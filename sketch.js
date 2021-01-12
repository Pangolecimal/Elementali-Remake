let cols = 12, rows = 12;
let cells, cellsHistory;
let indexPrev, indexNext;
let movable = true;
let cardsToRemove = [], cardsToUpgrade = [];
let elementList = ["water", "fire", "air", "rock", "nature", "energy", "none"];
let elementSelection = [4]; // 0,1 -> blue; 2,3 -> green;
let mergeButton, attackButton, undoButton, regenerateButton, fullnessButton;
let fullnessInput;
let maxLevel = 3; // displayed maximum level;
let fullness = 0.3; // 0 -> 1

function setup() {
    createCanvas(825, 825);

    indexPrev = createVector(-1, -1);
    indexNext = createVector(-1, -1);

    mergeButton = createButton("Merge");
    mergeButton.position(0, height);
    mergeButton.size(width / 12, height / 12);
    mergeButton.mousePressed(merging);

    mergeAttack = createButton("Attack");
    mergeAttack.position(0, height + height / 12);
    mergeAttack.size(width / 12, height / 12);
    mergeAttack.mousePressed(attack);

    regenerateButton = createButton("Generate Board");
    regenerateButton.position(width / 12, height);
    regenerateButton.size(width / 12, height / 12);
    regenerateButton.mousePressed(generate);

    fullnessInput = createInput(fullness);
    fullnessInput.position(2 * width / 12, height + 2 * height / 24);
    fullnessInput.size(width / 12 - 7, height / 12 - 6);
    fullnessInput.style("text-align", "center");

    fullnessButton = createButton("Apply Fullness (0..1)");
    fullnessButton.position(width / 12, height + height / 12);
    fullnessButton.size(width / 12, height / 12);
    fullnessButton.mousePressed(applyFullness);

    for (let j = 0; j < 2; j++) {
        for (let i = 0; i < 2; i++) {
            elementSelection[i + j * 2] = createSelect();
            elementSelection[i + j * 2].position((2 + j) * width / 12, height + i * height / 24);
            elementSelection[i + j * 2].size(width / 12, height / 24);
        }
    }

    for (let i = 0; i < elementList.length; i++) {
        for (let j = 0; j < 4; j++) {
            elementSelection[j].option(elementList[i]);
        }
    }
    elementSelection[0].selected("nature");
    elementSelection[1].selected("none");
    elementSelection[2].selected("water");
    elementSelection[3].selected("none");
    elementSelection[0].style("background", color(0, 0, 255, 102));
    elementSelection[1].style("background", color(0, 0, 255, 102));
    elementSelection[2].style("background", color(0, 255, 0, 102));
    elementSelection[3].style("background", color(0, 255, 0, 102));

    cells = createNDimArray([cols, rows]);
    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            cells[i][j] = new Cell(i, j);
            cells[i][j].update();
        }
    }
    let greens = indecies(fullness, 0);
    let blues = indecies(fullness, 1);
    for (let i = 0; i < greens.length; i++) {
        cells[greens[i].x][greens[i].y].card = new Card(greens[i].x, greens[i].y);
    }
    for (let i = 0; i < blues.length; i++) {
        cells[blues[i].x][blues[i].y].card = new Card(blues[i].x, blues[i].y);
    }
}

function draw() {
    background(51);
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height)
        cells[floor(mouseX * 12 / width)][floor(mouseY * 12 / width)].highlighted = true;
    if (indexPrev.x != -1 && indexPrev.y != -1)
        cells[indexPrev.x][indexPrev.y].previous = -1;
    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            cells[i][j].update();
            cells[i][j].show();
            cells[i][j].highlighted = false;
            cells[i][j].previous = 1;
        }
    }
}