import React, { useEffect, useRef, useState } from "react";
import { Atom } from "lucide-react";
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
        "BRANCHED ALKANE CHAIN";



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
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary-700/10 dark:bg-primary-500/10 rounded-3xl border border-primary-500/20 dark:border-white/10 shadow-lg">
              <Atom className="w-7 h-7 text-primary-600 dark:text-primary-300" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[var(--heading-color)]">
              <span className="text-gradient">3D Polymer Visualizer</span>
            </h1>
          </div>
          <p className="text-sm text-slate-700 dark:text-gray-400 mt-4 font-bold max-w-lg leading-relaxed uppercase tracking-wider">
            Interactive 3D Structures & Functional Group Highlights
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[420px_minmax(0,1fr)] gap-10 items-start">
          <div className="space-y-8">
            <section className="glass-card p-8 border-slate-200 dark:border-white/10 shadow-2xl bg-white dark:bg-white/5">
              <div className="space-y-6">
                <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.3em] px-2">
                  Select Polymer
                </label>
                <select
                  value={selectedPolymer}
                  onChange={(e) => setSelectedPolymer(e.target.value)}
                  className="mt-4 w-full bg-white dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 rounded-[1.5rem] px-5 py-4 text-[var(--heading-color)] font-black text-base focus:outline-none focus:ring-4 focus:ring-primary-500/20 cursor-pointer shadow-md"
                >
                  <option value="pp.glb">Polypropylene (PP)</option>
                  <option value="ps.glb">Polystyrene (PS)</option>
                  <option value="pet.glb">PET</option>
                  <option value="hdpe.glb">HDPE</option>
                  <option value="ldpe.glb">LDPE</option>
                  <option value="pvc.glb">PVC</option>
                </select>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={handleFullscreen}
                    className="flex-1 flex items-center justify-center text-center text-[10px] leading-tight px-6 py-3 bg-white dark:bg-white/5 hover:bg-primary-600 hover:text-white hover:border-primary-600 dark:hover:bg-primary-600 dark:hover:text-white dark:hover:border-primary-600 border-2 border-primary-500/30 dark:border-white/10 text-gray-900 dark:text-gray-300 rounded-[1.5rem] font-black uppercase tracking-[0.2em] shadow-xl transition-all duration-300 hover:-translate-y-1.5 active:translate-y-0"
                  >
                    Full Screen
                  </button>
                  <button
                    type="button"
                    onClick={highlightFunctionalGroup}
                    className="flex-1 flex items-center justify-center text-center text-[10px] leading-tight px-6 py-3 bg-white dark:bg-white/5 hover:bg-primary-600 hover:text-white hover:border-primary-600 dark:hover:bg-primary-600 dark:hover:text-white dark:hover:border-primary-600 border-2 border-primary-500/30 dark:border-white/10 text-gray-900 dark:text-gray-300 rounded-[1.5rem] font-black uppercase tracking-[0.2em] shadow-xl transition-all duration-300 hover:-translate-y-1.5 active:translate-y-0"
                  >
                    Highlight Functional Group
                  </button>
                </div>
              </div>
            </section>

            <section className="glass-card p-8 border-slate-200 dark:border-white/10 shadow-2xl bg-white dark:bg-white/5">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.3em] px-2 block mb-3">
                    Current Polymer
                  </label>
                  <p className="text-base font-black text-[var(--heading-color)] tracking-tight px-2">
                    {info.name}
                  </p>
                </div>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                      Chemical Formula
                    </p>
                    <p className="text-sm font-semibold">{info.formula}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                      Density
                    </p>
                    <p className="text-sm font-semibold">{info.density}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                      Functional Group
                    </p>
                    <p className="text-sm font-semibold">{info.functionalGroup}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                      Important FTIR Peaks
                    </p>
                    <p className="text-sm font-semibold">{info.ftir}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <section className="glass-card h-full overflow-hidden border-slate-200 dark:border-white/10 shadow-2xl bg-white dark:bg-white/5">
            <div className="relative h-full min-h-[680px]">
              <model-viewer
                ref={viewerRef}
                src={`models/${selectedPolymer}`}
                camera-controls
                auto-rotate
                shadow-intensity="1"
                exposure="1"
                environment-image="neutral"
                camera-orbit="0deg 65deg 2.25m"
                className="w-full h-full bg-slate-950"
              >
                <button
                  ref={hotspotRef}
                  className="absolute top-6 left-6 rounded-full px-4 py-2 bg-primary-600 text-white text-sm font-black shadow-2xl"
                  slot="hotspot-functional"
                  data-position="0m 0m 0m"
                  data-normal="0m 1m 0m"
                >
                  Functional Group
                </button>
              </model-viewer>
            </div>
          </section>
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