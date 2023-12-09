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
            return true;
        }
    }
    return false;
}
function calculateSum(lines) {
    let result = 0;
    for (let x = 0; x < lines.length; x++) {
        const line = lines[x]
        for (let y = 0; y < line.length; y++) {
            let nb = ''
            if (isNumber(line[y])) {
                let hasNeighbor = false;
                while (isNumber(line[y])) {
                    if (!hasNeighbor)
                        hasNeighbor = checkNeighbors(lines, x, y);
                    nb += line[y];
                    y++;
                }
                if (hasNeighbor)
                    result += parseInt(nb);
            }

        }
    }
    return result;
}
lines = createArr2D(lines);
console.log(calculateSum(lines));
