import { fetchData } from "../utils.js";

const file = 'day10.txt'
const data = await fetchData(file)
    .then((data) => data.split('\n'))
    .catch(err => console.log(err));

if (!data) {
    console.log("[ERROR]: %s is empty.", file);
    process.exit();
}

const D = {
    "|": (p) => ({
        y: p.ly === p.y + 1 ? p.y - 1 : p.y + 1,
        x: p.x,
        lx: p.x,
        ly: p.y
    }),
    "-": (p) => ({
        x: p.lx === p.x + 1 ? p.x - 1 : p.x + 1,
        y: p.y,
        ly: p.y,
        lx: p.x
    }),
    "7": (p) => ({
        y: p.ly > p.y ? p.y : p.y + 1,
        x: p.lx < p.x ? p.x : p.x - 1,
        ly: p.y,
        lx: p.x,
    }),
    "J": (p) => ({
        y: p.ly < p.y ? p.y : p.y - 1,
        x: p.lx < p.x ? p.x : p.x - 1,
        ly: p.y,
        lx: p.x,
    }),
    "L": (p) => ({
        y: p.ly < p.y ? p.y : p.y - 1,
        x: p.lx > p.x ? p.x : p.x + 1,
        ly: p.y,
        lx: p.x,
    }),
    "F": (p) => ({
        y: p.ly > p.y ? p.y : p.y + 1,
        x: p.lx > p.x ? p.x : p.x + 1,
        ly: p.y,
        lx: p.x,
    }),
}


class Matrix {
    M;
    start = {}
    moves = []
    constructor(data) {
        this.fillMatrix()
        this.launchBot()
        this.findMiddle()
    }

    findMiddle() {
        for (let i = 0; i < this.moves[0].length; i++) {
            let cache;
            for (let j = 0; j < this.moves.length; j++) {
                if (!cache)
                    cache = this.moves[j][i]
                else if (cache.y === this.moves[j][i].y && cache.x === this.moves[j][i].x)
                    return i + 1
                else
                    continue
            }
        }
    }

    launchBot() {
        const entryPoints = this.getEntryPoints()
        console.log({ entryPoints })
        for (const entryPoint of entryPoints) {
            let P = entryPoint
            const move = []
            let sign;
            while (1) {
                sign = this.M[P.y][P.x]
                move.push({ ...P, sign })
                if (["S", "."].includes(sign))
                    break;
                P = D[sign](P);

            }
            this.moves.push(move);
        }
    }

    getEntryPoints() {
        const entryPoints = []
        const directions = [
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0],
        ]
        for (const dir of directions) {
            const dy = this.start.y + dir[0]
            const dx = this.start.x + dir[1]
            const sign = this.M[dy][dx]
            if (sign && sign !== "." && this.canStart(sign, dir)) {
                entryPoints.push({
                    y: dy,
                    x: dx,
                    ly: this.start.y,
                    lx: this.start.x,
                    sign
                })
            }
        }

        return entryPoints
    }
    /*
    ..F7.
    .FJ|.
    SJ.L7
    |F--J
    LJ...
     */

    canStart(sign, dir) {
        const [y, x] = dir
        switch (sign) {
            case "7":
                if (y > 0 || x < 0)
                    return false;
            case "F":
                if (x > 0 || y > 0)
                    return false;
            case "J":
                if (x < 0 || y < 0)
                    return false;
            case "L":
                if (x > 0 || y < 0)
                    return false;
            case "-":
                if (y !== 0 && x)
                    return false;
            case "|":
                if (x !== 0 && y)
                    return false;
            default:
                return true
        }
    }

    fillMatrix() {
        this.M = data.map((line, y) => {
            const x = line.indexOf("S")
            if (x > -1) {
                this.start = { y, x }
            }

            return line.split('')
        })
    }
}

const m = new Matrix(data)
//console.log(m.moves)
console.log(m.findMiddle())