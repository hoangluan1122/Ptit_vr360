(() => {
  const script = document.currentScript;
  const musicUrl = new URL("background.mp3", script.src).href;
  const storageKey = "ptit-vtour-music-muted";
  const consentKey = "ptit-vtour-audio-consent";
  const playbackKey = "ptit-vtour-music-playback";
  const audio = new Audio(musicUrl);
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = 0.22;

  const savedConsent = localStorage.getItem(consentKey);
  let muted = savedConsent ? savedConsent !== "enabled" : true;
  audio.muted = muted;
  window.ptitAudioAllowed = () => localStorage.getItem(consentKey) === "enabled";

  function readPlayback() {
    try {
      const value = JSON.parse(sessionStorage.getItem(playbackKey));
      return value && Number.isFinite(value.time) && Number.isFinite(value.savedAt) ? value : null;
    } catch (_) {
      return null;
    }
  }

  function savePlayback() {
    if (!Number.isFinite(audio.currentTime)) return;
    sessionStorage.setItem(playbackKey, JSON.stringify({ time: audio.currentTime, savedAt: Date.now() }));
  }

  function restorePlayback() {
    const saved = readPlayback();
    if (!saved || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    const elapsed = muted ? 0 : Math.max(0, (Date.now() - saved.savedAt) / 1000);
    audio.currentTime = (saved.time + elapsed) % audio.duration;
  }

  const style = document.createElement("style");
  style.textContent = `
    .music-toggle {
      position: fixed;
      z-index: 1000;
      right: 18px;
      top: 96px;
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      padding: 0;
      border: 1px solid rgba(255,255,255,.2);
      border-radius: 13px;
      background: rgba(17,18,22,.72);
      color: #fff;
      box-shadow: 0 10px 30px rgba(0,0,0,.22);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      cursor: pointer;
      transition: right 180ms ease, background 160ms ease, transform 160ms ease, opacity 160ms ease;
    }
    .music-toggle:hover { background: rgba(34,37,44,.9); }
    .music-toggle:active { transform: scale(.92); }
    .music-toggle:focus-visible { outline: 2px solid #ff6a71; outline-offset: 3px; }
    .music-toggle svg { width: 19px; height: 19px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
    .music-toggle .sound-off { display: none; }
    .music-toggle.is-muted { opacity: .68; }
    .music-toggle.is-muted .sound-on { display: none; }
    .music-toggle.is-muted .sound-off { display: block; }
    body:has(.place-directory.open) .music-toggle { right: 380px; }
    .audio-consent {
      position: fixed;
      z-index: 10000;
      inset: 0;
      display: grid;
      place-items: center;
      padding: 20px;
      background: rgba(8,10,14,.64);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }
    .audio-consent-card {
      width: min(430px, calc(100vw - 40px));
      padding: 28px;
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 24px;
      background: rgba(24,26,31,.96);
      color: #fff;
      box-shadow: 0 28px 80px rgba(0,0,0,.42);
      text-align: center;
    }
    .audio-consent-icon { display:grid; place-items:center; width:58px; height:58px; margin:0 auto 18px; border-radius:18px; background:#d71920; }
    .audio-consent-icon svg { width:26px; height:26px; fill:none; stroke:currentColor; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; }
    .audio-consent-card h2 { margin:0 0 8px; font:700 24px/1.2 system-ui,sans-serif; }
    .audio-consent-card p { margin:0 auto 22px; max-width:330px; color:#b8bec8; font:400 14px/1.55 system-ui,sans-serif; }
    .audio-consent-actions { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
    .audio-consent-actions button { min-height:48px; padding:0 14px; border:0; border-radius:13px; font:700 13px/1.2 system-ui,sans-serif; cursor:pointer; }
    .audio-consent-enable { background:#d71920; color:#fff; }
    .audio-consent-silent { background:#34373e; color:#f4f5f7; }
    .audio-consent-actions button:hover { filter:brightness(1.08); }
    .audio-consent-actions button:focus-visible { outline:2px solid #ff7379; outline-offset:3px; }
    @media (max-width: 620px) {
      .music-toggle { top: 78px; right: 10px; width: 42px; height: 42px; }
      body:has(.place-directory.open) .music-toggle { opacity: 0; visibility: hidden; pointer-events: none; }
      .audio-consent-card { padding:24px 18px; border-radius:20px; }
      .audio-consent-actions { grid-template-columns:1fr; }
    }
  `;
  document.head.appendChild(style);

  const button = document.createElement("button");
  button.className = "music-toggle";
  button.type = "button";
  button.innerHTML = `
    <svg class="sound-on" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v6h4l5 4V5L9 9H5Z"/><path d="M17 9.5a4 4 0 0 1 0 5"/><path d="M19.5 7a7.5 7.5 0 0 1 0 10"/></svg>
    <svg class="sound-off" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v6h4l5 4V5L9 9H5Z"/><path d="m17 10 5 5m0-5-5 5"/></svg>
  `;
  document.body.appendChild(button);

  function saveConsent(enabled) {
    muted = !enabled;
    audio.muted = muted;
    localStorage.setItem(consentKey, enabled ? "enabled" : "muted");
    localStorage.setItem(storageKey, String(muted));
    updateButton();
    if (!enabled) {
      window.dispatchEvent(new CustomEvent("ptit:stop-guided-narration"));
      window.dispatchEvent(new CustomEvent("ptit:stop-infopost-narration"));
    }
  }

  function showConsent() {
    if (savedConsent) return;
    const consent = document.createElement("div");
    consent.className = "audio-consent";
    consent.setAttribute("role", "dialog");
    consent.setAttribute("aria-modal", "true");
    consent.setAttribute("aria-labelledby", "audioConsentTitle");
    consent.innerHTML = `
      <section class="audio-consent-card">
        <div class="audio-consent-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v6h4l5 4V5L9 9H5Z"/><path d="M17 9.5a4 4 0 0 1 0 5"/><path d="M19.5 7a7.5 7.5 0 0 1 0 10"/></svg></div>
        <h2 id="audioConsentTitle">Bạn có muốn bật âm thanh?</h2>
        <p>Âm thanh bao gồm nhạc nền và nội dung thuyết minh trong suốt chuyến tham quan.</p>
        <div class="audio-consent-actions">
          <button class="audio-consent-enable" type="button">Bật âm thanh</button>
          <button class="audio-consent-silent" type="button">Tham quan không âm thanh</button>
        </div>
      </section>`;
    document.body.appendChild(consent);
    consent.querySelector(".audio-consent-enable").addEventListener("click", async () => {
      saveConsent(true);
      consent.remove();
      await startMusic();
    });
    consent.querySelector(".audio-consent-silent").addEventListener("click", () => {
      saveConsent(false);
      consent.remove();
    });
  }

  function updateButton() {
    button.classList.toggle("is-muted", muted);
    button.setAttribute("aria-label", muted ? "Bật nhạc nền" : "Tắt nhạc nền");
    button.title = muted ? "Bật nhạc nền" : "Tắt nhạc nền";
  }

  async function startMusic() {
    if (muted || !audio.paused) return;
    try { await audio.play(); } catch (_) { /* Browser will allow it after a user gesture. */ }
  }

  audio.addEventListener("loadedmetadata", async () => {
    restorePlayback();
    await startMusic();
  }, { once: true });

  button.addEventListener("click", async () => {
    saveConsent(muted);
    if (!muted) await startMusic();
  });

  window.addEventListener("ptit:narrationstart", () => {
    if (!muted) audio.volume = 0.055;
  });
  window.addEventListener("ptit:narrationend", () => {
    audio.volume = 0.22;
  });

  document.addEventListener("pointerdown", startMusic, { once: true, passive: true });
  document.addEventListener("keydown", startMusic, { once: true });
  window.addEventListener("pagehide", savePlayback);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") savePlayback();
  });
  setInterval(savePlayback, 750);
  updateButton();
  showConsent();
  startMusic();
})();
