import React, { useEffect, useRef, useState } from "react";
import "@google/model-viewer";

export default function PolymerVisualizer() {

  const viewerRef = useRef(null);

  const hotspotRef = useRef(null);



  // =========================
  // POLYMER DATA
  // =========================

  const polymerInfo = {

    "pp.glb": {

      name: "Polypropylene (PP)",

      formula: "(C3H6)n",

      density: "0.90 g/cm³",

      functionalGroup: "Methyl Side Group",

      ftir: "1455 cm⁻¹, 1375 cm⁻¹"

    },



    "ps.glb": {

      name: "Polystyrene (PS)",

      formula: "(C8H8)n",

      density: "1.05 g/cm³",

      functionalGroup: "Aromatic Benzene Ring",

      ftir: "1600 cm⁻¹, 1492 cm⁻¹"

    },



    "pet.glb": {

      name: "PET",

      formula: "(C10H8O4)n",

      density: "1.38 g/cm³",

      functionalGroup: "Ester Group",

      ftir: "1715 cm⁻¹, 1240 cm⁻¹"

    },



    "hdpe.glb": {

      name: "HDPE",

      formula: "(C2H4)n",

      density: "0.95 g/cm³",

      functionalGroup: "Alkane Chain",

      ftir: "2915 cm⁻¹, 1470 cm⁻¹"

    },



    "ldpe.glb": {

      name: "LDPE",

      formula: "(C2H4)n",

      density: "0.91 g/cm³",

      functionalGroup: "Branched Alkane Chain",

      ftir: "2920 cm⁻¹, 1465 cm⁻¹"

    },



    "pvc.glb": {

      name: "PVC",

      formula: "(C2H3Cl)n",

      density: "1.38 g/cm³",

      functionalGroup: "Chlorinated Polymer",

      ftir: "600 cm⁻¹, 1250 cm⁻¹"

    }

  };



  // =========================
  // STATE
  // =========================

  const [selectedPolymer, setSelectedPolymer] =
    useState("pp.glb");



  // =========================
  // LOAD MODEL
  // =========================

  useEffect(() => {

    const viewer =
      viewerRef.current;

    const hotspot =
      hotspotRef.current;



    viewer.cameraOrbit =
      "0deg 70deg 3.5m";



    hotspot.style.display =
      "none";

  }, [selectedPolymer]);



  // =========================
  // FULLSCREEN
  // =========================

  const handleFullscreen = () => {

    const viewer =
      viewerRef.current;



    if (viewer.requestFullscreen) {

      viewer.requestFullscreen();

    }

  };



  // =========================
  // FUNCTIONAL GROUP
  // =========================

  const highlightFunctionalGroup = () => {

    const hotspot =
      hotspotRef.current;

    const viewer =
      viewerRef.current;



    hotspot.style.display =
      "block";



    // PET

    if (selectedPolymer === "pet.glb") {

      hotspot.innerText =
        "ESTER GROUP";



      hotspot.dataset.position =
        "0m 0.15m 0m";



      hotspot.style.background =
        "rgba(255,0,0,0.9)";



      viewer.cameraOrbit =
        "20deg 70deg 2.5m";

    }



    // PVC

    else if (selectedPolymer === "pvc.glb") {

      hotspot.innerText =
        "CHLORINE GROUP";



      hotspot.dataset.position =
        "0.1m 0.1m 0m";



      hotspot.style.background =
        "rgba(0,255,0,0.9)";



      viewer.cameraOrbit =
        "20deg 70deg 2.5m";

    }



    // PS

    else if (selectedPolymer === "ps.glb") {

      hotspot.innerText =
        "BENZENE RING";



      hotspot.dataset.position =
        "0m 0.2m 0m";



      hotspot.style.background =
        "rgba(255,140,0,0.9)";



      viewer.cameraOrbit =
        "20deg 70deg 2.5m";

    }



    // PP

    else if (selectedPolymer === "pp.glb") {

      hotspot.innerText =
        "CH3 GROUP";



      hotspot.dataset.position =
        "0m 0.1m 0m";



      hotspot.style.background =
        "rgb(255, 217, 0)";



      viewer.cameraOrbit =
        "20deg 70deg 2.5m";

    }



    // LDPE

    else if (selectedPolymer === "ldpe.glb") {

      hotspot.innerText =
        "BRANCHED CHAIN";



      hotspot.dataset.position =
        "0m 0.1m 0m";



      hotspot.style.background =
        "rgba(0,200,255,0.9)";



      viewer.cameraOrbit =
        "0deg 75deg 2.5m";

    }



    // HDPE

    else {

      hotspot.innerText =
        "ALKANE CHAIN";



      hotspot.dataset.position =
        "0m 0m 0m";



      hotspot.style.background =
        "rgba(151, 40, 173, 0.9)";



      viewer.cameraOrbit =
        "0deg 75deg 2.5m";

    }

  };



  const info =
    polymerInfo[selectedPolymer];



  return (

    <div style={styles.body}>

      <div style={styles.container}>
        {/* TITLE */}
        <h1 style={styles.title}>
          3D Polymer Visualizer
        </h1>
        <p style={styles.subtitle}>
          Explore common polymer structures with an interactive 3D viewer, functional
          group highlights, and key FTIR signatures.
        </p>



        {/* CONTROLS */}

        <div style={styles.controls}>

          <select
            value={selectedPolymer}
            onChange={(e) =>
              setSelectedPolymer(
                e.target.value
              )
            }
            style={styles.select}
          >

            <option value="pp.glb">
              Polypropylene (PP)
            </option>

            <option value="ps.glb">
              Polystyrene (PS)
            </option>

            <option value="pet.glb">
              PET
            </option>

            <option value="hdpe.glb">
              HDPE
            </option>

            <option value="ldpe.glb">
              LDPE
            </option>

            <option value="pvc.glb">
              PVC
            </option>

          </select>



          <button
            style={styles.button}
            onClick={handleFullscreen}
          >
            Full Screen
          </button>



          <button
            style={styles.button}
            onClick={
              highlightFunctionalGroup
            }
          >
            Highlight Functional Group
          </button>

        </div>



        {/* VIEWER */}

        <div style={styles.viewerContainer}>

          <model-viewer
            ref={viewerRef}
            src={`models/${selectedPolymer}`}
            camera-controls
            auto-rotate
            shadow-intensity="1"
            exposure="1"
            environment-image="neutral"
            camera-orbit="0deg 70deg 3.5m"
            style={styles.viewer}
          >

            <button
              ref={hotspotRef}
              className="Hotspot"
              slot="hotspot-functional"
              data-position="0m 0m 0m"
              data-normal="0m 1m 0m"
              style={styles.hotspot}
            >
              Functional Group
            </button>

          </model-viewer>

        </div>



        {/* INFO CARD */}

        <div style={styles.infoCard}>

          <h2 style={styles.infoTitle}>
            {info.name}
          </h2>



          <p style={styles.infoText}>
            <strong>
              Chemical Formula:
            </strong>{" "}
            {info.formula}
          </p>



          <p style={styles.infoText}>
            <strong>
              Density:
            </strong>{" "}
            {info.density}
          </p>



          <p style={styles.infoText}>
            <strong>
              Functional Group:
            </strong>{" "}
            {info.functionalGroup}
          </p>



          <p style={styles.infoText}>
            <strong>
              Important FTIR Peaks:
            </strong>{" "}
            {info.ftir}
          </p>

        </div>

      </div>

    </div>

  );

}



