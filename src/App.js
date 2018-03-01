import React, {Component} from 'react';
import {generateShips} from './utils/generateShips';
import {Popup} from './Popup/Popup';
import './App.css';

class App extends Component {
    constructor() {
        super();

        this.state = this.generateInitialState();
    };

    generateInitialState = () => {
        this.shipDescription = ['4l', 4, 1, 1];
        const ships = generateShips(this.shipDescription);
        const cells = this.getCells(ships, []);
        const shipCounter = this.shipDescription.length;

        return {
            ships,
            cells,
            shipCounter,
            misses: []
        };
    };

    getCells = (ships, misses) => {
        const cells = [];

        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                const id = `${row}${col}`;
                const ship = ships.find(currentShip => {
                    return currentShip.locations.includes(id);
                });

                cells.push({id, ship, status: this.getStatus(id, ship, misses)});
            }
        }

        return cells;
    };

    getStatus = (id, ship, misses) => {
        if (ship) {
            if (ship.sunk) {
                return 'sunk';
            }
            const index = ship.locations.findIndex(location => location === id);

            return ship.hits[index] ? 'hit' : 'clean';
        }

        if (misses.includes(id)) {
            return 'miss';
        }

        return 'clean';
    };

    handleClick = (event) => {
        const {id} = event.target;
        this.setState(({cells, ships, misses, shipCounter}) => {
            const cell = cells.find(cell => cell.id === id);
            const isSunk = ship => {
                return ship.hits.filter(hit => hit).length === ship.locations.length;
            };

            if (cell.ship) {
                const prevSunk = isSunk(cell.ship);
                const index = cell.ship.locations.findIndex(location => location === id);

                cell.ship.hits[index] = true;
                cell.ship.sunk = isSunk(cell.ship);

                if (prevSunk !== cell.ship.sunk) {
                    const newCounter = shipCounter - 1;

                    return {cells: this.getCells(ships, misses),  shipCounter: newCounter};
                }
            } else {
                misses.push(id);
            }

            return {cells: this.getCells(ships, misses)};
        });
    };

    handleNewGame = () => {
        this.setState(this.generateInitialState());
    };

    render() {
        const cells = this.state.cells.map(cell => (
            <div
                key={cell.id}
                className={`cell ${cell.status}`}
                id={cell.id}
                onClick={this.handleClick}
            />
        ));

        return (
            <div className="field">
                {cells}
                {Boolean(this.state.shipCounter) || <Popup onClick={this.handleNewGame}/>}
            </div>
        );
    }
}

export default App;
