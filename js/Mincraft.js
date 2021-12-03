"use strict";
const ARRAY_OF_TOOLS = ["axe", "pickaxe", "shovel"];
const MATERIAL_ARRAY = [
  ["sky", -1],
  ["tree", 0],
  ["leaves", 0],
  ["rock", 1],
  ["ground", 2],
  ["grass", 2],
  ["cloud", -1],
];

const gameBoardElement = document.querySelector("#gameBoard");
const toolBoxElement = document.querySelector(".toolBox");
const materialBoxElement = document.querySelector(".materialBar");

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
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  ],
  selectedTool: -1, // axe = 0 // pickaxe =1 // shovel = 2
  lastClickedMaterial: -1, // 1 = wood // 2 = levees // 3 = metal // 4 = dirt // 6 = clouds
};

const gameInit = () => {
  printGameBoard();
  ARRAY_OF_TOOLS.forEach((tool) => {
    createToolsBar(tool);
  });
  const filteredMaterials = MATERIAL_ARRAY.filter(
    (material) => material[1] !== -1
  );
  filteredMaterials.forEach((material, materialIndex) => {
    createMaterialsBar(material[0], materialIndex);
  });
  // document.querySelectorAll(".swords").forEach((tool) => {
  //   tool.addEventListener("click", whichToolSelected);
  // });
};

const createToolsBar = (tool) => {
  const createButtonTool = document.createElement("button");
  createButtonTool.classList.add("swords");
  createButtonTool.classList.add(tool);
  toolBoxElement.appendChild(createButtonTool);
  createButtonTool.dataset.toolId = ARRAY_OF_TOOLS.indexOf(tool);
  createButtonTool.addEventListener("click", whichToolSelected);

  // const createButtonTool = `<button class="swords ${tool}"></button>`;
  // toolBoxElement.innerHTML += createButtonTool;
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
  createButtonMaterial.addEventListener("click", whichToolSelected);
};

const printGameBoard = () => {
  mainInfo.gameBoardMatrix.forEach((row, yIndex) => {
    // runs on each column
    row.forEach((column, xIndex) => {
      // save current position id
      const currentPositionId = column;
      const block = document.createElement("div");

      block.dataset.materialId = currentPositionId;
      block.addEventListener("click", clickHandler);
      // block.addEventListener("mouseover", mouseOverHandler);
      // block.addEventListener("mouseout", mouseOutHandler);
      block.classList.add(MATERIAL_ARRAY[currentPositionId][0]);
      gameBoardElement.appendChild(block);
    });
  });
};

const whichToolSelected = (e) => {
  const selectedToolElement = e.target;
  const toolId = selectedToolElement.dataset.toolId;
  mainInfo.selectedTool = toolId;
  const allTools = document.querySelectorAll("[data-tool-id]");
  allTools.forEach((eachTool) => {
    eachTool.classList.remove("selected-tool");
  });
  selectedToolElement.classList.add("selected-tool");
};

const clickHandler = (e) => {
  const item = e.target;
  const saveMaterialId = item.dataset.materialId;
  const selectedTool = +mainInfo.selectedTool;
  if (MATERIAL_ARRAY[saveMaterialId][1] === selectedTool) {
    item.classList.remove(MATERIAL_ARRAY[saveMaterialId][0]);
  } else {
    const selectedToolElement = document.querySelector(
      `[data-tool-id='${selectedTool}']`
    );
    selectedToolElement.classList.toggle("invalid");
    setTimeout(() => {
      selectedToolElement.classList.toggle("invalid");
    }, 500);
  }
  // if(myObj.hasOwnProperty('key')   classlistMaterial.contain)
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

// const mouseOverHandler = (e) => {
//   const item = e.target;
//   item.style.border = "1px solid black";
// };
// const mouseOutHandler = (e) => {
//   const item = e.target;
//   item.style.border = "none";
// };

gameInit();
