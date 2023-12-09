import { fetchData } from "../utils.js";

const file = 'day4.txt'
const data = await fetchData(file)
    .then((data) => data.split('\n'))
    .catch((error) => console.log(error));

if (!data) {
    console.log("[ERROR]: %s is empty.", file);
    process.exit();
}

function parseList(list, deleteFirstElement) {

    if (deleteFirstElement)
        list = list.split(':')[1]

    list = list.split(" ")
    return list.reduce((prev, curr) => {
        if (curr !== '')
            prev.push(parseInt(curr))
        return prev;
    }, []);
}

function findOcc(line) {
    let [list1, list2] = line.split("|");
    let occ = 0;
    list1 = parseList(list1, true)
    list2 = parseList(list2, false)
    list1.forEach((element) => {
        if (list2.indexOf(element) > -1) {
            if (occ)
                occ *= 2;
            else
                occ = 1;
        }
    })
    return occ;
}

let sumOfOcc = 0;
for (let i = 0; i < data.length; i++) {
    const element = data[i];
    sumOfOcc += findOcc(element);
}

console.log({ sumOfOcc })
