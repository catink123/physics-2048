import { BehaviorSubject } from "rxjs";
import { Cell } from "./Cell";
import { cellValues, getCellValueByID } from "./cellValues";
import { doesCombine, getCombinationResult } from "./combos";
import { applyStyles, gridEqualTo, gridForEach, gridMap, Position, randomPosition, randomValue } from "./Common";

export interface FieldOptions {
    fieldDisplaySize?: number,
    fieldSize?: number;
}

export const fieldStyles = {
    position: 'relative',
    backgroundImage: `repeating-linear-gradient(to right, transparent 0px 99px, black 99px 100px), repeating-linear-gradient(to bottom, transparent 0px 99px, black 99px 100px)`,
    border: '2px solid black',
    borderBottomWidth: '1px',
    borderRightWidth: '1px',
}

interface GetCellAtResult {
    main: null | Cell,
    other: Cell[]
}

export class Field {
    cells: Array<Cell> = [];
    _fieldSize;
    _fieldDisplaySize;
    _element: HTMLDivElement;
    _prevGrid?: any[][];
    knownCellValues: string[] = [];
    lastCreatedCell = new BehaviorSubject("");
    // Transformation Callback (for "movingInto" transformation)
    _trCallback = (e: Position) => {
        // Find Cell's index by querying it's position and checking if it's "moving into"
        const index = this.cells.findIndex(val => val.position.x === e.x && val.position.y === e.y && val._isMovingInto);
        if (index === -1) { /* console.error("Can't remove a Cell at position", e, "as no Cell was found at that position!"); */ return; }
        if (!this.cells[index]) { /* console.error("Can't remove a Cell at position", e, "as index is out of bounds of cells array!"); */ return; }
        this.cells[index].destroy();
        this.cells.splice(index, 1);
    }

    constructor(container: HTMLElement, options?: FieldOptions) {
        this._fieldSize = options?.fieldSize ?? 4;
        this._fieldDisplaySize = options?.fieldDisplaySize ?? 400;
        for (let i = 0; i < 2; i++)
            this.knownCellValues.push(cellValues[i].id);
        this.lastCreatedCell.next('');
        this._element = document.createElement("div");
        applyStyles(this._element, {
            width: this._fieldDisplaySize + "px",
            height: this._fieldDisplaySize + "px",
            ...fieldStyles
        });
        try {
            container.appendChild(this._element);
        } catch (error) {
            console.error("Could not add Field to the page due to an unknown error.")
            console.error(error);
        }
        // Populate the cells array
        for (let i = 0; i < 2; i++)
            this.addRandomCell()
    }

    addRandomCell() {
        let randPos = randomPosition({ x: this._fieldSize, y: this._fieldSize });
        while (this.isOccupied(randPos)) {
            randPos = randomPosition({ x: this._fieldSize, y: this._fieldSize });
        }
        const cellValue = getCellValueByID(randomValue(this.knownCellValues))!;
        if (!cellValue) {
            console.error("Can't add a random Cell, because couldn't get a random CellValue");
        }
        this.cells.push(
            new Cell(
                randPos.x,              // x
                randPos.y,              // y
                cellValue,          // value
                this._element,          // container
                this._trCallback,       // trCallback
                {                       // options
                    cellDisplaySize: this._fieldDisplaySize / this._fieldSize
                }
            )
        )
    }

    getCellAt(pos: Position): GetCellAtResult {
        const { x, y } = pos;
        const findResult = this.cells.filter(val => ((val.position.x === x) && (val.position.y === y)));
        // console.log(findResult);
        const result: GetCellAtResult = { main: null, other: [] };
        if (findResult.length === 1) {
            result.main = findResult[0];
        } else if (findResult.length > 1) {
            result.main = findResult[0];
            result.other = findResult.slice(1);
        }
        return result;
    }

