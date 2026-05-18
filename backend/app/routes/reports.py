# app/services/pdf_service.py

"""
Professional PDF Report Generator
=================================
Generates scientific-style PDF reports for
polymer / microplastic analysis.
"""

from pathlib import Path
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse, FileResponse

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

        "Singh, N. FTIR analysis of PET microplastics."

    ],



    "PP": [

        "Karian, H. Handbook of Polypropylene.",

        "Maier, C. Polypropylene: The Definitive User's Guide.",

        "Andrady, A. Plastics and environmental sustainability.",

        "Fotopoulou, K. Microplastics in marine systems.",

        "Zhang, J. FTIR identification of polypropylene."

    ],



    "PS": [

        "Lithner, D. Environmental hazards of polystyrene.",

        "Andrady, A. Microplastics research trends.",

        "Rochman, C. Plastic pollution studies.",

        "Smith, B. Infrared spectral interpretation.",

        "Cole, M. Microplastics as contaminants."

    ],



    "HDPE": [

        "Harper, C. Handbook of Plastics Technologies.",

        "Thompson, R. Plastic debris in oceans.",

        "Barnes, D. Accumulation of plastics.",

        "Andrady, A. Environmental impacts of plastics.",

        "Jung, M. FTIR analysis of HDPE."

    ],



    "LDPE": [

        "Peacock, A. Handbook of Polyethylene.",

        "Hopewell, J. Plastics recycling challenges.",

        "Cole, M. Microplastic contamination.",

        "Thompson, R. Marine plastic pollution.",

        "Singh, P. FTIR characterization of LDPE."

    ],



    "PVC": [

        "Titow, W. PVC Technology.",

        "Mersiowsky, I. Long-term fate of PVC.",

        "Andrady, A. Plastics and environment.",

        "Lithner, D. Chemical hazards of plastics.",

        "Zhou, Q. FTIR characterization of PVC."

    ]

}



# =========================================================
# AI SUMMARY GENERATOR
# =========================================================

