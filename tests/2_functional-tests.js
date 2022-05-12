const chai = require("chai");
const chaiHttp = require('chai-http');
const res = require("express/lib/response");
const { test } = require("mocha");
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

    test('Solve valid puzzle', function(done) {
        chai
            .request(server)
            .post('/api/solve')
            .send({
                puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
            })
            .end((err, res) => {
                assert.isObject(res.body)
                assert.property(res.body, 'solution')
                done()
            })
    })
    test('Solve missing puzzle', function(done) {
        chai
            .request(server)
            .post('/api/solve')
            .send({puzzle: ''})
            .end((err, res) => {
                assert.isObject(res.body)
                assert.property(res.body, 'error')
                assert.propertyVal(res.body, 'error', 'Required field missing')
                done()
            })
    })
    test('Solve invalid characters puzzle', function(done) {
        chai
            .request(server)
            .post('/api/solve')
            .send({
                puzzle: 'Ad5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
            })
            .end((err, res) => {
                assert.isObject(res.body)    
                assert.property(res.body, 'error')
                assert.propertyVal(res.body, 'error', 'Invalid characters in puzzle')
                done()
            })
    })
    test('Solve invalid length puzzle', function(done) {
        chai
            .request(server)
            .post('/api/solve')
            .send({
                puzzle: '344334...5455'
            })
            .end((err, res) => {
                assert.isObject(res.body)
                assert.property(res.body, 'error')
                assert.propertyVal(res.body, 'error', 'Expected puzzle to be 81 characters long')
                done()
            })
    })
    test('Solve puzzle cant be solved', function(done) {
        chai
            .request(server)
            .post('/api/solve')
            .send({
                puzzle: '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
            })
            .end((err, res) => {
                assert.isObject(res.body)
                assert.property(res.body, 'error')
                assert.propertyVal(res.body, 'error', 'Puzzle cannot be solved')
                done()
            })
    })
    test('All fields', function(done) {
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: 'A1',
                value: 7
            })
            .end((err, res) => {
                assert.isObject(res.body)
                assert.deepEqual(res.body, {valid: true})
                done()
            })
    })
    test('Single placement conflict', function(done) {
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: 'A1',
                value: 6
            })
            .end((err, res) => {
                assert.isObject(res.body)
                assert.property(res.body, 'valid')
                assert.propertyVal(res.body, 'valid', false)
                assert.property(res.body, 'conflict')
                assert.isArray(res.body.conflict)
                assert.equal(res.body.conflict.length, 1)
                done()
            })
    })
    test('Multiple placement conflicts', function(done) {
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: 'A1',
                value: 9
            })
            .end((err, res) => {
                assert.isObject(res.body)
                assert.property(res.body, 'valid')
                assert.propertyVal(res.body, 'valid', false)
                assert.property(res.body, 'conflict')
                assert.isArray(res.body.conflict)
                assert.equal(res.body.conflict.length, 2)
                done()
            })
    })
    test('All placement conflicts', function(done) {
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: 'A1',
                value: 5
            })
            .end((err, res) => {
                assert.isObject(res.body)
                assert.property(res.body, 'valid')
                assert.propertyVal(res.body, 'valid', false)
                assert.property(res.body, 'conflict')
                assert.isArray(res.body.conflict)
                assert.equal(res.body.conflict.length, 3)
                done()
            })
    })
    test('Missing required fields', function(done) {
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
            })
            .end((err, res) => {
                assert.isObject(res.body)
                assert.deepEqual(res.body, {error: 'Required field(s) missing'})
                done()
            })
    })
    test('Invalid characters', function(done) {
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: 'd.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: 'A1',
                value: 5
            })
            .end((err, res) => {
                assert.isObject(res.body)
                assert.deepEqual(res.body, {error: 'Invalid characters in puzzle'})
                done()
            })
    })
    test('Incorrect length', function(done) {
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: '..62.7.37.4.3..6..',
                coordinate: 'A1',
                value: 5
            })
            .end((err, res) => {
                assert.isObject(res.body)
                assert.deepEqual(res.body, {error: 'Expected puzzle to be 81 characters long'})
                done()
            })
    })
    test('Iinvalid coordinate', function(done) {
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: 'A11',
                value: 5
            })
            .end((err, res) => {
                assert.isObject(res.body)
                assert.deepEqual(res.body, {error: 'Invalid coordinate'})
                done()
            })
    })
    test('Incorrect length', function(done) {
        chai
            .request(server)
            .post('/api/check')
            .send({
                puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: 'A1',
                value: 50
            })
            .end((err, res) => {
                assert.isObject(res.body)
                assert.deepEqual(res.body, {error: 'Invalid value'})
                done()
            })
    })

});

