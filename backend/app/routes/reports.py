"""
Professional PDF Report Generator
==================================
Generates scientific-style PDF reports for
polymer / microplastic analysis.
"""

from pathlib import Path
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse, FileResponse

from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

from app.services.storage_service import (
    create_report as create_report_record,
    delete_report,
    get_report_by_id,
    get_reports,
)


# =========================================================
# OUTPUT DIRECTORY
# =========================================================

REPORT_DIR = Path("reports/generated")
REPORT_DIR.mkdir(parents=True, exist_ok=True)


# =========================================================
# POLYMER REFERENCES
# =========================================================

POLYMER_REFERENCES = {
    "PET": [
        "Awaja, F. et al. Recycling of PET. European Polymer Journal.",
        "Shukla, S.R. PET waste management by recycling.",
        "Jambeck, J. Plastic waste inputs from land into ocean.",
        "Andrady, A. Microplastics in marine environments.",
        "Singh, N. FTIR analysis of PET microplastics.",
    ],
    "PP": [
        "Karian, H. Handbook of Polypropylene.",
        "Maier, C. Polypropylene: The Definitive User's Guide.",
        "Andrady, A. Plastics and environmental sustainability.",
        "Fotopoulou, K. Microplastics in marine systems.",
        "Zhang, J. FTIR identification of polypropylene.",
    ],
    "PS": [
        "Lithner, D. Environmental hazards of polystyrene.",
        "Andrady, A. Microplastics research trends.",
        "Rochman, C. Plastic pollution studies.",
        "Smith, B. Infrared spectral interpretation.",
        "Cole, M. Microplastics as contaminants.",
    ],
    "HDPE": [
        "Harper, C. Handbook of Plastics Technologies.",
        "Thompson, R. Plastic debris in oceans.",
        "Barnes, D. Accumulation of plastics.",
        "Andrady, A. Environmental impacts of plastics.",
        "Jung, M. FTIR analysis of HDPE.",
    ],
    "LDPE": [
        "Peacock, A. Handbook of Polyethylene.",
        "Hopewell, J. Plastics recycling challenges.",
        "Cole, M. Microplastic contamination.",
        "Thompson, R. Marine plastic pollution.",
        "Singh, P. FTIR characterization of LDPE.",
    ],
    "PVC": [
        "Titow, W. PVC Technology.",
        "Mersiowsky, I. Long-term fate of PVC.",
        "Andrady, A. Plastics and environment.",
        "Lithner, D. Chemical hazards of plastics.",
        "Zhou, Q. FTIR characterization of PVC.",
    ],
}


# =========================================================
# AI SUMMARY GENERATOR
# =========================================================

def generate_ai_summary(report_data: dict) -> str:
    try:
        client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        
        pred = report_data.get("predictions", {})
        polymer = pred.get("class", "Unknown")
        confidence = pred.get("confidence", 0)
        model_used = report_data.get("model_used", "Unknown")
        sample_id = report_data.get("sample_id", "N/A")
        
        prompt = f"""Generate a concise summary (2-3 sentences, max 150 words) for a microplastic polymer analysis report with the following details:
- Sample ID: {sample_id}
- Detected Polymer: {polymer}
- Confidence Score: {confidence:.2f}%
- Model Used: {model_used}

Write in a professional scientific tone suitable for a polymer analysis report. Focus on the significance of the findings and their relevance to environmental microplastic identification."""

        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt
        )
        
        return response.text.strip()
    
    except Exception as e:
        pred = report_data.get("predictions", {})
        polymer = pred.get("class", "Unknown")
        confidence = pred.get("confidence", 0)
        return f"ERROR"



# =========================================================
# GENERATE PDF REPORT
# =========================================================

