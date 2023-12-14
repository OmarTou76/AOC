import { fetchData } from "../utils.js";

const file = 'day11.txt'
const data = await fetchData(file)
    .then((data) => data.split('\n'))
    .catch(err => console.log(err));

if (!data) {
    console.log("[ERROR]: %s is empty.", file);
    process.exit();
}

const EXPANSION_SIZE = 1000000

class Universe {

    matrix = [];
    galaxies = new Map()
    pathLength = []
    sumOfLength = 0
    rowsExpansions = []
    colsExpansions = []
    constructor(data) {
        this.create(data)
        this.calculateStepsPath()
        this.sumOfLength = this.pathLength.reduce((acc, curr) => acc += curr, 0)
    }

    getPath(startOriginal, end) {
        let steps = 0
        let start = { ...startOriginal }
        while (1) {
            let stepAccumulator = 1;
            if ((start.x === end.x) && (start.y === end.y))
                break;
            if (start.y < end.y) {
                stepAccumulator += this.rowsExpansions.includes(start.y + 1) ? EXPANSION_SIZE - 1 : 0;
                start.y++;
            }
            else if (start.y > end.y) {
                stepAccumulator += this.rowsExpansions.includes(start.y - 1) ? EXPANSION_SIZE - 1 : 0;
                start.y--;
            }
            else if (start.x < end.x) {
                stepAccumulator += this.colsExpansions.includes(start.x + 1) ? EXPANSION_SIZE - 1 : 0;
                start.x++;
            }
            else if (start.x > end.x) {
                stepAccumulator += this.colsExpansions.includes(start.x - 1) ? EXPANSION_SIZE - 1 : 0;
                start.x--
            }
            steps += stepAccumulator;
        }
        return steps
    }

    calculateStepsPath() {
        const max = this.galaxies.size
        this.galaxies.forEach((v, k) => {
            let targetKey = k + 1
            while (targetKey <= max) {
                const target = this.galaxies.get(targetKey)
                const steps = this.getPath(v, target)
                this.pathLength.push(steps)
                targetKey++;
            }
        })
    }

    create(data) {
        this.initMatrix(data)
        this.expandedUniverse()
        this.addIdToGalaxies()
    }

    addIdToGalaxies() {
        let id = 0;
        this.matrix = this.matrix.map((line, y) => line.map((s, x) => {
            if (s !== ".") {
                s = ++id;
                this.galaxies.set(id, { y, x })
            }
            return s
        }))
    }

    expandedUniverse() {
        let newColumn = []
        for (let x = 0; x < this.matrix[0].length; x++) {
            let hasGalaxy = true
            for (let y = 0; y < this.matrix.length; y++) {
                if (this.matrix[y][x] !== ".") {
                    hasGalaxy = false
                    break
                };
            }
            if (hasGalaxy)
                this.colsExpansions.push(x)
        }

    }

    initMatrix(data) {
        for (let i = 0; i < data.length; i++) {
            const line = data[i].split('')
            this.matrix.push(line);
            if (!line.includes("#"))
                this.rowsExpansions.push(i)
        }
    }

}

const u = new Universe(data)
console.log(u.sumOfLength)
console.log(u.pathLength)