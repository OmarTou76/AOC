import { fetchData } from "../utils.js";

const file = 'day5.txt'
const data = await fetchData(file)
    .then(data => data.split('\n\n'))
    .catch((error) => console.log(error));

if (!data) {
    console.log("[ERROR]: %s is empty.", file);
    process.exit();
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

class Seeds {
    data = []
    converters = [];
    result;
    constructor(file) {
        let [seeds, ...convertData] = file
        this.getConverter(convertData)
        this.getData(seeds)
    }

    getConverter(convertData) {
        for (let i = 0; i < convertData.length; i++) {
            const element = convertData[i];
            this.converters.push(new Converter(element))
        }
    }

    getData(line) {
        let [_, data] = line.split(":")
        data = data.split(" ")
            .filter(el => el)
            .map(el => parseInt(el))
        for (let i = 0; i < data.length; i += 2) {
            const element = data[i];
            for (let j = element; j < element + data[i + 1]; j++) {
                let n = j;
                this.converters.forEach(el => n = el.convert(n))
                if (!this.result || n < this.result)
                    this.result = n
            }
        }
    }
}



console.time('Execution Time');

const seeds = new Seeds(data)

console.log(seeds.result)
console.timeEnd('Execution Time');