def generate_pdf_report(report_data: dict) -> str:
    try:
        from reportlab.platypus import (
            SimpleDocTemplate,
            Paragraph,
            Spacer,
            Table,
            TableStyle,
            PageBreak,
            Image,
        )
        from reportlab.lib import colors
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.pagesizes import A4
        from reportlab.lib.units import inch
    except ImportError as e:
        raise RuntimeError(
            "reportlab is required to generate PDF reports. Install reportlab in the backend environment."
        ) from e

    report_id = report_data.get("id", datetime.now().strftime("%Y%m%d%H%M%S"))
    filename = f"report_{report_id}.pdf"
    filepath = REPORT_DIR / filename

    # document setup (smaller margins to help single-page output)
    doc = SimpleDocTemplate(
        str(filepath), pagesize=A4, rightMargin=30, leftMargin=30, topMargin=20, bottomMargin=20
    )

    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="BodySmall", parent=styles["BodyText"], fontName="Helvetica", fontSize=9, leading=11))
    styles.add(ParagraphStyle(name="HeadingCompact", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=14, leading=16))

    elements = []

    # title
    title = Paragraph("<font size=18><b>Microplastic Polymer Analysis Report</b></font>", styles["Title"])
    elements.append(title)
    elements.append(Spacer(1, 0.15 * inch))

    # basic info table
    generated_date = datetime.now().strftime("%d %B %Y %H:%M")
    info_table_data = [
        ["Report ID", report_id],
        ["Generated On", generated_date],
        ["Status", report_data.get("status", "Completed")],
        ["Sample ID", report_data.get("sample_id", "N/A")],
    ]
    info_table = Table(info_table_data, colWidths=[180, 300])
    info_table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#dbeafe")),
            ("TEXTCOLOR", (0, 0), (-1, -1), colors.black),
            ("GRID", (0, 0), (-1, -1), 1, colors.grey),
            ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
        ])
    )
    elements.append(info_table)
    elements.append(Spacer(1, 0.12 * inch))

    # prediction results
    pred = report_data.get("predictions", {})
    polymer = pred.get("class", "Unknown")
    confidence = pred.get("confidence", 0)
    heading = Paragraph("<font size=16><b>Prediction Results</b></font>", styles["HeadingCompact"])
    elements.append(heading)
    elements.append(Spacer(1, 0.12 * inch))

    prediction_data = [["Detected Polymer", polymer], ["Confidence Score", f"{confidence:.2f}%"], ["Model Used", report_data.get("model_used", "CNN + Random Forest")]]
    prediction_table = Table(prediction_data, colWidths=[220, 260])
    prediction_table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#bfdbfe")),
            ("GRID", (0, 0), (-1, -1), 1, colors.grey),
            ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
        ])
    )
    elements.append(prediction_table)
    elements.append(Spacer(1, 0.12 * inch))

    # FTIR analysis
    ftir_heading = Paragraph("<font size=16><b>FTIR Spectral Analysis</b></font>", styles["HeadingCompact"])
    elements.append(ftir_heading)
    elements.append(Spacer(1, 0.08 * inch))

    polymer_ftir = {
        "PET": ["1715 cm<super>-1</super> → Ester carbonyl stretching", "1240 cm<super>-1</super> → C-O stretching"],
        "PP": ["1455 cm<super>-1</super> → CH bending", "1375 cm<super>-1</super> → CH<sub>3</sub> symmetric deformation"],
        "PS": ["1600 cm<super>-1</super> → Aromatic C=C stretching", "1492 cm<super>-1</super> → Benzene ring vibration"],
        "HDPE": ["2915 cm<super>-1</super> → CH<sub>2</sub> asymmetric stretching", "1470 cm<super>-1</super> → CH<sub>2</sub> bending"],
        "LDPE": ["2920 cm<super>-1</super> → CH<sub>2</sub> stretching", "1465 cm<super>-1</super> → CH<sub>2</sub> deformation"],
        "PVC": ["600 cm<super>-1</super> → C-Cl stretching", "1250 cm<super>-1</super> → CH bending"],
    }
    ftir_points = polymer_ftir.get(polymer, [])
    for point in ftir_points:
        elements.append(Paragraph(f"• {point}", styles["BodySmall"]))
    elements.append(Spacer(1, 0.12 * inch))

    # confidence bar
    confidence_heading = Paragraph("<font size=16><b>Confidence Interpretation</b></font>", styles["HeadingCompact"])
    elements.append(confidence_heading)
    elements.append(Spacer(1, 0.08 * inch))
    confidence_bar = "█" * int(confidence / 10) + "░" * (10 - int(confidence / 10))
    elements.append(Paragraph(f"<font size=11>{confidence_bar} {confidence:.2f}%</font>", styles["BodySmall"]))
    elements.append(Spacer(1, 0.12 * inch))

    # references
    ref_heading = Paragraph("<font size=16><b>Scientific References</b></font>", styles["HeadingCompact"])
    elements.append(ref_heading)
    elements.append(Spacer(1, 0.08 * inch))
    references = POLYMER_REFERENCES.get(polymer, [])
    for i, ref in enumerate(references, start=1):
        elements.append(Paragraph(f"[{i}] {ref}", styles["BodySmall"]))
        elements.append(Spacer(1, 0.03 * inch))
    elements.append(Spacer(1, 0.12 * inch))

    # AI summary
    ai_heading = Paragraph("<font size=16><b>AI Generated Summary</b></font>", styles["HeadingCompact"])
    elements.append(ai_heading)
    elements.append(Spacer(1, 0.08 * inch))
    ai_summary = generate_ai_summary(report_data)
    elements.append(Paragraph(ai_summary, styles["BodySmall"]))

    # build and return
    doc.build(elements)
    return str(filepath)
    
    
    


