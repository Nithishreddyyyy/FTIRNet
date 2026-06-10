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

        "Jambeck, J. R., Geyer, R., Wilcox, C., Siegler, T. R., Perryman, M., Andrady, A., Narayan, R., & Law, K. L. (2015). Plastic waste inputs from land into the ocean. Science, 347(6223), 768–771. DOI: https://doi.org/10.1126/science.1260352",

        "Andrady, A. L. (2011). Microplastics in the marine environment. Marine Pollution Bulletin, 62(8), 1596–1605. DOI: https://doi.org/10.1016/j.marpolbul.2011.05.030",

        "Gewert, B., Plassmann, M. M., & MacLeod, M. (2015). Pathways for degradation of plastic polymers floating in the marine environment. Environmental Science: Processes & Impacts, 17(9), 1513–1521. DOI: https://doi.org/10.1039/C5EM00207A",

        "Silva, A. B., Bastos, A. S., Justino, C. I. L., da Costa, J. P., Duarte, A. C., & Rocha-Santos, T. A. P. (2018). Microplastics in the environment: Challenges in analytical chemistry. Analytica Chimica Acta, 1017, 1–19. DOI: https://doi.org/10.1016/j.aca.2018.02.043",

        "Primpke, S., Wirth, M., Lorenz, C., & Gerdts, G. (2018). Reference database design for the automated analysis of microplastic samples based on FTIR spectroscopy. Analytical and Bioanalytical Chemistry, 410(21), 5131–5141. DOI: https://doi.org/10.1007/s00216-018-1156-x",

    ],



    "PP": [

        "Andrady, A. L. (2017). The plastic in microplastics: A review. Marine Pollution Bulletin, 119(1), 12–22. DOI: https://doi.org/10.1016/j.marpolbul.2017.01.082",

        "Fotopoulou, K. N., & Karapanagioti, H. K. (2012). Surface properties of beached plastic pellets. Marine Environmental Research, 81, 70–77. DOI: https://doi.org/10.1016/j.marenvres.2012.08.001",

        "Song, Y. K., Hong, S. H., Jang, M., Han, G. M., Jung, S. W., & Shim, W. J. (2015). Combined effects of UV exposure duration and mechanical abrasion on microplastic fragmentation by polymer type. Environmental Science & Technology, 49(7), 4368–4376. DOI: https://doi.org/10.1021/es505863x",

        "Primpke, S., Lorenz, C., Rascher-Friesenhausen, R., & Gerdts, G. (2017). An automated approach for microplastics analysis using FTIR microscopy and image analysis. Analytical Methods, 9(9), 1499–1511. DOI: https://doi.org/10.1039/C6AY02476A",

        "Jung, M. R., Horgen, F. D., Orski, S. V., Rodriguez, C. V., Beers, K. L., Balazs, G. H., Jones, T. T., Work, T. M., Brignac, K. C., Royer, S. J., Hyrenbach, K. D., Jensen, B. A., & Lynch, J. M. (2018). Validation of ATR FT-IR to identify polymers of plastic marine debris. Marine Pollution Bulletin, 127, 704–716. DOI: https://doi.org/10.1016/j.marpolbul.2017.12.061",

    ],



    "PS": [

        "Lithner, D., Larsson, Å., & Dave, G. (2011). Environmental and health hazard ranking of plastic polymers based on chemical composition. Science of the Total Environment, 409(18), 3309–3324. DOI: https://doi.org/10.1016/j.scitotenv.2011.04.038",

        "Cole, M., Lindeque, P., Halsband, C., & Galloway, T. S. (2011). Microplastics as contaminants in the marine environment. Marine Pollution Bulletin, 62(12), 2588–2597. DOI: https://doi.org/10.1016/j.marpolbul.2011.09.025",

        "Rochman, C. M., Hoh, E., Kurobe, T., & Teh, S. J. (2013). Ingested plastic transfers hazardous chemicals to fish and induces hepatic stress. Scientific Reports, 3, 3263. DOI: https://doi.org/10.1038/srep03263",

        "Käppler, A., Fischer, M., Scholz-Böttcher, B. M., Oberbeckmann, S., Labrenz, M., & Fischer, D. (2016). Identification of microplastics by FTIR and Raman microscopy. Analytical and Bioanalytical Chemistry, 408(29), 8377–8391. DOI: https://doi.org/10.1007/s00216-016-9956-3",

        "Frias, J. P. G. L., & Nash, R. (2019). Microplastics: Finding a consensus on the definition. Marine Pollution Bulletin, 138, 145–147. DOI: https://doi.org/10.1016/j.marpolbul.2018.11.022",

    ],



    "HDPE": [

        "Thompson, R. C., Olsen, Y., Mitchell, R. P., Davis, A., Rowland, S. J., John, A. W. G., McGonigle, D., & Russell, A. E. (2004). Lost at sea: Where is all the plastic? Science, 304(5672), 838. DOI: https://doi.org/10.1126/science.1094559",

        "Barnes, D. K. A., Galgani, F., Thompson, R. C., & Barlaz, M. (2009). Accumulation and fragmentation of plastic debris in global environments. Philosophical Transactions of the Royal Society B, 364(1526), 1985–1998. DOI: https://doi.org/10.1098/rstb.2008.0205",

        "Gewert, B., Plassmann, M. M., & MacLeod, M. (2015). Pathways for degradation of plastic polymers in marine environments. Environmental Science: Processes & Impacts, 17(9), 1513–1521. DOI: https://doi.org/10.1039/C5EM00207A",

        "Jung, M. R., et al. (2018). Validation of ATR FT-IR to identify polymers of plastic marine debris. Marine Pollution Bulletin, 127, 704–716. DOI: https://doi.org/10.1016/j.marpolbul.2017.12.061",

        "Primpke, S., et al. (2018). Reference database design for FTIR-based automated microplastic analysis. Analytical and Bioanalytical Chemistry, 410(21), 5131–5141. DOI: https://doi.org/10.1007/s00216-018-1156-x",

    ],



    "LDPE": [

        "Hopewell, J., Dvorak, R., & Kosior, E. (2009). Plastics recycling: Challenges and opportunities. Philosophical Transactions of the Royal Society B, 364(1526), 2115–2126. DOI: https://doi.org/10.1098/rstb.2008.0311",

        "Andrady, A. L. (2011). Microplastics in the marine environment. Marine Pollution Bulletin, 62(8), 1596–1605. DOI: https://doi.org/10.1016/j.marpolbul.2011.05.030",

        "Song, Y. K., et al. (2015). Effects of UV exposure on microplastic fragmentation. Environmental Science & Technology, 49(7), 4368–4376. DOI: https://doi.org/10.1021/es505863x",

        "Käppler, A., et al. (2016). Analysis of environmental microplastics by vibrational microspectroscopy. Analytical and Bioanalytical Chemistry, 408(29), 8377–8391. DOI: https://doi.org/10.1007/s00216-016-9956-3",

        "Silva, A. B., et al. (2018). Microplastics in the environment: Analytical challenges. Analytica Chimica Acta, 1017, 1–19. DOI: https://doi.org/10.1016/j.aca.2018.02.043",

    ],



    "PVC": [

        "Lithner, D., Larsson, Å., & Dave, G. (2011). Environmental and health hazard ranking of plastic polymers. Science of the Total Environment, 409(18), 3309–3324. DOI: https://doi.org/10.1016/j.scitotenv.2011.04.038",

        "Mersiowsky, I. (2002). Long-term fate of PVC products and their additives. Biomarkers, 7(5), 364–376. DOI: https://doi.org/10.1080/13547500210148536",

        "Rochman, C. M., Hoh, E., Kurobe, T., & Teh, S. J. (2013). Hazardous chemical transfer from plastics to organisms. Scientific Reports, 3, 3263. DOI: https://doi.org/10.1038/srep03263",

        "Käppler, A., et al. (2016). Identification of microplastics by FTIR and Raman microscopy. Analytical and Bioanalytical Chemistry, 408(29), 8377–8391. DOI: https://doi.org/10.1007/s00216-016-9956-3",

        "Primpke, S., et al. (2018). FTIR reference database for automated microplastic analysis. Analytical and Bioanalytical Chemistry, 410(21), 5131–5141. DOI: https://doi.org/10.1007/s00216-018-1156-x",

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
            model="gemini-2.5-flash",
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
