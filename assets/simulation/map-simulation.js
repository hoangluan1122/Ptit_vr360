(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const routes = [
    [
      { x: 39.5, y: 69.5 }, { x: 46.0, y: 63.5 }, { x: 55.5, y: 64.0 },
      { x: 62.0, y: 56.0 }, { x: 67.0, y: 46.5 }, { x: 61.0, y: 41.0 },
      { x: 53.5, y: 43.0 }, { x: 46.5, y: 49.0 }, { x: 40.5, y: 57.0 }
    ],
    [
      { x: 43.0, y: 66.0 }, { x: 48.5, y: 60.5 }, { x: 57.0, y: 60.0 },
      { x: 63.5, y: 52.5 }, { x: 60.0, y: 46.0 }, { x: 53.0, y: 47.0 },
      { x: 46.0, y: 53.0 }, { x: 40.5, y: 59.0 }
    ],
    [
      { x: 34.0, y: 48.0 }, { x: 40.0, y: 43.0 }, { x: 47.0, y: 41.5 },
      { x: 54.0, y: 44.5 }, { x: 50.0, y: 50.0 }, { x: 42.0, y: 51.5 }
    ],
    [
      { x: 35.5, y: 64.0 }, { x: 43.0, y: 59.0 }, { x: 51.0, y: 57.5 },
      { x: 58.0, y: 62.0 }, { x: 52.0, y: 68.0 }, { x: 43.0, y: 69.5 }
    ],
    [
      { x: 47.0, y: 35.5 }, { x: 54.0, y: 31.5 }, { x: 62.0, y: 34.5 },
      { x: 66.0, y: 40.5 }, { x: 59.0, y: 44.0 }, { x: 51.0, y: 41.5 }
    ]
  ];

  function createActor(element, index) {
    const sprite = element.querySelector(".npc-sprite");
    const id = element.dataset.npc;
    const route = routes[index % routes.length];
    const speedFactor = Number(element.dataset.speed || 1);
    const initialSegment = Number(element.dataset.segment || 0) % route.length;
    const available = new Set((element.dataset.directions || "left,down,downleft,up,upleft").split(","));
    return {
      element, sprite, id, route, available,
      segment: initialSegment,
      progress: Number(element.dataset.progress || 0),
      speed: (reducedMotion ? 1.15 : 2.15) * speedFactor,
      frame: index % 8,
      frameClock: index * 23,
      currentAsset: ""
    };
  }

  const actors = [...document.querySelectorAll(".campus-npc[data-npc]")].map(createActor);
  if (!actors.length) return;

  function setDirection(actor, dx, dy) {
    let asset;
    let mirrored = false;
    if (Math.abs(dx) > Math.abs(dy) * 1.65) {
      asset = "left";
      mirrored = dx > 0;
    } else if (dy > 0 && Math.abs(dx) < Math.abs(dy) * .5) {
      asset = "down";
    } else if (dy < 0 && Math.abs(dx) < Math.abs(dy) * .5) {
      asset = "up";
    } else if (dy > 0) {
      asset = "downleft";
      mirrored = dx > 0;
    } else {
      asset = "upleft";
      mirrored = dx > 0;
    }

    if (!actor.available.has(asset)) asset = dy < 0 ? "up" : (Math.abs(dx) > Math.abs(dy) ? "left" : "down");
    if (asset !== actor.currentAsset) {
      actor.currentAsset = asset;
      actor.sprite.style.backgroundImage = `url("assets/simulation/${actor.id}/${asset}.png")`;
    }
    actor.sprite.classList.toggle("mirrored", mirrored);
  }

  function updateActor(actor, delta) {
    const start = actor.route[actor.segment];
    const end = actor.route[(actor.segment + 1) % actor.route.length];
    const distance = Math.hypot(end.x - start.x, end.y - start.y);
    actor.progress += (actor.speed * delta / 1000) / distance;
    if (actor.progress >= 1) {
      actor.progress -= 1;
      actor.segment = (actor.segment + 1) % actor.route.length;
    }

    const activeStart = actor.route[actor.segment];
    const activeEnd = actor.route[(actor.segment + 1) % actor.route.length];
    const x = activeStart.x + (activeEnd.x - activeStart.x) * actor.progress;
    const y = activeStart.y + (activeEnd.y - activeStart.y) * actor.progress;
    const perspectiveScale = .34 + Math.max(0, Math.min(1, (y - 30) / 44)) * .14;

    actor.element.style.left = `${x}%`;
    actor.element.style.top = `${y}%`;
    actor.element.style.setProperty("--npc-scale", perspectiveScale.toFixed(3));
    actor.element.style.zIndex = String(Math.round(5 + y / 12));
    setDirection(actor, activeEnd.x - activeStart.x, activeEnd.y - activeStart.y);

    actor.frameClock += delta;
    const frameDuration = reducedMotion ? 210 : 115;
    if (actor.frameClock >= frameDuration) {
      actor.frameClock %= frameDuration;
      actor.frame = (actor.frame + 1) % 8;
      actor.sprite.style.backgroundPosition = `${-actor.frame * 96}px -96px`;
    }
  }

  let lastTime = performance.now();
  function animate(now) {
    const delta = Math.min(40, now - lastTime);
    lastTime = now;
    actors.forEach(actor => updateActor(actor, delta));
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();
