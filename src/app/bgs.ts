export interface BackgroundImage {
    id: string;
    name: string;
    image: string;
}

export const bgs: BackgroundImage[] = [
    {
        id: 'autumn',
        name: 'Осень',
        image: 'assets/bgs/autumn.jpg'
    },
    {
        id: 'beach',
        name: 'Пляж',
        image: 'assets/bgs/beach.jpg'
    },
    {
        id: 'city',
        name: 'Город',
        image: 'assets/bgs/city.jpg'
    },
    {
        id: 'fire',
        name: 'Огонь',
        image: 'assets/bgs/fire.jpg'
    },
    {
        id: 'flowers',
        name: 'Цветы',
        image: 'assets/bgs/flowers.jpg'
    },
    {
        id: 'guitar',
        name: 'Гитара',
        image: 'assets/bgs/guitar.jpg'
    },
    {
        id: 'joker',
        name: 'Джокер',
        image: 'assets/bgs/joker.jpg'
    },
    {
        id: 'leaf',
        name: 'Лист',
        image: 'assets/bgs/leaf.jpg'
    },
    {
        id: 'minimalistic_city',
        name: 'Минималистический город',
        image: 'assets/bgs/minimalistic_city.jpg'
    },
    {
        id: 'neon_samurai',
        name: 'Неоновый самурай',
        image: 'assets/bgs/neon_samurai.jpg'
    },
    {
        id: 'paint',
        name: 'Краски',
        image: 'assets/bgs/paint.jpg'
    },
    {
        id: 'rainforest',
        name: 'Лес',
        image: 'assets/bgs/rainforest.jpg'
    },
    {
        id: 'shapes1',
        name: 'Фигуры 1',
        image: 'assets/bgs/shapes1.jpg'
    },
    {
        id: 'shapes2',
        name: 'Фигуры 2',
        image: 'assets/bgs/shapes2.jpg'
    },
    {
        id: 'sky',
        name: 'Небо',
        image: 'assets/bgs/sky.jpg'
    },
    {
        id: 'squares',
        name: 'Квадраты',
        image: 'assets/bgs/squares.jpg'
    }
]

export function getBG(id: string): BackgroundImage | undefined {
    return bgs.find(val => val.id === id);
}