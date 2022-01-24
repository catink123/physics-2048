import { CellValue } from "./CellValue";
import { cellValues } from "./cellValues";
import { Combination } from "./Combination";

function generateCombosFromList(list: Array<CellValue>): Array<Combination> {
    let combos: Array<Combination> = [];
    for (const [i, val] of Object.entries(list)) {
        combos.push({
            from: [val, val],
            result: list[parseInt(i) + 1]
        });
    }
    return combos;
}

// const combos: Array<Combination> = [
//     [v2, v2]
// ]
// const combos = generateCombosFromList(cellValues);

export const combos = generateCombosFromList(cellValues);

export function doesCombine(firstVal: CellValue, secondVal: CellValue): boolean {
    if (combos.find(val => 
        val.from[0] === firstVal && val.from[1] === secondVal
    )) return true;
    else return false;
}

export function getCombinationResult(firstVal: CellValue, secondVal: CellValue): CellValue {
    return combos.find(val => val.from[0] === firstVal && val.from[1] === secondVal)!.result;
}