    get _cellGrid(): Array<Array<GetCellAtResult>> {
        let grid = Array.from({ length: this._fieldSize }, v => 
            Array.from({ length: this._fieldSize }, l => 
                ({ main: null, other: [] } as GetCellAtResult)
            )
        );
        grid = gridMap(grid, (_: any, position: Position) => {
            return this.getCellAt(position);
        })
        return grid;
    }

    isOccupied(pos: Position) {
        return this.getCellAt(pos).main !== null;
    }

    // Slides all cells to the left
    slide() {
        let grid = this._cellGrid;
        // console.log("Grid before sliding:");
        // console.table(grid);
        grid = grid.map(row => {
            const filtered = row.filter(val => val.main !== null);
            return filtered.concat(Array(this._fieldSize - filtered.length).fill({ main: null, other: [] } as GetCellAtResult));
        });
        // console.log("Grid after sliding:");
        // console.table(grid);
        // console.log("Sliding cells...");
        gridForEach(grid, (items: GetCellAtResult, pos: Position) => {
            if (items.main) {
                // console.log("Moving from", items.main.position, "to", pos);
                items.main.moveTo(pos);
            }
            for (const item of items.other) {
                // console.log("Moving from", item.position, "to", pos);
                item.moveTo(pos);
            }
        });
    }

    // Combines adjacent cells to the left
    combine(): number {
        let addedScore = 0;
        let grid = this._cellGrid;
        grid.forEach((row, y) => {
            let rowCopy = row;
            rowCopy.forEach((cell, x) => {
                const firstCellObj = cell;
                const secondCellObj = rowCopy[x + 1];
                // Check if there is a Cell
                if (firstCellObj && secondCellObj &&
                    firstCellObj.main !== null && secondCellObj.main !== null) {
                    const firstCell = firstCellObj.main;
                    const secondCell = secondCellObj.main;
                    // If they can combine, change one's value and move another into the first.
                    if (doesCombine(firstCell.value, secondCell.value)) {
                        const combineResult = getCombinationResult(firstCell.value, secondCell.value);
                        // Push the new CellValue's id to the knownCellValues array, so that we can create new random cells with this CellValue
                        // if (!this.knownCellValues.includes(combineResult.id)) {
                        //     this.knownCellValues.push(combineResult.id);
                        //     // Change lastCreatedCell to the first text variation of last CellValue of knownCellValues
                        //     this.lastCreatedCell.next(getCellValueByID(this.knownCellValues[this.knownCellValues.length - 1])?.variations[0].value ?? '');
                        // }
                        // REMOVED
                        firstCell.setValue(combineResult);
                        secondCell.moveInto(firstCell.position);
                        rowCopy[x] = { ...firstCellObj, main: firstCell };
                        rowCopy[x + 1] = { ...secondCellObj, main: null };
                        // Score for the combination
                        addedScore += combineResult.scoreValue;
                    }
                }
            })
        })
        return addedScore;
    }

    // Applies all Cells' transformations
    applyTransformations() {
        this.cells.forEach(val => val.applyAllTransformations());
    }

    // Transposes the field
    transpose() {
        // Flips (transposes) x and y values in the transformations. This function is for syncing with field rotation
        function transposeTransformations(cell: Cell) {
            cell.transformations = cell.transformations.map(val => {
                let r = val;
                if (r.data) {
                    const { from, to } = r.data;
                    r.data.from = { x: from.y, y: from.x };
                    r.data.to = { x: to.y, y: to.x };
                }
                return r
            })
        }

        let grid = this._cellGrid;
        gridForEach(grid, (vals: GetCellAtResult, pos: Position) => {
            if (vals.main) {
                transposeTransformations(vals.main);
                vals.main.moveTo({ x: pos.y, y: pos.x });
            }
            for (const val of vals.other) {
                transposeTransformations(val);
                val.moveTo({ x: pos.y, y: pos.x });
            }
        });
    }

