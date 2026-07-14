(() => {
  const toolbar = document.querySelector(".tour-tools");
  if (!toolbar) return;

  function getViewer() { return window.ptitKrpano || null; }
  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

  toolbar.addEventListener("click", (event) => {
    const button = event.target.closest("[data-tour-action]");
    if (!button) return;
    const action = button.dataset.tourAction;
    const viewer = getViewer();

    if (action === "fullscreen") {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
      else document.exitFullscreen?.();
      return;
    }
    if (!viewer) return;

    const h = Number(viewer.get("view.hlookat") || 0);
    const v = Number(viewer.get("view.vlookat") || 0);
    const fov = Number(viewer.get("view.fov") || 100);
    if (action === "left") viewer.set("view.hlookat", h - 14);
    if (action === "right") viewer.set("view.hlookat", h + 14);
    if (action === "up") viewer.set("view.vlookat", clamp(v - 9, -80, 80));
    if (action === "down") viewer.set("view.vlookat", clamp(v + 9, -80, 80));
    if (action === "zoom-in") viewer.set("view.fov", clamp(fov - 10, 55, 140));
    if (action === "zoom-out") viewer.set("view.fov", clamp(fov + 10, 55, 140));
    if (action === "vr") viewer.call("webvr.enterVR();");
  });
})();
