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

const gameBoardElement = document.querySelector("#gameBoard");
const toolBoxElement = document.querySelector(".toolBox");
const materialBoxElement = document.querySelector(".materialBar");
const lastClickedMaterialElement = document.querySelector(
  "#lastClickedMaterial"
);

const mainInfo = {
  isStartGame: false,
  gameBoardMatrix: [
    //19*19
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 6, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 6, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 6, 6, 6, 6, 6, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 2, 2, 0, 0, 3, 3, 3, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 2, 2, 0, 0, 3, 3, 3, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    [4, 4, 4, 3, 3, 4, 4, 4, 3, 4, 4, 4, 4, 3, 4, 4, 4, 4, 4],
    [4, 4, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 4, 4],
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
};

const printGameBoard = () => {
  mainInfo.gameBoardMatrix.forEach((row, yIndex) => {
    row.forEach((column, xIndex) => {
      const block = document.createElement("div");
      block.dataset.materialId = column;
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
    return;
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
  // lastClickedMaterialElement.dataset.matchMaterialId = -1;
  mainInfo.lastClickedMaterial = target.dataset.materialId;

  //   mainInfo.lastPickedMaterial =
  //   lastClickedMaterialElement.dataset.matchMaterialId;
  // console.log(mainInfo.lastPickedMaterial);
  // mainInfo.lastPickedMaterial = -1;
  // lastClickedMaterialElement.dataset.matchMaterialId = -1;
  // putLastMaterialInSky(target, saveMaterialId);
  checkMatchMaterialAndTool(target, selectedTool, saveMaterialId);
  putSelectedMaterialInSky(target, saveMaterialId);
};

const checkMatchMaterialAndTool = (target, selectedTool, saveMaterialId) => {
  const lastClickedMaterial = mainInfo.lastClickedMaterial;
  if (selectedTool === -1) return;
  removeLastPickedClass();
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
    if (mainInfo.lastPickedMaterial != -1) {
      const selectedToolElement = document.querySelector(
        `[data-tool-id='${selectedTool}']`
      );
      selectedToolElement.classList.add("invalid");
      setTimeout(() => {
        selectedToolElement.classList.remove("invalid");
      }, 500);
    }
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

// const putLastMaterialInSky = (target, saveMaterialId) => {
//   const lastClickedMaterial = mainInfo.lastClickedMaterial;
//   console.log(lastClickedMaterial);

//   const lastPickedMaterial = mainInfo.lastPickedMaterial;
//   console.log(lastPickedMaterial);
//   if (lastPickedMaterial == -1 || lastClickedMaterial != 0) return;
//   const materialElement = document.querySelector(
//     `[data-material-box-id='${lastPickedMaterial}']`
//   );
//   console.log(materialElement);
//   // materialElement.classList.add("selected-material");
//   // const whichMaterialNum = mainInfo.selectedMaterial;
// };

const putSelectedMaterialInSky = (target, selectedBlockId) => {
  const whichMaterialNum = mainInfo.selectedMaterial;
  const materialElement = document.querySelector(".selected-material");
  if (materialElement) {
    if (selectedBlockId != 0 || materialElement.textContent < 1) return;
    materialElement.textContent--;
    if (materialElement.textContent == 0)
      materialElement.classList.remove("selected-material");
    target.classList.remove("sky");
    target.dataset.materialId = whichMaterialNum;
    target.classList.add(ARRAY_MATERIAL[whichMaterialNum][0]);
    //put last material in sky
    mainInfo.lastClickedMaterial = -1;
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

const createMatrix = (row, column) => {
  let matrix = [];
  for (let i = 0; i < row; i++) {
    const newRow = [];
    for (let j = 0; j < column; j++) {
      newRow.push({});
    }
    matrix.push(newRow);
  }
  console.log(matrix);
};

gameInit();
