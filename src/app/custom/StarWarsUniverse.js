import Starship from "./Starship";

export default class StarWarsUniverse {
    constructor() {
        this.starships = [];
    }

    async init() {
        await this._getStarshipCount()
        await this._createStarships()
        return this.theBestStarship;
    }

    async _getStarshipCount() {
        const res = await fetch('https://swapi.dev/api/starships/')
        const { count } = await res.json();
        return count;
    }

    async _createStarships() {
        for (let i = 0; i < 76; i++) { //id 75 is assigned to the last starship from API 
            const response = await fetch(`https://swapi.dev/api/starships/${i}`);

            if (!response.ok) {
                continue;
            }

            const data = await response.json();
            if(this._validateData(data)){          
                const starship = new Starship(data.name, data.consumables, data.passengers)
                this.starships.push(starship);
            }
        }
    }

    get theBestStarship(){
        let bestShip;
        let maxDays = 0;
        for (const ship of this.starships) {
            if(ship.maxDaysInSpace > maxDays){
                maxDays = ship.maxDaysInSpace;
                bestShip = ship;
            }
        }
        return bestShip;
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

