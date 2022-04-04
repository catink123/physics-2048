import { CellValue, Variant } from "./CellValue";
import { getContranstingTextColor } from "./Color";
import { applyStyles, Position, randomValue } from "./Common";

const imageStyles = {
    width: "100%",
    height: "100%",
    objectFit: "contain"
}

export class DisplayValue {
    value: Variant | any;
    constructor(value: any) {
        this.value = value;
    }

    get html(): HTMLElement {
        if (typeof this.value === "object") {
            switch (this.value.constructor.name) {
                case "HTMLImageElement":
                    applyStyles(this.value, imageStyles);
                    return this.value;
                case "HTMLParagraphElement":
                    return this.value;
                default:
                    if (this.value.type === "image") {
                        const img = document.createElement("img");
                        img.src = this.value.value;
                        img.draggable = false;
                        img.style.padding = "5px";
                        img.style.boxSizing = "border-box";
                        applyStyles(img, imageStyles);
                        return img;
                    } else if (this.value.type === "text") {
                        let p = document.createElement("p");
                        p.style.margin = "0px";
                        p.innerHTML = this.value.value;
                        return p;
                    } else {
                        let p = document.createElement("p");
                        p.style.margin = "0px";
                        p.innerHTML = JSON.stringify(this.value);
                        return p;
                    }
            }
        } else {
            let p = document.createElement("p");
            p.style.margin = "0px";
            switch (typeof this.value) {
                case "string":
                    p.innerHTML = this.value;
                    break;
                case "number":
                    p.innerHTML = this.value as unknown as string;
                    break;
            }
            return p;
        }
    }
}

export type TransformationType = "movingInto" | "moving" | "unknown";

export interface TransformationData {
    from: Position;
    to: Position;
}

// Transformation is an object, that represents changes in position to help in animations.
export class Transformation {
    type: TransformationType;
    data?: TransformationData;

    constructor(type: TransformationType, data: TransformationData) {
        if (data) {
            this.type = type;
            this.data = data;
        } else {
            this.type = "unknown";
        }
    }
}

export interface CellOptions {
    cellDisplaySize?: number
}

const transDur = 250;

export const cellStyles = {
    position: 'absolute',
    border: '2px solid black',
    boxSizing: 'border-box',
    transitionDuration: transDur + 'ms',
    background: 'white',
    display: 'grid',
    placeItems: 'center',
    fontSize: '44px',
    zIndex: '2',
    userSelect: 'none'
}

export function applyPosition(el: HTMLElement, newPos: Position) {
    applyStyles(el, {
        left: newPos.x + "px",
        top: newPos.y + "px"
    })
}

export class Cell {
    displayValue: DisplayValue;
    value: CellValue;
    currentVariation: Variant;
    position: Position;
    transformations: Array<Transformation> = [];
    _element: HTMLDivElement;
    _isMovingInto = false;
    trCallback: Function;
    // options: CellOptions;
    _cellSize;
    constructor(x: number, y: number, value: CellValue, container: HTMLDivElement, trCallback: Function, options?: CellOptions) {
        this.position = { x: x ?? 0, y: y ?? 0 };
        this.currentVariation = randomValue(value.variations);
        this.displayValue = new DisplayValue(this.currentVariation);
        this.value = value;
        this.trCallback = trCallback ?? null;
        this._cellSize = options!.cellDisplaySize ?? 100;

        // Display
        this._element = document.createElement("div");
        if (this._element.childNodes.length > 0) 
            this._element.replaceChild(this.displayValue.html, this._element.childNodes[0]);
        else
            this._element.appendChild(this.displayValue.html);
        applyStyles(this._element, {
            width: this._cellSize + "px",
            height: this._cellSize + "px",
            ...cellStyles,
            fontSize: Math.floor(this._cellSize / 3) + "px"
        });
        this._updateAppearance();
        applyPosition(this._element, {
            x: (this._cellSize ?? 100) * this.position.x,
            y: (this._cellSize ?? 100) * this.position.y
        });
        // Animate on creation
        this.newCellAnim();

        try {
            container.appendChild(this._element);
        } catch (error) {
            console.error(`Could not add Cell(${x}, ${y}) due to an unknown error.`)
            console.log(error);
        }
    }

    scaleAnim() {
        this._element.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(1.1)' },
            { transform: 'scale(1)' }
        ], {
            duration: 250,
            easing: "ease"
        });
    }

    newCellAnim() {
        this._element.animate([
            { borderColor: "red" },
            { borderColor: "black" },
        ], {
            duration: 3000,
            easing: "linear"
        })
        this._element.animate([
            { transform: 'scale(0)' },
            { transform: 'scale(1)' }
        ], {
            duration: 450,
            easing: "ease"
        })
    }

    setValue(newValue: CellValue) {
        this.value = newValue;
        this.currentVariation = randomValue(newValue.variations);
        this._updateDisplayValue();
        this.scaleAnim();
    }

    _updateAppearance() {
        applyStyles(this._element, {
            background: this.value.color ?? "white",
            color: getContranstingTextColor(this.value.color ?? "white")
        });
    }

    _updateDisplayValue() {
        this.displayValue = new DisplayValue(this.currentVariation);
        const html = this.displayValue.html;
        if (this.currentVariation.type === "image") {
            if (getContranstingTextColor(this.value.color ?? "white") === "#FFFFFF")
                html.style.filter = "invert(1)";
        }
        if (this._element.childNodes.length > 0) 
            this._element.replaceChild(html, this._element.childNodes[0]);
        else
            this._element.appendChild(html);
        this._updateAppearance();
    }

    moveTo(newPos: Position) {
        this.position = newPos;
        this.transformations.push(new Transformation("moving", {
            from: this.position,
            to: newPos
        }));
    }

    moveInto(newPos: Position) {
        this.position = newPos;
        this.transformations.push(new Transformation("movingInto", {
            from: this.position,
            to: newPos
        }));
        this._isMovingInto = true;
        this._element.style.zIndex = "0";
    }

    applyAllTransformations() {
        let ftFrom: Position | undefined;
        let ftTo: Position | undefined;
        let ftType: TransformationType | undefined;
        for (const tr of this.transformations) {
            if (!ftFrom) ftFrom = tr.data!.from;
            ftTo = tr.data!.to;
            if (!ftType || ftType !== "movingInto") ftType = tr.type;
        }
        let finalTransformation = new Transformation(ftType!, {
            from: ftFrom!,
            to: ftTo!
        });
        // console.log("Applying transformations to Cell with params", this, "\nThese transformations are:", this.transformations, "\nFinal transformation:", finalTransformation);
        // console.log(finalTransformation);
        this.applyTransformation(finalTransformation);
    }

    applyTransformation(transformation: Transformation) {
        if (transformation.data?.to) {
            const { to } = transformation.data;
            const type = transformation.type;
            this._element.style.left = (this._cellSize ?? 100) * to.x + "px";
            this._element.style.top = (this._cellSize ?? 100) * to.y + "px";
            if (type === "movingInto") setTimeout(() => { this.trCallback({ x: to.x, y: to.y }) }, transDur);
        }
    }

    destroy() {
        this._element.remove();
    }

    isEqualTo(otherCell: Cell): boolean {
        return otherCell.value.id === this.value.id;
    }
}