import { fetchData } from "../utils.js";

const file = 'day5.txt'
const data = await fetchData(file)
    .then(data => data.split('\n\n'))
    .catch((error) => console.log(error));

if (!data) {
    console.log("[ERROR]: %s is empty.", file);
    process.exit();
}

class Seeds {
    data = []
    constructor(line) {
        this.getData(line)
    }

    getData(line) {
        const [_, data] = line.split(":")
        this.data = data.split(" ")
            .filter(el => el)
            .map(el => parseInt(el))
    }
}

class Converter {
    maps = []
    name;
    constructor(block) {
        this.getData(block)
    }

    getData(block) {
        const [_, data] = block.split(":")
        this.name = _.split(" ")[0]
        const blockSplitted = data.trim().split("\n")
        this.maps = blockSplitted.map((n, i) => {
            const [destStart, srcStart, length] = n.split(" ").map(el => parseInt(el))
            return {
                destStart,
                srcStart,
                length
            }
        })
    }

    convert(num) {
        const n = num
        for (let i = 0; i < this.maps.length; i++) {
            const el = this.maps[i];

            const { destStart, srcStart, length } = el;
            if ((num >= srcStart && num < srcStart + length)) {
                num += (destStart - srcStart)
                return num
            }
        }
        return num
    }
}


let [_, ...convertData] = data
const seeds = new Seeds(_)
const converters = [];
for (let i = 0; i < convertData.length; i++) {
    const element = convertData[i];
    converters.push(new Converter(element))
}

const seedsConverted = seeds.data.map(el => {
    let n = el;
    converters.forEach(element => n = element.convert(n))
    return n
})
console.log(seedsConverted.sort((a, b) => a - b)[0])
