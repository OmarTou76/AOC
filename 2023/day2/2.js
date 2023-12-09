import { fetchData } from "../utils.js";

const file = 'day2.txt'
const data = await fetchData(file)
    .then((data) => data.split('\n'))
    .catch(err => console.log(err));

if (!data) {
    console.log("[ERROR]: %s is empty.", file);
    process.exit();
}

const MAX = { red: 12, green: 13, blue: 14 }

class Game {
    part = []
    cubes = {}
    _sum
    constructor(line) {
        this.part = line
        this._sum = 0
        this.appendCubes();
    }

    appendCubes() {
        this.part.forEach(el => {
            const [quantity, color] = el.split(" ")
            this.cubes[color] = parseInt(quantity)
        })
        this.updateSum()

    }

    update(game) {
        const newCubes = game.cubes;
        for (const color in newCubes) {
            if (!this.cubes[color] || this.cubes[color] < newCubes[color]) {
                this.cubes[color] = newCubes[color]
            }
        }
        this.updateSum()
    }

    updateSum() {
        this._sum = Object.values(this.cubes).reduce((prev, curr) => prev * curr)
    }

    get sum() {
        return this._sum
    }
}

function serializeData(data) {

    let serializedData = []

    for (let i = 0; i < data.length; i++) {
        let [game, line] = data[i].split(':');
        const id = parseInt(game.split(' ')[1]);
        line = line.split(';')
        for (let j = 0; j < line.length; j++) {
            const part = line[j].trim().split(', ');
            const game = new Game(part)
            if (!serializedData[i])
                serializedData.push(game);
            else {
                serializedData[i].update(game)
            }
        }
    }

    return serializedData
}

let serializedData = serializeData(data)
const sum = serializedData.reduce((p, c) => p += c.sum, 0)
console.log(sum)
//console.log(serializedData.reduce((prev, curr) => curr += prev, 0))
