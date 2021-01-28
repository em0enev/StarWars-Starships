import Starship from "./Starship";

export default class StarWarsUniverse {
    constructor() {
        this.starships = [];
    }

    async init() {
        await this._getStarshipCount()
        await this._createStarships()
        this.theBestStarship
    }

    async _getStarshipCount() {
        const res = await fetch('https://swapi.dev/api/starships/')
        const { count } = await res.json();
        return count;
    }

    async _createStarships() {
        const maxStarships = await this._getStarshipCount();
        let currentIndex = 0
        let starshipCount = 0;

        while (starshipCount < Number(maxStarships)) {
            const response = await fetch(`https://swapi.dev/api/starships/${currentIndex}`);

            if (!response.ok) {
                currentIndex++;
                continue;
            }

            starshipCount++;
            currentIndex++;

            const data = await response.json();
            if (this._validateData(data)) {
                const starship = new Starship(data.name, data.consumables, data.passengers)
                this.starships.push(starship);
            }
        }
    }

    get theBestStarship() {
        return this.starships.reduce((currentShip, candidate) => {
            if (currentShip.maxDaysInSpace > candidate.maxDaysInSpace) {
                return currentShip
            } else {
                return candidate
            }
        })
    }

    _validateData(ship) {
        if (typeof ship.consumables === undefined
            || typeof ship.consumables === null
            || ship.consumables === 'unknown') {
            return false;
        }

        if (typeof ship.passenger === undefined
            || typeof ship.passengers === null
            || ship.passengers === 'n/a'
            || ship.passengers === 'unknown'
            || ship.passengers === '0') {
            return false;
        }

        return true
    }
}

