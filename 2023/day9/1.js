import { fetchData } from "../utils.js";

const file = 'day9.txt'
const data = await fetchData(file)
    .then((data) => data.split('\n'))
    .catch(err => console.log(err));

if (!data) {
    console.log("[ERROR]: %s is empty.", file);
    process.exit();
}

class Line {
    numbers = [];
    constructor(line) {
        this.numbers.push(line.split(' ').map(n => parseInt(n)))
    }

    calculateChilds() {
        const newArr = [];
        const currentArr = this.numbers[this.numbers.length - 1];
        for (let i = 0; i < currentArr.length - 1; i++) {
            const diff = currentArr[i + 1] - currentArr[i]
            newArr.push(diff)
        }
        this.numbers.push(newArr);
        const allZeroes = newArr.every(n => n === 0)
        if (!allZeroes)
            return this.calculateChilds()
        this.getEndNumbers()
    }

    getEndNumbers() {
        for (let i = this.numbers.length - 1; i > 0; i--) {
            const currentLen = this.numbers[i].length - 1
            const targetLen = this.numbers[i - 1].length - 1
            const nextNumber = this.numbers[i - 1][targetLen] + this.numbers[i][currentLen]
            this.numbers[i - 1].push(nextNumber);
        }
        console.log(this.numbers)
    }

    getSum() {

        return this.numbers[0][this.numbers[0].length - 1];
    }
}


class Game {
    lines = []
    sums = 0
    constructor(data) {
        this.fillLines(data)
        this.createChild()
        this.getAllSum()
    }

    getAllSum() {
        this.sums = this.lines.reduce((acc, curr) => acc += curr.getSum(), 0)
    }

    fillLines(data) {
        data.forEach(line => this.lines.push(new Line(line)))
    }

    createChild() {
        this.lines.forEach(line => line.calculateChilds())
    }
}

const game = new Game(data)
console.log({ sums: game.sums })