    // Flips the field
    flip() {
        // Flips the transformations
        const fieldSize = this._fieldSize;
        function flipTransformations(cell: Cell) {
            cell.transformations = cell.transformations.map(val => {
                let r = val;
                if (r.data) {
                    const { from, to } = r.data;
                    r.data.from.x = fieldSize - 1 - from.x;
                    r.data.to.x = fieldSize - 1 - to.x;
                }
                return r
            })
        }

        let grid = this._cellGrid;
        gridForEach(grid, (vals: GetCellAtResult, pos: Position) => {
            if (vals.main) {
                flipTransformations(vals.main);
                vals.main.moveTo({ x: fieldSize - 1 - pos.x, y: pos.y });
            }
            for (const val of vals.other) {
                flipTransformations(val);
                val.moveTo({ x: fieldSize - 1 - pos.x, y: pos.y });
            }
        });
    }

    isSpaceAvailable(): boolean {
        let result = false;
        let regularGrid = this._cellGrid;
        // Check if there's free space on the field
        gridForEach(regularGrid, (val: GetCellAtResult) => {
            if (val.main === null) result = true;
        });
        return result;
    }

    // Check if can move in either direction (to put it simply, check if the game is over or not)
    canMove(): boolean {
        let result = false;
        // Create grid copy and slide it
        let regularGrid = this._cellGrid;
        regularGrid = regularGrid.map(row => {
            const filtered = row.filter(val => val.main !== null);
            return filtered.concat(Array(this._fieldSize - filtered.length).fill({ main: null, other: [] } as GetCellAtResult));
        });
        // Transposed grid for vertical checking
        let rotatedGrid = gridMap(regularGrid, (val: GetCellAtResult, pos: Position) => {
            const {x, y} = pos;
            let returnedGrid = regularGrid;
            returnedGrid[x][y] = val;
            return returnedGrid;
        });

        // Check if there's free space on the field
        gridForEach(regularGrid, (val: GetCellAtResult) => {
            if (val.main === null) result = true;
        });

        // Check if can combine
        const gridComparingFunction = (row: GetCellAtResult[]) => {
            row.forEach((cellObj, x) => {
                if (x === (this._fieldSize - 1)) return;
                const first = cellObj;
                console.log
                const second = row[x + 1];
                if (first.main && second.main && first.main!.isEqualTo(second.main!)) result = true;
            })
        };
        regularGrid.forEach(gridComparingFunction);
        rotatedGrid.forEach(gridComparingFunction);

        return result;
    }

    saveField() {
        this._prevGrid = this.getValueGrid();
    }

    getValueGrid(): any[][] {
        const grid = this._cellGrid;
        var valueGrid = gridMap(grid, (val: GetCellAtResult) => {
            if (val.main) {
                return val.main?.value.id
            } else {
                return null
            }
        });
        return valueGrid;
    }

    hasChanged(): boolean {
        const currentValueGrid = this.getValueGrid();
        if (this._prevGrid) 
            return !gridEqualTo(currentValueGrid, this._prevGrid!);
        else
            return false;
    }

    _removeAllCells() {
        for (let i = (this.cells.length - 1); i >= 0; i--) {
            this.cells[i].destroy();
            this.cells.splice(i, 1);
        }
    }

    reset() {
        this._removeAllCells();
        this.knownCellValues = [];
        for (let i = 0; i < 2; i++)
            this.knownCellValues.push(cellValues[i].id);
        this.lastCreatedCell.next('');
        this._prevGrid = undefined;
        this.addRandomCell();
        this.addRandomCell();
    }

    // undo() {
    //     if (!this._prevGrid) return;
    //     this._removeAllCells();
    //     gridForEach(this._prevGrid, (cvID: any, pos: Position) => {
    //         const {x, y} = pos;
    //         if (cvID) {
    //             this.cells.push(new Cell(x, y, getCellValueByID(cvID)!, this._element, this._trCallback));
    //         }
    //     })
    // }
    // TODO: Create an Undo action
}