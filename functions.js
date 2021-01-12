function drawCell(xi, yi, color, selected = false, highlighted = false, previous = 1, attackable = false) {
    let defColor = selected ? 60 : previous * 20;
    defColor += highlighted ? 30 : 0;
    if (xi % 2 == yi % 2) {
        defColor -= 10;
    }
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
    if (attackable) {
        fill(255, 0, 0, 51);
        rect(norm(xi, 0, 12) * width, norm(yi, 0, 12) * height, width / 12.0);
    }
}

function drawCard(card, selected = false, highlighted = false, previous = 1, attackable = false) {
    let defColor = selected ? 60 : previous * 30;
    defColor += highlighted ? 30 : 0;
    let opacity = selected ? 255 * 0.5 : 255;
    switch (card.element) {
        case "water":
            stroke(defColor, defColor, 255 + defColor, opacity);
            fill(defColor, defColor, 204 + defColor, opacity);
            break;
        case "fire":
            stroke(255 + defColor, defColor, defColor, opacity);
            fill(204 + defColor, defColor, defColor, opacity);
            break;
        case "air":
            stroke(255 + defColor, opacity);
            fill(204 + defColor, opacity);
            break;
        case "rock":
            stroke(102 + defColor, opacity);
            fill(51 + defColor, opacity);
            break;
        case "nature":
            stroke(defColor, 255 + defColor, defColor, opacity);
            fill(defColor, 204 + defColor, defColor, opacity);
            break;
        case "energy":
            stroke(255 + defColor, defColor, 255 + defColor, opacity);
            fill(204 + defColor, defColor, 204 + defColor, opacity);
            break;
    }
    strokeWeight(1);
    let percent = map(card.level + 1, 0, maxLevel, 0.75, 0.25);
    let pos = card.cardIndex.copy().div(12).add(percent / 24, percent / 24).mult(width);
    let dim = width / 12.0 * (1 - percent);
    rect(pos.x, pos.y, dim);
    if (attackable) {
        fill(255, 0, 0, 51);
        rect(pos.x, pos.y, dim);
    }

    let s = nf(card.level + 1);
    fill(255);
    stroke(0);
    strokeWeight(1);
    textAlign(CENTER, BOTTOM);
    text(s, pos.x + dim/2, pos.y + dim);

    displayHP(card.cardIndex, card.health, card.level);
}

function mouseReleased() {
    if (mouseX < width && mouseX > 0 && mouseY < height && mouseY > 0) {
        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols; i++) {
                if (cells[i][j].selected == true) {
                    cells[i][j].selected = false;
                }
                cells[i][j].attackable = false;
            }
        }
        indexPrev = indexNext;
        indexNext = createVector(min(floor(mouseX * 12.0 / width), 11), min(floor(mouseY * 12.0 / height), 11));
        cells[indexNext.x][indexNext.y].selected = true;
        if (cells[indexNext.x][indexNext.y].card != null)
            if (indexNext.y < 6) {
                for (let i = indexNext.x - 1; i < indexNext.x + 2; i++)
                    for (let j = indexNext.y + 1; j < cells[indexNext.x][indexNext.y].card.reach + indexNext.y + 1; j++)
                        if (i >= 0 && j >= 0 && i < 12 && j < 12)
                            cells[i][j].attackable = true;
            } else {
                for (let i = indexNext.x - 1; i < indexNext.x + 2; i++)
                    for (let j = indexNext.y - 1; j > indexNext.y - 1 - cells[indexNext.x][indexNext.y].card.reach; j--)
                        if (i >= 0 && j >= 0 && i < 12 && j < 12)
                            cells[i][j].attackable = true;
            }
        if (movable) {
            moveCard(indexPrev, indexNext);
            movable = !movable;
        }
        movable = !movable;
    }
}

