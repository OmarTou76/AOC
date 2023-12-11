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
        this.getFirstNumbers()
    }

    getFirstNumbers() {
        this.numbers[this.numbers.length - 1].push(0)

        for (let i = this.numbers.length - 2; i > -1; i--) {
            const lastNumber = this.numbers[i + 1][0]
            const currentNumber = this.numbers[i][0]
            //console.log({ currentNumber, n: this.numbers })
            const newNumber = currentNumber - lastNumber
            this.numbers[i].unshift(newNumber)
        }

    }

    getSum() {

        return this.numbers[0][0];
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