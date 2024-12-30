class SudokuSolver {
  validate(puzzleString) {
    if (puzzleString.length !== 81) {
      throw new Error("Expected puzzle to be 81 characters long");
    }

    const regex = /^[0-9.]$/;
    for (let char of puzzleString) {
      if (!regex.test(char)) {
        throw new Error("Invalid characters in puzzle");
      }
    }

    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowIndex = row.charCodeAt() - 65;
    const columnIndex = Number(column) - 1;

    for (let i = 0; i < puzzleString.length; i++) {
      if (puzzleString[i] === ".") {
        continue;
      }

      const currentRowIndex = Math.floor(i / 9);
      const currentColumnIndex = i % 9;

      if (
        puzzleString[i] === `${value}` &&
        currentRowIndex === rowIndex &&
        currentColumnIndex !== columnIndex
      ) {
        return false;
      }
    }

    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const rowIndex = row.charCodeAt() - 65;
    const columnIndex = Number(column) - 1;

    for (let i = 0; i < puzzleString.length; i++) {
      if (puzzleString[i] === ".") {
        continue;
      }

      const currentRowIndex = Math.floor(i / 9);
      const currentColumnIndex = i % 9;

      if (
        puzzleString[i] === `${value}` &&
        currentColumnIndex === columnIndex &&
        currentRowIndex !== rowIndex
      ) {
        return false;
      }
    }

    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const rowIndex = row.charCodeAt() - 65;
    const columnIndex = Number(column) - 1;

    const horizontalPositionIndex = Math.floor(columnIndex / 3);
    const verticalPositionIndex = Math.floor(rowIndex / 3);

    const targetRegionIndex =
      verticalPositionIndex * 3 + horizontalPositionIndex;

    for (let i = 0; i < puzzleString.length; i++) {
      if (puzzleString[i] === ".") {
        continue;
      }

      const currentRowIndex = Math.floor(i / 9);
      const currentColumnIndex = i % 9;

      const currentHorizontalPositionIndex = Math.floor(currentColumnIndex / 3);
      const currentVerticalPositionIndex = Math.floor(currentRowIndex / 3);

      const currentRegionIndex =
        currentVerticalPositionIndex * 3 + currentHorizontalPositionIndex;

      if (
        (puzzleString[i] !== `${value}` &&
          currentRowIndex === rowIndex &&
          currentColumnIndex === columnIndex) ||
        (puzzleString[i] === `${value}` &&
          currentRegionIndex === targetRegionIndex &&
          (currentRowIndex !== rowIndex || currentColumnIndex !== columnIndex))
      ) {
        return false;
      }
    }

    return true;
  }

  checkPlacement(puzzleString, row, column, value) {
    this.validate(puzzleString);

    const errorsArray = [];

    const firstResult = this.checkRowPlacement(
      puzzleString,
      row,
      column,
      value
    );

    if (!firstResult) {
      errorsArray.push("row");
    }

    const secondResult = this.checkColPlacement(
      puzzleString,
      row,
      column,
      value
    );

    if (!secondResult) {
      errorsArray.push("column");
    }

    const thirdResult = this.checkRegionPlacement(
      puzzleString,
      row,
      column,
      value
    );

    if (!thirdResult) {
      errorsArray.push("region");
    }

    if (errorsArray.length > 0) {
      throw new Error(errorsArray);
    }

    return true;
  }

  testIfIsInSolvableState(puzzleString) {
    for (let i = 0; i < puzzleString.length; i++) {
      if (puzzleString[i] !== ".") {
        const rowIndex = Math.floor(i / 9);
        const columnIndex = i % 9;

        const row = String.fromCharCode(65 + rowIndex);
        const column = columnIndex + 1;

        const hasValidRowPlacement = this.checkRowPlacement(
          puzzleString,
          row,
          column,
          Number(puzzleString[i])
        );
        if (!hasValidRowPlacement) {
          return false;
        }

        const hasValidColPlacement = this.checkColPlacement(
          puzzleString,
          row,
          column,
          Number(puzzleString[i])
        );
        if (!hasValidColPlacement) {
          return false;
        }

        const hasValidRegionPlacement = this.checkRegionPlacement(
          puzzleString,
          row,
          column,
          Number(puzzleString[i])
        );
        if (!hasValidRegionPlacement) {
          return false;
        }
      }
    }

    return true;
  }

  getListOfPossiblePlaysByPosition(puzzleString) {
    let allPlaysByRow = [];
    for (let i = 0; i < 9; i++) {
      allPlaysByRow[i] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    }

    let allPlaysByColumn = [];
    for (let i = 0; i < 9; i++) {
      allPlaysByColumn[i] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    }

    let allPlaysByRegion = [];
    for (let i = 0; i < 9; i++) {
      allPlaysByRegion[i] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    }

    for (let i = 0; i < puzzleString.length; i++) {
      if (puzzleString[i] === ".") {
        continue;
      }

      const currentRowIndex = Math.floor(i / 9);
      const currentColumnIndex = i % 9;

      const currentHorizontalPositionIndex = Math.floor(currentColumnIndex / 3);
      const currentVerticalPositionIndex = Math.floor(currentRowIndex / 3);

      const currentRegionIndex =
        currentVerticalPositionIndex * 3 + currentHorizontalPositionIndex;

      allPlaysByRow[currentRowIndex] = allPlaysByRow[currentRowIndex].filter(
        (p) => p !== Number(puzzleString[i])
      );

      allPlaysByColumn[currentColumnIndex] = allPlaysByColumn[
        currentColumnIndex
      ].filter((p) => p !== Number(puzzleString[i]));

      allPlaysByRegion[currentRegionIndex] = allPlaysByRegion[
        currentRegionIndex
      ].filter((p) => p !== Number(puzzleString[i]));
    }

    const possiblePlaysByIndex = [];
    for (let i = 0; i < puzzleString.length; i++) {
      if (puzzleString[i] !== ".") {
        continue;
      }

      const currentRowIndex = Math.floor(i / 9);
      const currentColumnIndex = i % 9;

      const currentHorizontalPositionIndex = Math.floor(currentColumnIndex / 3);
      const currentVerticalPositionIndex = Math.floor(currentRowIndex / 3);

      const currentRegionIndex =
        currentVerticalPositionIndex * 3 + currentHorizontalPositionIndex;

      possiblePlaysByIndex[i] = allPlaysByRow[currentRowIndex].filter(
        (value) =>
          allPlaysByColumn[currentColumnIndex].includes(value) &&
          allPlaysByRegion[currentRegionIndex].includes(value)
      );
    }

    return possiblePlaysByIndex;
  }

  solve(puzzleString) {
    this.validate(puzzleString);

    const isInSolvableState = this.testIfIsInSolvableState(puzzleString);

    if (!isInSolvableState) {
      throw new Error("Puzzle cannot be solved");
    }

    let solutionString = puzzleString;

    let possiblePlaysByIndex =
      this.getListOfPossiblePlaysByPosition(solutionString);

    while (possiblePlaysByIndex.length > 0) {
      for (let i = 1; i <= 9; i++) {
        let foundPositionWithPossibleAmmountOfPlaysEqualsToI = false;
        for (let j = 0; j < possiblePlaysByIndex.length; j++) {
          if (!possiblePlaysByIndex[j]) {
            continue;
          }

          if (possiblePlaysByIndex[j].length === i) {
            solutionString =
              solutionString.substring(0, j) +
              `${possiblePlaysByIndex[j][0]}` +
              solutionString.substring(j + 1);

            possiblePlaysByIndex =
              this.getListOfPossiblePlaysByPosition(solutionString);

            foundPositionWithPossibleAmmountOfPlaysEqualsToI = true;

            break;
          }
        }

        if (foundPositionWithPossibleAmmountOfPlaysEqualsToI) {
          break;
        }
      }
    }

    return solutionString;
  }
}

module.exports = SudokuSolver;
