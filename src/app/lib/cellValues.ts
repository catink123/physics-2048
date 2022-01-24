import { CellValue } from "./CellValue";

export function getCellValueByID(id: string): CellValue | undefined {
    return cellValues.find(val => id === val.id);
}

export const cellValues: Array<CellValue> = [
    {
        id: "v",
        variations: [
            {type: "text", value: "υ"},
            {type: "text", value: "м/с"},
            {type: 'image', value: 'assets/symbols/speedometer.png'},
        ],
        color: "#eee4da",
        scoreValue: 0
    },
    {
        id: 'L',
        variations: [
            {type: 'text', value: 'L'},
            {type: 'text', value: 'м.'},
            {type: 'image', value: 'assets/symbols/ruler.png'}
        ],
        color: "#ead3a8",
        scoreValue: 2
    },
    {
        id: 't',
        variations: [
            {type: 'text', value: 't'},
            {type: 'text', value: 'сек.'},
            {type: 'image', value: 'assets/symbols/clock.png'}
        ],
        color: "#f3b27a",
        scoreValue: 4
    },
    {
        id: 'm',
        variations: [
            {type: 'text', value: 'm'},
            {type: 'text', value: 'кг'},
            {type: 'image', value: 'assets/symbols/scale.png'}
        ],
        color: "#f68d56",
        scoreValue: 8
    },
    {
        id: 'V',
        variations: [
            {type: 'text', value: 'V'},
            {type: 'text', value: 'м³'},
            {type: 'image', value: 'assets/symbols/cube.png'}
        ],
        color: "#f65e3b",
        scoreValue: 16
    },
    {
        id: 'ro',
        variations: [
            {type: 'text', value: 'ρ'},
            {type: 'text', value: 'кг/м³'},
            {type: 'image', value: 'assets/symbols/plotnost.png'}
        ],
        color: "#ff3b0e",
        scoreValue: 32
    },
    {
        id: 'p',
        variations: [
            {type: 'text', value: 'p'},
            {type: 'text', value: 'Па.'},
            {type: 'image', value: 'assets/symbols/press.png'}
        ],
        color: "#edcf72",
        scoreValue: 64
    },
    {
        id: 'g',
        variations: [
            {type: 'text', value: 'g'},
            {type: 'text', value: 'м/с²'},
            {type: 'image', value: 'assets/symbols/uskorenie.png'}
        ],
        color: "#eac752",
        scoreValue: 128
    },
    {
        id: 'F',
        variations: [
            {type: 'text', value: 'F'},
            {type: 'text', value: 'Н.'},
            {type: 'image', value: 'assets/symbols/dynamometer.png'}
        ],
        color: "#dbb435",
        scoreValue: 256
    },
    {
        id: 'A',
        variations: [
            {type: 'text', value: 'A'},
            {type: 'text', value: 'Дж.'},
            {type: 'image', value: 'assets/symbols/work.png'}
        ],
        color: "#d2a81b",
        scoreValue: 512
    },
    {
        id: 'P',
        variations: [
            {type: 'text', value: 'P'},
            {type: 'text', value: 'Ватт.'},
            {type: 'image', value: 'assets/symbols/motor.png'}
        ],
        color: "#b28a00",
        scoreValue: 1024
    },
    {
        id: 'R',
        variations: [
            {type: 'text', value: 'R'},
            {type: 'text', value: 'Ом.'},
            {type: 'image', value: 'assets/symbols/resistance.png'}
        ],
        color: "#3e3933",
        scoreValue: 2048
    },
    {
        id: 'U',
        variations: [
            {type: 'text', value: 'U'},
            {type: 'text', value: 'В.'},
            {type: 'image', value: 'assets/symbols/voltmeter.png'}
        ],
        color: "#191715",
        scoreValue: 4096
    },
    {
        id: 'I',
        variations: [
            {type: 'text', value: 'I'},
            {type: 'text', value: 'А.'},
            {type: 'image', value: 'assets/symbols/amperemeter.png'}
        ],
        color: "#3e3933",
        scoreValue: 8192
    },
    {
        id: 'q',
        variations: [
            {type: 'text', value: 'q'},
            {type: 'text', value: 'Кл.'},
        ],
        color: "#3e3933",
        scoreValue: 16384
    },
    {
        id: 'n',
        variations: [
            {type: 'text', value: 'η'},
            {type: 'text', value: '%'},
        ],
        scoreValue: 32768
    },
];