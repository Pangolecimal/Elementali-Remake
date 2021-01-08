class Card {
    constructor(xindex, yindex, defLevel = 0, defElement = "none", cardData = null) {
        if (cardData == null) {
            this.cardIndex = createVector(xindex, yindex);
            this.level = defLevel;
            this.update("levelChange", this.level);
            this.element = getElement(yindex, chanceToSpawn, element1, element2, element3, element4); //random(1) < 0.33 ? elementList[floor(yindex / 6) * 2] : defElement;
        } else {
            this.cardIndex = cardData.index;
            this.level = cardData.level;
            this.update("levelChange", this.level);
            this.element = cardData.element;
        }
    }

    update(type, amount) {
        switch (type) {
            case "levelChange":
                this.level = amount; // 0 -> 1 -> 2
                this.health = this.level + 1 == 3 ? 6 : this.level + 1; // 1 -> 2 -> 6
                this.damage = 2 ** this.level; // 1 -> 2 -> 4
                this.reach = this.level * 2 + 3; // 3 -> 5 -> 7
                break;
            case "hit":
                this.health -= amount;
                break;
            case "move":
                cells[amount.x][amount.y].card = this;
                this.cardIndex = amount;
                break;
        }
    }
}

class Cell {
    constructor(xindex, yindex, defCard = null) {
        this.cellIndex = createVector(xindex, yindex);
        this.card = defCard.element == "none" ? null : defCard;
        this.color = yindex < 6 ? "green" : "blue";
        this.selected = false;
    }

    show() {
        drawCell(this.cellIndex.x, this.cellIndex.y, this.color, this.selected);
        if (this.card != null) {
            drawCard(this.cellIndex.x, this.cellIndex.y, this.card.element, this.selected, this.card.level);
        }
    }

    update() {
        if (this.card.element == "none")
            this.card = null;
    }
}

class cardData {
    constructor(xi, yi, level, element) {
        this.index = createVector(xi, yi);
        this.level = level+1;
        this.element = element;
    }
}