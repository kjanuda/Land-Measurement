"use client";

import {
  MapContainer, TileLayer, Marker, Polyline, Polygon,
  Popup, useMapEvents, useMap, Circle,
} from "react-leaflet";
import { useState, useEffect, useRef, useCallback } from "react";
import * as turf from "@turf/turf";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import L from "leaflet";

// ─── Responsive hook ──────────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

// ─── Map helpers ──────────────────────────────────────────────────────────────
// flyTrigger = { count, zoom } — only count changing causes a fly.
function MapFlyTo({ flyTrigger, location }) {
  const map = useMap();
  useEffect(() => {
    if (flyTrigger.count > 0 && location) {
      map.flyTo(location, flyTrigger.zoom, { animate: true, duration: 0.6 });
    }
  }, [flyTrigger.count]); // eslint-disable-line
  return null;
}

function MapClickHandler({ mode, setPoints, setDistPoints }) {
  useMapEvents({
    click(e) {
      const pt = [e.latlng.lat, e.latlng.lng];
      if (mode === "distance") {
        setDistPoints(prev => prev.length >= 2 ? [pt] : [...prev, pt]);
      } else if (mode === "addPoint") {
        setPoints(prev => [...prev, pt]);
      }
    },
  });
  return null;
}

// ─── GPS ─────────────────────────────────────────────────────────────────────
function getHighAccuracyPosition(samples = 5, onProgress) {
  return new Promise((resolve, reject) => {
    const readings = [];
    let count = 0;
    const collect = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          readings.push({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy });
          count++;
          if (onProgress) onProgress(count, samples);
          if (count < samples) setTimeout(collect, 800);
          else {
            const best = [...readings].sort((a, b) => a.accuracy - b.accuracy).slice(0, Math.ceil(samples * 0.7));
            resolve({
              lat: best.reduce((s, r) => s + r.lat, 0) / best.length,
              lng: best.reduce((s, r) => s + r.lng, 0) / best.length,
              accuracy: best.reduce((s, r) => s + r.accuracy, 0) / best.length,
            });
          }
        },
        reject,
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
    };
    collect();
  });
}

// ─── Math helpers ─────────────────────────────────────────────────────────────
function getSideLength(p1, p2) {
  return turf.distance(turf.point([p1[1], p1[0]]), turf.point([p2[1], p2[0]]), { units: "meters" });
}

function getBearing(p1, p2) {
  const b = turf.bearing(turf.point([p1[1], p1[0]]), turf.point([p2[1], p2[0]]));
  const pos = (b + 360) % 360;
  const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  return { deg: pos.toFixed(1), compass: dirs[Math.round(pos / 22.5) % 16] };
}

function getCentroid(points) {
  if (points.length < 3) return null;
  try {
    const poly = turf.polygon([[...points.map(p => [p[1], p[0]]), [points[0][1], points[0][0]]]]);
    const c = turf.centroid(poly);
    return [c.geometry.coordinates[1], c.geometry.coordinates[0]];
  } catch { return null; }
}

// ─── Elevation ────────────────────────────────────────────────────────────────
async function fetchElevations(points) {
  try {
    const locations = points.map(p => ({ latitude: p[0], longitude: p[1] }));
    const res = await fetch("https://api.open-elevation.com/api/v1/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locations }),
    });
    const data = await res.json();
    return data.results.map(r => r.elevation);
  } catch {
    return points.map(() => null);
  }
}

