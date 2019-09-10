'use strict';

const constants = require('./constants');

class Player {
    constructor(id, username, startCoordinates, color, generateNextPoint) {
        this.id = id;
        this.username = username;
        this.currentDirection = null;
        this.color = color;
        this.generateNextPoint = generateNextPoint;
        this.pathPoints = [startCoordinates];
        this.newPathPoints = [startCoordinates];
        this.pathLines = [];
    }

    setDirection(direction) {
        if (direction.key == constants.LEFT || direction.key == constants.RIGHT ||
            direction.key == constants.UP || direction.key == constants.DOWN) {
            this.currentDirection = direction.key;
        }
    }

    getNextPoint() {
        if (this.currentDirection == null) {
            return null;
        }

        const lastPoint = this.pathPoints[this.pathPoints.length - 1];
        const nextPoint = this.generateNextPoint(lastPoint, this.currentDirection);

        return nextPoint;
    }

    addPoint(point) {
        const lastPoint = this.pathPoints[this.pathPoints.length - 1];
        this.updatePathLines(point, lastPoint);

        this.pathPoints.push(point);
        this.newPathPoints.push(point);
    }

    updatePathLines(pointToAdd, lastPoint) {
        let linesUpdated = false;
        if (this.pathLines.length != 0) {
            let lastLine = this.pathLines[this.pathLines.length - 1];
            if (lastLine.start.x == lastLine.end.x) {
                if (pointToAdd.x == lastLine.end.x) {
                    lastLine.end = pointToAdd;
                    linesUpdated = true;
                }
            }
            else {
                if (pointToAdd.y == lastLine.end.y) {
                    lastLine.end = pointToAdd;
                    linesUpdated = true;
                }
            }
        }

        if (!linesUpdated) {
            this.pathLines.push({ start: lastPoint, end: pointToAdd });
        }
    }

    createUpdateData() {
        let pointsToReturn = this.newPathPoints;
        this.newPathPoints = [pointsToReturn[pointsToReturn.length - 1]];
        return {
            id: this.id,
            points: pointsToReturn,
            color: this.color
        };
    }

    createStateData() {
        let points = [];

        if (this.pathLines.length > 0) {
            points.push(this.pathLines[0].start);
            points.push(this.pathLines[0].end);

            if (this.pathLines.length > 1) {
                for (let i = 1; i < this.pathLines.length; i++) {
                    points.push(this.pathLines[i].end);
                }
            }
        }
        else {
            points.push(this.pathPoints[0]);
        }

        return {
            id: this.id,
            username: this.username,
            points: points,
            color: this.color
        };
    }
}

module.exports = Player;