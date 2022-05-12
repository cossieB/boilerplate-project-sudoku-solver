const chai = require('chai');
const { test } = require('mocha');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver;

suite('UnitTests', () => {
    test('Valid puzzle', function(done) {
        const input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
        const validate = Solver.validate(input)
        assert.isArray(validate)
        assert.equal(validate.length, 1)
        assert.isTrue(validate[0])
        done()
    })
    test('Invalid characters', function(done) {
        const input = 'd.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
        const validate = Solver.validate(input)
        assert.isArray(validate)
        assert.equal(validate.length, 2)
        assert.isFalse(validate[0])
        assert.equal(validate[1], 'Invalid characters in puzzle')
        done()
    })
    test('Invalid length 81 characters', function(done) {
        const input = '1945....4.37.4.3..6..'
        const validate = Solver.validate(input)
        assert.isArray(validate)
        assert.equal(validate.length, 2)
        assert.isFalse(validate[0])
        assert.equal(validate[1], 'Expected puzzle to be 81 characters long')
        done()
    })
    test('valid row placement', function(done) {
        const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
        const value = '7'
        const cellNumber = 0;
        const puzzle = new Solver(input)
        const checkResult = puzzle.check(cellNumber, value)
        assert.isArray(checkResult)
        assert.notInclude(checkResult, 'row')
        done()
    })
    test('invalid row placement', function(done) {
        const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
        const value = '9'
        const cellNumber = 0;
        const puzzle = new Solver(input)
        const checkResult = puzzle.check(cellNumber, value)
        assert.isArray(checkResult)
        assert.include(checkResult, 'row')
        done()
    })
    test('valid column placement', function(done) {
        const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
        const value = '2'
        const cellNumber = 0;
        const puzzle = new Solver(input)
        const checkResult = puzzle.check(cellNumber, value)
        assert.isArray(checkResult)
        assert.notInclude(checkResult, 'column')
        done()
    })
    test('invalid column placement', function(done) {
        const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
        const value = '1'
        const cellNumber = 0;
        const puzzle = new Solver(input)
        const checkResult = puzzle.check(cellNumber, value)
        assert.isArray(checkResult)
        assert.include(checkResult, 'column')
        done()
    })
    test('valid region placement', function(done) {
        const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
        const value = '1'
        const cellNumber = 0;
        const puzzle = new Solver(input)
        const checkResult = puzzle.check(cellNumber, value)
        assert.isArray(checkResult)
        assert.notInclude(checkResult, 'region')
        done()
    })
    test('invalid region placement', function(done) {
        const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
        const value = '5'
        const cellNumber = 0;
        const puzzle = new Solver(input)
        const checkResult = puzzle.check(cellNumber, value)
        assert.isArray(checkResult)
        assert.include(checkResult, 'region')
        done()
    })
    test('Valid solver', function(done) {
        const input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
        const solution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
        const puzzle = new Solver(input)
        const solved = puzzle.solve()
        assert.isString(solved)
        assert.equal(solved, solution)
        done()
    })
    test('invalid solver', function(done) {
        const input = '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
        const puzzle = new Solver(input)
        assert.throws(puzzle.solve)
        done()
    })
    test('expected solution', function(done) {
        const input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
        const solution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
        const puzzle = new Solver(input)
        const solved = puzzle.solve()
        assert.isString(solved)
        assert.equal(solved, solution)
        done()
    })
});
