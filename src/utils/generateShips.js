const DIRECTION = {
    VERTICAL: 'vertical',
    HORIZONTAL: 'horizontal'
};
const fieldSize = 10;

function generateDirection() {
    return getTrueOrFalse() ? DIRECTION.HORIZONTAL : DIRECTION.VERTICAL;
}

function generateShip(shipLength) {
    const ship = {locations: [], hits: []};
    const direction = generateDirection();

    if (typeof shipLength === 'string') {
        const preparedShipLength = Number(shipLength[0]);

        return generateLShip(preparedShipLength, ship, direction);
    }

    if (direction === DIRECTION.HORIZONTAL) {
        const row = Math.floor(Math.random() * (fieldSize));
        const col = Math.floor(Math.random() * (fieldSize - shipLength));

        for (let i = 0; i < shipLength; i++) {
            ship.locations.push(`${row}${col + i}`);
        }
    }

    if (direction === DIRECTION.VERTICAL) {
        const col = Math.floor(Math.random() * (fieldSize));
        const row = Math.floor(Math.random() * (fieldSize - shipLength));

        for (let i = 0; i < shipLength; i++) {
            ship.locations.push(`${row + i}${col}`);
        }
    }

    return ship;
}


export function generateShips(shipList) {
    const ships = [];

    shipList.forEach(description => {
        let ship;

        do {
            ship = generateShip(description);
        } while (isCollision(ship, ships));

        ships.push(ship);
    });

    return ships;
}

function isCollision(ship, existingShips) {
    if (existingShips.length === 0) {
        return false;
    }

    return existingShips.find(existingShip => {
        return existingShip.locations.find(existingLocation => {
            return getNearestLocations(existingLocation).find(location => {
                return ship.locations.includes(location);
            });
        });
    });
}

function getNearestLocations(location) {
    const [row, col] = location.split('');
    let locations = [];

    for (let x = -1; x < 2; x++) {
        for (let y = -1; y < 2; y++) {
            locations.push(`${Number(row) + x}${Number(col) + y}`);
        }
    }

    return locations;
}

function generateLShip(shipLength, ship, direction) {
    const body = getTrueOrFalse();
    const tail = getTrueOrFalse();

    if (direction === DIRECTION.HORIZONTAL) {
        const row = Math.floor(Math.random() * (fieldSize - 1));
        const col = Math.floor(Math.random() * (fieldSize - shipLength));

        for (let i = 0; i < shipLength; i++) {
            ship.locations.push(`${row + Number(body)}${col + i}`);
        }
        ship.locations.push(`${row + Number(!body)}${tail ? col : col + shipLength - 1}`);
    }

    if (direction === DIRECTION.VERTICAL) {
        const col = Math.floor(Math.random() * (fieldSize - 1));
        const row = Math.floor(Math.random() * (fieldSize - shipLength));

        for (let i = 0; i < shipLength; i++) {
            ship.locations.push(`${row + i}${col + Number(body)}`);
        }
        ship.locations.push(`${tail ? row : row + shipLength - 1}${col + Number(!body)}`);
    }

    return ship;
}

function getTrueOrFalse() {
    return Boolean(Math.floor(Math.random() * 2 - 1));
}
