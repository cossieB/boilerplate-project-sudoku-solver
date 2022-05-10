class Sudoku {
    puzzleString
    array

    constructor(puzzleString) {
        if (!this.#validate(puzzleString)) throw new Error('Invalid puzzle')
        this.puzzleString = puzzleString
        this.array = this.getArray()
    }
    #validate(str) {
        if (str.length != 81) return false
        for (let letter of str) {
            if (!/[1-9]|\./.test(letter)) return false
        }
        return true
    }
    getArray() {
        let arr = []
        for (let i = 0; i < 81; i++) {
            const value = this.puzzleString[i]
            const row = Math.floor(i / 9)
            const column = i % 9
            let region

            if (row < 3 && column < 3) region = 0
            else if (row < 3 && column < 6) region = 1
            else if (row < 3 && column < 9) region = 2
            else if (row < 6 && column < 3) region = 3
            else if (row < 6 && column < 6) region = 4
            else if (row < 6 && column < 9) region = 5
            else if (row < 9 && column < 3) region = 6
            else if (row < 9 && column < 6) region = 7
            else region = 8

            arr.push({ value, row, column, region, frozen: value !== '.', cellNumber: i })
        }
        return arr
    }
    placeNumber(cellNumber, direction ) {

        const cell = this.array[cellNumber]
        let num;

        if (direction == 1) {
            num = 1
        }
        else {
            num = Number(cell.value) + 1
        }

        while (num <= 9) {
            const checkColumn = this.array.filter(item => item.column == cell.column).every(item => item.value != String(num))
            const checkRow = this.array.filter(item => item.row == cell.row).every(item => item.value != String(num))
            const checkRegion = this.array.filter(item => item.region == cell.region).every(item => item.value != String(num))

            if (checkColumn && checkRegion && checkRow) return String(num);
            num++
        }
        return '.'
    }
    solve() {
        const blanks = this.array.filter(item => !item.frozen)
        let position = 0;
        let direction = 1
        while (true) {
            let cell = blanks[position];
            let result = this.placeNumber(cell.cellNumber, direction)
            direction = 1
            // console.log(position, direction)
            if (result != '.') {
                cell.value = result;
            }
            if (result == '.') {
                direction = -1;
                cell.value = '.'
            }
            position += direction;
            if (position < 0 || position >= blanks.length) break
        }
    }
}

const puzzle = new Sudoku('..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1')

puzzle.solve()   

const arr = puzzle.array
let str = ''
arr.forEach(item => {
    str += item.value
})

console.log(str)



module.exports = Sudoku;