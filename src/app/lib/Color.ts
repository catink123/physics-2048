import {contrastColor} from 'contrast-color';

export const RGB = (r: number, g: number, b: number) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')

export function getContranstingTextColor(color: string) {
    return contrastColor({bgColor: color.toUpperCase(), threshold: 128});
}