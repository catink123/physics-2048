export type VariantType = "image" | "text";

export interface Variant {
    type: VariantType,
    value: any
}

export type HEXColor = string;

export interface CellValue {
    id: string;
    variations: Variant[];
    color?: HEXColor;
    scoreValue: number;
}