"use strict";
const ARRAY_TOOLS = ["axe", "pickaxe", "shovel"];
// materials and their tool positions
const ARRAY_MATERIAL = [
  ["sky", -1],
  ["tree", 0],
  ["leaves", 0],
  ["rock", 1],
  ["ground", 2],
  ["grass", 2],
  ["cloud", -1],
];

const arrOfMaterials = ARRAY_MATERIAL.flat(Infinity).filter(
  (material) => typeof material === "string"
);

const gameBoardElement = document.querySelector(".gameBoard");
const toolBoxElement = document.querySelector(".toolBox");
const materialBoxElement = document.querySelector(".materialBar");
const lastClickedMaterialElement = document.querySelector(
  "#lastClickedMaterial"
);
const chestElement = document.querySelector("#chest");

const mainInfo = {
  isStartGame: false,
  gameBoardMatrix: [
    //19*19
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 6, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 6, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 6, 6, 6, 6, 6, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 2, 2, 0, 0, 3, 3, 3, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 2, 2, 0, 0, 3, 3, 3, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    [4, 4, 4, 3, 3, 4, 4, 4, 3, 4, 4, 4, 4, 3, 4, 4, 4, 4, 4, 3, 4],
    [4, 4, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 4, 4, 4, 4],
  ],
  selectedTool: -1, // axe = 0 // pickaxe =1 // shovel = 2
  selectedMaterial: -1, // 1 = wood // 2 = levees // 3 = metal // 4 = dirt // 6 = clouds
  lastClickedMaterial: -1, // 1 = wood // 2 = levees // 3 = metal // 4 = dirt // 6 = clouds
  lastPickedMaterial: -1, // 1 = wood // 2 = levees // 3 = metal // 4 = dirt // 6 = clouds
};

const gameInit = () => {
  printGameBoard();
  ARRAY_TOOLS.forEach((tool) => {
    createToolsBar(tool);
  });
  const filteredMaterials = ARRAY_MATERIAL.filter(
    (material) => material[1] !== -1
  );
  filteredMaterials.forEach((material) => {
    createMaterialsBar(material[0], ARRAY_MATERIAL.indexOf(material));
  });
  chestElement.addEventListener("click", openOrCloseChestListener);
};

const createToolsBar = (tool) => {
  const createButtonTool = document.createElement("button");
  createButtonTool.classList.add("swords");
  createButtonTool.classList.add(tool);
  toolBoxElement.appendChild(createButtonTool);
  createButtonTool.dataset.toolId = ARRAY_TOOLS.indexOf(tool);
  createButtonTool.addEventListener("click", ToolOrMaterialSelected);
};

const createMaterialsBar = (materialName, materialIndex) => {
  const createButtonMaterial = document.createElement("button");
  createButtonMaterial.classList.add("materialBox");
  createButtonMaterial.classList.add(materialName);
  const createSpanButtonMaterial = document.createElement("span");
  createSpanButtonMaterial.textContent = 0;
  createButtonMaterial.appendChild(createSpanButtonMaterial);
  materialBoxElement.appendChild(createButtonMaterial);
  createButtonMaterial.dataset.materialBoxId = materialIndex;
  createButtonMaterial.addEventListener("click", ToolOrMaterialSelected);
  lastClickedMaterialElement.addEventListener("click", putLastMaterialInSky);
};

const openOrCloseChestListener = ({ target }) => {
  const classesArrChest = [...target.classList];
  if (classesArrChest.includes("chest-closed")) {
    target.classList.remove("chest-closed");
    target.classList.add("chest-open");
    materialBoxElement.classList.remove("visibility-hidden");
    return;
  }
  target.classList.remove("chest-open");
  target.classList.add("chest-closed");
  materialBoxElement.classList.add("visibility-hidden");
};

