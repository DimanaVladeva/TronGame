'use strict';

const constants = require('./constants');

const generateNextPoint = (lastPoint, direction) => {
    let pointToAdd;
    switch (direction) {
        case constants.LEFT:
            pointToAdd = { x: lastPoint.x - 1, y: lastPoint.y };
            break;
        case constants.RIGHT:
            pointToAdd = { x: lastPoint.x + 1, y: lastPoint.y };
            break;
        case constants.UP:
            pointToAdd = { x: lastPoint.x, y: lastPoint.y - 1 };
            break;
        case constants.DOWN:
            pointToAdd = { x: lastPoint.x, y: lastPoint.y + 1 };
            break;
        default:
            console.log('unsuported direction: ' + direction);
            return null;
    }

    return pointToAdd;
}

module.exports = {
    generateNextPoint
}