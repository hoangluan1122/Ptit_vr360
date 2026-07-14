(() => {
  const script = document.currentScript;
  const musicUrl = new URL("background.mp3", script.src).href;
  const storageKey = "ptit-vtour-music-muted";
  const playbackKey = "ptit-vtour-music-playback";
  const audio = new Audio(musicUrl);
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = 0.22;

  let muted = localStorage.getItem(storageKey) === "true";
  audio.muted = muted;

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
      transition: background 160ms ease, transform 160ms ease, opacity 160ms ease;
    }
    .music-toggle:hover { background: rgba(34,37,44,.9); }
    .music-toggle:active { transform: scale(.92); }
    .music-toggle:focus-visible { outline: 2px solid #ff6a71; outline-offset: 3px; }
    .music-toggle svg { width: 19px; height: 19px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
    .music-toggle .sound-off { display: none; }
    .music-toggle.is-muted { opacity: .68; }
    .music-toggle.is-muted .sound-on { display: none; }
    .music-toggle.is-muted .sound-off { display: block; }
    @media (max-width: 620px) { .music-toggle { top: 78px; right: 10px; width: 42px; height: 42px; } }
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
    muted = !muted;
    audio.muted = muted;
    localStorage.setItem(storageKey, String(muted));
    updateButton();
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
  startMusic();
})();
