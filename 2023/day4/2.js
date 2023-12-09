import { fetchData } from "../utils.js";

const file = 'day4.txt'
const data = await fetchData(file)
    .then((data) => data.split('\n'))
    .catch((error) => console.log(error));

if (!data) {
    console.log("[ERROR]: %s is empty.", file);
    process.exit();
}


const instances = {}

function parseList(list) {
    return list.split(" ").reduce((prev, curr) => {
        if (curr !== '')
            prev.push(parseInt(curr))
        return prev;
    }, []);
}

function addInstance(index, isCopy) {
    if (!instances.hasOwnProperty(index))
        instances[index] = {
            original: 0,
            copy: 0
        };
    if (!isCopy) {
        instances[index].original++;
    } else {
        instances[index].copy++
    }
}

function appendInstance(list1, list2, index) {
    let nextIndex = index;
    list1.forEach(el => {
        if (list2.indexOf(el) > -1) {
            nextIndex++
            addInstance(nextIndex, true)
        }
    })
}

function process(line) {
    let [game, list] = line.split(':')
    let index = game.split(" ")
    index = parseInt(index[index.length - 1])
    addInstance(index, false)
    list = list.split("|")
    const list1 = parseList(list[0])
    const list2 = parseList(list[1])
    appendInstance(list1, list2, index)
    const { copy } = instances[index]
    for (let i = 0; i < copy; i++) {
        appendInstance(list1, list2, index)
    }

}


for (let i = 0; i < data.length; i++) {
    const element = data[i];
    process(element)
    console.log(instances)
}

let result = 0;

for (const instance in instances) {
    result += instances[instance].original + instances[instance].copy
}
console.log(result)