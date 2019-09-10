'use strict';

const expect = require('chai').expect;
const { generateNextPoint } = require('../next-point-generator');
const constants = require('../constants');

describe('NextPointGenerator tests', () => {
    const startPoint = { x: 2, y: 3 }

    describe('generateNextPoint', () => {
        it('return null when direction is undefined', () => {
            expect(generateNextPoint(startPoint)).to.equal(null)
        })

        it('return null when direction is unsupproted', () => {
            expect(generateNextPoint(startPoint, "unsupported")).to.
                equal(null)
        })

        it('return correct point when direction is LEFT', () => {
            expect(generateNextPoint(startPoint, constants.LEFT)).to.deep.
                equal({ x: startPoint.x - 1, y: startPoint.y })
        })

        it('return correct point when direction is RIGHT', () => {
            expect(generateNextPoint(startPoint, constants.RIGHT)).to.deep.
                equal({ x: startPoint.x + 1, y: startPoint.y })
        })

        it('return correct point when direction is UP', () => {
            expect(generateNextPoint(startPoint, constants.UP)).to.deep.
                equal({ x: startPoint.x, y: startPoint.y - 1 })
        })

        it('return correct point when direction is DOWN', () => {
            expect(generateNextPoint(startPoint, constants.DOWN)).to.deep.
                equal({ x: startPoint.x, y: startPoint.y + 1 })
        })

    })
})