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
    stats = {}
    result = []
    constructor(file) {
        this.getStats(file)
    }

    getStats(file) {
        file.forEach(line => {
            const [label, data] = line.split(":")
            const nb = data.trim()
                .split(" ")
                .filter(el => el)
                .join("")
                .split(" ")

            this.stats[label] = parseInt(nb)
        })
    }


    getResult() {
        const { Time, Distance } = this.stats
        let over = 0;
        for (let i = 1; i < Time; i++) {
            const dist = i * (Time - i)
            if (dist > Distance)
                over++;
        }
        return over
    }

}

const stats = new Stats(data)
console.log(stats.getResult())