# =========================================================
# Reports API Routes
# =========================================================

router = APIRouter()


@router.get("/", tags=["Reports"])
async def list_reports(
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
):
    try:
        reports, total = get_reports(limit=limit, offset=offset)
        return JSONResponse(
            content={
                "success": True,
                "data": reports,
                "pagination": {
                    "limit": limit,
                    "offset": offset,
                    "total": total,
                    "has_more": offset + limit < total,
                },
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success": False, "error": str(e)})


@router.get("/{report_id}", tags=["Reports"])
async def get_report(report_id: str):
    try:
        report = get_report_by_id(report_id)
        if report is None:
            raise HTTPException(
                status_code=404,
                detail={"success": False, "error": f"Report '{report_id}' not found"},
            )
        return JSONResponse(content={"success": True, "data": report})
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success": False, "error": str(e)})


@router.post("/", tags=["Reports"])
async def create_report_endpoint(report_data: dict):
    try:
        report = create_report_record(report_data)
        return JSONResponse(content={"success": True, "data": report})
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success": False, "error": str(e)})


@router.delete("/{report_id}", tags=["Reports"])
async def delete_report_item(report_id: str):
    try:
        success = delete_report(report_id)
        if not success:
            raise HTTPException(
                status_code=404,
                detail={"success": False, "error": f"Report '{report_id}' not found"},
            )
        return JSONResponse(content={"success": True, "message": f"Report '{report_id}' deleted"})
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success": False, "error": str(e)})


@router.get("/search", tags=["Reports"])
async def search_reports(
    query: str = Query(..., min_length=2),
    search_by: str = Query("all", regex="^(all|title|polymer|status|sample_id|id)$"),
):
    try:
        reports, _ = get_reports(limit=1000, offset=0)
        query_lower = query.lower()

        def matches(report: dict) -> bool:
            if search_by in ("all", "title") and query_lower in str(report.get("title", "")).lower():
                return True
            if search_by in ("all", "polymer") and query_lower in str(report.get("predictions", {}).get("class", "")).lower():
                return True
            if search_by in ("all", "status") and query_lower in str(report.get("status", "")).lower():
                return True
            if search_by in ("all", "sample_id") and query_lower in str(report.get("sample_id", "")).lower():
                return True
            if search_by in ("all", "id") and query_lower in str(report.get("id", "")).lower():
                return True
            return False

        results = [report for report in reports if matches(report)]
        return JSONResponse(content={"success": True, "data": results})
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success": False, "error": str(e)})


@router.get("/filter", tags=["Reports"])
async def filter_reports(
    polymer: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    min_confidence: Optional[float] = Query(None, ge=0),
    max_confidence: Optional[float] = Query(None, ge=0),
):
    try:
        reports, _ = get_reports(limit=1000, offset=0)

        def matches(report: dict) -> bool:
            if polymer and polymer.lower() != str(report.get("predictions", {}).get("class", "")).lower():
                return False
            if status and status.lower() != str(report.get("status", "")).lower():
                return False
            confidence = report.get("predictions", {}).get("confidence")
            if confidence is not None:
                try:
                    confidence = float(confidence)
                except (TypeError, ValueError):
                    confidence = None
            if min_confidence is not None and (confidence is None or confidence < min_confidence):
                return False
            if max_confidence is not None and (confidence is None or confidence > max_confidence):
                return False
            return True

        filtered = [report for report in reports if matches(report)]
        return JSONResponse(content={"success": True, "data": filtered})
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success": False, "error": str(e)})


@router.get("/{report_id}/download", tags=["Reports"])
async def download_report_pdf(report_id: str):
    try:
        report = get_report_by_id(report_id)
        if report is None:
            raise HTTPException(
                status_code=404,
                detail={"success": False, "error": f"Report '{report_id}' not found"},
            )

        filepath = generate_pdf_report(report)
        return FileResponse(path=filepath, media_type="application/pdf", filename=f"report_{report_id}.pdf")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success": False, "error": str(e)})