const printGameBoard = () => {
  mainInfo.gameBoardMatrix.forEach((row, yIndex) => {
    row.forEach((column, xIndex) => {
      const block = document.createElement("div");
      block.dataset.materialId = column;
      block.dataset.materialXY = yIndex + "_" + xIndex;
      block.addEventListener("click", gameBoardClickHandler);
      block.classList.add(ARRAY_MATERIAL[column][0]);
      gameBoardElement.appendChild(block);
    });
  });
};

const ToolOrMaterialSelected = ({ target }) => {
  if (target.dataset.toolId) {
    userSelectedTool(target);
    return;
  }
  userSelectedMaterial(target);
  if (mainInfo.selectedTool > -1)
    document.querySelector(".selected-tool").classList.remove("selected-tool");
};

const userSelectedTool = (selectedToolElement) => {
  removeMaterialSelection();
  removeToolSelection(); // remove perv tool selection
  const toolId = selectedToolElement.dataset.toolId;
  mainInfo.selectedTool = toolId;
  selectedToolElement.classList.add("selected-tool");
};

const userSelectedMaterial = (target) => {
  removeToolSelection();
  if (target.firstChild.textContent > 0) {
    removeMaterialSelection();
    target.firstChild.classList.add("selected-material");
    mainInfo.selectedMaterial = target.dataset.materialBoxId;
    lastClickedMaterialElement.dataset.matchMaterialId =
      target.dataset.materialBoxId;
  }
};

const removeMaterialSelection = () => {
  if (document.querySelector(".selected-material")) {
    document
      .querySelector(".selected-material")
      .classList.remove("selected-material");
  }
  mainInfo.selectedMaterial = -1;
};

const removeToolSelection = () => {
  mainInfo.selectedTool = -1;
  const allTools = document.querySelectorAll("[data-tool-id]");
  allTools.forEach((eachTool) => {
    eachTool.classList.remove("selected-tool");
  });
};

const gameBoardClickHandler = ({ target }) => {
  const saveMaterialId = target.dataset.materialId;
  const selectedTool = +mainInfo.selectedTool;
  mainInfo.lastClickedMaterial = target.dataset.materialId;
  checkMatchMaterialAndTool(target, selectedTool, saveMaterialId);
  putSelectedMaterialInSky(target, saveMaterialId, selectedTool);
};

const checkMatchMaterialAndTool = (target, selectedTool, saveMaterialId) => {
  const lastClickedMaterial = mainInfo.lastClickedMaterial;
  if (selectedTool === -1) return;
  removeLastPickedClass(lastClickedMaterial);
  // match between tool and material
  if (saveMaterialId && ARRAY_MATERIAL[saveMaterialId][1] === selectedTool) {
    lastClickedMaterialElement.dataset.matchMaterialId = saveMaterialId;
    mainInfo.lastPickedMaterial =
      lastClickedMaterialElement.dataset.matchMaterialId;
    target.classList.remove(ARRAY_MATERIAL[saveMaterialId][0]);
    lastClickedMaterialElement.classList.add(
      ARRAY_MATERIAL[lastClickedMaterial][0]
    );
    target.dataset.materialId = 0;
    addToInventory(lastClickedMaterial);
    // not a match
  } else {
    mainInfo.lastClickedMaterial = -1;
    mainInfo.selectedMaterial = -1;
    const selectedToolElement = document.querySelector(
      `[data-tool-id='${selectedTool}']`
    );
    selectedToolElement.classList.add("invalid");
    setTimeout(() => {
      selectedToolElement.classList.remove("invalid");
    }, 500);
    lastClickedMaterialElement.dataset.matchMaterialId = -1;
  }
};

const removeLastPickedClass = () => {
  const lastClickedMaterialClasses = [...lastClickedMaterialElement.classList];
  lastClickedMaterialClasses.forEach((classs) => {
    if (arrOfMaterials.includes(classs)) {
      lastClickedMaterialElement.classList.remove(classs);
    }
  });
};

