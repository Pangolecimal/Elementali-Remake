let cols = 12, rows = 12;
let cells, cellsHistory;

let indexPrev, indexNext;
let movable = true;
let cardsToRemove = [], cardsToUpgrade = [];

let elementList = ["water", "fire", "air", "rock", "nature", "energy", "none"];
let element1 = "water", element2 = "nature", element3 = "none", element4 = "none";

let mergeButton, attackButton, undoButton;
let maxLevel = 3;
let chanceToSpawn = 0.2;

function setup() {
    createCanvas(800, 800);
    cells = createNDimArray([cols,rows]);
    cellsHistory = createNDimArray([0,0,0]);    
    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            cells[i][j] = new Cell(i, j, new Card(i, j, 0));
        }
    }
    cellsHistory.push(cells);

    indexPrev = createVector();
    indexNext = createVector();

    mergeButton = createButton("Merge");
    mergeButton.position(0, height);
    mergeButton.size(width/12, height/12);
    mergeButton.mousePressed(merging);

    mergeAttack = createButton("Attack");
    mergeAttack.position(width/12, height);
    mergeAttack.size(width/12, height/12);
    mergeAttack.mousePressed(attack);

    // undoButton = createButton("Undo");
    // undoButton.position(2*width/12, height);
    // undoButton.size(width/12, height/12);
    // undoButton.mousePressed(attack);
}

function draw() {
    background(51);

    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            cells[i][j].update();
            cells[i][j].show();
        }
    }
}