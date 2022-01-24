import { CellValue } from "./CellValue";

export interface Combination {
    from: [CellValue, CellValue];
    result: CellValue
}