// ─── Canvas diagram for PDF ───────────────────────────────────────────────────
function drawPolygonCanvas(points, width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#0f172a"; ctx.fillRect(0, 0, width, height);
  if (points.length < 2) return canvas;
  const lats = points.map(p => p[0]), lngs = points.map(p => p[1]);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const pad = 65;
  const sx = (width - pad * 2) / (maxLng - minLng || 0.0001);
  const sy = (height - pad * 2) / (maxLat - minLat || 0.0001);
  const sc = Math.min(sx, sy);
  const ox = (width - (maxLng - minLng) * sc) / 2;
  const oy = (height - (maxLat - minLat) * sc) / 2;
  const tx = lng => ox + (lng - minLng) * sc;
  const ty = lat => height - oy - (lat - minLat) * sc;
  ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 1;
  for (let i = 0; i <= 8; i++) {
    ctx.beginPath(); ctx.moveTo((width/8)*i, 0); ctx.lineTo((width/8)*i, height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, (height/8)*i); ctx.lineTo(width, (height/8)*i); ctx.stroke();
  }
  ctx.beginPath(); ctx.moveTo(tx(points[0][1]), ty(points[0][0]));
  for (let i = 1; i < points.length; i++) ctx.lineTo(tx(points[i][1]), ty(points[i][0]));
  ctx.closePath();
  ctx.fillStyle = "rgba(99,102,241,0.2)"; ctx.fill();
  ctx.strokeStyle = "#818cf8"; ctx.lineWidth = 2.5; ctx.stroke();
  for (let i = 0; i < points.length; i++) {
    const a = points[i], b = points[(i+1) % points.length];
    const dist = getSideLength(a, b);
    const bear = getBearing(a, b);
    const mx = (tx(a[1]) + tx(b[1])) / 2, my = (ty(a[0]) + ty(b[0])) / 2;
    ctx.fillStyle = "rgba(0,0,0,0.75)"; ctx.fillRect(mx - 34, my - 18, 68, 20);
    ctx.fillStyle = "#fbbf24"; ctx.font = "bold 10px Arial"; ctx.textAlign = "center";
    ctx.fillText(`${dist.toFixed(2)}m`, mx, my - 6);
    ctx.fillStyle = "#94a3b8"; ctx.font = "9px Arial";
    ctx.fillText(`${bear.compass} ${bear.deg}°`, mx, my + 4);
  }
  points.forEach((p, i) => {
    const x = tx(p[1]), y = ty(p[0]);
    ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fillStyle = "#6366f1"; ctx.fill();
    ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = "#fff"; ctx.font = "bold 11px Arial"; ctx.textAlign = "center";
    ctx.fillText(`P${i+1}`, x, y - 13);
  });
  return canvas;
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function makeNumberedIcon(n, color = "#6366f1") {
  return L.divIcon({
    className: "",
    html: `<div style="background:${color};color:#fff;border:2px solid #fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;box-shadow:0 2px 8px rgba(0,0,0,0.5)">${n}</div>`,
    iconSize: [28, 28], iconAnchor: [14, 14],
  });
}

function makeCenterIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="background:#f59e0b;color:#fff;border:2px solid #fff;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,0.5)">⊕</div>`,
    iconSize: [24, 24], iconAnchor: [12, 12],
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function LandMap() {
  const isMobile = useIsMobile();

  // ── Core state ───────────────────────────────────────────────────────────────
  const [plots, setPlots] = useState([{ id: 1, name: "Plot 1", points: [], color: "#6366f1" }]);
  const [activePlot, setActivePlot] = useState(0);
  const [mapType, setMapType] = useState("satellite");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [flyTrigger, setFlyTrigger] = useState({ count: 0, zoom: 23 });
  const [watchId, setWatchId] = useState(null);
  const [gpsAccuracy, setGpsAccuracy] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureProgress, setCaptureProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [autoActive, setAutoActive] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const lastAutoPoint = useRef(null);

  // ── Sheet state (mobile bottom drawer) ───────────────────────────────────────
  // "peek"  = 120px   → just the handle + quick actions visible
  // "half"  = 45vh    → main stats + primary button
  // "full"  = 85vh    → full panel
  const [sheetState, setSheetState] = useState("peek"); // peek | half | full
  const sheetRef = useRef(null);
  const dragStartY = useRef(null);
  const dragStartState = useRef(null);

  // ── Feature state ─────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("survey");
  const [mapMode, setMapMode] = useState("addPoint");
  const [distPoints, setDistPoints] = useState([]);
  const [elevations, setElevations] = useState({});
  const [elevLoading, setElevLoading] = useState(false);
  const [showCentroid, setShowCentroid] = useState(true);
  const [showBearings, setShowBearings] = useState(true);
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [savedSurveys, setSavedSurveys] = useState([]);
  const [surveyName, setSurveyName] = useState("My Survey");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [showInsertModal, setShowInsertModal] = useState(false);

  const SAMPLES = 5;
  const PLOT_COLORS = ["#6366f1","#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4"];
  const normalMap = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const satelliteMap = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

  const curPlot = plots[activePlot];
  const points = curPlot?.points || [];
  const setPoints = (fn) => setPlots(prev =>
    prev.map((p, i) => i === activePlot ? { ...p, points: typeof fn === "function" ? fn(p.points) : fn } : p)
  );

  // ── Calculations ──────────────────────────────────────────────────────────────
  const calcArea = (pts = points) => {
    if (pts.length < 3) return 0;
    try { return turf.area(turf.polygon([[...pts.map(p => [p[1], p[0]]), [pts[0][1], pts[0][0]]]])); }
    catch { return 0; }
  };
  const calcPerimeter = (pts = points) => {
    if (pts.length < 2) return 0;
    let t = 0;
    for (let i = 0; i < pts.length; i++) t += getSideLength(pts[i], pts[(i+1) % pts.length]);
    return t;
  };
  const area = calcArea();
  const perimeter = calcPerimeter();
  const perch = area / 25.29;
  const acres = area / 4046.86;
  const centroid = getCentroid(points);

  // ── Load saved ────────────────────────────────────────────────────────────────
  useEffect(() => {
    try { setSavedSurveys(JSON.parse(localStorage.getItem("landsurveys") || "[]")); } catch {}
  }, []);

  // ── Load from URL ─────────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const s = params.get("survey");
      if (s) { setPlots(JSON.parse(decodeURIComponent(s))); setMsg("✓ Survey loaded from link!", 4000); }
    } catch {}
  }, []);

  const setMsg = (msg, delay = 3000) => {
    setStatus(msg);
    if (delay) setTimeout(() => setStatus(""), delay);
  };

  // ── Touch drag sheet ──────────────────────────────────────────────────────────
  const handleTouchStart = (e) => {
    dragStartY.current = e.touches[0].clientY;
    dragStartState.current = sheetState;
  };
  const handleTouchEnd = (e) => {
    if (dragStartY.current === null) return;
    const dy = dragStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(dy) < 20) return; // ignore tiny taps
    if (dy > 40) {
      // swipe up → expand
      if (sheetState === "peek") setSheetState("half");
      else if (sheetState === "half") setSheetState("full");
    } else if (dy < -40) {
      // swipe down → collapse
      if (sheetState === "full") setSheetState("half");
      else if (sheetState === "half") setSheetState("peek");
    }
    dragStartY.current = null;
  };

  // ── GPS ───────────────────────────────────────────────────────────────────────
  const addPoint = async () => {
    if (isCapturing) return;
    setIsCapturing(true); setCaptureProgress(0);
    setStatus("GPS readings ගන්නවා...");
    try {
      const r = await getHighAccuracyPosition(SAMPLES, (d, t) => {
        setCaptureProgress(Math.round((d / t) * 100));
        setStatus(`Reading ${d}/${t}...`);
      });
      const np = [r.lat, r.lng];
      setPoints(prev => [...prev, np]);
      setCurrentLocation(np);
      setGpsAccuracy(r.accuracy.toFixed(1));
      setMapType("satellite"); // ensure satellite view
      setFlyTrigger({ count: Date.now(), zoom: 21 }); // zoom in close so point is clearly visible
      setMsg(`✓ Point added! ±${r.accuracy.toFixed(1)}m`);
    } catch { setMsg("GPS error — permission check කරන්න."); }
    finally { setIsCapturing(false); setCaptureProgress(0); }
  };

  const addManualPoint = () => {
    const lat = parseFloat(manualLat), lng = parseFloat(manualLng);
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setMsg("Invalid coordinates!"); return;
    }
    setPoints(prev => [...prev, [lat, lng]]);
    setCurrentLocation([lat, lng]);
    setManualLat(""); setManualLng("");
    setShowManualModal(false);
    setMsg(`✓ Manual point: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
  };

  const insertPointBetween = async (afterIndex) => {
    setIsCapturing(true); setCaptureProgress(0);
    setStatus(`Inserting after P${afterIndex + 1}...`);
    try {
      const r = await getHighAccuracyPosition(SAMPLES, (d, t) => {
        setCaptureProgress(Math.round((d / t) * 100));
        setStatus(`Reading ${d}/${t}...`);
      });
      setPoints(prev => {
        const next = [...prev];
        next.splice(afterIndex + 1, 0, [r.lat, r.lng]);
        return next;
      });
      setCurrentLocation([r.lat, r.lng]);
      setGpsAccuracy(r.accuracy.toFixed(1));
      setShowInsertModal(false);
      setMsg(`✓ Point inserted after P${afterIndex + 1}!`);
    } catch { setMsg("GPS error."); }
    finally { setIsCapturing(false); setCaptureProgress(0); }
  };

  // "Locate me" — flies the map to current position
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const loc = [p.coords.latitude, p.coords.longitude];
        setCurrentLocation(loc);
        setGpsAccuracy(p.coords.accuracy.toFixed(1));
        setFlyTrigger({ count: Date.now(), zoom: 19 }); // triggers MapFlyTo
        setMsg("Location updated", 2000);
      },
      null, { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
  };

  const startAuto = () => {
    lastAutoPoint.current = null;
    const id = navigator.geolocation.watchPosition(
      (p) => {
        const np = [p.coords.latitude, p.coords.longitude];
        setCurrentLocation(np);
        setGpsAccuracy(p.coords.accuracy.toFixed(1));
        if (lastAutoPoint.current) {
          if (getSideLength(lastAutoPoint.current, np) >= 2) { setPoints(prev => [...prev, np]); lastAutoPoint.current = np; }
        } else { setPoints(prev => [...prev, np]); lastAutoPoint.current = np; }
      },
      (e) => setMsg("GPS error: " + e.message),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );
    setWatchId(id); setAutoActive(true);
    setMsg("Boundary දිගේ ඇවිදන්න...", 4000);
  };

  const stopAuto = () => {
    if (watchId !== null) { navigator.geolocation.clearWatch(watchId); setWatchId(null); }
    setAutoActive(false); setMsg("Survey stopped", 2000);
  };

  const loadElevations = async () => {
    if (points.length === 0) { setMsg("Points නැහැ!"); return; }
    setElevLoading(true); setMsg("Elevation data ගන්නවා...", 0);
    const elev = await fetchElevations(points);
    const obj = {};
    points.forEach((_, i) => { obj[i] = elev[i]; });
    setElevations(obj);
    setElevLoading(false);
    setMsg("✓ Elevation loaded!", 3000);
  };

  const addPlot = () => {
    const newPlot = { id: Date.now(), name: `Plot ${plots.length + 1}`, points: [], color: PLOT_COLORS[plots.length % PLOT_COLORS.length] };
    setPlots(prev => [...prev, newPlot]);
    setActivePlot(plots.length);
    setMsg(`Plot ${plots.length + 1} created`, 2000);
  };

  const removePlot = (idx) => {
    if (plots.length === 1) { setMsg("අවම plot 1 ඕන!"); return; }
    setPlots(prev => prev.filter((_, i) => i !== idx));
    setActivePlot(Math.max(0, activePlot - 1));
  };

  const saveSurvey = () => {
    const survey = { id: Date.now(), name: surveyName, date: new Date().toISOString(), plots };
    const updated = [...savedSurveys, survey];
    try {
      localStorage.setItem("landsurveys", JSON.stringify(updated));
      setSavedSurveys(updated);
      setShowSaveModal(false);
      setMsg(`✓ "${surveyName}" saved!`);
    } catch { setMsg("Save failed — storage full?"); }
  };

  const loadSurvey = (survey) => {
    setPlots(survey.plots); setActivePlot(0);
    setShowLoadModal(false); setMsg(`✓ "${survey.name}" loaded!`);
  };

  const deleteSaved = (id) => {
    const updated = savedSurveys.filter(s => s.id !== id);
    localStorage.setItem("landsurveys", JSON.stringify(updated));
    setSavedSurveys(updated);
  };

  const shareLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?survey=${encodeURIComponent(JSON.stringify(plots))}`;
    navigator.clipboard.writeText(url).then(() => setMsg("✓ Link copied!")).catch(() => setMsg("Copy failed"));
  };

  const exportKML = () => {
    if (points.length < 3) { setMsg("Points 3+ ඕන!"); return; }
    const coords = [...points, points[0]].map(p => `${p[1]},${p[0]},0`).join(" ");
    const kml = `<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>${surveyName}</name><Placemark><name>${curPlot.name}</name><Polygon><outerBoundaryIs><LinearRing><coordinates>${coords}</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark></Document></kml>`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([kml], { type: "application/vnd.google-earth.kml+xml" }));
    a.download = `${surveyName.replace(/\s+/g,"-")}.kml`; a.click();
    setMsg("✓ KML downloaded!");
  };

  const exportGeoJSON = () => {
    if (points.length < 3) { setMsg("Points 3+ ඕන!"); return; }
    const geojson = {
      type: "FeatureCollection",
      features: plots.filter(p => p.points.length >= 3).map(plot => ({
        type: "Feature",
        properties: { name: plot.name, area: calcArea(plot.points), perimeter: calcPerimeter(plot.points) },
        geometry: { type: "Polygon", coordinates: [[...plot.points.map(p => [p[1], p[0]]), [plot.points[0][1], plot.points[0][0]]]] },
      })),
    };
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(geojson, null, 2)], { type: "application/json" }));
    a.download = `${surveyName.replace(/\s+/g,"-")}.geojson`; a.click();
    setMsg("✓ GeoJSON downloaded!");
  };

  const distanceMeasured = distPoints.length === 2 ? getSideLength(distPoints[0], distPoints[1]) : null;

  const handleMarkerDrag = (index, e) => {
    const { lat, lng } = e.target.getLatLng();
    setPoints(prev => prev.map((p, i) => i === index ? [lat, lng] : p));
  };

  const exportPDF = async () => {
    if (points.length < 3) { setMsg("Points 3+ ඕන PDF export කරන්න"); return; }
    setIsExporting(true); setMsg("PDF generate කරනවා...", 0);
    try {
      await new Promise((res) => {
        if (window.jspdf) return res();
        const s = document.createElement("script");
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
        s.onload = res; document.head.appendChild(s);
      });
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pw = 210, ph = 297, mg = 18;
      doc.setFillColor(10,15,30); doc.rect(0,0,pw,34,"F");
      doc.setFillColor(99,102,241); doc.rect(0,0,5,34,"F");
      doc.setTextColor(255,255,255); doc.setFontSize(18); doc.setFont("helvetica","bold");
      doc.text("LAND SURVEY REPORT", mg+4, 14);
      doc.setFontSize(8); doc.setFont("helvetica","normal"); doc.setTextColor(160,160,200);
      const now = new Date();
      doc.text(`Survey: ${surveyName}  |  Plot: ${curPlot.name}`, mg+4, 21);
      doc.text(`Date: ${now.toLocaleDateString("en-GB")}  |  Time: ${now.toLocaleTimeString("en-GB")}`, mg+4, 27);
      doc.text(`GPS Points: ${points.length}  |  Accuracy: ${gpsAccuracy ? `±${gpsAccuracy}m` : "N/A"}`, mg+4, 32);
      let y = 42;
      doc.setTextColor(20,20,20); doc.setFontSize(11); doc.setFont("helvetica","bold");
      doc.text("LAND MEASUREMENTS", mg, y);
      doc.setDrawColor(99,102,241); doc.setLineWidth(0.4); doc.line(mg, y+2, pw-mg, y+2);
      y += 8;
      const stats = [
        { label:"Area (m²)", value: area.toFixed(4)+" m²" },
        { label:"Area (Perch)", value: perch.toFixed(4)+" perch" },
        { label:"Area (Acres)", value: acres.toFixed(6)+" acres" },
        { label:"Perimeter", value: perimeter.toFixed(2)+" m" },
      ];
      const cw = (pw - mg*2) / 2 - 3;
      stats.forEach((s, i) => {
        const col = i%2, row = Math.floor(i/2);
        const x = mg+col*(cw+6), sy = y+row*17;
        doc.setFillColor(245,245,255); doc.roundedRect(x,sy,cw,13,2,2,"F");
        doc.setDrawColor(210,210,235); doc.setLineWidth(0.3); doc.roundedRect(x,sy,cw,13,2,2,"S");
        doc.setFontSize(7.5); doc.setFont("helvetica","normal"); doc.setTextColor(100,100,140);
        doc.text(s.label, x+3, sy+5.5);
        doc.setFontSize(10); doc.setFont("helvetica","bold"); doc.setTextColor(20,20,70);
        doc.text(s.value, x+3, sy+11);
      });
      y += Math.ceil(stats.length/2)*17 + 10;
      if (centroid) {
        doc.setFontSize(8); doc.setFont("helvetica","normal"); doc.setTextColor(80,80,120);
        doc.text(`Center: ${centroid[0].toFixed(8)}, ${centroid[1].toFixed(8)}`, mg, y);
        y += 7;
      }
      doc.setFontSize(11); doc.setFont("helvetica","bold"); doc.setTextColor(20,20,20);
      doc.text("LAND BOUNDARY DIAGRAM", mg, y);
      doc.setDrawColor(99,102,241); doc.line(mg, y+2, pw-mg, y+2);
      y += 5;
      const cnv = drawPolygonCanvas(points, 520, 360);
      const dW = pw-mg*2, dH = (360/520)*dW;
      doc.addImage(cnv.toDataURL("image/png"), "PNG", mg, y, dW, dH);
      y += dH + 10;
      if (y < ph - 60) {
        doc.setFontSize(11); doc.setFont("helvetica","bold"); doc.setTextColor(20,20,20);
        doc.text("GPS COORDINATES & BEARINGS", mg, y);
        doc.setDrawColor(99,102,241); doc.line(mg, y+2, pw-mg, y+2);
        y += 5;
        const colX = { pt:mg+2, lat:mg+14, lng:mg+62, elev:mg+110, bear:mg+135, side:mg+158 };
        doc.setFillColor(10,15,30); doc.rect(mg,y,pw-mg*2,9,"F");
        doc.setTextColor(255,255,255); doc.setFontSize(7); doc.setFont("helvetica","bold");
        ["Pt","Latitude","Longitude","Elev(m)","Bearing","Side(m)"].forEach((h,i) => {
          doc.text(h, Object.values(colX)[i], y+6);
        });
        y += 9;
        points.forEach((p, i) => {
          if (y > ph-20) return;
          const nextPt = points[(i+1)%points.length];
          const side = getSideLength(p, nextPt);
          const bear = getBearing(p, nextPt);
          const elev = elevations[i];
          doc.setFillColor(i%2===0?245:255, i%2===0?245:255, 255);
          doc.rect(mg,y,pw-mg*2,8,"F");
          doc.setDrawColor(220,220,235); doc.setLineWidth(0.2); doc.rect(mg,y,pw-mg*2,8,"S");
          doc.setFontSize(7); doc.setFont("helvetica","bold"); doc.setTextColor(60,60,120);
          doc.text(`P${i+1}`, colX.pt, y+5.5);
          doc.setFont("helvetica","normal"); doc.setTextColor(20,20,20);
          doc.text(p[0].toFixed(8), colX.lat, y+5.5);
          doc.text(p[1].toFixed(8), colX.lng, y+5.5);
          doc.text(elev!=null?elev.toFixed(1):"N/A", colX.elev, y+5.5);
          doc.setTextColor(80,80,160);
          doc.text(`${bear.compass} ${bear.deg}°`, colX.bear, y+5.5);
          doc.setTextColor(20,20,20);
          doc.text(side.toFixed(2), colX.side, y+5.5);
          y += 8;
        });
      }
      doc.setFillColor(10,15,30); doc.rect(0,ph-14,pw,14,"F");
      doc.setTextColor(100,100,140); doc.setFontSize(7.5); doc.setFont("helvetica","normal");
      doc.text("Smart GPS Land Survey  •  Reference only. Consult a licensed surveyor for legal purposes.", mg, ph-5);
      doc.save(`land-survey-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,"0")}${String(now.getDate()).padStart(2,"0")}.pdf`);
      setMsg("✓ PDF downloaded!");
    } catch (e) { setMsg("PDF error: " + e.message); }
    finally { setIsExporting(false); }
  };

  const accColor = gpsAccuracy
    ? parseFloat(gpsAccuracy) < 5  ? { bg:"rgba(34,197,94,0.15)", border:"rgba(34,197,94,0.3)", text:"#4ade80", label:"Excellent" }
    : parseFloat(gpsAccuracy) < 10 ? { bg:"rgba(234,179,8,0.15)",  border:"rgba(234,179,8,0.3)",  text:"#facc15", label:"Good" }
    : { bg:"rgba(239,68,68,0.15)", border:"rgba(239,68,68,0.3)", text:"#f87171", label:"Weak" }
    : null;

  // ── Sheet height map ──────────────────────────────────────────────────────────
  const SHEET_HEIGHTS = { peek: "116px", half: "48vh", full: "86vh" };

  // ── Shared sub-components ─────────────────────────────────────────────────────
  const Btn = ({ onClick, disabled, children, color = "#374151", full = false, small = false, style = {} }) => (
    <button onClick={onClick} disabled={disabled} style={{
      padding: small ? "7px 10px" : "10px 10px",
      background: disabled ? "rgba(255,255,255,0.04)" : color,
      color: disabled ? "#444" : "#fff",
      border: "none", borderRadius: 10,
      fontSize: small ? 11 : 12, fontWeight: 600,
      cursor: disabled ? "not-allowed" : "pointer",
      width: full ? "100%" : "auto",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
      transition: "opacity 0.15s",
      ...style,
    }}>{children}</button>
  );

  const Row2 = ({ children, gap = 6 }) => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap, marginBottom: 7 }}>
      {children}
    </div>
  );

  const StatCard = ({ label, value, accent }) => (
    <div style={{
      background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "8px 10px",
      border: "1px solid rgba(255,255,255,0.07)",
    }}>
      <div style={{ fontSize: 10, color: "#555", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: accent || "#fff" }}>{value}</div>
    </div>
  );

  const SectionLabel = ({ children }) => (
    <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 6, marginTop: 10 }}>
      {children}
    </div>
  );

  const inp = {
    width: "100%", padding: "9px 12px",
    background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 8, color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box",
  };

  const modalBg = {
    position: "fixed", inset: 0, zIndex: 3000,
    background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center",
    padding: 16,
  };
  const modalBox = {
    background: "#0f172a", border: "1px solid rgba(99,102,241,0.3)",
    borderRadius: 16, padding: 20, width: "100%", maxWidth: 360, color: "#fff",
  };

  const popupCSS = `
    .cpop .leaflet-popup-content-wrapper{background:rgba(8,10,20,0.96);border:1px solid rgba(99,102,241,0.35);border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.5);color:#fff;padding:0}
    .cpop .leaflet-popup-content{margin:0;padding:10px 13px;min-width:185px}
    .cpop .leaflet-popup-tip{background:rgba(8,10,20,0.96)}
    .cpop .leaflet-popup-close-button{color:#888;font-size:16px;padding:4px 6px}
  `;

  // ── Desktop panel (fixed sidebar) ─────────────────────────────────────────────
  const DesktopPanel = () => (
    <div style={{
      position: "absolute", top: 12, left: 12, zIndex: 1000,
      background: "rgba(8,10,20,0.93)", backdropFilter: "blur(14px)",
      padding: "14px", borderRadius: 18, width: 280, color: "#fff",
      boxShadow: "0 8px 40px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)",
      maxHeight: "calc(100vh - 24px)", overflowY: "auto",
    }}>
      <PanelContent />
    </div>
  );

  // ── Mobile bottom sheet ────────────────────────────────────────────────────────
  const MobileSheet = () => (
    <div
      ref={sheetRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1000,
        background: "rgba(8,10,20,0.97)", backdropFilter: "blur(20px)",
        borderRadius: "20px 20px 0 0",
        border: "1px solid rgba(255,255,255,0.09)",
        height: SHEET_HEIGHTS[sheetState],
        transition: "height 0.35s cubic-bezier(0.32,0.72,0,1)",
        boxShadow: "0 -8px 48px rgba(0,0,0,0.6)",
        display: "flex", flexDirection: "column",
        overflowY: "hidden",
        willChange: "height",
      }}
    >
      {/* Drag handle */}
      <div
        style={{
          flexShrink: 0,
          padding: "10px 0 6px",
          display: "flex", flexDirection: "column", alignItems: "center",
          cursor: "pointer",
        }}
        onClick={() => setSheetState(s => s === "peek" ? "half" : s === "half" ? "full" : "peek")}
      >
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.2)", marginBottom: 6 }} />
        {/* Peek row: stats + primary action always visible */}
        <div style={{ width: "100%", padding: "0 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "#555", lineHeight: 1 }}>PERCH</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#a78bfa", lineHeight: 1.2 }}>{perch.toFixed(2)}</div>
            </div>
            <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "#555", lineHeight: 1 }}>m²</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>{area.toFixed(0)}</div>
            </div>
            <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "#555", lineHeight: 1 }}>PTS</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>{points.length}</div>
            </div>
            {accColor && (
              <>
                <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: "#555", lineHeight: 1 }}>GPS</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: accColor.text, lineHeight: 1.2 }}>±{gpsAccuracy}m</div>
                </div>
              </>
            )}
          </div>
          <div style={{ fontSize: 10, color: "#444", paddingRight: 4 }}>
            {sheetState === "peek" ? "▲ expand" : sheetState === "half" ? "▲ more" : "▼ hide"}
          </div>
        </div>
      </div>

      {/* Scrollable content — only visible when half / full */}
      <div style={{
        flex: 1,
        overflowY: sheetState === "peek" ? "hidden" : "auto",
        padding: "4px 14px 36px",
        color: "#fff",
        opacity: sheetState === "peek" ? 0 : 1,
        transition: "opacity 0.2s",
        pointerEvents: sheetState === "peek" ? "none" : "auto",
      }}>
        {/* Quick actions always-visible row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7, marginBottom: 10, marginTop: 4 }}>
          <button onClick={addPoint} disabled={isCapturing} style={{
            padding: "13px 6px",
            background: isCapturing ? "rgba(99,102,241,0.3)" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
            color: "#fff", border: "none", borderRadius: 12, fontSize: 12, fontWeight: 700,
            cursor: isCapturing ? "not-allowed" : "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            boxShadow: isCapturing ? "none" : "0 3px 14px rgba(99,102,241,0.4)",
          }}>
            <span style={{ fontSize: 18 }}>📍</span>
            {isCapturing ? `${captureProgress}%` : "Add Pt"}
          </button>
          <button onClick={getLocation} style={{
            padding: "13px 6px", background: "#1d4ed8", color: "#fff",
            border: "none", borderRadius: 12, fontSize: 12, fontWeight: 700,
            cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          }}>
            <span style={{ fontSize: 18 }}>🎯</span>
            Locate
          </button>
          <button onClick={() => setPoints(p => p.slice(0,-1))} disabled={points.length === 0} style={{
            padding: "13px 6px",
            background: points.length === 0 ? "rgba(255,255,255,0.04)" : "#92400e",
            color: points.length === 0 ? "#444" : "#fff",
            border: "none", borderRadius: 12, fontSize: 12, fontWeight: 700,
            cursor: points.length === 0 ? "not-allowed" : "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          }}>
            <span style={{ fontSize: 18 }}>↩</span>
            Undo
          </button>
        </div>

        {/* Capture progress bar */}
        {isCapturing && (
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: "#888", marginBottom: 3 }}>Averaging {SAMPLES} readings...</div>
            <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 99, height: 5 }}>
              <div style={{ background: "linear-gradient(90deg,#6366f1,#a78bfa)", width: `${captureProgress}%`, height: "100%", borderRadius: 99, transition: "width 0.3s" }} />
            </div>
          </div>
        )}

        {/* Status */}
        {status && (
          <div style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 8, padding: "6px 10px", marginBottom: 8, fontSize: 11, color: "#a5b4fc" }}>
            {status}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
          {[["survey","📍 Survey"],["tools","🔧 Tools"],["plots","🗂 Plots"],["save","💾 Save"]].map(([id,label]) => (
            <button key={id} onClick={() => setActiveTab(id)} style={{
              flex: 1, padding: "7px 2px", fontSize: 10, fontWeight: 600,
              background: activeTab === id ? "#6366f1" : "rgba(255,255,255,0.05)",
              color: activeTab === id ? "#fff" : "#666",
              border: activeTab === id ? "1px solid #6366f1" : "1px solid transparent",
              borderRadius: 8, cursor: "pointer",
            }}>{label}</button>
          ))}
        </div>

        <TabContent />
      </div>
    </div>
  );

  // ── Tab content (shared between mobile/desktop) ────────────────────────────────
  const TabContent = () => {
    if (activeTab === "survey") return (
      <>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginBottom: 10 }}>
          <StatCard label="m²" value={area.toFixed(1)} />
          <StatCard label="Perch" value={perch.toFixed(2)} accent="#a78bfa" />
          <StatCard label="Acres" value={acres.toFixed(4)} />
          <StatCard label="Perimeter" value={perimeter.toFixed(1)+"m"} />
          <StatCard label="Points" value={points.length} />
          <StatCard label="Plots" value={plots.length} />
        </div>

        <Row2>
          <Btn onClick={startAuto} disabled={autoActive} color={autoActive?"#374151":"#064e3b"}>▶ Auto Walk</Btn>
          <Btn onClick={stopAuto} disabled={!autoActive} color={!autoActive?"#374151":"#7f1d1d"}>■ Stop</Btn>
        </Row2>
        <Btn onClick={exportPDF} disabled={isExporting || points.length < 3}
          color={points.length < 3 ? "#1e293b" : "linear-gradient(135deg,#0f766e,#14b8a6)"} full
          style={{ marginBottom: 6, padding: "11px" }}>
          {isExporting ? "⏳ Generating..." : "📄 Export PDF Report"}
        </Btn>
        {points.length < 3 && <div style={{ fontSize: 10, color: "#555", textAlign: "center", marginBottom: 8 }}>3 points min for PDF ({points.length}/3)</div>}
        <Btn onClick={() => { setPoints([]); setElevations({}); setMsg("Reset done", 1500); }} color="#7f1d1d" full>🗑 Reset Points</Btn>
      </>
    );

    if (activeTab === "tools") return (
      <>
        <SectionLabel>✏️ Manual Entry</SectionLabel>
        <Btn onClick={() => setShowManualModal(true)} color="#1d4ed8" full>📌 Add by Coordinates</Btn>

        {points.length >= 2 && (
          <>
            <SectionLabel>➕ Insert Point</SectionLabel>
            <Btn onClick={() => setShowInsertModal(true)} color="#0f766e" full>↗ Insert Between Points</Btn>
          </>
        )}

        {points.length >= 2 && (
          <>
            <SectionLabel>🧭 Bearings</SectionLabel>
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "8px 10px", border: "1px solid rgba(255,255,255,0.07)", marginBottom: 5 }}>
              {points.map((p, i) => {
                const next = points[(i+1) % points.length];
                const bear = getBearing(p, next);
                const dist = getSideLength(p, next);
                return (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: i < points.length-1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                    <span style={{ color: "#818cf8", fontSize: 11, fontWeight: 600 }}>P{i+1}→P{(i+1)%points.length+1}</span>
                    <span style={{ color: "#a78bfa", fontSize: 11 }}>{bear.compass} {bear.deg}°</span>
                    <span style={{ color: "#fbbf24", fontSize: 11 }}>{dist.toFixed(1)}m</span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {centroid && (
          <>
            <SectionLabel>⊕ Center Point</SectionLabel>
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "8px 10px", border: "1px solid rgba(255,255,255,0.07)", marginBottom: 5 }}>
              <div style={{ color: "#94a3b8", fontSize: 11 }}>Lat: <span style={{ color: "#f59e0b", fontFamily: "monospace" }}>{centroid[0].toFixed(6)}</span></div>
              <div style={{ color: "#94a3b8", fontSize: 11 }}>Lng: <span style={{ color: "#f59e0b", fontFamily: "monospace" }}>{centroid[1].toFixed(6)}</span></div>
            </div>
            <label style={{ fontSize: 11, color: "#666", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", marginBottom: 8 }}>
              <input type="checkbox" checked={showCentroid} onChange={e => setShowCentroid(e.target.checked)} />
              Show centroid on map
            </label>
          </>
        )}

        <SectionLabel>🏔️ Elevation</SectionLabel>
        <Btn onClick={loadElevations} disabled={elevLoading || points.length === 0} color="#7c3aed" full>
          {elevLoading ? "⏳ Loading..." : "📡 Fetch Elevation Data"}
        </Btn>
        {Object.keys(elevations).length > 0 && (
          <div style={{ marginTop: 6, background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "8px 10px", border: "1px solid rgba(255,255,255,0.07)" }}>
            {points.map((_, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}>
                <span style={{ color: "#818cf8", fontSize: 11 }}>P{i+1}</span>
                <span style={{ color: "#fbbf24", fontSize: 11 }}>{elevations[i] != null ? `${elevations[i].toFixed(1)}m` : "N/A"}</span>
              </div>
            ))}
          </div>
        )}

        <SectionLabel>📏 Distance Tool</SectionLabel>
        <Row2>
          <Btn onClick={() => { setMapMode("distance"); setDistPoints([]); }} color={mapMode==="distance"?"#10b981":"#064e3b"} small>
            {mapMode==="distance"?"✓ Active":"▶ Start"}
          </Btn>
          <Btn onClick={() => { setMapMode("addPoint"); setDistPoints([]); }} color="#374151" small>✕ Cancel</Btn>
        </Row2>
        {distanceMeasured && (
          <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 8, padding: "6px 10px", color: "#34d399", fontSize: 12, fontWeight: 600 }}>
            📏 {distanceMeasured.toFixed(2)}m &nbsp;|&nbsp; {(distanceMeasured/0.9144).toFixed(2)} yards
          </div>
        )}
      </>
    );

    if (activeTab === "plots") return (
      <>
        <SectionLabel>🗂 Multiple Plots</SectionLabel>
        {plots.map((plot, idx) => (
          <div key={plot.id} onClick={() => setActivePlot(idx)} style={{
            background: idx === activePlot ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${idx === activePlot ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.07)"}`,
            borderRadius: 10, padding: "9px 10px", marginBottom: 6, cursor: "pointer",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: plot.color }} />
                <span style={{ fontWeight: 600, fontSize: 12 }}>{plot.name}</span>
                {idx === activePlot && <span style={{ fontSize: 10, color: "#818cf8" }}>● Active</span>}
              </div>
              {plots.length > 1 && (
                <button onClick={e => { e.stopPropagation(); removePlot(idx); }} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 14, padding: 2 }}>✕</button>
              )}
            </div>
            <div style={{ fontSize: 11, color: "#666", marginTop: 3 }}>
              {plot.points.length} pts &nbsp;|&nbsp; {(calcArea(plot.points)/25.29).toFixed(2)} perch &nbsp;|&nbsp; {calcPerimeter(plot.points).toFixed(0)}m
            </div>
          </div>
        ))}
        <Btn onClick={addPlot} color="#0f766e" full>＋ Add New Plot</Btn>
        <SectionLabel>🎨 Plot Color</SectionLabel>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {PLOT_COLORS.map(c => (
            <div key={c} onClick={() => setPlots(prev => prev.map((p,i) => i===activePlot ? {...p,color:c} : p))} style={{
              width: 30, height: 30, borderRadius: "50%", background: c, cursor: "pointer",
              border: curPlot?.color === c ? "3px solid #fff" : "2px solid transparent",
            }} />
          ))}
        </div>
      </>
    );

    if (activeTab === "save") return (
      <>
        <SectionLabel>💾 Save & Share</SectionLabel>
        <input value={surveyName} onChange={e => setSurveyName(e.target.value)} placeholder="Survey name..." style={{ ...inp, marginBottom: 6 }} />
        <Row2>
          <Btn onClick={() => setShowSaveModal(true)} color="#6366f1">💾 Save</Btn>
          <Btn onClick={() => setShowLoadModal(true)} color="#0f766e">📂 Load</Btn>
        </Row2>

        <SectionLabel>Export</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 8 }}>
          <Btn onClick={exportPDF} disabled={points.length < 3} color={points.length < 3 ? "#1e293b" : "#0f766e"} small>📄 PDF</Btn>
          <Btn onClick={exportKML} disabled={points.length < 3} color={points.length < 3 ? "#1e293b" : "#7c3aed"} small>🌍 KML</Btn>
          <Btn onClick={exportGeoJSON} disabled={points.length < 3} color={points.length < 3 ? "#1e293b" : "#0e7490"} small>📋 JSON</Btn>
        </div>
        <Btn onClick={shareLink} color="#1d4ed8" full>🔗 Copy Share Link</Btn>

        {savedSurveys.length > 0 && (
          <>
            <SectionLabel>Saved ({savedSurveys.length})</SectionLabel>
            {savedSurveys.slice(-3).reverse().map(s => (
              <div key={s.id} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "7px 10px", marginBottom: 5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{s.name}</div>
                  <div style={{ fontSize: 10, color: "#555" }}>{new Date(s.date).toLocaleDateString("en-GB")}</div>
                </div>
                <div style={{ display: "flex", gap: 5 }}>
                  <button onClick={() => loadSurvey(s)} style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 6, color: "#818cf8", fontSize: 10, cursor: "pointer", padding: "3px 7px", fontWeight: 600 }}>Load</button>
                  <button onClick={() => deleteSaved(s.id)} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 6, color: "#f87171", fontSize: 10, cursor: "pointer", padding: "3px 7px" }}>✕</button>
                </div>
              </div>
            ))}
          </>
        )}
      </>
    );

    return null;
  };

  // ── Desktop panel with tabs ────────────────────────────────────────────────────
  const PanelContent = () => (
    <>
      <div style={{ marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 9, color: "#555", letterSpacing: "0.12em", textTransform: "uppercase" }}>Smart GPS</div>
          <div style={{ fontSize: 17, fontWeight: 700 }}>Land Survey</div>
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          {["normal","satellite"].map(t => (
            <button key={t} onClick={() => setMapType(t)} style={{
              padding: "4px 9px", fontSize: 11, fontWeight: 600,
              background: mapType === t ? "#6366f1" : "rgba(255,255,255,0.07)",
              color: mapType === t ? "#fff" : "#888",
              border: mapType === t ? "1px solid #6366f1" : "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, cursor: "pointer",
            }}>
              {t === "normal" ? "🗺 Map" : "🛰 Sat"}
            </button>
          ))}
        </div>
      </div>

      {accColor && (
        <div style={{ background: accColor.bg, border: `1px solid ${accColor.border}`, borderRadius: 8, padding: "5px 10px", marginBottom: 8, fontSize: 11, color: accColor.text, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 8 }}>●</span> GPS ±{gpsAccuracy}m — {accColor.label}
        </div>
      )}
      {status && (
        <div style={{ background: "rgba(99,102,241,0.18)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 8, padding: "5px 10px", marginBottom: 8, fontSize: 11, color: "#a5b4fc" }}>
          {status}
        </div>
      )}
      {isCapturing && (
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 10, color: "#888", marginBottom: 3 }}>Averaging {SAMPLES} readings...</div>
          <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 99, height: 5 }}>
            <div style={{ background: "linear-gradient(90deg,#6366f1,#a78bfa)", width: `${captureProgress}%`, height: "100%", borderRadius: 99, transition: "width 0.3s" }} />
          </div>
        </div>
      )}

      <button onClick={addPoint} disabled={isCapturing} style={{
        width: "100%", padding: "12px",
        background: isCapturing ? "rgba(99,102,241,0.3)" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
        color: "#fff", border: "none", borderRadius: 12, fontSize: 13, fontWeight: 700,
        cursor: isCapturing ? "not-allowed" : "pointer", marginBottom: 8,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
        boxShadow: isCapturing ? "none" : "0 4px 20px rgba(99,102,241,0.35)",
      }}>
        {isCapturing ? `⏳ Capturing... ${captureProgress}%` : "📍 Add Point Here"}
      </button>

      <Row2>
        <Btn onClick={getLocation} color="#1d4ed8">🎯 Locate</Btn>
        <Btn onClick={() => setPoints(p => p.slice(0,-1))} disabled={points.length === 0} color="#92400e">↩ Undo</Btn>
      </Row2>

      <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
        {[["survey","📍"],["tools","🔧"],["plots","🗂"],["save","💾"]].map(([id,icon]) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{
            flex: 1, padding: "6px 2px", fontSize: 11, fontWeight: 600,
            background: activeTab === id ? "#6366f1" : "rgba(255,255,255,0.05)",
            color: activeTab === id ? "#fff" : "#666",
            border: activeTab === id ? "1px solid #6366f1" : "1px solid transparent",
            borderRadius: 8, cursor: "pointer",
          }}>{icon} {id.charAt(0).toUpperCase()+id.slice(1)}</button>
        ))}
      </div>

      <TabContent />
    </>
  );

  // ── Map controls (always visible on map layer) ────────────────────────────────
  const MapControls = () => (
    <div style={{
      position: "absolute",
      top: isMobile ? 12 : 12,
      right: 12,
      zIndex: 999,
      display: "flex", flexDirection: "column", gap: 6,
    }}>
      {/* Map type toggle (mobile only — desktop has it in sidebar) */}
      {isMobile && (
        <div style={{ display: "flex", gap: 5 }}>
          {["normal","satellite"].map(t => (
            <button key={t} onClick={() => setMapType(t)} style={{
              padding: "7px 10px", fontSize: 11, fontWeight: 600,
              background: mapType === t ? "rgba(99,102,241,0.9)" : "rgba(8,10,20,0.75)",
              color: mapType === t ? "#fff" : "#aaa",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 9, cursor: "pointer", backdropFilter: "blur(8px)",
            }}>
              {t === "normal" ? "🗺" : "🛰"}
            </button>
          ))}
        </div>
      )}

      {/* Distance mode indicator */}
      {mapMode === "distance" && (
        <div style={{
          background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)",
          borderRadius: 9, padding: "6px 10px", color: "#34d399", fontSize: 11, fontWeight: 600,
          backdropFilter: "blur(8px)",
        }}>
          📏 Tap map to measure
          {distanceMeasured && <div style={{ color: "#fbbf24", marginTop: 2 }}>{distanceMeasured.toFixed(2)}m</div>}
        </div>
      )}

      {/* Auto walk indicator */}
      {autoActive && (
        <div style={{
          background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)",
          borderRadius: 9, padding: "6px 10px", color: "#f87171", fontSize: 11, fontWeight: 600,
          backdropFilter: "blur(8px)", display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ animation: "pulse 1s infinite", display: "inline-block", fontSize: 8 }}>●</span>
          Walk mode ON
          <button onClick={stopAuto} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: 16, padding: 0, marginLeft: 4 }}>■</button>
        </div>
      )}
    </div>
  );

  // ── RENDER ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ position: "relative", width: "100%", height: "100dvh", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <style>{popupCSS}</style>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>

      {/* ── MAP (always full screen) ────────────────────────────────────── */}
      <MapContainer
        center={[6.9271, 79.8612]}
        zoom={18}
        style={{ height: "100dvh", width: "100%" }}
        zoomControl={!isMobile}
      >
        <TileLayer attribution="Map data" url={mapType === "normal" ? normalMap : satelliteMap} />
        <MapClickHandler mode={mapMode} setPoints={setPoints} setDistPoints={setDistPoints} />
        {/* Only flies to location when Locate button is pressed — NOT on every point add */}
        <MapFlyTo flyTrigger={flyTrigger} location={currentLocation} />

        {/* Current location marker */}
        {currentLocation && (
          <Marker position={currentLocation}>
            <Popup className="cpop">
              <div style={{ fontSize: 11 }}>
                <div style={{ fontWeight: 700, color: "#818cf8", marginBottom: 4 }}>📍 My Location</div>
                <div style={{ color: "#94a3b8" }}>Lat: <span style={{ color: "#fff", fontFamily: "monospace" }}>{currentLocation[0].toFixed(8)}</span></div>
                <div style={{ color: "#94a3b8" }}>Lng: <span style={{ color: "#fff", fontFamily: "monospace" }}>{currentLocation[1].toFixed(8)}</span></div>
                {gpsAccuracy && <div style={{ color: "#4ade80", marginTop: 4 }}>±{gpsAccuracy}m</div>}
              </div>
            </Popup>
          </Marker>
        )}

        {/* All plots */}
        {plots.map((plot, plotIdx) => {
          const pts = plot.points;
          const isActive = plotIdx === activePlot;
          return pts.map((pt, i) => {
            const nextPt = pts[(i+1) % pts.length];
            const bear = pts.length > 1 ? getBearing(pt, nextPt) : null;
            const sideToNext = pts.length > 1 ? getSideLength(pt, nextPt).toFixed(2) : null;
            const elev = elevations[i];
            return (
              <Marker
                key={`${plot.id}-${i}`}
                position={pt}
                icon={makeNumberedIcon(i+1, plot.color)}
                draggable={isActive}
                eventHandlers={isActive ? { dragend: (e) => handleMarkerDrag(i, e) } : {}}
              >
                <Popup className="cpop">
                  <div style={{ fontSize: 11 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: plot.color, marginBottom: 6, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 5 }}>
                      {plot.name} — P{i+1}
                    </div>
                    <div style={{ color: "#94a3b8" }}>Lat: <span style={{ color: "#e2e8f0", fontFamily: "monospace" }}>{pt[0].toFixed(8)}</span></div>
                    <div style={{ color: "#94a3b8" }}>Lng: <span style={{ color: "#e2e8f0", fontFamily: "monospace" }}>{pt[1].toFixed(8)}</span></div>
                    {elev != null && <div style={{ color: "#94a3b8" }}>Elev: <span style={{ color: "#fbbf24" }}>{elev.toFixed(1)}m</span></div>}
                    {sideToNext && (
                      <div style={{ color: "#94a3b8", marginTop: 4 }}>→P{(i+1)%pts.length+1}: <span style={{ color: "#fbbf24", fontWeight: 600 }}>{sideToNext}m</span></div>
                    )}
                    {bear && showBearings && (
                      <div style={{ color: "#a78bfa", marginTop: 2, fontWeight: 600 }}>⬆ {bear.compass} {bear.deg}°</div>
                    )}
                    {isActive && (
                      <button onClick={() => setPoints(prev => prev.filter((_,idx) => idx !== i))} style={{
                        marginTop: 6, width: "100%", padding: "5px",
                        background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)",
                        borderRadius: 6, color: "#f87171", fontSize: 10, cursor: "pointer", fontWeight: 600,
                      }}>🗑 Delete Point</button>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          });
        })}

        {/* Polylines + polygons */}
        {plots.map((plot, plotIdx) => {
          const pts = plot.points;
          const isActive = plotIdx === activePlot;
          if (pts.length < 2) return null;
          return (
            <div key={`lines-${plot.id}`}>
              <Polyline positions={pts} color={plot.color} weight={isActive ? 2.5 : 1.5} dashArray={isActive ? "6,4" : "4,6"} />
              {pts.length > 2 && (
                <>
                  <Polyline positions={[pts[pts.length-1], pts[0]]} color={plot.color} weight={isActive ? 2.5 : 1.5} dashArray={isActive ? "6,4" : "4,6"} />
                  <Polygon positions={pts} pathOptions={{ color: plot.color, fillColor: plot.color, fillOpacity: isActive ? 0.12 : 0.05, weight: 0 }} />
                </>
              )}
            </div>
          );
        })}

        {/* Centroid */}
        {showCentroid && centroid && (
          <Marker position={centroid} icon={makeCenterIcon()}>
            <Popup className="cpop">
              <div style={{ fontSize: 11 }}>
                <div style={{ fontWeight: 700, color: "#f59e0b", marginBottom: 4 }}>⊕ Center Point</div>
                <div style={{ color: "#94a3b8" }}>Lat: <span style={{ color: "#fff", fontFamily: "monospace" }}>{centroid[0].toFixed(8)}</span></div>
                <div style={{ color: "#94a3b8" }}>Lng: <span style={{ color: "#fff", fontFamily: "monospace" }}>{centroid[1].toFixed(8)}</span></div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Distance tool */}
        {mapMode === "distance" && distPoints.map((dp, i) => (
          <Marker key={`dist-${i}`} position={dp}>
            <Popup className="cpop">
              <div style={{ fontSize: 11, color: "#10b981", fontWeight: 700 }}>📏 Point {i+1}</div>
              {distanceMeasured && i === 1 && <div style={{ color: "#fbbf24", fontWeight: 700, marginTop: 4 }}>{distanceMeasured.toFixed(2)}m</div>}
            </Popup>
          </Marker>
        ))}
        {mapMode === "distance" && distPoints.length === 2 && (
          <Polyline positions={distPoints} color="#10b981" weight={3} dashArray="8,4" />
        )}
      </MapContainer>

      {/* ── MAP OVERLAY CONTROLS ─────────────────────────────────────── */}
      <MapControls />

      {/* ── PANEL: desktop sidebar / mobile bottom sheet ──────────────── */}
      {isMobile ? <MobileSheet /> : <DesktopPanel />}

      {/* ── MODALS ──────────────────────────────────────────────────────── */}

      {showManualModal && (
        <div style={modalBg} onClick={() => setShowManualModal(false)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, color: "#818cf8" }}>📌 Manual Coordinate Entry</div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>Latitude (-90 to 90)</div>
              <input value={manualLat} onChange={e => setManualLat(e.target.value)} placeholder="e.g. 6.92714" style={inp} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>Longitude (-180 to 180)</div>
              <input value={manualLng} onChange={e => setManualLng(e.target.value)} placeholder="e.g. 79.86124" style={inp} />
            </div>
            <Row2>
              <Btn onClick={() => setShowManualModal(false)} color="#374151">Cancel</Btn>
              <Btn onClick={addManualPoint} color="#6366f1">✓ Add Point</Btn>
            </Row2>
          </div>
        </div>
      )}

      {showInsertModal && (
        <div style={modalBg} onClick={() => setShowInsertModal(false)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: "#818cf8" }}>➕ Insert Point Between</div>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>Select where to insert the new GPS point:</div>
            <div style={{ maxHeight: 220, overflowY: "auto", marginBottom: 14 }}>
              {points.map((_, i) => (
                <button key={i} onClick={() => insertPointBetween(i)} disabled={isCapturing} style={{
                  width: "100%", padding: "9px 12px", background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff",
                  cursor: "pointer", marginBottom: 4, fontSize: 12, textAlign: "left",
                  display: "flex", justifyContent: "space-between",
                }}>
                  <span>P{i+1} → P{(i+1)%points.length+1}</span>
                  <span style={{ color: "#818cf8" }}>{getSideLength(points[i], points[(i+1)%points.length]).toFixed(1)}m →</span>
                </button>
              ))}
            </div>
            {isCapturing && <div style={{ background: "rgba(99,102,241,0.15)", borderRadius: 8, padding: "6px 10px", marginBottom: 8, fontSize: 11, color: "#a5b4fc" }}>{status}</div>}
            <Btn onClick={() => setShowInsertModal(false)} color="#374151" full>Cancel</Btn>
          </div>
        </div>
      )}

      {showSaveModal && (
        <div style={modalBg} onClick={() => setShowSaveModal(false)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, color: "#818cf8" }}>💾 Save Survey</div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>Survey Name</div>
              <input value={surveyName} onChange={e => setSurveyName(e.target.value)} placeholder="Survey name..." style={inp} />
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 10px", marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: "#666" }}>Plots: {plots.length} &nbsp;|&nbsp; Total Points: {plots.reduce((s,p) => s+p.points.length, 0)}</div>
            </div>
            <Row2>
              <Btn onClick={() => setShowSaveModal(false)} color="#374151">Cancel</Btn>
              <Btn onClick={saveSurvey} color="#6366f1">✓ Save</Btn>
            </Row2>
          </div>
        </div>
      )}

      {showLoadModal && (
        <div style={modalBg} onClick={() => setShowLoadModal(false)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, color: "#818cf8" }}>📂 Load Survey</div>
            {savedSurveys.length === 0 ? (
              <div style={{ color: "#555", fontSize: 13, textAlign: "center", padding: "20px 0" }}>Saved surveys නැහැ</div>
            ) : (
              <div style={{ maxHeight: 280, overflowY: "auto", marginBottom: 14 }}>
                {[...savedSurveys].reverse().map(s => (
                  <div key={s.id} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "10px 12px", marginBottom: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 4 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div>
                      <button onClick={() => deleteSaved(s.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 14 }}>✕</button>
                    </div>
                    <div style={{ fontSize: 11, color: "#555", marginBottom: 6 }}>{new Date(s.date).toLocaleString("en-GB")} &nbsp;|&nbsp; {s.plots?.length || 1} plots</div>
                    <button onClick={() => loadSurvey(s)} style={{
                      width: "100%", padding: "7px", background: "rgba(99,102,241,0.2)",
                      border: "1px solid rgba(99,102,241,0.3)", borderRadius: 6, color: "#818cf8",
                      cursor: "pointer", fontWeight: 600, fontSize: 12,
                    }}>📂 Load This Survey</button>
                  </div>
                ))}
              </div>
            )}
            <Btn onClick={() => setShowLoadModal(false)} color="#374151" full>Close</Btn>
          </div>
        </div>
      )}
    </div>
  );
}