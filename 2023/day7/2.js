import { fetchData } from "../utils.js";

const file = 'day7.txt'
const data = await fetchData(file)
    .then((data) => data.split('\n'))
    .catch(err => console.log(err));

if (!data) {
    console.log("[ERROR]: %s is empty.", file);
    process.exit();
}

const CARDS = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J']

class Hand {
    bid;
    cards;
    type;
    hand;
    constructor(line) {
        const [hand, bid] = line.split(" ")
        this.hand = hand
        this.bid = parseInt(bid)
        this.getCards()
        this.calculateType()
    }

    getCards() {
        this.cards = this.hand
            .split('')
            .reduce((acc, curr) => {
                if (!acc[curr])
                    acc[curr] = 0;
                acc[curr]++
                return acc;
            }, {})
    }

    calculateType() {
        let cards = Object.entries(this.cards).sort((a, b) => b[1] - a[1])
        const jokerIndex = cards.findIndex(card => card[0] === 'J')
        console.log({ jokerIndex })
        if (jokerIndex > 0) {
            cards[0][1] += cards[jokerIndex][1];
            cards.splice(jokerIndex, 1)
        } else if (jokerIndex === 0 && cards.length > 1) {
            cards[1][1] += cards[jokerIndex][1];
            cards.splice(jokerIndex, 1)
        }
        if (cards.length === 5)
            this.type = 0 // "High card"
        else if (cards.length == 4)
            this.type = 1 // "One Pair"
        else if (cards.length == 3) {
            if (cards[0][1] === 3)
                this.type = 3 // "Three of a kind"
            else
                this.type = 2 //  "Two pair"
        } else if (cards.length == 2) {
            if (cards[0][1] === 4)
                this.type = 5 //  "Four of a kind" 
            else
                this.type = 4 // "Full house"
        } else
            this.type = 6 // "Five of a kind"
    }
}


function getWinner(a, b) {
    const A = a.split("").map(c => CARDS.indexOf(c))
    const B = b.split("").map(c => CARDS.indexOf(c))
    for (let i = 0; i < A.length; i++) {
        if (A[i] === B[i])
            continue;
        else if (A[i] > B[i]) {
            return 'b';
        } else {
            return 'a';
        }
    }
    return "a"
}

class Game {
    hands = []
    constructor(data) {
        this.getHands(data)
        this.sortHands()
    }

    getHands(brutData) {
        brutData.forEach(line => {
            this.hands.push(new Hand(line))
        })
    }

    sortHands() {
        this.hands.sort((a, b) => {
            if (a.type < b.type) return -1
            else if (a.type > b.type) return 1
            else if (getWinner(a.hand, b.hand) === "b") return -1
            else if (getWinner(a.hand, b.hand) === "a") return 1
            else return 0
        })
    }

    getTotalWinnings() {
        const len = this.hands.length
        let multiplicator = 1
        let result = 0
        for (let i = 0; i < len; i++) {
            result += this.hands[i].bid * multiplicator
            multiplicator++;
        }
        return result
    }
}

const game = new Game(data)
console.log(game.hands)
console.log(game.getTotalWinnings())


