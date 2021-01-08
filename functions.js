function drawCell(xi, yi, color, highlight = false) {
    let defColor = highlight ? 51 : 0;
    switch (color) {
        case "green":
            stroke(defColor, 204 + defColor, defColor);
            fill(defColor, 153 + defColor, defColor);
            break;
        case "blue":
            stroke(defColor, defColor, 204 + defColor);
            fill(defColor, defColor, 153 + defColor);
            break;
    }
    strokeWeight(1);
    rect(norm(xi, 0, 12) * width, norm(yi, 0, 12) * height, width / 12.0);
}

function drawCard(xi, yi, cardType, highlight = false, lvl) {
    let defColor = highlight ? 51 : 0;
    switch (cardType) {
        case "water":
            stroke(defColor, defColor, 255 + defColor);
            fill(defColor, defColor, 204 + defColor);
            break;
        case "fire":
            stroke(255 + defColor, defColor, defColor);
            fill(204 + defColor, defColor, defColor);
            break;
        case "air":
            stroke(255 + defColor);
            fill(204 + defColor);
            break;
        case "rock":
            stroke(153 + defColor);
            fill(102 + defColor);
            break;
        case "nature":
            stroke(defColor, 255 + defColor, defColor);
            fill(defColor, 204 + defColor, defColor);
            break;
        case "energy":
            stroke(255 + defColor, defColor, 255 + defColor);
            fill(204 + defColor, defColor, 204 + defColor);
            break;
    }
    strokeWeight(1);
    let pos = createVector((xi / 12.0 + 1.5 / 120.0) * width, (yi / 12.0 + 1.5 / 120.0) * height);
    let dim = width / 12.0 - width * 3 / 120.0;
    rect(pos.x, pos.y, dim);

    let s = "lvl " + nf(lvl + 1);
    fill(255);
    stroke(0);
    strokeWeight(1);
    textSize(24);
    textAlign(CENTER, CENTER);
    text(s, pos.x+dim/2, pos.y+dim/2);
}

function mouseReleased() {
    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            if (cells[i][j].selected == true) {
                cells[i][j].selected = false;
            }
        }
    }
    indexNext = createVector(min(floor(mouseX * 12.0 / width), 11), min(floor(mouseY * 12.0 / height), 11));
    cells[indexNext.x][indexNext.y].selected = true;
    // console.log(cells[indexNext.x][indexNext.y]);
    if (movable) {
        moveCard(indexPrev, indexNext);
        
    }
    indexPrev = indexNext;
    movable = !movable;
}

function moveCard(indexA, indexB) {
    if (cells[indexB.x][indexB.y].card == null && cells[indexA.x][indexA.y].card != null) {
        cells[indexA.x][indexA.y].card.update("move", indexB);
        cells[indexA.x][indexA.y].card = null;

        merging();
        cardsUpdate();
    } else {
        movable = !movable;
    }
}

function mergeQueue(cardDataA, indexB, indexC) {
    let addA = true, addB = true, addC = true;
    for (let i = 0; i < cardsToUpgrade.length; i++) {
        if (cardDataA.index.equals(cardsToUpgrade[i]))
            addA = false;
    }
    for (let i = 0; i < cardsToRemove.length; i++) {
        if (indexB.equals(cardsToRemove[i]))
            addB = false;
        if (indexC.equals(cardsToRemove[i]))
            addC = false;
    }
    if (addA)
        cardsToUpgrade.push(cardDataA);
    if (addB)
        cardsToRemove.push(indexB);
    if (addC)
        cardsToRemove.push(indexC);
}

function mergeable(indexA, indexB, indexC) {
    let valid = cells[indexA.x][indexA.y].card != null &&
        cells[indexB.x][indexB.y].card != null &&
        cells[indexC.x][indexC.y].card != null;
    if (valid && !indexA.equals(indexB) && !indexB.equals(indexC) && !indexA.equals(indexC) &&
    cells[indexA.x][indexA.y].card.level < 2 &&
    cells[indexB.x][indexB.y].card.level < 2 &&
    cells[indexC.x][indexC.y].card.level < 2) {
        return cells[indexA.x][indexA.y].card.element == cells[indexB.x][indexB.y].card.element &&
            cells[indexA.x][indexA.y].card.element == cells[indexC.x][indexC.y].card.element &&
            cells[indexA.x][indexA.y].card.level == cells[indexB.x][indexB.y].card.level &&
            cells[indexA.x][indexA.y].card.level == cells[indexC.x][indexC.y].card.level;
    } else {
        return false;
    }
}

function merging() {
    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            if (cells[i][j].card != null) {
                let startI = max(0, i - 1);
                let endI = min(cols - 1, i + 1);
                let startJ = max(0, j - 1);
                let endJ = min(rows - 1, j + 1);
                if (abs(startI - endI) == 2 && abs(startJ - endJ) == 2)
                    if (mergeable(createVector(i, j), createVector(startI, startJ), createVector(endI, endJ)))
                        mergeQueue(new cardData(i, j, cells[i][j].card.level, cells[i][j].card.element),
                            createVector(startI, startJ), createVector(endI, endJ));
                if (mergeable(createVector(i, j), createVector(i, startJ), createVector(i, endJ)))
                    mergeQueue(new cardData(i, j, cells[i][j].card.level, cells[i][j].card.element),
                        createVector(i, startJ), createVector(i, endJ));
                if (abs(startI - endI) == 2 && abs(startJ - endJ) == 2)
                    if (mergeable(createVector(i, j), createVector(endI, startJ), createVector(startI, endJ)))
                        mergeQueue(new cardData(i, j, cells[i][j].card.level, cells[i][j].card.element),
                            createVector(endI, startJ), createVector(startI, endJ));
                if (mergeable(createVector(i, j), createVector(endI, j), createVector(startI, j)))
                    mergeQueue(new cardData(i, j, cells[i][j].card.level, cells[i][j].card.element),
                        createVector(endI, j), createVector(startI, j));
            }
        }
    }
}

function cardsUpdate() {
    for (let i = 0; i < cardsToRemove.length; i++) {
        cells[cardsToRemove[i].x][cardsToRemove[i].y].card = null;
    }
    cardsToRemove = [];

    for (let i = 0; i < cardsToUpgrade.length; i++) {
        cells[cardsToUpgrade[i].index.x][cardsToUpgrade[i].index.y].card = new Card(
            cardsToUpgrade[i].index.x, cardsToUpgrade[i].index.y,
            cardsToUpgrade[i].level, cardsToUpgrade[i].element, cardsToUpgrade[i]);
        cells[cardsToUpgrade[i].index.x][cardsToUpgrade[i].index.y].update();
    }
    cardsToUpgrade = [];
}

function getElement(height, chance, el1, el2, el3 = "none", el4 = "none") {
    if (height < 6) {
        return random(1) < chance ? random(1) < 0.5 && el3 != "none" ? el3 : el1 : "none";
    } else {
        return random(1) < chance ? random(1) < 0.5 && el4 != "none" ? el4 : el2 : "none";
    }
}

function regenerate() {
    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            cells[i][j] = new Cell(i, j, new Card(i, j, 0));
        }
    }
    indexPrev = createVector();
    indexNext = createVector();
}