// =========================
// STYLES
// =========================

const styles = {
  body: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, #1b2d6b 0%, #090f28 40%, #02040c 100%)",
    color: "white",
    fontFamily: "Inter, Arial, sans-serif"
  },



  container: {
    width: "min(1200px, 95%)",
    margin: "auto",
    padding: "120px 0 60px"
  },



  title: {
    textAlign: "center",
    fontSize: "64px",
    marginBottom: "12px",
    color: "#d6e0ff",
    fontWeight: "900",
    letterSpacing: "0.06em"
  },



  subtitle: {
    textAlign: "center",
    maxWidth: "760px",
    margin: "0 auto 40px",
    color: "#a9b9ff",
    fontSize: "18px",
    lineHeight: "1.75"
  },
  controls: {
    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    gap: "20px",

    marginBottom: "40px",

    flexWrap: "wrap"
  },



  select: {

    padding: "16px 22px",

    borderRadius: "16px",

    border: "none",

    fontSize: "24px",

    background: "#18264d",

    color: "white",

    cursor: "pointer"
  },



  button: {
    padding: "16px 22px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.12)",
    fontSize: "20px",
    background: "linear-gradient(135deg, #3178ff 0%, #1e4dd8 100%)",
    color: "white",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    boxShadow: "0 18px 40px rgba(49,120,255,0.25)"
  },



  viewerContainer: {
    width: "100%",
    height: "640px",
    borderRadius: "30px",
    overflow: "hidden",
    background: "linear-gradient(180deg, #081039, #02020c)",
    marginBottom: "50px",

    boxShadow:
      "0 0 40px rgba(0,0,0,0.5)"
  },



  viewer: {
    width: "100%",
    height: "100%",
    background: "#020719"
  },



  hotspot: {

    background:
      "rgba(0,200,255,0.9)",

    color: "white",

    border: "none",

    padding: "12px 18px",

    borderRadius: "30px",

    fontWeight: "bold",

    fontSize: "18px",

    boxShadow:
      "0 0 20px cyan"
  },



  infoCard: {
    marginTop: "40px",
    padding: "32px",
    borderRadius: "28px",
    background:
      "rgba(10,24,65,0.88)",
    border: "1px solid rgba(255,255,255,0.08)",

    backdropFilter: "blur(10px)",

    boxShadow:
      "0 0 20px rgba(0,0,0,0.3)"
  },



  infoTitle: {

    fontSize: "42px",

    marginBottom: "20px",

    color: "#dce7ff"
  },



  infoText: {

    fontSize: "22px",

    marginBottom: "14px",

    lineHeight: "1.5",

    color: "#f2f2f2"
  }

};