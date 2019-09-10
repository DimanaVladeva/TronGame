'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const Player = require('../player')
const constants = require('../constants')

describe('Player tests', () => {
    const userID = 1;
    const username = 'name';
    const startCoordinates = { x: 1, y: 1 };
    const color = 'red';

    let sandbox;
    let player;
    let generateNextPointStub;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        generateNextPointStub = sandbox.stub();
        player = new Player(userID, username, startCoordinates, color, generateNextPointStub);
    })

    afterEach(() => {
        sandbox.restore();
    })

    describe('getNextPoint', () => {
        context('when direction is not set', () => {
            it('returns null', () => {
                expect(player.getNextPoint()).to.equal(null)
            })
        })

        context('when direction is set', () => {
            const direction = { key: constants.UP };
            const expectedPoint = { x: 1, y: 0 };

            beforeEach(() => {
                player.setDirection(direction);
                generateNextPointStub.returns(expectedPoint);
            })

            it('returns point', () => {
                expect(player.getNextPoint()).to.deep.equal(expectedPoint);
                sinon.assert.calledWith(generateNextPointStub, startCoordinates, direction.key);
            })
        })
    })

    describe('createUpdateData', () => {
        context('when path is only start point', () => {
            it('returns correct update data', () => {
                expect(player.createUpdateData()).to.
                    deep.equal({ id: userID, color: color, points: [startCoordinates] })
            })
        })

        context('when path contains lines', () => {
            const newPoint = { x: 1, y: 2 };
            beforeEach(() => {
                player.addPoint(newPoint);
            })

            it('returns correct update data', () => {
                expect(player.createUpdateData()).to.
                    deep.equal({ id: userID, color: color, points: [startCoordinates, newPoint] })
            })
        })
    })

    describe('createStateData', () => {
        context('when path is only start point', () => {
            it('returns correct state data', () => {
                expect(player.createStateData()).to.deep.
                    equal({ id: userID, username: username, color: color, points: [startCoordinates] })
            })
        })

        context('when path contains lines', () => {
            const newPoint = { x: 1, y: 2 };
            beforeEach(() => {
                player.addPoint(newPoint);
            })

            it('returns correct state data', () => {
                expect(player.createStateData()).to.deep.
                    equal({ id: userID, username: username, color: color, points: [startCoordinates, newPoint] })
            })
        })
    })
})
