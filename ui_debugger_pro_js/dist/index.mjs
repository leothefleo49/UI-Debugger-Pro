// src/index.tsx
import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";
var SYMPTOMS = [
  { id: "glow", label: "Glowing / Shining", description: "Elements have a halo, fuzzy edge, or light emitting from them.", recommendedToggles: ["shadow", "filter", "ring"] },
  { id: "border", label: "Lines / Borders", description: "Sharp lines, rectangles, or outlines appear around elements.", recommendedToggles: ["outline", "border", "ring"] },
  { id: "flash", label: "Flashing / Colors", description: "Backgrounds change color, flash blue/grey, or highlight on tap.", recommendedToggles: ["tap", "background", "selection"] },
  { id: "glass", label: "Glass / Blur", description: "Backgrounds get blurry, frosted, or semi-transparent.", recommendedToggles: ["backdrop", "filter", "background"] },
  { id: "ghost", label: "Ghost / Highlights", description: "Faint white/colored backgrounds appearing on elements.", recommendedToggles: ["background", "selection"] },
  { id: "move", label: "Movement / Size", description: "Elements grow, shrink, bounce, or shift position.", recommendedToggles: ["transform"] },
  { id: "overlay", label: "Overlays / Blockers", description: "Invisible layers blocking clicks or covering content.", recommendedToggles: ["background", "backdrop"] },
  { id: "text", label: "Text / Content", description: "Text is hard to read, overflowing, or wrong font.", recommendedToggles: ["contrast", "edit"] }
];
var THEMES = {
  dark: { bg: "bg-slate-900", text: "text-slate-200", border: "border-indigo-500", accent: "indigo" },
  light: { bg: "bg-white", text: "text-slate-800", border: "border-blue-500", accent: "blue" },
  hacker: { bg: "bg-black", text: "text-green-400", border: "border-green-500", accent: "green" },
  cyber: { bg: "bg-zinc-900", text: "text-pink-400", border: "border-yellow-400", accent: "pink" },
  dracula: { bg: "bg-[#282a36]", text: "text-[#f8f8f2]", border: "border-[#ff79c6]", accent: "pink" }
};
var STORAGE_KEY = "ui_debugger_pro_config_v7_0";
function UIDebugger() {
  const [showWizard, setShowWizard] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).showWizard : true;
  });
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).theme || "dark" : "dark";
  });
  const [headlessMode, setHeadlessMode] = useState(false);
  const [panelSize, setPanelSize] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).panelSize || { width: 800, height: 400 } : { width: 800, height: 400 };
  });
  const [panelPosition, setPanelPosition] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const defaultPos = { x: 50, y: window.innerHeight - 450 };
    return saved ? JSON.parse(saved).panelPosition || defaultPos : defaultPos;
  });
  const [toggles, setToggles] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).toggles : {
      outline: false,
      shadow: false,
      ring: false,
      border: false,
      selection: false,
      tap: false,
      filter: false,
      backdrop: false,
      transform: false,
      background: false,
      layout: false,
      // Layout Grid
      contrast: false,
      // Contrast Checker
      edit: false,
      // Design Mode (Edit Text)
      images: false
      // Highlight Images
    };
  });
  useEffect(() => {
    document.designMode = toggles.edit ? "on" : "off";
  }, [toggles.edit]);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [targetedRules, setTargetedRules] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).targetedRules : [];
  });
  const [trackHover, setTrackHover] = useState(true);
  const [trackClick, setTrackClick] = useState(true);
  const [trackFocus, setTrackFocus] = useState(true);
  const [trackSelect, setTrackSelect] = useState(true);
  const [maxLogs, setMaxLogs] = useState(50);
  const [autoSave, setAutoSave] = useState(true);
  const [scanResults, setScanResults] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [simulatorMode, setSimulatorMode] = useState(null);
  const [simScale, setSimScale] = useState(1);
  const [ignoredIssues, setIgnoredIssues] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).ignoredIssues || [] : [];
  });
  const [sensitivity, setSensitivity] = useState(0.5);
  const [appliedFixes, setAppliedFixes] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("live");
  const isPausedRef = useRef(isPaused);
  const configRef = useRef({ trackHover, trackClick, trackFocus, trackSelect });
  const historyRef = useRef(history);
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);
  useEffect(() => {
    configRef.current = { trackHover, trackClick, trackFocus, trackSelect };
  }, [trackHover, trackClick, trackFocus, trackSelect]);
  useEffect(() => {
    historyRef.current = history;
  }, [history]);
  useEffect(() => {
    const config = {
      toggles,
      targetedRules,
      trackHover,
      trackClick,
      trackFocus,
      trackSelect,
      showWizard,
      maxLogs,
      autoSave,
      panelSize,
      panelPosition,
      theme,
      ignoredIssues
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [toggles, targetedRules, trackHover, trackClick, trackFocus, trackSelect, showWizard, maxLogs, autoSave, panelSize, panelPosition, theme, ignoredIssues]);
  const applyAutoFix = (issue) => {
    const { el, type } = issue;
    let fix = {};
    let css = "";
    switch (type) {
      case "overlap":
        const currentZ = window.getComputedStyle(el).zIndex;
        const newZ = (parseInt(currentZ) || 0) + 10;
        el.style.zIndex = newZ;
        el.style.position = "relative";
        fix = { property: "z-index", value: newZ, prev: currentZ };
        css = `z-index: ${newZ}; position: relative;`;
        break;
      case "cutoff":
        el.style.overflow = "visible";
        fix = { property: "overflow", value: "visible", prev: el.style.overflow };
        css = `overflow: visible;`;
        break;
      case "a11y":
        el.style.color = "#000000";
        el.style.backgroundColor = "#ffffff";
        fix = { property: "color/bg", value: "high-contrast", prev: "original" };
        css = `color: #000000; background-color: #ffffff;`;
        break;
      case "broken-image":
        el.style.border = "2px dashed red";
        el.style.minWidth = "50px";
        el.style.minHeight = "50px";
        el.style.backgroundColor = "#ffebeb";
        fix = { property: "border", value: "dashed red", prev: "" };
        css = `border: 2px dashed red; min-width: 50px; min-height: 50px; background-color: #ffebeb;`;
        break;
      default:
        alert("No auto-fix available for this issue type.");
        return;
    }
    const fixRecord = {
      id: Date.now(),
      issue,
      css,
      revert: () => {
        if (type === "overlap") {
          el.style.zIndex = "";
          el.style.position = "";
        }
        if (type === "cutoff") {
          el.style.overflow = "";
        }
        if (type === "a11y") {
          el.style.color = "";
          el.style.backgroundColor = "";
        }
        if (type === "broken-image") {
          el.style.border = "";
          el.style.minWidth = "";
          el.style.minHeight = "";
          el.style.backgroundColor = "";
        }
        setAppliedFixes((prev) => prev.filter((f) => f.id !== fixRecord.id));
      }
    };
    setAppliedFixes((prev) => [...prev, fixRecord]);
  };
  const saveLogsToServer = useCallback(async (silent = false, data) => {
    const dataToUse = data || historyRef.current;
    if (dataToUse.length === 0) return;
    try {
      await fetch("/ui-debugger-pro/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToUse)
      });
      if (!silent) alert("Logs saved to server!");
    } catch (e) {
      console.error("Failed to save logs:", e);
      if (!silent) alert("Failed to save logs to server. Is the Python backend running?");
    }
  }, []);
  useEffect(() => {
    if (!autoSave || isPaused) return;
    const interval = setInterval(() => saveLogsToServer(true), 3e4);
    return () => clearInterval(interval);
  }, [autoSave, isPaused, saveLogsToServer]);
  const runDeepScan = async () => {
    setIsScanning(true);
    setScanResults([]);
    const issues = [];
    const allElements = Array.from(document.querySelectorAll("*")).filter((el) => !el.closest("#ui-debugger-pro-root"));
    const tolerance = Math.round((1 - sensitivity) * 10);
    const visibleElements = allElements.filter((el) => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).visibility !== "hidden";
    });
    const importantElements = visibleElements.filter(
      (el) => ["P", "H1", "H2", "H3", "H4", "H5", "H6", "BUTTON", "A", "INPUT", "SPAN"].includes(el.tagName)
    );
    for (let i = 0; i < importantElements.length; i++) {
      for (let j = i + 1; j < importantElements.length; j++) {
        const el1 = importantElements[i];
        const el2 = importantElements[j];
        if (el1.contains(el2) || el2.contains(el1)) continue;
        const r1 = el1.getBoundingClientRect();
        const r2 = el2.getBoundingClientRect();
        const overlapX = Math.max(0, Math.min(r1.right, r2.right) - Math.max(r1.left, r2.left));
        const overlapY = Math.max(0, Math.min(r1.bottom, r2.bottom) - Math.max(r1.top, r2.top));
        if (overlapX > tolerance && overlapY > tolerance) {
          const z1 = window.getComputedStyle(el1).zIndex;
          const z2 = window.getComputedStyle(el2).zIndex;
          if (z1 === z2 && z1 === "auto") {
            issues.push({ type: "overlap", el: el1, el2, message: `Overlap detected between <${el1.tagName}> and <${el2.tagName}>` });
          }
        }
      }
      if (i % 50 === 0) await new Promise((r) => setTimeout(r, 0));
    }
    visibleElements.forEach((el) => {
      if (el.scrollWidth > el.clientWidth + tolerance || el.scrollHeight > el.clientHeight + tolerance) {
        const style = window.getComputedStyle(el);
        if (style.overflow === "hidden" || style.overflow === "clip") {
          issues.push({ type: "cutoff", el, message: `Content cut off in <${el.tagName}> (Scroll: ${el.scrollWidth}px > Client: ${el.clientWidth}px)` });
        }
      }
    });
    const colors = {};
    visibleElements.forEach((el) => {
      const style = window.getComputedStyle(el);
      const bg = style.backgroundColor;
      const color = style.color;
      if (bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") colors[bg] = (colors[bg] || 0) + 1;
      if (color) colors[color] = (colors[color] || 0) + 1;
    });
    const rareThreshold = Math.max(2, Math.round(sensitivity * 5));
    Object.entries(colors).forEach(([color, count]) => {
      if (count < rareThreshold) {
        const el = visibleElements.find((e) => {
          const s = window.getComputedStyle(e);
          return s.backgroundColor === color || s.color === color;
        });
        if (el) issues.push({ type: "theme", el, message: `Inconsistent color usage: ${color} (used only ${count} times)` });
      }
    });
    visibleElements.forEach((el) => {
      if (el.tagName === "BODY" || el.tagName === "HTML") return;
      const hasVerticalScroll = el.scrollHeight > el.clientHeight;
      const hasHorizontalScroll = el.scrollWidth > el.clientWidth;
      if (hasVerticalScroll || hasHorizontalScroll) {
        const style = window.getComputedStyle(el);
        if (style.overflow === "auto" || style.overflow === "scroll" || style.overflowY === "auto" || style.overflowY === "scroll") {
          issues.push({ type: "scrollbar", el, message: `Scrollbar detected on <${el.tagName}>. Verify if it is styled.` });
        }
      }
    });
    const parents = new Set(visibleElements.map((el) => el.parentElement).filter((p) => p));
    parents.forEach((parent) => {
      const children = Array.from(parent.children).filter((c) => visibleElements.includes(c));
      if (children.length < 2) return;
      const lefts = children.map((c) => c.getBoundingClientRect().left);
      const minLeft = Math.min(...lefts);
      const maxLeft = Math.max(...lefts);
      if (maxLeft - minLeft > 0 && maxLeft - minLeft <= 3) {
        issues.push({ type: "alignment", el: parent, message: `Possible misalignment in children of <${parent.tagName}> (Left diff: ${maxLeft - minLeft}px)` });
      }
      const tops = children.map((c) => c.getBoundingClientRect().top);
      const minTop = Math.min(...tops);
      const maxTop = Math.max(...tops);
      if (maxTop - minTop > 0 && maxTop - minTop <= 3) {
        issues.push({ type: "alignment", el: parent, message: `Possible misalignment in children of <${parent.tagName}> (Top diff: ${maxTop - minTop}px)` });
      }
    });
    visibleElements.forEach((el) => {
      if (el.innerText && el.innerText.trim().length > 0 && el.children.length === 0) {
        const style = window.getComputedStyle(el);
        const color = style.color;
        const bg = style.backgroundColor;
        if (bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
          const parseRgb = (str) => {
            const match = str.match(/\d+/g);
            return match ? match.map(Number) : [0, 0, 0];
          };
          const [r1, g1, b1] = parseRgb(color);
          const [r2, g2, b2] = parseRgb(bg);
          const brightness1 = (r1 * 299 + g1 * 587 + b1 * 114) / 1e3;
          const brightness2 = (r2 * 299 + g2 * 587 + b2 * 114) / 1e3;
          if (Math.abs(brightness1 - brightness2) < 40) {
            issues.push({ type: "a11y", el, message: `Low contrast detected. Text might be hard to read.` });
          }
        }
      }
    });
    const images = Array.from(document.querySelectorAll("img")).filter((img) => !img.closest("#ui-debugger-pro-root"));
    images.forEach((img) => {
      if (img.naturalWidth === 0 && img.src) {
        issues.push({ type: "broken-image", el: img, message: `Broken image detected: ${img.src.substring(0, 50)}...` });
      }
      if (!img.alt) {
        issues.push({ type: "a11y", el: img, message: `Image missing alt text.` });
      }
    });
    const links = Array.from(document.querySelectorAll("a")).filter((a) => !a.closest("#ui-debugger-pro-root"));
    links.forEach((a) => {
      const href = a.getAttribute("href");
      if (!href || href === "#" || href === "") {
        issues.push({ type: "broken-link", el: a, message: `Empty or placeholder link detected.` });
      }
    });
    const filteredIssues = issues.filter((issue) => {
      const sig = `${issue.type}|${issue.el.tagName}|${issue.el.className}`;
      return !ignoredIssues.includes(sig);
    });
    setScanResults(filteredIssues);
    setIsScanning(false);
  };
  const runMonkeyTest = async () => {
    if (!confirm("\u26A0\uFE0F WARNING: This will click random buttons on your page. \n\nEnsure you are in a SAFE environment (e.g., local dev) where data loss or random actions won't cause issues.\n\nContinue?")) return;
    const buttons = Array.from(document.querySelectorAll('button, a, input[type="submit"]')).filter((el) => !el.closest("#ui-debugger-pro-root") && el.offsetParent !== null);
    alert(`Found ${buttons.length} interactive elements. Starting test...`);
    for (const btn of buttons) {
      try {
        btn.style.outline = "2px solid red";
        await new Promise((r) => setTimeout(r, 100));
        const mouseOverEvent = new MouseEvent("mouseover", { bubbles: true, cancelable: true, view: window });
        btn.dispatchEvent(mouseOverEvent);
        await new Promise((r) => setTimeout(r, 100));
        btn.click();
        btn.style.outline = "";
        await new Promise((r) => setTimeout(r, 300));
      } catch (e) {
        console.error("Monkey Test Error:", e);
      }
    }
    alert("Monkey Test Complete!");
  };
  useEffect(() => {
    let interval;
    if (simulatorMode === "auto") {
      const modes = ["mobile", "tablet", "desktop"];
      let i = 0;
      interval = setInterval(() => {
        i = (i + 1) % modes.length;
      }, 2e3);
    }
    return () => clearInterval(interval);
  }, [simulatorMode]);
  const [customSimSize, setCustomSimSize] = useState(null);
  const runExtremeRatioTest = () => {
    setSimulatorMode("custom");
    const ratios = [
      { w: 320, h: 480 },
      { w: 480, h: 320 },
      // Old phones
      { w: 1920, h: 1080 },
      { w: 1080, h: 1920 },
      // HD / Vertical Monitor
      { w: 2560, h: 1440 },
      // 2K
      { w: 3840, h: 2160 },
      // 4K
      { w: 500, h: 2e3 },
      // Tall thin
      { w: 2e3, h: 500 },
      // Wide short
      { w: 300, h: 300 }
      // Small square
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i >= ratios.length) {
        clearInterval(interval);
        setSimulatorMode(null);
        setCustomSimSize(null);
        alert("Extreme Ratio Test Complete");
        return;
      }
      const r = ratios[i];
      setCustomSimSize(r);
      i++;
    }, 1500);
  };
  const resetAll = () => {
    setHistory([]);
    setTargetedRules([]);
    setToggles({ outline: false, shadow: false, ring: false, border: false, selection: false, tap: false, filter: false, backdrop: false, transform: false, background: false });
    setShowWizard(true);
    localStorage.removeItem(STORAGE_KEY);
  };
  const captureElement = (el, type) => {
    if (isPausedRef.current) return;
    if (el.closest("#ui-debugger-pro-root")) return;
    const style = window.getComputedStyle(el);
    if (type === "hover" && style.pointerEvents === "none") return;
    let path = el.tagName.toLowerCase();
    if (el.id) path += `#${el.id}`;
    if (el.className && typeof el.className === "string" && el.className.trim()) {
      const classes = el.className.trim().split(/\s+/).slice(0, 3).join(".");
      path += `.${classes}`;
    }
    const info = {
      tag: el.tagName.toLowerCase(),
      id: el.id,
      className: typeof el.className === "string" ? el.className : "",
      timestamp: Date.now(),
      path,
      eventType: type,
      computed: {
        outline: style.outline,
        boxShadow: style.boxShadow,
        border: style.border,
        backgroundColor: style.backgroundColor,
        backgroundImage: style.backgroundImage,
        filter: style.filter,
        backdropFilter: style.backdropFilter,
        transform: style.transform,
        zIndex: style.zIndex,
        position: style.position,
        opacity: style.opacity,
        display: style.display
      }
    };
    setHistory((prev) => {
      if (prev.length > 0 && prev[0].path === info.path && prev[0].eventType === info.eventType) return prev;
      return [info, ...prev].slice(0, 300);
    });
  };
  const addTargetedRule = (selector, property, value) => {
    setTargetedRules((prev) => {
      if (prev.some((r) => r.selector === selector && r.property === property)) return prev;
      return [...prev, { selector, property, value }];
    });
  };
  const removeTargetedRule = (index) => {
    setTargetedRules((prev) => prev.filter((_, i) => i !== index));
  };
  useEffect(() => {
    const handleMouseOver = (e) => configRef.current.trackHover && captureElement(e.target, "hover");
    const handleClick = (e) => configRef.current.trackClick && captureElement(e.target, "click");
    const handleFocus = (e) => configRef.current.trackFocus && captureElement(e.target, "focus");
    const handleSelection = () => {
      if (!configRef.current.trackSelect) return;
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed && selection.anchorNode) {
        const el = selection.anchorNode.parentElement;
        if (el) captureElement(el, "select");
      }
    };
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("click", handleClick);
    document.addEventListener("focusin", handleFocus);
    document.addEventListener("selectionchange", handleSelection);
    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("click", handleClick);
      document.removeEventListener("focusin", handleFocus);
      document.removeEventListener("selectionchange", handleSelection);
    };
  }, []);
  const suspects = useMemo(() => {
    const counts = {};
    history.forEach((item) => {
      if (!counts[item.path]) counts[item.path] = { count: 0, info: item, types: /* @__PURE__ */ new Set() };
      counts[item.path].count++;
      counts[item.path].types.add(item.eventType);
    });
    return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 15);
  }, [history]);
  const startMove = (e) => {
    if (isExpanded) return;
    e.preventDefault();
    const startX = e.clientX - panelPosition.x;
    const startY = e.clientY - panelPosition.y;
    const handleMouseMove = (moveEvent) => {
      const newX = Math.max(0, Math.min(window.innerWidth - 50, moveEvent.clientX - startX));
      const newY = Math.max(0, Math.min(window.innerHeight - 50, moveEvent.clientY - startY));
      setPanelPosition({ x: newX, y: newY });
    };
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  const startResize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = panelSize.width;
    const startHeight = panelSize.height;
    const handleMouseMove = (moveEvent) => {
      const newWidth = Math.max(400, startWidth + (moveEvent.clientX - startX));
      const newHeight = Math.max(300, startHeight + (moveEvent.clientY - startY));
      setPanelSize({ width: newWidth, height: newHeight });
    };
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  const applyWizard = () => {
    const newToggles = { ...toggles };
    selectedSymptoms.forEach((id) => {
      const symptom = SYMPTOMS.find((s) => s.id === id);
      symptom == null ? void 0 : symptom.recommendedToggles.forEach((t) => {
        newToggles[t] = true;
      });
    });
    setToggles(newToggles);
    setShowWizard(false);
  };
  const currentTheme = THEMES[theme];
  if (headlessMode) {
    return /* @__PURE__ */ React.createElement("div", { className: "fixed bottom-4 right-4 z-[10000]" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setHeadlessMode(false),
        className: "bg-red-600 text-white px-3 py-1 rounded shadow-lg font-mono text-xs hover:bg-red-500"
      },
      "\u{1F534} REC (UI Hidden)"
    ), /* @__PURE__ */ React.createElement("style", null, toggles.outline && `* { outline: none !important; }`), /* @__PURE__ */ React.createElement("style", null, toggles.shadow && `* { box-shadow: none !important; }`), /* @__PURE__ */ React.createElement("style", null, targetedRules.map((r) => `${r.selector} { ${r.property}: ${r.value}; }`).join("\n")));
  }
  if (showWizard) {
    return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-sans" }, /* @__PURE__ */ React.createElement("div", { className: `w-full max-w-lg ${currentTheme.bg} border-2 ${currentTheme.border} rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]` }, /* @__PURE__ */ React.createElement("div", { className: "p-6 border-b border-slate-700" }, /* @__PURE__ */ React.createElement("h2", { className: `text-2xl font-bold ${currentTheme.text} mb-2` }, "\u{1F575}\uFE0F Debugger Pro v7.0"), /* @__PURE__ */ React.createElement("p", { className: "text-slate-400" }, "What kind of visual bug are you hunting?")), /* @__PURE__ */ React.createElement("div", { className: "p-6 overflow-y-auto space-y-3" }, SYMPTOMS.map((s) => /* @__PURE__ */ React.createElement("label", { key: s.id, className: `flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition ${selectedSymptoms.includes(s.id) ? "bg-indigo-500/20 border-indigo-500" : "bg-slate-800 border-slate-700 hover:border-slate-500"}` }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "checkbox",
        className: "mt-1.5 w-5 h-5",
        checked: selectedSymptoms.includes(s.id),
        onChange: (e) => {
          if (e.target.checked) setSelectedSymptoms((prev) => [...prev, s.id]);
          else setSelectedSymptoms((prev) => prev.filter((id) => id !== s.id));
        }
      }
    ), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "font-bold text-white" }, s.label), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-slate-400" }, s.description))))), /* @__PURE__ */ React.createElement("div", { className: "p-6 border-t border-slate-700 flex justify-end gap-3" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setShowWizard(false), className: "px-4 py-2 text-slate-400 hover:text-white" }, "Skip Setup"), /* @__PURE__ */ React.createElement("button", { onClick: applyWizard, className: "px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg" }, "Start Debugging"))));
  }
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      id: "debug-highlighter-panel",
      className: `fixed z-[9999] ${currentTheme.bg}/95 border-2 ${currentTheme.border} ${currentTheme.text} rounded-xl text-xs font-mono shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col transition-all duration-75 ease-out overflow-hidden`,
      style: {
        left: isExpanded ? 0 : panelPosition.x,
        top: isExpanded ? 0 : panelPosition.y,
        width: isExpanded ? "100vw" : panelSize.width,
        height: isExpanded ? "100vh" : panelSize.height
      }
    },
    /* @__PURE__ */ React.createElement("link", { href: "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css", rel: "stylesheet" }),
    !isExpanded && /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50 flex items-center justify-center hover:bg-white/10 rounded-br-xl",
        onMouseDown: startResize
      },
      /* @__PURE__ */ React.createElement("div", { className: "w-1.5 h-1.5 border-b-2 border-r-2 border-indigo-400/50" })
    ),
    /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "flex justify-between items-center p-3 border-b border-slate-700 bg-slate-800/50 rounded-t-xl shrink-0 cursor-move select-none",
        onMouseDown: startMove,
        onDoubleClick: () => setIsExpanded(!isExpanded)
      },
      /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("h3", { className: `font-bold text-${currentTheme.accent}-400 text-sm` }, "UI DEBUGGER PRO"), /* @__PURE__ */ React.createElement("button", { onClick: (e) => {
        e.stopPropagation();
        setShowWizard(true);
      }, className: "text-[10px] bg-slate-700 px-2 py-0.5 rounded hover:bg-slate-600 ml-2" }, "Wizard")),
      /* @__PURE__ */ React.createElement("div", { className: "flex gap-2", onMouseDown: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1 mr-2" }, /* @__PURE__ */ React.createElement("div", { className: `w-2 h-2 rounded-full ${autoSave ? "bg-green-500 animate-pulse" : "bg-slate-600"}`, title: "Auto-save status" }), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-slate-500" }, history.length, " events")), /* @__PURE__ */ React.createElement("button", { onClick: () => saveLogsToServer(false), className: "bg-blue-900/80 px-2 py-1 rounded hover:bg-blue-800 text-[10px] text-blue-200" }, "\u{1F4BE} SAVE"), /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => {
            const url = "https://github.com/leothefleo49/ui-debugger-pro/blob/master/docs/DETAILED_FEATURES.md";
            const win = window.open(url, "_blank");
            if (!win) alert(`Please visit our documentation at:

${url}`);
          },
          className: "bg-slate-700 px-2 py-1 rounded hover:bg-slate-600 text-[10px]",
          title: "Open Documentation"
        },
        "\u2753 HELP"
      ), /* @__PURE__ */ React.createElement("button", { onClick: () => setHeadlessMode(true), className: "bg-slate-700 px-2 py-1 rounded hover:bg-slate-600 text-[10px]" }, "\u{1F441}\uFE0F HIDE UI"), /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => setIsPaused(!isPaused),
          className: `px-2 py-1 rounded text-[10px] font-bold ${isPaused ? "bg-yellow-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`
        },
        isPaused ? "\u25B6 RESUME" : "\u23F8 PAUSE"
      ), /* @__PURE__ */ React.createElement("button", { onClick: resetAll, className: "bg-red-900/80 px-2 py-1 rounded hover:bg-red-800 text-[10px]" }, "RESET"))
    ),
    /* @__PURE__ */ React.createElement("div", { className: "p-3 border-b border-slate-700 bg-slate-900 shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "text-[10px] font-bold text-slate-500 uppercase mb-2 flex justify-between" }, /* @__PURE__ */ React.createElement("span", null, "Global Killers"), /* @__PURE__ */ React.createElement("span", { className: `text-${currentTheme.accent}-400` }, Object.values(toggles).filter(Boolean).length, " Active")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-4 gap-2" }, Object.entries(toggles).map(([key, active]) => /* @__PURE__ */ React.createElement("label", { key, className: `flex items-center gap-2 cursor-pointer p-1.5 rounded select-none border transition ${active ? "bg-red-500/20 border-red-500/50" : "bg-slate-800 border-transparent hover:bg-slate-700"}` }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "checkbox",
        checked: active,
        onChange: (e) => setToggles((prev) => ({ ...prev, [key]: e.target.checked })),
        className: "w-3 h-3"
      }
    ), /* @__PURE__ */ React.createElement("span", { className: `capitalize truncate ${active ? "text-red-200 font-bold" : "text-slate-400"}` }, key))))),
    /* @__PURE__ */ React.createElement("div", { className: "flex border-b border-slate-700 bg-slate-800/30 shrink-0" }, ["live", "suspects", "audit", "rules", "settings"].map((tab) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: tab,
        onClick: () => setActiveTab(tab),
        className: `flex-1 py-2 text-center hover:bg-white/10 transition capitalize ${activeTab === tab ? `text-${currentTheme.accent}-400 border-b-2 border-${currentTheme.accent}-400 font-bold` : "text-slate-500"}`
      },
      tab
    ))),
    /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-y-auto p-2 bg-slate-900/50" }, activeTab === "live" && /* @__PURE__ */ React.createElement("div", { className: "space-y-1" }, history.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "text-center text-slate-600 py-10 italic" }, "Interact with the app to see events..."), history.map((item, i) => /* @__PURE__ */ React.createElement("div", { key: `${item.timestamp}-${i}`, className: "bg-slate-800 p-2 rounded border border-slate-700 hover:border-indigo-500 transition group text-[10px]" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between mb-1" }, /* @__PURE__ */ React.createElement("span", { className: `font-bold uppercase px-1.5 rounded ${item.eventType === "click" ? "bg-green-900 text-green-300" : item.eventType === "hover" ? "bg-indigo-900 text-indigo-300" : item.eventType === "focus" ? "bg-amber-900 text-amber-300" : "bg-blue-900 text-blue-300"}` }, item.eventType), /* @__PURE__ */ React.createElement("span", { className: "text-slate-500" }, new Date(item.timestamp).toLocaleTimeString())), /* @__PURE__ */ React.createElement("div", { className: "font-mono text-slate-300 break-all mb-1" }, item.tag, item.id && /* @__PURE__ */ React.createElement("span", { className: "text-blue-400" }, "#", item.id), item.className && /* @__PURE__ */ React.createElement("span", { className: "text-green-400" }, ".", item.className.split(" ").join("."))), /* @__PURE__ */ React.createElement("div", { className: "flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition" }, /* @__PURE__ */ React.createElement("button", { onClick: () => navigator.clipboard.writeText(item.path), className: "flex-1 bg-slate-700 hover:bg-indigo-600 text-white py-1 rounded" }, "Copy Selector"), /* @__PURE__ */ React.createElement("button", { onClick: () => addTargetedRule(item.path, "background", "transparent !important"), className: "flex-1 bg-slate-700 hover:bg-red-600 text-white py-1 rounded" }, "Kill BG"), /* @__PURE__ */ React.createElement("button", { onClick: () => addTargetedRule(item.path, "outline", "none !important"), className: "flex-1 bg-slate-700 hover:bg-red-600 text-white py-1 rounded" }, "Kill Outline"))))), activeTab === "suspects" && /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-slate-500 uppercase tracking-wider mb-2" }, "Top 15 Most Frequent Elements"), suspects.map((suspect, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "bg-slate-800/50 p-2 rounded border border-amber-500/20 hover:border-amber-500/50 transition" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-start mb-1" }, /* @__PURE__ */ React.createElement("span", { className: "text-amber-400 font-bold" }, "#", i + 1), /* @__PURE__ */ React.createElement("div", { className: "flex gap-1" }, Array.from(suspect.types).map((t) => /* @__PURE__ */ React.createElement("span", { key: t, className: "bg-slate-700 px-1 rounded text-[9px] uppercase" }, t)), /* @__PURE__ */ React.createElement("span", { className: "bg-amber-900/30 text-amber-200 px-1.5 rounded text-[10px] font-bold" }, suspect.count))), /* @__PURE__ */ React.createElement("div", { className: "font-mono text-[10px] break-all text-slate-300 mb-1" }, suspect.info.tag, suspect.info.id && /* @__PURE__ */ React.createElement("span", { className: "text-blue-400" }, "#", suspect.info.id), suspect.info.className && /* @__PURE__ */ React.createElement("span", { className: "text-green-400" }, ".", suspect.info.className.split(" ").join("."))), /* @__PURE__ */ React.createElement("div", { className: "flex gap-1 mt-1" }, /* @__PURE__ */ React.createElement("button", { onClick: () => navigator.clipboard.writeText(suspect.info.path), className: "text-[9px] text-indigo-400 hover:text-indigo-300 underline" }, "Copy Selector"), /* @__PURE__ */ React.createElement("span", { className: "text-slate-600" }, "|"), /* @__PURE__ */ React.createElement("button", { onClick: () => addTargetedRule(suspect.info.path, "background", "transparent !important"), className: "text-[9px] text-red-400 hover:text-red-300 underline" }, "Kill BG"))))), activeTab === "audit" && /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800 p-3 rounded border border-slate-700" }, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-white mb-2" }, "Deep Scan & Automation"), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 mb-2" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: runDeepScan,
        disabled: isScanning,
        className: `flex-1 py-2 rounded font-bold text-white ${isScanning ? "bg-slate-600 cursor-wait" : "bg-indigo-600 hover:bg-indigo-500"}`
      },
      isScanning ? "Scanning..." : "\u{1F50D} Run Deep Scan"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: runMonkeyTest,
        className: "flex-1 py-2 rounded font-bold text-white bg-amber-700 hover:bg-amber-600"
      },
      "\u{1F412} Monkey Test"
    )), /* @__PURE__ */ React.createElement("div", { className: "mt-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between text-[10px] text-slate-400 mb-1" }, /* @__PURE__ */ React.createElement("span", null, "Scan Sensitivity"), /* @__PURE__ */ React.createElement("span", null, Math.round(sensitivity * 100), "%")), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "range",
        min: "0",
        max: "1",
        step: "0.1",
        value: sensitivity,
        onChange: (e) => setSensitivity(parseFloat(e.target.value)),
        className: "w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer"
      }
    ))), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800 p-3 rounded border border-slate-700" }, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-white mb-2" }, "Responsive Simulator"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-2 mb-2" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setSimulatorMode("mobile"), className: "bg-slate-700 hover:bg-slate-600 text-white py-1 rounded text-[10px]" }, "\u{1F4F1} Mobile"), /* @__PURE__ */ React.createElement("button", { onClick: () => setSimulatorMode("tablet"), className: "bg-slate-700 hover:bg-slate-600 text-white py-1 rounded text-[10px]" }, "\u{1F4F2} Tablet"), /* @__PURE__ */ React.createElement("button", { onClick: () => setSimulatorMode("desktop"), className: "bg-slate-700 hover:bg-slate-600 text-white py-1 rounded text-[10px]" }, "\u{1F4BB} Desktop"), /* @__PURE__ */ React.createElement("button", { onClick: () => setSimulatorMode("auto"), className: "bg-purple-700 hover:bg-purple-600 text-white py-1 rounded text-[10px]" }, "\u{1F504} Auto-Cycle"), /* @__PURE__ */ React.createElement("button", { onClick: runExtremeRatioTest, className: "col-span-2 bg-red-900 hover:bg-red-800 text-white py-1 rounded text-[10px] font-bold" }, "\u{1F525} Extreme Ratio Test"))), /* @__PURE__ */ React.createElement("div", { className: "bg-slate-800 p-3 rounded border border-slate-700" }, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-white mb-2" }, "Animation Speed"), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-slate-400" }, "Slow"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "range",
        min: "0.1",
        max: "2",
        step: "0.1",
        value: animationSpeed,
        onChange: (e) => setAnimationSpeed(parseFloat(e.target.value)),
        className: "flex-1 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer"
      }
    ), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-slate-400" }, "Fast (", animationSpeed, "x)"))), scanResults.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center" }, /* @__PURE__ */ React.createElement("h5", { className: "font-bold text-slate-300" }, "Issues Found (", scanResults.length, ")"), /* @__PURE__ */ React.createElement("button", { onClick: () => setScanResults([]), className: "text-[10px] text-slate-500 hover:text-white" }, "Clear")), scanResults.map((issue, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "bg-slate-800/50 p-2 rounded border border-red-500/20 hover:border-red-500/50" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between" }, /* @__PURE__ */ React.createElement("span", { className: "uppercase text-[9px] font-bold text-red-400 bg-red-900/20 px-1 rounded" }, issue.type), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          issue.el.scrollIntoView({ behavior: "smooth", block: "center" });
          issue.el.style.outline = "2px solid red";
          setTimeout(() => issue.el.style.outline = "", 2e3);
        },
        className: "text-[9px] text-indigo-400 hover:underline"
      },
      "Locate"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => applyAutoFix(issue),
        className: "text-[9px] text-green-400 hover:underline font-bold"
      },
      "Auto-Fix"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          const sig = `${issue.type}|${issue.el.tagName}|${issue.el.className}`;
          setIgnoredIssues((prev) => [...prev, sig]);
          setScanResults((prev) => prev.filter((_, idx) => idx !== i));
        },
        className: "text-[9px] text-slate-500 hover:text-slate-300"
      },
      "Ignore"
    ))), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-slate-300 mt-1" }, issue.message)))), appliedFixes.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "mt-4 pt-4 border-t border-slate-700" }, /* @__PURE__ */ React.createElement("h5", { className: "font-bold text-green-400 mb-2" }, "Applied Fixes (Session)"), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, appliedFixes.map((fix) => /* @__PURE__ */ React.createElement("div", { key: fix.id, className: "bg-green-900/20 p-2 rounded border border-green-500/30" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-start" }, /* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-green-200" }, "Fixed ", /* @__PURE__ */ React.createElement("b", null, fix.issue.type), " on ", fix.issue.el.tagName), /* @__PURE__ */ React.createElement("button", { onClick: fix.revert, className: "text-[9px] text-red-300 hover:text-white bg-red-900/50 px-1 rounded" }, "Revert")), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 mt-1" }, /* @__PURE__ */ React.createElement("code", { className: "text-[9px] font-mono bg-black/30 px-1 rounded text-slate-300 flex-1 truncate" }, fix.css), /* @__PURE__ */ React.createElement("button", { onClick: () => navigator.clipboard.writeText(fix.css), className: "text-[9px] text-blue-300 hover:text-white" }, "Copy CSS")))))), ignoredIssues.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "mt-4 pt-4 border-t border-slate-700" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center" }, /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-slate-500" }, "Ignored Issues: ", ignoredIssues.length), /* @__PURE__ */ React.createElement("button", { onClick: () => setIgnoredIssues([]), className: "text-[10px] text-red-400 hover:text-red-300" }, "Reset Ignored")))), simulatorMode && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-[10001] bg-black/90 flex flex-col" }, /* @__PURE__ */ React.createElement("div", { className: "h-10 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-4" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-white" }, "Responsive Simulator: ", simulatorMode === "custom" ? customSimSize ? `${customSimSize.w}x${customSimSize.h}` : "Custom" : simulatorMode), /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setSimulatorMode(null);
      setCustomSimSize(null);
    }, className: "text-slate-400 hover:text-white" }, "\u2715 Close")), /* @__PURE__ */ React.createElement("div", { className: "flex-1 flex items-center justify-center p-4 overflow-hidden" }, /* @__PURE__ */ React.createElement(
      "iframe",
      {
        src: `${window.location.href}${window.location.href.includes("?") ? "&" : "?"}ui_debugger_ignore=true`,
        className: "bg-white transition-all duration-500 shadow-2xl border-4 border-slate-700 rounded-lg",
        style: {
          width: customSimSize ? `${customSimSize.w}px` : simulatorMode === "mobile" ? "375px" : simulatorMode === "tablet" ? "768px" : "100%",
          height: customSimSize ? `${customSimSize.h}px` : simulatorMode === "mobile" ? "667px" : simulatorMode === "tablet" ? "1024px" : "100%",
          transform: `scale(${simScale})`
        }
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "h-12 bg-slate-900 border-t border-slate-700 flex items-center justify-center gap-4" }, /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setSimulatorMode("mobile");
      setCustomSimSize(null);
    }, className: `px-3 py-1 rounded ${simulatorMode === "mobile" ? "bg-indigo-600" : "bg-slate-700"}` }, "Mobile"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setSimulatorMode("tablet");
      setCustomSimSize(null);
    }, className: `px-3 py-1 rounded ${simulatorMode === "tablet" ? "bg-indigo-600" : "bg-slate-700"}` }, "Tablet"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setSimulatorMode("desktop");
      setCustomSimSize(null);
    }, className: `px-3 py-1 rounded ${simulatorMode === "desktop" ? "bg-indigo-600" : "bg-slate-700"}` }, "Desktop"), /* @__PURE__ */ React.createElement("div", { className: "w-px h-6 bg-slate-700 mx-2" }), /* @__PURE__ */ React.createElement("input", { type: "range", min: "0.2", max: "1.5", step: "0.1", value: simScale, onChange: (e) => setSimScale(e.target.value), className: "w-24", title: "Zoom" }))), activeTab === "rules" && /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-slate-500 uppercase tracking-wider mb-2" }, "Active Targeted Rules"), targetedRules.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "text-center text-slate-600 py-8 italic" }, "No targeted rules active."), targetedRules.map((rule, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "bg-slate-800 p-2 rounded border border-red-500/30 flex justify-between items-center" }, /* @__PURE__ */ React.createElement("div", { className: "overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "font-mono text-[10px] text-slate-300 truncate", title: rule.selector }, rule.selector), /* @__PURE__ */ React.createElement("div", { className: "text-[9px] text-red-400 font-bold" }, rule.property, ": ", rule.value)), /* @__PURE__ */ React.createElement("button", { onClick: () => removeTargetedRule(i), className: "text-slate-500 hover:text-white px-2" }, "\u2715")))), activeTab === "settings" && /* @__PURE__ */ React.createElement("div", { className: "space-y-4 p-2" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-slate-400 mb-2" }, "Theme"), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, Object.keys(THEMES).map((t) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: t,
        onClick: () => setTheme(t),
        className: `px-3 py-1 rounded capitalize text-xs ${theme === t ? "bg-indigo-600 text-white" : "bg-slate-700 text-slate-300"}`
      },
      t
    )))), /* @__PURE__ */ React.createElement("div", { className: "pt-4 border-t border-slate-700" }, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-slate-400 mb-2" }, "Event Tracking"), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: trackHover, onChange: (e) => setTrackHover(e.target.checked) }), " Track Hover"), /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: trackClick, onChange: (e) => setTrackClick(e.target.checked) }), " Track Click"), /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: trackFocus, onChange: (e) => setTrackFocus(e.target.checked) }), " Track Focus"), /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: trackSelect, onChange: (e) => setTrackSelect(e.target.checked) }), " Track Selection"))), /* @__PURE__ */ React.createElement("div", { className: "pt-4 border-t border-slate-700" }, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-slate-400 mb-2" }, "Auto-Save Logs"), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: autoSave, onChange: (e) => setAutoSave(e.target.checked) }), "Enable Auto-Save (Every 30s)"), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-1" }, /* @__PURE__ */ React.createElement("label", { className: "text-[10px] text-slate-500" }, "Max Log Files to Keep"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "number",
        value: maxLogs,
        onChange: (e) => setMaxLogs(Number(e.target.value)),
        className: "bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs w-20"
      }
    )))), /* @__PURE__ */ React.createElement("div", { className: "pt-4 border-t border-slate-700" }, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-red-400 mb-2" }, "Danger Zone"), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          if (confirm("Are you sure you want to reset all settings?")) resetAll();
        },
        className: "w-full bg-red-900/50 hover:bg-red-800 text-red-200 py-2 rounded text-xs font-bold border border-red-900"
      },
      "Reset All Settings"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          alert("To uninstall completely, run this command in your terminal:\n\nnpx ui-debugger-pro remove\n\nThis will remove the package and clean up your project files.");
        },
        className: "w-full bg-black hover:bg-slate-900 text-slate-400 py-2 rounded text-xs border border-slate-700"
      },
      "Uninstall / Remove from Project"
    ))))),
    toggles.outline && /* @__PURE__ */ React.createElement("style", null, `* { outline: none !important; }`),
    toggles.shadow && /* @__PURE__ */ React.createElement("style", null, `* { box-shadow: none !important; }`),
    toggles.ring && /* @__PURE__ */ React.createElement("style", null, `* { --tw-ring-color: transparent !important; --tw-ring-offset-width: 0px !important; box-shadow: none !important; }`),
    toggles.border && /* @__PURE__ */ React.createElement("style", null, `* { border-color: transparent !important; }`),
    toggles.selection && /* @__PURE__ */ React.createElement("style", null, `*::selection { background: transparent !important; }`),
    toggles.tap && /* @__PURE__ */ React.createElement("style", null, `* { -webkit-tap-highlight-color: transparent !important; }`),
    toggles.filter && /* @__PURE__ */ React.createElement("style", null, `* { filter: none !important; }`),
    toggles.backdrop && /* @__PURE__ */ React.createElement("style", null, `* { backdrop-filter: none !important; }`),
    toggles.transform && /* @__PURE__ */ React.createElement("style", null, `* { transform: none !important; }`),
    toggles.background && /* @__PURE__ */ React.createElement("style", null, `* { background-color: transparent !important; background: none !important; }`),
    toggles.layout && /* @__PURE__ */ React.createElement("style", null, `* { outline: 1px solid rgba(255, 0, 0, 0.2) !important; }`),
    toggles.images && /* @__PURE__ */ React.createElement("style", null, `img { outline: 5px solid magenta !important; filter: grayscale(100%) !important; }`),
    animationSpeed !== 1 && /* @__PURE__ */ React.createElement("style", null, `* { animation-duration: ${1 / animationSpeed}s !important; transition-duration: ${1 / animationSpeed}s !important; }`),
    /* @__PURE__ */ React.createElement("style", null, targetedRules.map((r) => `${r.selector} { ${r.property}: ${r.value}; }`).join("\n"))
  );
}
if (typeof window !== "undefined") {
  window.UIDebugger = UIDebugger;
  const mount = () => {
    const rootId = "ui-debugger-pro-root";
    if (!document.getElementById(rootId)) {
      const div = document.createElement("div");
      div.id = rootId;
      document.body.appendChild(div);
      const root = createRoot(div);
      root.render();
      console.log("\u{1F680} UI Debugger Pro mounted automatically.");
    }
  };
  window.mountUIDebugger = mount;
  if (window.location.search.includes("ui_debug=true")) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", mount);
    } else {
      mount();
    }
  }
}
export {
  UIDebugger
};
//# sourceMappingURL=index.mjs.map