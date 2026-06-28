const sceneGroups = [
  {
    title: "Lab CTS",
    scenes: [
      "scene_cts_(2)",
      "scene_cts_(3)",
      "scene_cts_(4)",
      "scene_cts_(5)",
      "scene_cts_(6)",
      "scene_cts_(7)",
      "scene_cts_(8)",
    ],
  },
  {
    title: "Lab Game",
    scenes: [
      "scene_game_(1)",
      "scene_game_(2)",
      "scene_game_(3)",
      "scene_game_(4)",
      "scene_game_(5)",
      "scene_game_(6)",
    ],
  },
  {
    title: "Lab Naver",
    scenes: [
      "scene_naver_(2)",
      "scene_naver_(3)",
      "scene_naver_(4)",
      "scene_naver_(5)",
      "scene_naver_(6)",
      "scene_naver_(7)",
      "scene_naver_(8)",
      "scene_naver_(8_1)",
      "scene_naver_(9)",
      "scene_naver_(10)",
      "scene_naver_(11)",
      "scene_naver_(13)",
      "scene_naver_(14)",
    ],
  },
  {
    title: "Lab Samsung / SSL",
    scenes: [
      "scene_ssl_(1)",
      "scene_ssl_(2)",
      "scene_ssl_(3)",
      "scene_ssl_(4)",
      "scene_ssl_(5)",
    ],
  },
];

const sceneData = {
  "scene_cts_(2)": { title: "CTS (2)", thumb: "panos/CTS_(2).tiles/thumb.jpg", description: "Canh 360 CTS (2)." },
  "scene_cts_(3)": { title: "CTS (3)", thumb: "panos/CTS_(3).tiles/thumb.jpg", description: "Canh 360 CTS (3)." },
  "scene_cts_(4)": { title: "CTS (4)", thumb: "panos/CTS_(4).tiles/thumb.jpg", description: "Canh 360 CTS (4)." },
  "scene_cts_(5)": { title: "CTS (5)", thumb: "panos/CTS_(5).tiles/thumb.jpg", description: "Canh 360 CTS (5)." },
  "scene_cts_(6)": { title: "CTS (6)", thumb: "panos/CTS_(6).tiles/thumb.jpg", description: "Canh 360 CTS (6)." },
  "scene_cts_(7)": { title: "CTS (7)", thumb: "panos/CTS_(7).tiles/thumb.jpg", description: "Canh 360 CTS (7)." },
  "scene_cts_(8)": { title: "CTS (8)", thumb: "panos/CTS_(8).tiles/thumb.jpg", description: "Canh 360 CTS (8)." },

  "scene_game_(1)": { title: "Game (1)", thumb: "panos/Game_(1).tiles/thumb.jpg", description: "Canh 360 Game (1)." },
  "scene_game_(2)": { title: "Game (2)", thumb: "panos/Game_(2).tiles/thumb.jpg", description: "Canh 360 Game (2)." },
  "scene_game_(3)": { title: "Game (3)", thumb: "panos/Game_(3).tiles/thumb.jpg", description: "Canh 360 Game (3)." },
  "scene_game_(4)": { title: "Game (4)", thumb: "panos/Game_(4).tiles/thumb.jpg", description: "Canh 360 Game (4)." },
  "scene_game_(5)": { title: "Game (5)", thumb: "panos/Game_(5).tiles/thumb.jpg", description: "Canh 360 Game (5)." },
  "scene_game_(6)": { title: "Game (6)", thumb: "panos/Game_(6).tiles/thumb.jpg", description: "Canh 360 Game (6)." },

  "scene_naver_(2)": { title: "Naver (2)", thumb: "panos/Naver_(2).tiles/thumb.jpg", description: "Canh 360 Naver (2)." },
  "scene_naver_(3)": { title: "Naver (3)", thumb: "panos/Naver_(3).tiles/thumb.jpg", description: "Canh 360 Naver (3)." },
  "scene_naver_(4)": { title: "Naver (4)", thumb: "panos/Naver_(4).tiles/thumb.jpg", description: "Canh 360 Naver (4)." },
  "scene_naver_(5)": { title: "Naver (5)", thumb: "panos/Naver_(5).tiles/thumb.jpg", description: "Canh 360 Naver (5)." },
  "scene_naver_(6)": { title: "Naver (6)", thumb: "panos/Naver_(6).tiles/thumb.jpg", description: "Canh 360 Naver (6)." },
  "scene_naver_(7)": { title: "Naver (7)", thumb: "panos/Naver_(7).tiles/thumb.jpg", description: "Canh 360 Naver (7)." },
  "scene_naver_(8)": { title: "Naver (8)", thumb: "panos/Naver_(8).tiles/thumb.jpg", description: "Canh 360 Naver (8)." },
  "scene_naver_(8_1)": { title: "Naver (8.1)", thumb: "panos/Naver_(8_1).tiles/thumb.jpg", description: "Canh 360 Naver (8.1)." },
  "scene_naver_(9)": { title: "Naver (9)", thumb: "panos/Naver_(9).tiles/thumb.jpg", description: "Canh 360 Naver (9)." },
  "scene_naver_(10)": { title: "Naver (10)", thumb: "panos/Naver_(10).tiles/thumb.jpg", description: "Canh 360 Naver (10)." },
  "scene_naver_(11)": { title: "Naver (11)", thumb: "panos/Naver_(11).tiles/thumb.jpg", description: "Canh 360 Naver (11)." },
  "scene_naver_(13)": { title: "Naver (13)", thumb: "panos/Naver_(13).tiles/thumb.jpg", description: "Canh 360 Naver (13)." },
  "scene_naver_(14)": { title: "Naver (14)", thumb: "panos/Naver_(14).tiles/thumb.jpg", description: "Canh 360 Naver (14)." },

  "scene_ssl_(1)": { title: "SSL (1)", thumb: "panos/SSL_(1).tiles/thumb.jpg", description: "Canh 360 SSL (1)." },
  "scene_ssl_(2)": { title: "SSL (2)", thumb: "panos/SSL_(2).tiles/thumb.jpg", description: "Canh 360 SSL (2)." },
  "scene_ssl_(3)": { title: "SSL (3)", thumb: "panos/SSL_(3).tiles/thumb.jpg", description: "Canh 360 SSL (3)." },
  "scene_ssl_(4)": { title: "SSL (4)", thumb: "panos/SSL_(4).tiles/thumb.jpg", description: "Canh 360 SSL (4)." },
  "scene_ssl_(5)": { title: "SSL (5)", thumb: "panos/SSL_(5).tiles/thumb.jpg", description: "Canh 360 SSL (5)." },
};

