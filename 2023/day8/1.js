import { fetchData } from "../utils.js";

const file = 'day8.txt'
const data = await fetchData(file)
    .then((data) => data.split('\n'))
    .catch(err => console.log(err));

if (!data) {
    console.log("[ERROR]: %s is empty.", file);
    process.exit();
}

class Solver {

    node = {}
    instructions;
    currentNode = "AAA";
    count = 0

    constructor(data) {
        const [instructions, ...rest] = data
        this.instructions = instructions.split('')
        this.formatData(rest.filter(el => el))
    }

    formatData(data) {
        data.forEach((line, i) => {
            const [key, values] = line.split(" = ")
            const [L, R] = values.split(/[\(\), ]/g).filter(el => el)
            this.node[key] = { L, R }
        })
    }

    proceed() {
        let isFound = -1
        while (isFound < 0) {
            isFound = this.executeInstructions()
        }
        return isFound
    }

    executeInstructions() {
        for (let i = 0; i < this.instructions.length; i++) {
            const instruction = this.instructions[i];
            this.currentNode = this.node[this.currentNode][instruction]
            this.count++;
            if (this.currentNode === 'ZZZ') return this.count;
        }

        return -1
    }


}

const node = new Solver(data);
console.log({ count: node.proceed() })