function moveCard(indexA, indexB) { // A moves to B
    if (floor(indexA.y / 6) == floor(indexB.y / 6) && !indexA.equals(indexB)) {
        if (cells[indexA.x][indexA.y].card != null && cells[indexB.x][indexB.y].card == null) {
            cells[indexA.x][indexA.y].card.update("move", indexB);
            cells[indexA.x][indexA.y].card = null;

            movable = !movable;
        }
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
        cells[indexC.x][indexC.y].card != null &&
        floor(indexA.y / 6) == floor(indexB.y / 6) && floor(indexB.y / 6) == floor(indexC.y / 6);
    if (valid && !indexA.equals(indexB) && !indexB.equals(indexC) && !indexA.equals(indexC) &&
        cells[indexA.x][indexA.y].card.level < maxLevel - 1 &&
        cells[indexB.x][indexB.y].card.level < maxLevel - 1 &&
        cells[indexC.x][indexC.y].card.level < maxLevel - 1) {
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

    for (let i = 0; i < cardsToRemove.length; i++) {
        cells[cardsToRemove[i].x][cardsToRemove[i].y].card = null;
    }
    cardsToRemove = [];

    for (let i = 0; i < cardsToUpgrade.length; i++) {
        cells[cardsToUpgrade[i].index.x][cardsToUpgrade[i].index.y].card = new Card(cardsToUpgrade[i]);
        cells[cardsToUpgrade[i].index.x][cardsToUpgrade[i].index.y].update();
    }
    cardsToUpgrade = [];
}

function getElement(height) {
    let el1 = elementSelection[0].value();
    let el2 = elementSelection[1].value();
    let el3 = elementSelection[2].value();
    let el4 = elementSelection[3].value();
    if (height >= 6) { // green
        return random(1) < 0.5 && el2 != "none" ? el2 : el1;
    } else { // blue
        return random(1) < 0.5 && el4 != "none" ? el4 : el3;
    }
}

function generate() {
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
    indexPrev = createVector(-1, -1);
    indexNext = createVector(-1, -1);
}

function createNDimArray(dimensions) {
    var t, i = 0, s = dimensions[0], arr = new Array(s);
    if (dimensions.length < 3) for (t = dimensions[1]; i < s;) arr[i++] = new Array(t);
    else for (t = dimensions.slice(1); i < s;) arr[i++] = createNDimArray(t);
    return arr;
}

function attack() { // indexPrev attacks indexNext
    if (indexPrev != indexNext && floor(indexNext.y / 6) != floor(indexPrev.y / 6) &&
        cells[indexPrev.x][indexPrev.y].card != null && cells[indexNext.x][indexNext.y].card != null &&
        abs(indexPrev.y - indexNext.y) <= cells[indexPrev.x][indexPrev.y].card.reach) {
        cells[indexNext.x][indexNext.y].card.update("hit", cells[indexPrev.x][indexPrev.y].card.damage);
        cells[indexNext.x][indexNext.y].update();
    }
}

function applyFullness() {
    fullness = max(min(fullnessInput.value(),1),0);
}

function displayHP(index, health, level) {
    let hp = norm(health, 0, ceil(2 * 3 ** (level - 1)));
    let radius = width / 12 * 0.15;
    push();
    if (hp <= 0.25) {
        fill(255, 0, 0);
    } else if (hp <= 0.75) {
        fill(255, 255, 0);
    } else {
        fill(0, 255, 0);
    }
    // strokeWeight(0.5);
    noStroke();
    beginShape();
    vertex((index.x + 0.5) * width / 12, (index.y + 0.2) * height / 12);
    for (let i = hp; i >= 0; i -= 0.001) {
        vertex(cos(PI - i * TAU) * radius + (index.x + 0.5) * width / 12, sin(PI - i * TAU) * radius + (index.y + 0.2) * height / 12);
    }
    vertex((index.x + 0.5) * width / 12, (index.y + 0.2) * height / 12);
    endShape();
    noFill();
    stroke(0);
    strokeWeight(0.5);
    circle((index.x + 0.5) * width / 12, (index.y + 0.2) * height / 12, radius * 2);
    pop();
}

function indecies(fi, height) {
    let n = round(fi * 72);
    let indecies = [];
    while (n > 0) {
        let trial = createVector(floor(random(12)), floor(random(6) + height * 6));
        let valid = true;
        for (let i = 0; i < indecies.length; i++) {
            if (indecies[i].equals(trial)) {
                valid = false;
                continue;
            }
        }
        if (valid) {
            indecies.push(trial);
            n--;
        }
    }
    return indecies;
}