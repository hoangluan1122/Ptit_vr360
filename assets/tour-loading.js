(() => {
  const root = document.querySelector("#loading");
  if (!root) return;

  const bar = root.querySelector(".loading-bar");
  const percent = root.querySelector(".loading-percent");
  const title = root.querySelector(".loading-title");
  const defaultTitle = title?.textContent || "Đang tải không gian 360";
  let value = 0;
  let hasCompletedOnce = false;
  let completionTimer = 0;
  let previewTimer = 0;
  let progressTimer = 0;
  let krpanoInstance = null;
  let manifest = null;

  function render(nextValue) {
    value = Math.max(value, Math.min(100, Math.round(nextValue)));
    if (bar) bar.style.width = `${value}%`;
    if (percent) percent.textContent = `${value}%`;
    root.setAttribute("aria-valuenow", String(value));
  }

  function resetProgress() {
    value = 0;
    render(4);
  }

  function sceneStart() {
    clearTimeout(completionTimer);
    clearTimeout(previewTimer);
    clearInterval(progressTimer);
    root.classList.remove("done");
    root.classList.toggle("compact", hasCompletedOnce);
    root.classList.remove("preview-ready");
    if (title) title.textContent = hasCompletedOnce ? "Đang tải scene tiếp theo" : defaultTitle;
    resetProgress();
    progressTimer = setInterval(() => {
      const progress = Number(krpanoInstance?.get("progress.progress"));
      if (Number.isFinite(progress)) render(5 + progress * 94);
    }, 100);
    previewTimer = setTimeout(previewReady, 1200);
    completionTimer = setTimeout(sceneLoaded, 8000);
  }

  function previewReady() {
    clearTimeout(previewTimer);
    root.classList.add("preview-ready");
    render(30);
  }

  function sceneLoaded() {
    clearTimeout(completionTimer);
    clearTimeout(previewTimer);
    clearInterval(progressTimer);
    root.classList.add("preview-ready");
    render(100);
    setTimeout(() => {
      root.classList.add("done");
      hasCompletedOnce = true;
      if ("requestIdleCallback" in window) requestIdleCallback(preloadNextScene, { timeout: 1500 });
      else setTimeout(preloadNextScene, 500);
    }, 280);
  }

  function resolveTemplate(template, face, level, vertical, horizontal) {
    return template
      .replaceAll("%s", face)
      .replaceAll("%l", String(level))
      .replaceAll("%v", String(vertical))
      .replaceAll("%h", String(horizontal));
  }

  function faceFromHeading(heading) {
    const angle = ((Number(heading) % 360) + 360) % 360;
    if (angle < 45 || angle >= 315) return "f";
    if (angle < 135) return "r";
    if (angle < 225) return "b";
    return "l";
  }

  function prefetchImage(url) {
    if (!url) return;
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "image";
    link.href = url;
    document.head.appendChild(link);
  }

  function preloadNextScene() {
    const krpano = window.ptitKrpano;
    const currentName = krpano?.get("xml.scene");
    if (!manifest || !currentName) return;
    const current = manifest.find((item) => item.name === currentName);
    if (!current) return;

    const currentIndex = manifest.indexOf(current);
    const linkedCandidates = current.links
      .map((name) => ({ name, index: manifest.findIndex((item) => item.name === name) }))
      .filter((item) => item.index >= 0);
    const linked = linkedCandidates
      .filter((item) => item.index > currentIndex)
      .sort((a, b) => a.index - b.index)[0]?.name || linkedCandidates[0]?.name;
    const next = manifest.find((item) => item.name === linked) || manifest[(currentIndex + 1) % manifest.length];
    if (!next || next.name === currentName) return;

    prefetchImage(next.preview);
    const heading = current.lookats.get(next.name) || 0;
    const face = faceFromHeading(heading);
    for (let vertical = 1; vertical <= 2; vertical += 1) {
      for (let horizontal = 1; horizontal <= 2; horizontal += 1) {
        prefetchImage(resolveTemplate(next.cube, face, 1, vertical, horizontal));
      }
    }
  }

  async function loadManifest() {
    try {
      const response = await fetch("tour.xml", { cache: "force-cache" });
      const xml = new DOMParser().parseFromString(await response.text(), "application/xml");
      manifest = [...xml.querySelectorAll("scene")].map((scene) => {
        const links = [...scene.querySelectorAll("hotspot[linkedscene]")];
        return {
          name: scene.getAttribute("name"),
          preview: scene.querySelector("preview")?.getAttribute("url") || "",
          cube: scene.querySelector("cube")?.getAttribute("url") || "",
          links: links.map((hotspot) => hotspot.getAttribute("linkedscene")),
          lookats: new Map(links.map((hotspot) => [hotspot.getAttribute("linkedscene"), Number((hotspot.getAttribute("linkedscene_lookat") || "0").split(",")[0])]))
        };
      });
      render(18);
    } catch (_) {
      manifest = [];
    }
  }

  window.ptitTourSceneStart = sceneStart;
  window.ptitTourPreviewReady = previewReady;
  window.ptitTourSceneLoaded = sceneLoaded;
  window.ptitAttachTourLoader = (krpano) => {
    krpanoInstance = krpano;
    window.ptitKrpano = krpano;
    krpano.set("events[ptit_loader].keep", true);
    krpano.set("events[ptit_loader].onnewscene", "js(ptitTourSceneStart());");
    krpano.set("events[ptit_loader].onpreviewcomplete", "js(ptitTourPreviewReady());");
    krpano.set("events[ptit_loader].onloadcomplete", "js(ptitTourSceneLoaded());");
    sceneStart();
  };

  resetProgress();
  loadManifest();
})();
