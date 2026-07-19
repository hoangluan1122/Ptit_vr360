(() => {
  const config = window.PTIT_TOUR_NAV_CONFIG;
  if (!config?.floors?.length) return;

  let activeFloor = config.floors[0].id;
  let currentScene = "";
  let guideIndex = 0;
  let guideOpen = false;
  let speechTimer = 0;

  const launcher = document.createElement("div");
  launcher.className = "tour-nav-launcher";
  launcher.innerHTML = `<button type="button" data-open-map aria-label="Mở sơ đồ tầng"><svg viewBox="0 0 24 24"><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15"/></svg><span>Sơ đồ tầng</span></button><button type="button" data-start-guide aria-label="Bắt đầu tham quan"><svg viewBox="0 0 24 24"><path d="M5 4h14v16H5zM9 9l6 3-6 3z"/></svg><span>Tham quan</span></button>`;

  const mapPanel = document.createElement("aside");
  mapPanel.className = "tour-map-panel";
  mapPanel.setAttribute("aria-label", "Sơ đồ điều hướng");
  mapPanel.innerHTML = `<div class="tour-map-head"><div><strong>${config.title || "Sơ đồ tầng"}</strong><span>Chọn một điểm để di chuyển nhanh</span></div><button class="tour-map-close" type="button" aria-label="Đóng">×</button></div><div class="tour-map-floors"></div><div class="tour-map-canvas"></div><div class="tour-map-legend"><span><i></i>Hành lang</span><span><i class="room"></i>Phòng học</span><span><i class="lab"></i>Phòng lab</span><span><i class="entrance"></i>Lối vào</span></div>`;

  const guide = document.createElement("section");
  guide.className = "guided-tour";
  guide.setAttribute("aria-live", "polite");
  guide.innerHTML = `<article class="guided-card"><div class="guided-top"><span class="guided-progress"></span><button class="guided-skip" type="button">Bỏ qua</button></div><h2></h2><p></p><div class="guided-speaking"><i></i>Đang thuyết minh</div><div class="guided-actions"><button type="button" data-guide-prev>Quay lại</button><button type="button" data-guide-replay>Nghe lại</button><button type="button" data-guide-next>Tiếp theo</button></div></article>`;

  document.body.append(launcher, mapPanel, guide);
  const floorTabs = mapPanel.querySelector(".tour-map-floors");
  const canvas = mapPanel.querySelector(".tour-map-canvas");

  function sceneNode(scene) {
    for (const floor of config.floors) {
      const node = floor.nodes.find((item) => item.scene === scene || item.aliases?.includes(scene));
      if (node) return { floor, node };
    }
    return null;
  }

  function loadScene(scene, lookat) {
    const krpano = window.ptitKrpano;
    if (!krpano) return;
    const h = Number(lookat?.[0] ?? 0), v = Number(lookat?.[1] ?? 0), fov = Number(lookat?.[2] ?? 105);
    if (krpano.get("xml.scene") === scene) krpano.call(`lookto(${h},${v},${fov},smooth(80,-80,100));`);
    else krpano.call(`loadscene(${scene},null,MERGE,BLEND(0.45)); delayedcall(0.7,lookto(${h},${v},${fov},smooth(80,-80,100)));`);
  }

  function renderFloor() {
    floorTabs.innerHTML = config.floors.map((floor) => `<button type="button" class="tour-map-floor${floor.id === activeFloor ? " active" : ""}" data-floor="${floor.id}">${floor.label}</button>`).join("");
    const floor = config.floors.find((item) => item.id === activeFloor) || config.floors[0];
    const nodesById = new Map(floor.nodes.map((node) => [node.id, node]));
    const lines = (floor.edges || []).map(([from, to]) => {
      const a = nodesById.get(from), b = nodesById.get(to);
      return a && b ? `<line x1="${a.x}%" y1="${a.y}%" x2="${b.x}%" y2="${b.y}%"/>` : "";
    }).join("");
    canvas.innerHTML = `<svg class="tour-map-lines">${lines}</svg>${floor.nodes.map((node) => `<button type="button" class="tour-map-node${node.scene === currentScene || node.aliases?.includes(currentScene) ? " active" : ""}" data-scene="${node.scene}" data-type="${node.type}" title="${node.label}" style="left:${node.x}%;top:${node.y}%">${node.short || node.label}</button>`).join("")}`;
  }

  function updateCurrentScene() {
    const scene = window.ptitKrpano?.get("xml.scene") || "";
    if (!scene || scene === currentScene) return;
    currentScene = scene;
    const match = sceneNode(scene);
    if (match && match.floor.id !== activeFloor) activeFloor = match.floor.id;
    renderFloor();
  }

  let guideAudio = null;

  function stopSpeech() {
    clearTimeout(speechTimer);
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    if (guideAudio) {
      guideAudio.pause();
      guideAudio.currentTime = 0;
      guideAudio = null;
    }
    guide.querySelector(".guided-speaking").classList.remove("visible");
    window.dispatchEvent(new CustomEvent("ptit:narrationend"));
  }

  function speakStep(step) {
    stopSpeech();
    window.dispatchEvent(new CustomEvent("ptit:stop-infopost-narration"));
    if (window.ptitAudioAllowed && !window.ptitAudioAllowed()) return;
    if (step.audio) {
      speechTimer = setTimeout(() => {
        guideAudio = new Audio(step.audio);
        guideAudio.preload = "auto";
        guideAudio.onplay = () => { guide.querySelector(".guided-speaking").classList.add("visible"); window.dispatchEvent(new CustomEvent("ptit:narrationstart")); };
        guideAudio.onended = guideAudio.onerror = () => { guide.querySelector(".guided-speaking").classList.remove("visible"); guideAudio = null; window.dispatchEvent(new CustomEvent("ptit:narrationend")); };
        guideAudio.play().catch(() => {
          guideAudio = null;
          if (step.narration) speakText(step.narration);
        });
      }, 850);
      return;
    }
    speakText(step.narration);
  }

  function speakText(narration) {
    if (!("speechSynthesis" in window) || !narration) return;
    speechTimer = setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(narration);
      utterance.lang = "vi-VN";
      utterance.rate = .95;
      utterance.onstart = () => { guide.querySelector(".guided-speaking").classList.add("visible"); window.dispatchEvent(new CustomEvent("ptit:narrationstart")); };
      utterance.onend = utterance.onerror = () => { guide.querySelector(".guided-speaking").classList.remove("visible"); window.dispatchEvent(new CustomEvent("ptit:narrationend")); };
      speechSynthesis.speak(utterance);
    }, 850);
  }

  function renderGuide(navigate = true) {
    const steps = config.guided || [];
    if (!steps.length) return;
    const step = steps[guideIndex];
    guide.querySelector(".guided-progress").textContent = `Điểm ${guideIndex + 1} / ${steps.length}`;
    guide.querySelector("h2").textContent = step.title;
    guide.querySelector("p").textContent = step.description;
    guide.querySelector("[data-guide-prev]").disabled = guideIndex === 0;
    guide.querySelector("[data-guide-next]").textContent = guideIndex === steps.length - 1 ? "Hoàn tất" : "Tiếp theo";
    if (navigate) { loadScene(step.scene, step.lookat); speakStep(step); }
  }

  function startGuide() {
    guideIndex = 0; guideOpen = true; guide.classList.add("open"); mapPanel.classList.remove("open"); renderGuide();
  }

  window.addEventListener("ptit:stop-guided-narration", stopSpeech);
  function closeGuide() { guideOpen = false; guide.classList.remove("open"); stopSpeech(); }

  floorTabs.addEventListener("click", (event) => { const button = event.target.closest("[data-floor]"); if (button) { activeFloor = button.dataset.floor; renderFloor(); } });
  canvas.addEventListener("click", (event) => { const button = event.target.closest("[data-scene]"); if (button) { closeGuide(); loadScene(button.dataset.scene); mapPanel.classList.remove("open"); } });
  launcher.querySelector("[data-open-map]").addEventListener("click", () => { mapPanel.classList.toggle("open"); renderFloor(); });
  launcher.querySelector("[data-start-guide]").addEventListener("click", startGuide);
  mapPanel.querySelector(".tour-map-close").addEventListener("click", () => mapPanel.classList.remove("open"));
  guide.querySelector(".guided-skip").addEventListener("click", closeGuide);
  guide.querySelector("[data-guide-prev]").addEventListener("click", () => { if (guideIndex > 0) { guideIndex -= 1; renderGuide(); } });
  guide.querySelector("[data-guide-replay]").addEventListener("click", () => speakStep(config.guided[guideIndex]));
  guide.querySelector("[data-guide-next]").addEventListener("click", () => { if (guideIndex >= config.guided.length - 1) closeGuide(); else { guideIndex += 1; renderGuide(); } });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") { mapPanel.classList.remove("open"); if (guideOpen) closeGuide(); } });

  renderFloor();
  setInterval(updateCurrentScene, 300);
})();
