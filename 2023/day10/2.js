import { fetchData } from "../utils.js";

const file = 'day10.txt'
const data = await fetchData(file)
    .then((data) => data.split('\n'))
    .catch(err => console.log(err));

if (!data) {
    console.log("[ERROR]: %s is empty.", file);
    process.exit();
}

const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
]

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
    loop
    positions = []
    outOfBands = []
    count;
    constructor(data) {
        this.fillMatrix()
        this.launchBot()
        this.loop = Array(this.M.length).fill(null).map(() => Array(this.M[0].length).fill('.'))
        this.fillLoop()
        this.findInsideLoop()
        this.positions.forEach(e => this.loop[e[0]][e[1]] = "I")
        this.count = this.positions.length
    }

    findInsideLoop() {
        let id = 0
        for (let y = 1; y < this.loop.length - 1; y++) {
            const line = this.loop[y]
            for (let x = 1; x < line.length - 1; x++) {
                if (line[x] === ".") {
                    this.getTile(y, x, ++id)
                }
            }
        }
        this.positions = this.positions.filter(p => this.outOfBands.indexOf(p[2]) === -1)
    }

    getTile(y, x, id) {
        let savedPosition = this.positions.find(p => p[0] === y && p[1] === x)
        if (savedPosition)
            return;
        this.positions.push([y, x, id])
        for (const dir of directions) {
            const dy = y + dir[0]
            const dx = x + dir[1]
            const element = this.loop?.[dy]?.[dx]
            savedPosition = this.positions.find(p => p[0] === dy && p[1] === dx)
            if (element && element === "." && !savedPosition) {
                this.getTile(dy, dx, id)
            } else if (!element) {
                this.outOfBands.push(id)
                return;
            }
        }
    }

    fillLoop() {
        this.moves[0].forEach(({ y, x, sign }) => this.loop[y][x] = sign)
        this.moves[0].sort((a, b) => a.y - b.y).forEach(({ y, x, sign }) => console.log({ y, x, sign }))
    }


    launchBot() {
        const entryPoints = this.getEntryPoints()
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

        for (const dir of directions) {
            const dy = this.start.y + dir[0]
            const dx = this.start.x + dir[1]
            const sign = this.M?.[dy]?.[dx]
            if (sign && sign !== "." && this.canStart(sign, dir)) {
                console.log({ dy, dx })
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
const { loop } = m
// PREND EN COMPTE TOUT LES CREUX ET NON SEULEMENT CEUX DANS LESQUELS PASSENT LE CHEMIN.
/* for (let y = 0; y < loop.length; y++) {
    const line = loop[y]
    for (let x = 0; x < line.length; x++) {
        if (line[x] === 'I') {
            process.stdout.write("\x1b[35m" + line[x] + "\x1b[0m")
        }
        else if (line[x] === 'S')
            process.stdout.write("\x1b[31m" + line[x] + "\x1b[0m")
        else
            process.stdout.write(line[x])

    }
    process.stdout.write("\n")

}
console.log(m.count) */