import { fetchData } from "../utils.js";


const file = 'day1/day1.txt'
const data = await fetchData(file);

if (!data) {
    console.log("[ERROR]: %s doesn't exists", file);
    process.exit();
}

const isNumber = (c) => c >= '0' && c <= '9'

const getDigit = (line) => {
    let n = '';
    let i = 0;
    const l = line.split('')
    while (i < l.length) {
        if (isNumber(l[i])) {
            n += l[i];
            break;
        }
        i++;
    }
    i = l.length;
    while (i >= 0) {
        if (isNumber(l[i])) {
            n += l[i];
            break;
        }
        i--;
    }

    return parseInt(n);
}


const text = data.split('\n');

let i = 0;

let result = 0;

for (let i = 0; i < text.length; i++) {
    const element = text[i];
    result += getDigit(element);
}

console.log(result);
