import { fetchData } from "../utils.js";

const file = 'day3/day3.txt'
const data = await fetchData(file);

if (!data) {
    console.log("[ERROR]: %s doesn't exists", file);
    process.exit();
}


let lines = data.split("\n");

const isNumber = (c) => c >= '0' && c <= '9'

function createArr2D(lines) {
    const arr2D = [];

    for (let x = 0; x < lines.length; x++) {
        const line = lines[x]
        const newLine = [];
        for (let y = 0; y < line.length; y++) {
            if (!isNumber(line[y]))
                newLine.push(line[y])
            else {
                newLine.push(parseInt(line[y]));
            }
        }
        arr2D.push(newLine);
    }

    return arr2D;
}


function isValidSign(sign) {
    if (!isNumber(sign) && sign != '.')
        return true;
    return false;
}

function checkNeighbors(lines, x, y) {
    const neighbors = [
        [-1, 0],
        [1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [-1, -1],
        [-1, 1],
        [1, -1],
    ]

    for (const neighbor of neighbors) {
        const dx = x + neighbor[0];
        const dy = y + neighbor[1];
        if ((dx >= 0 && dx < lines[0].length) && (dy >= 0 && dy < lines[0].length) && (isValidSign(lines[dx][dy]))) {
            return { sign: lines[dx][dy], x: dx, y: dy };
        }
    }
    return null;
}

function calculateSum(lines) {
    let visited = []
    for (let x = 0; x < lines.length; x++) {
        const line = lines[x]
        for (let y = 0; y < line.length; y++) {
            let nb = ''
            if (isNumber(line[y])) {
                let sign = null;
                while (isNumber(line[y])) {
                    if (!sign)
                        sign = checkNeighbors(lines, x, y);
                    nb += line[y];
                    y++;
                }
                if (sign) {
                    const v = parseInt(nb)
                    if (sign.sign === '*') {
                        const adjacent = visited.find((element) => element.x == sign.x && element.y == sign.y)
                        if (adjacent) {
                            adjacent.value.push(v);
                        } else
                            visited.push({ ...sign, value: [v] });
                    }
                }
            }

        }
    }
    let result = 0;

    visited.forEach(e => {
        if (e.value.length == 2)
            result += (e.value[0] * e.value[1])
    })

    return result;
}
lines = createArr2D(lines);
console.log(calculateSum(lines));