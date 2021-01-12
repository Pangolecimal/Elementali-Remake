class Card {
    constructor(xindex, yindex) {
        if (yindex != null) {
            this.cardIndex = createVector(xindex, yindex);
            this.level = 0;
            this.update("levelChange", this.level);
            this.element = getElement(yindex);
        } else {
            this.cardIndex = xindex.index;
            this.level = xindex.level;
            this.update("levelChange", this.level);
            this.element = xindex.element;
        }
    }

    update(type, amount) {
        switch (type) {
            case "levelChange":
                this.level = amount; // 0 -> 1 -> 2
                this.health = ceil(2 * 3 ** (this.level - 1)); // 1 -> 2 -> 6
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
        this.card = defCard;
        this.color = yindex < 6 ? "green" : "blue";
        this.selected = false;
        this.highlighted = false;
        this.previous = 1;
        this.attackable = false;
    }

    show() {
        drawCell(this.cellIndex.x, this.cellIndex.y, this.color, this.selected, this.highlighted, this.previous, this.attackable);
        if (this.card != null) {
            drawCard(this.card, this.selected, this.highlighted, this.previous, this.attackable);
        }
    }

    update() {
        if (this.card != null) {
            if (this.card.element == "none") {
                this.card = null;
            }
            if (this.card != null) {
                if (this.card.health <= 0) {
                    this.card.update("levelChange", this.card.level - 1);
                }
                if (this.card.level < 0) {
                    this.card = null;
                }
            }
        }

    }
}

class cardData {
    constructor(xi, yi, level, element) {
        this.index = createVector(xi, yi);
        this.level = level + 1;
        this.element = element;
    }
}
