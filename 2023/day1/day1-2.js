import { fetchData } from "../utils.js";

const file = 'day1/day1.txt'
const data = await fetchData(file);

if (!data) {
    console.log("[ERROR]: %s doesn't exists", file);
    process.exit();
}

const isNumber = (c) => c >= '0' && c <= '9'

const values = {
    "zero": 0,
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
}

const extractDigit = (line) => {
    let n = 0;
    let i = 0;
    firstLoop: while (i < line.length) {
        if (isNumber(line[i])) {
            n = parseInt(line[i]) * 10;
            break;
        }
        const sub = line.substring(i);
        for (const key in values) {
            if (sub.startsWith(key)) {
                n = values[key] * 10;
                break firstLoop;
            }
        }
        i++;
    }
    i = line.length;
    secondLoop: while (i >= 0) {
        if (isNumber(line[i])) {
            n += parseInt(line[i]);
            break;
        }
        const sub = line.substring(i);
        for (const key in values) {
            if (sub.startsWith(key)) {
                n += values[key];
                break secondLoop;
            }
        }
        i--;
    }
    return n;
}


const text = data.split('\n');

let i = 0;

let result = 0;

for (let i = 0; i < text.length; i++) {
    const element = text[i];
    result += extractDigit(element);
}

console.log(result);
