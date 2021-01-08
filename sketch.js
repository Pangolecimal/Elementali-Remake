let cols = 12, rows = 12;
let cells = Array.from(Array(cols), () => new Array(rows));
let indexPrev, indexNext;
let movable = true;
let cardsToRemove = [], cardsToUpgrade = [];
let elementList = ["water", "fire", "air", "rock", "nature", "energy", "none"];
let element1 = "water", element2 = "nature", element3 = "none", element4 = "none";
let chanceToSpawn = 0.2;

function setup() {
    createCanvas(1200, 1200);
    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            cells[i][j] = new Cell(i, j, new Card(i, j, 0));
        }
    }
    indexPrev = createVector();
    indexNext = createVector();
}

function draw() {
    background(51);

    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            cells[i][j].show();
        }
    }
}