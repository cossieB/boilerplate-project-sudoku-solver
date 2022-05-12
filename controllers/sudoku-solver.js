class Sudoku {

    constructor(puzzleString) {
        const validation = Sudoku.validate(puzzleString)
        if (!validation[0]) throw new Error(validation[1])
        this.puzzleString = puzzleString
        this.array = this.getArray()
    }
    static validate(str) {
        if (str.length != 81) return [false, 'Expected puzzle to be 81 characters long']
        for (let letter of str) {
            if (!/[1-9]|\./.test(letter)) return [false, 'Invalid characters in puzzle']
        }
        return [true]
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
    check(cellNumber, value) {
        const cell = this.array.find(item => item.cellNumber === cellNumber)
        const filteredArray = this.array.filter(item => item.cellNumber != cellNumber)
        const checkColumn = filteredArray.filter(item => item.column == cell.column).every(item => item.value != value)
        const checkRow = filteredArray.filter(item => item.row == cell.row).every(item => item.value != value)
        const checkRegion = filteredArray.filter(item => item.region == cell.region).every(item => item.value != value)

        let arr = []
        !checkColumn && arr.push('column')
        !checkRow && arr.push('row')
        !checkRegion && arr.push('region')

        return arr
    }
    solve() {
        const blanks = this.array.filter(item => !item.frozen)
        let position = 0;
        let direction = 1
        while (true) {
            let cell = blanks[position];
            let result = this.placeNumber(cell.cellNumber, direction)
            direction = result === '.' ? -1 : 1
            cell.value = result
            position += direction;
            if (position < 0 || position >= blanks.length) break
        }
        let solution = ''
        this.array.forEach(item => {
            solution += item.value
        })
        if ( solution.includes('.') ) throw new Error('Puzzle cannot be solved')
        return solution
    }
}

module.exports = Sudoku;
