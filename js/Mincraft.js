"use strict";
const ARRAY_OF_TOOLS = ["axe", "pickaxe", "shovel"];
const materialObj = {
  tree: "tree",
  leaves: "leaves",
  rock: "rock",
  ground: "ground",
  grass: "grass",
  cloud: "cloud",
};

const gameBoardElement = document.querySelector("#gameBoard");
const toolBoxElement = document.querySelector(".toolBox");

const mainInfo = {
  isStartGame: false,
  gameBoardMatrix: [
    //18*18
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 6, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 6, 6, 6, 6, 6, 0, 0, 0, 0, 2, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 2, 2, 0, 0, 3, 3, 3, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 2, 2, 0, 0, 3, 3, 3, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  ],
  selectedTool: -1, // axe = 0 // pickaxe =1 // shovel = 2
  lastClickedMaterial: -1, // 1 = wood // 2 = levees // 3 = metal // 4 = dirt // 6 = clouds
};

const gameInit = () => {
  printGameBoard();
  ARRAY_OF_TOOLS.forEach((tool) => {
    createTools(tool);
  });
  // document.querySelectorAll(".swords").forEach((tool) => {
  //   tool.addEventListener("click", whichToolSelected);
  // });
};

const createTools = (tool) => {
  const createButtonTool = document.createElement("button");
  createButtonTool.classList.add("swords");
  createButtonTool.classList.add(tool);
  toolBoxElement.appendChild(createButtonTool);
  createButtonTool.dataset.toolId = ARRAY_OF_TOOLS.indexOf(tool);
  createButtonTool.addEventListener("click", whichToolSelected);

  // const createButtonTool = `<button class="swords ${tool}"></button>`;
  // toolBoxElement.innerHTML += createButtonTool;
};

const printGameBoard = () => {
  // runs on each row
  mainInfo.gameBoardMatrix.forEach((row, yIndex) => {
    // runs on each column
    row.forEach((column, xIndex) => {
      // save current position id
      const currentPositionId = column;
      // create a block
      const block = document.createElement("div");
      if (currentPositionId !== 0) {
        block.dataset.materialId = currentPositionId;
        block.addEventListener("click", clickHandler);
        block.addEventListener("mouseover", mouseOverHandler);
        block.addEventListener("mouseout", mouseOutHandler);
      }

      // add style by id
      switch (currentPositionId) {
        case 1:
          block.classList.add(materialObj.tree);
          break;
        case 2:
          block.classList.add(materialObj.leaves);
          break;
        case 3:
          block.classList.add(materialObj.rock);
          break;
        case 4:
          block.classList.add(materialObj.ground);
          break;
        case 5:
          block.classList.add(materialObj.grass);
          break;
        case 6:
          block.classList.add(materialObj.cloud);
          break;
      }
      gameBoardElement.appendChild(block);
    });
  });
};

const whichToolSelected = (e) => {
  const toolId = e.target.dataset.toolId;
  console.log(toolId);
};

const clickHandler = (e) => {
  const saveMaterialId = e.target.dataset.materialId;
  console.log(e.target);
  console.log("click", saveMaterialId);
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

const mouseOverHandler = (e) => {
  const item = e.target;
  item.style.border = "1px solid black";
};
const mouseOutHandler = (e) => {
  const item = e.target;
  item.style.border = "none";
};

gameInit();
