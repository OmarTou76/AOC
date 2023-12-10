import { fetchData } from "../utils.js";

const file = 'day8.txt'
const data = await fetchData(file)
    .then((data) => data.split('\n'))
    .catch(err => console.log(err));

if (!data) {
    console.log("[ERROR]: %s is empty.", file);
    process.exit();
}

class Solver {

    node = {}
    instructions;
    currentNode = [];
    count = 0

    founded;

    constructor(data) {
        const [instructions, ...rest] = data
        this.instructions = instructions.split('')
        this.formatData(rest.filter(el => el))
        this.getStartingNodes()
        this.founded = new Array(this.currentNode.length).fill(null)
    }

    getStartingNodes() {
        Object.keys(this.node).forEach(k => {
            if (k.endsWith("A"))
                this.currentNode.push(k)
        })
    }

    formatData(data) {
        data.forEach((line, i) => {
            const [key, values] = line.split(" = ")
            const [L, R] = values.split(/[\(\), ]/g).filter(el => el)
            this.node[key] = { L, R }
        })
    }

    proceed() {
        let isFound = -1
        while (isFound < 0) {
            isFound = this.executeInstructions()
        }

        return this.founded
    }

    find() {
        let commonNum = this.founded.sort((a, b) => b - a)[0]
        let copy = [...this.founded]
        let i = 0;

        while (i < copy.length) {
            while (copy[i] < commonNum) {
                copy[i] += this.founded[i]
            }
            console.log({ commonNum, copy, i })
            if (copy[i] > commonNum) {
                commonNum = copy[i]
                i = -1;
            }
            i++
        }
        return commonNum
    }

    executeInstructions() {
        for (let i = 0; i < this.instructions.length; i++) {
            const instruction = this.instructions[i];
            this.count++;
            this.currentNode = this.currentNode.map((n, i) => {
                if (this.node[n][instruction].endsWith('Z') && !this.founded[i]) {
                    this.founded[i] = this.count
                }
                return this.node[n][instruction]
            })
            if (this.founded.every(el => el))
                return this.count;
        }

        return -1
    }


}




// Fonction pour décomposer un nombre en facteurs premiers
function decomposerEnFacteursPremiers(nombre) {
    const facteursPremiers = [];
    let diviseur = 2;

    while (nombre > 1) {
        while (nombre % diviseur === 0) {
            facteursPremiers.push(diviseur);
            nombre /= diviseur;
        }
        diviseur++;
    }

    return facteursPremiers;
}

// Fonction pour calculer le PPCM de plusieurs nombres
function ppcmMultiple(chiffres) {
    const facteursCommuns = {};
    // Trouver les facteurs premiers de chaque nombre
    for (const chiffre of chiffres) {
        const facteurs = decomposerEnFacteursPremiers(chiffre);

        // Mettre à jour les occurrences maximales de chaque facteur
        const occurences = {};
        for (const facteur of facteurs) {
            occurences[facteur] = (occurences[facteur] || 0) + 1;
        }

        for (const [facteur, occurence] of Object.entries(occurences)) {
            if (!facteursCommuns[facteur] || occurence > facteursCommuns[facteur]) {
                facteursCommuns[facteur] = occurence;
            }
        }
    }

    // Calculer le PPCM en multipliant les facteurs premiers à leurs occurrences maximales
    let ppcm = 1;
    for (const [facteur, occurence] of Object.entries(facteursCommuns)) {
        ppcm *= Math.pow(parseInt(facteur), occurence);
    }

    return ppcm;
}

console.time('Execution time');
console.timeEnd('Execution time');
const node = new Solver(data);
console.log(ppcmMultiple(node.proceed()));
