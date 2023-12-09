import { fetchData } from "../utils.js";

const file = 'day6.txt'
const data = await fetchData(file)
    .then((data) => data.split('\n'))
    .catch(err => console.log(err));

if (!data) {
    console.log("[ERROR]: %s is empty.", file);
    process.exit();
}

class Stats {
    stats = []
    result = []
    constructor(file) {
        this.getStats(file)
    }

    getStats(file) {
        file.forEach(line => {
            const [label, data] = line.split(":")
            data.trim()
                .split(" ")
                .filter(el => el)
                .forEach((el, i) => {
                    const section = { [label]: parseInt(el) }
                    if (this.stats[i]) {
                        this.stats[i] = {
                            ...this.stats[i],
                            ...section
                        }
                    } else {
                        this.stats.push({ ...section })
                    }
                })
        })
    }

    getResult() {


        const res = []

        this.stats.forEach(({ Time, Distance }) => {
            let over = 0;
            for (let i = 1; i < Time; i++) {
                const dist = i * (Time - i)
                if (dist > Distance)
                    over++;
            }
            res.push(over);
        })
        console.log({ res })
        return res.reduce((prev, curr) => curr *= prev)
    }

}

const stats = new Stats(data)
console.log(stats.getResult())