const state = {
  krpano: null,
};

const sceneList = document.querySelector("#sceneList");
const modal = document.querySelector("#infoModal");
const modalType = document.querySelector("#modalType");
const modalTitle = document.querySelector("#modalTitle");
const modalDescription = document.querySelector("#modalDescription");
const modalImage = document.querySelector("#modalImage");
const menuToggle = document.querySelector("#menuToggle");

function setSidebarVisible(visible) {
  document.body.classList.toggle("menu-hidden", !visible);
  if (menuToggle) {
    menuToggle.setAttribute("aria-expanded", String(visible));
    menuToggle.title = visible ? "An danh muc" : "Hien danh muc";
  }
}

function renderSceneList() {
  sceneList.innerHTML = sceneGroups
    .map((group) => {
      const firstSceneName = group.scenes[0];
      const firstScene = sceneData[firstSceneName];
      const imageStyle = firstScene?.thumb ? ` style="background-image:url('${firstScene.thumb}')"` : "";

      return `
        <button class="room-button" type="button" data-scene="${firstSceneName}">
          <span class="room-thumb"${imageStyle}></span>
          <span class="room-text">
            <strong>${group.title}</strong>
            <span>${group.scenes.length} diem xem</span>
          </span>
        </button>
      `;
    })
    .join("");
}

function bindEvents() {
  menuToggle.addEventListener("click", () => {
    setSidebarVisible(document.body.classList.contains("menu-hidden"));
  });

  document.querySelector("#helpButton").addEventListener("click", () => {
    openInfo({
      type: "Huong dan",
      title: "PTIT VR360",
      description: "Chon scene ben trai de nhay toi canh 360. Zip hien co CTS, Game, Naver va SSL.",
      image: "",
    });
  });

  document.querySelector("#modalClose").addEventListener("click", () => modal.close());

  sceneList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-scene]");
    if (!button) return;
    loadScene(button.dataset.scene);
    setSidebarVisible(false);
  });
}

function initKrpano() {
  if (typeof embedpano !== "function") return;

  embedpano({
    xml: "tour.xml?v=game-links-1",
    target: "pano",
    html5: "auto",
    mobilescale: 1.0,
    passQueryParameters: true,
    onready: (krpanoInterface) => {
      state.krpano = krpanoInterface;
      document.querySelector("#fallback").style.display = "none";
    },
  });
}

function loadScene(sceneName) {
  const scene = sceneData[sceneName];
  if (!scene) return;

  if (state.krpano) {
    state.krpano.call(`loadscene(${sceneName}, null, MERGE, BLEND(0.5));`);
    return;
  }

  openInfo({
    type: "Dang xem",
    title: scene.title,
    description: scene.description,
    image: scene.thumb,
  });
}

function openInfo(data) {
  modalType.textContent = data.type || "Thong tin";
  modalTitle.textContent = data.title || "";
  modalDescription.textContent = data.description || "";
  modalImage.style.backgroundImage = data.image ? `url("${data.image}")` : "";

  if (typeof modal.showModal === "function") modal.showModal();
  else modal.setAttribute("open", "");
}

window.openHotspotInfo = function openHotspotInfo(sceneName, hotspotName) {
  const scene = sceneData[sceneName];
  openInfo({
    type: "Thong tin",
    title: scene?.title || hotspotName,
    description: scene?.description || "Thong tin hotspot.",
    image: scene?.thumb || "",
  });
};

renderSceneList();
bindEvents();
initKrpano();
