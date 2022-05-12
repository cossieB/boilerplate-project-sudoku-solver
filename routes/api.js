'use strict';

const Sudoku = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

    // let solver = new SudokuSolver();

    app.route('/api/check')
        .post((req, res) => {
            try {
                const {puzzle, coordinate, value} = req.body
                if (!coordinate || !value || !puzzle) throw new Error('Required field(s) missing')
                if (! /^[1-9]$/.test(value)) throw new Error('Invalid value')
                if (! /^[A-I][1-9]$/i.test(coordinate)) throw new Error('Invalid coordinate')

                const letterToNumberMap = {
                    A: 0,
                    B: 1,
                    C: 2,
                    D: 3,
                    E: 4,
                    F: 5,
                    G: 6,
                    H: 7,
                    I: 8
                }
                const row = letterToNumberMap[coordinate[0].toUpperCase()]
                const column = Number(coordinate[1] - 1)
                const cellNumber = row * 9 + column
                
                let sudoku = new Sudoku(puzzle)
                const conflict = sudoku.check(cellNumber, value)
                
                if (conflict.length == 0) return res.json({valid: true})
                else return res.json({valid: false, conflict})

            }
            catch(e) {
                console.log(e)
                res.json({error: e.message})
            }
        });

    app.route('/api/solve')
        .post((req, res) => {
            try {
                if (!req.body.puzzle) throw new Error('Required field missing')
                let puzzle = new Sudoku(req.body.puzzle)
                const solution = puzzle.solve()
                res.json({solution})
            }
            catch(e) {
                res.json({error: e.message})
            }
        });
};
