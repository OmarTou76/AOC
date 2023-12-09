import { fetchData } from "../utils.js";

const file = 'day2.txt'
const data = await fetchData(file)
    .then((data) => data.split('\n'))
    .catch(err => console.log(err));

if (!data) {
    console.log("[ERROR]: %s is empty.", file);
    process.exit();
}

const MAX = { red: 12, green: 13, blue: 14 }

function serializeData(data) {

    let serializedData = []

    for (let i = 0; i < data.length; i++) {
        let [game, line] = data[i].split(':');
        const id = parseInt(game.split(' ')[1]);
        line = line.split(';')
        first: for (let j = 0; j < line.length; j++) {
            const part = line[j].split(', ');
            for (let j = 0; j < part.length; j++) {
                const el = part[j];
                let [quantity, color] = el.trim().split(' ')
                quantity = parseInt(quantity)
                if (quantity > MAX[color]) {
                    if (serializedData.indexOf(id) > -1) {
                        serializedData = serializedData.filter((el) => el !== id)
                    }
                    break first;
                } else {
                    if (serializedData.indexOf(id) === -1)
                        serializedData.push(id);
                }
            }
        }
    }

    return serializedData
}
let serializedData = serializeData(data)


console.log(serializedData.reduce((prev, curr) => curr += prev, 0))
