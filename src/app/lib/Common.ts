export function applyStyles(element: HTMLElement, styles: object) {
    for (const [key, value] of Object.entries(styles)) {
        element.style[<any>key] = value;
    }
}

export function gridMap(grid: any[][], callbackfn: Function): any[][] {
    return grid.map((row, y) => 
        row.map((item, x) =>
            callbackfn(item, {y, x})
        )
    )
}

export function gridForEach(grid: any[][], callbackfn: Function) {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            callbackfn(grid[y][x], {y, x});
        }
    }
}

export function gridEqualTo(firstGrid: any[][], secondGrid: any[][]): boolean {
    let returnValue = true;
    gridForEach(firstGrid, (val: any, pos: Position) => {
        const {x, y} = pos;
        if (val !== secondGrid[y][x]) returnValue = false;
    });
    return returnValue;
}

export interface Vec2 {
    x: number,
    y: number
}

export type Position = Vec2;

export type Size = Vec2;

export function randomPosition(bounds: Size): Position {
    const x = Math.floor(Math.random() * bounds.x);
    const y = Math.floor(Math.random() * bounds.y);
    return {x, y};
}

export function randomValue(array: Array<any>): any {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
}