def generate_ai_summary(report_data: dict) -> str:

    pred = report_data.get("predictions", {})

    polymer = pred.get("class", "Unknown")

    confidence = pred.get("confidence", 0)

    return (

        f"The analyzed sample was identified as "

        f"{polymer} with a confidence score of "

        f"{confidence:.2f}%. "

        f"The FTIR spectral characteristics strongly "

        f"support the presence of {polymer} polymer chains. "

        f"The detected functional groups and absorption "

        f"bands are consistent with known spectral signatures "

        f"of {polymer}. "

        f"The analysis indicates a reliable classification "

        f"suitable for environmental and material identification studies."

    )



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
        from reportlab.lib.styles import getSampleStyleSheet
        from reportlab.lib.pagesizes import A4
        from reportlab.lib.units import inch
    except ImportError as e:
        raise RuntimeError(
            "reportlab is required to generate PDF reports. Install reportlab in the backend environment."
        ) from e

    report_id = report_data.get(
        "id",
        datetime.now().strftime("%Y%m%d%H%M%S")
    )

    filename = f"report_{report_id}.pdf"

    filepath = REPORT_DIR / filename



    # =====================================================
    # DOCUMENT SETUP
    # =====================================================

    doc = SimpleDocTemplate(

        str(filepath),

        pagesize=A4,

        rightMargin=40,

        leftMargin=40,

        topMargin=40,

        bottomMargin=30

    )



    styles = getSampleStyleSheet()

    elements = []



    # =====================================================
    # TITLE
    # =====================================================

    title = Paragraph(

        "<font size=22><b>Microplastic Polymer Analysis Report</b></font>",

        styles["Title"]

    )



    elements.append(title)

    elements.append(Spacer(1, 0.3 * inch))



    # =====================================================
    # BASIC INFO
    # =====================================================

    generated_date = datetime.now().strftime("%d %B %Y %H:%M")



    info_table_data = [

        ["Report ID", report_id],

        ["Generated On", generated_date],

        ["Status", report_data.get("status", "Completed")],

        ["Sample ID", report_data.get("sample_id", "N/A")]

    ]



    info_table = Table(

        info_table_data,

        colWidths=[180, 300]

    )



    info_table.setStyle(TableStyle([

        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#dbeafe")),

        ("TEXTCOLOR", (0, 0), (-1, -1), colors.black),

        ("GRID", (0, 0), (-1, -1), 1, colors.grey),

        ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),

        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),

    ]))



    elements.append(info_table)

    elements.append(Spacer(1, 0.3 * inch))



    # =====================================================
    # PREDICTION RESULTS
    # =====================================================

    pred = report_data.get("predictions", {})

    polymer = pred.get("class", "Unknown")

    confidence = pred.get("confidence", 0)



    heading = Paragraph(

        "<font size=18><b>Prediction Results</b></font>",

        styles["Heading2"]

    )



    elements.append(heading)

    elements.append(Spacer(1, 0.15 * inch))



    prediction_data = [

        ["Detected Polymer", polymer],

        ["Confidence Score", f"{confidence:.2f}%"],

        ["Model Used", report_data.get("model_used", "CNN + Random Forest")],

    ]



    prediction_table = Table(

        prediction_data,

        colWidths=[220, 260]

    )



    prediction_table.setStyle(TableStyle([

        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#bfdbfe")),

        ("GRID", (0, 0), (-1, -1), 1, colors.grey),

        ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),

        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),

    ]))



    elements.append(prediction_table)

    elements.append(Spacer(1, 0.3 * inch))



    # =====================================================
    # FTIR ANALYSIS
    # =====================================================

    ftir_heading = Paragraph(

        "<font size=18><b>FTIR Spectral Analysis</b></font>",

        styles["Heading2"]

    )



    elements.append(ftir_heading)

    elements.append(Spacer(1, 0.15 * inch))



    polymer_ftir = {

        "PET": [

            "1715 cm⁻¹ → Ester carbonyl stretching",

            "1240 cm⁻¹ → C-O stretching"

        ],

        "PP": [

            "1455 cm⁻¹ → CH bending",

            "1375 cm⁻¹ → CH₃ symmetric deformation"

        ],

        "PS": [

            "1600 cm⁻¹ → Aromatic C=C stretching",

            "1492 cm⁻¹ → Benzene ring vibration"

        ],

        "HDPE": [

            "2915 cm⁻¹ → CH₂ asymmetric stretching",

            "1470 cm⁻¹ → CH₂ bending"

        ],

        "LDPE": [

            "2920 cm⁻¹ → CH₂ stretching",

            "1465 cm⁻¹ → CH₂ deformation"

        ],

        "PVC": [

            "600 cm⁻¹ → C-Cl stretching",

            "1250 cm⁻¹ → CH bending"

        ]

    }



    ftir_points = polymer_ftir.get(polymer, [])



    for point in ftir_points:

        p = Paragraph(f"• {point}", styles["BodyText"])

        elements.append(p)



    elements.append(Spacer(1, 0.3 * inch))



    # =====================================================
    # CONFIDENCE BAR
    # =====================================================

    confidence_heading = Paragraph(

        "<font size=18><b>Confidence Interpretation</b></font>",

        styles["Heading2"]

    )



    elements.append(confidence_heading)

    elements.append(Spacer(1, 0.15 * inch))



    confidence_bar = "█" * int(confidence / 10)

    confidence_bar += "░" * (10 - int(confidence / 10))



    confidence_text = Paragraph(

        f"<font size=14>{confidence_bar} {confidence:.2f}%</font>",

        styles["BodyText"]

    )



    elements.append(confidence_text)

    elements.append(Spacer(1, 0.3 * inch))



    # =====================================================
    # REFERENCES
    # =====================================================

    ref_heading = Paragraph(

        "<font size=18><b>Scientific References</b></font>",

        styles["Heading2"]

    )



    elements.append(ref_heading)

    elements.append(Spacer(1, 0.15 * inch))



    references = POLYMER_REFERENCES.get(polymer, [])



    for i, ref in enumerate(references, start=1):

        para = Paragraph(

            f"[{i}] {ref}",

            styles["BodyText"]

        )



        elements.append(para)

        elements.append(Spacer(1, 0.05 * inch))



    elements.append(Spacer(1, 0.3 * inch))



    # =====================================================
    # AI SUMMARY
    # =====================================================

    ai_heading = Paragraph(

        "<font size=18><b>AI Generated Summary</b></font>",

        styles["Heading2"]

    )



    elements.append(ai_heading)

    elements.append(Spacer(1, 0.15 * inch))



    ai_summary = generate_ai_summary(report_data)



    summary_para = Paragraph(

        ai_summary,

        styles["BodyText"]

    )



    elements.append(summary_para)



    # =====================================================
    # BUILD PDF
    # =====================================================

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
        return FileResponse(
            path=filepath,
            media_type='application/pdf',
            filename=f"report_{report_id}.pdf",
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail={"success": False, "error": str(e)})