const putLastMaterialInSky = () => {
  removeToolSelection();
  if (document.querySelectorAll(".selected-material")) {
    document
      .querySelectorAll(".selected-material")
      .forEach((selectedMaterial) => {
        selectedMaterial.classList.remove("selected-material");
      });
  }
  const lastPickedMaterial = mainInfo.lastPickedMaterial;
  mainInfo.selectedMaterial = mainInfo.lastPickedMaterial;

  const materialElement = document.querySelector(
    `[data-material-box-id='${lastPickedMaterial}']`
  );
  if (materialElement) {
    if (materialElement.firstChild.textContent < 1) return;
    materialElement.firstChild.classList.add("selected-material");
  }
};

const putSelectedMaterialInSky = (target, selectedBlockId, selectedTool) => {
  let whichMaterialNum = mainInfo.selectedMaterial;
  if (document.querySelector(".selected-material") && selectedTool === -1)
    whichMaterialNum =
      document.querySelector(".selected-material").parentElement.dataset
        .materialBoxId;
  const materialElement = document.querySelector(".selected-material");
  if (materialElement) {
    if (
      selectedBlockId != 0 ||
      materialElement.textContent < 1 ||
      lastClickedMaterialElement.dataset.matchMaterialId == -1
    )
      return;
    materialElement.textContent--;
    if (materialElement.textContent == 0) {
      materialElement.classList.remove("selected-material");
      lastClickedMaterialElement.dataset.matchMaterialId = -1;
      lastClickedMaterialElement.classList.remove(
        ARRAY_MATERIAL[whichMaterialNum][0]
      );
    }
    target.classList.remove("sky");
    target.dataset.materialId = whichMaterialNum;
    target.classList.add(ARRAY_MATERIAL[whichMaterialNum][0]);
    //put last material in sky
    mainInfo.lastClickedMaterial = -1;
    if (selectedTool != -1)
      lastClickedMaterialElement.classList.remove(
        ARRAY_MATERIAL[whichMaterialNum][0]
      );
  }
};

const addToInventory = (lastClickedMaterial) => {
  const MaterialInventoryElement = document.querySelector(
    `[data-material-box-id='${lastClickedMaterial}']`
  );
  MaterialInventoryElement.firstChild.textContent++;
};

const userClickedPlay = ({ target }) => {
  setTimeout(() => {
    mainInfo.isStartGame = true;
    document.querySelectorAll(".display-none").forEach((show) => {
      show.classList.remove("display-none");
    });
    target.parentElement.parentElement.classList.add("display-none");
    gameInit();
  }, 500);
};

const userClickedDescription = () => {
  document.querySelector("#descriptionSpan").classList.toggle("display-none");
};

const restart = (whatButton) => {
  const allTools = document.querySelectorAll(".swords");
  const allMaterials = document.querySelectorAll("[data-material-box-id]");
  const blocksGame = document.querySelectorAll("[data-material-id]");
  const itemsArr = [...allTools, ...allMaterials, ...blocksGame];
  itemsArr.forEach((item) => {
    item.remove();
  });
  mainInfo.lastClickedMaterial = -1;
  mainInfo.lastPickedMaterial = -1;
  lastClickedMaterialElement.dataset.matchMaterialId = -1;
  removeLastPickedClass();
  removeToolSelection();
  removeMaterialSelection();
  if (whatButton.id != "backButton") gameInit();
};

const userClickedBack = ({ target }) => {
  restart(target);
  const coverElement = document.querySelector(".display-none");
  coverElement.classList.remove("display-none");
  const elementsToHide = [
    document.querySelector(".cont"),
    document.querySelector(".gameBoard"),
  ];
  elementsToHide.forEach((element) => {
    element.classList.add("display-none");
  });
};

document.querySelector("#restartButton").addEventListener("click", restart);

document
  .querySelector("#playButton")
  .addEventListener("click", userClickedPlay);

document
  .querySelector("#descriptionBtn")
  .addEventListener("click", userClickedDescription);

document
  .querySelector("#backButton")
  .addEventListener("click", userClickedBack);
