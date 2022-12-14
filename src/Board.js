// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      // return (conflictCount > 1);

      // 2. we check if the index of value 1 equals to the last index of value 1
      // indexOf, lastIndexOf
      // return (array.indexOf(1) !== array.lastIndexOf(1)) <-- conflict
      // return (!(array.indexOf(1) === array.lastIndexOf(1))) <-- conflict
      // return false; // fixme
      let rowArr = this.get(rowIndex);

      return (rowArr.indexOf(1) === rowArr.lastIndexOf(1)) ? false : true;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      let rowLength = this.rows().length;
      for (let index = 0; index < rowLength; index++) {
        if (this.hasRowConflictAt(index)) {
          return true;
        }
      }
      return false; // fixme
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      // turn board into an array (currently an object)
      // to use double array strategy
      let allRows = this.rows();
      // let boardArray = [];
      // for (var i = 0; i < allRows.length; i++) {
      //   var currentRow = allRows[i];
      //   boardArray.push(currentRow);
      // }
      let boardArray = this.turnBoardIntoBoardArray();

      let counter = 0;
      for (let row in allRows) {
        if (boardArray[row][colIndex] === 1) {
          counter++;
        }
      }
      return (counter > 1) ? true : false;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      let rowLength = this.rows().length;
      for (let index = 0; index < rowLength; index++) {
        if (this.hasColConflictAt(index)) {
          return true;
        }
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    // boardArray[0][column index]
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow, row) {
      row = row || 0;
      if (!this._isInBounds(row, majorDiagonalColumnIndexAtFirstRow)) {
        return false;
      }
      let allRows = this.rows();
      let boardArray = this.turnBoardIntoBoardArray();
      let counter = 0;
      let col = majorDiagonalColumnIndexAtFirstRow;
      for (let index = 0; index < allRows.length; index++) {
        if (this._isInBounds(row, col)) {
          if (boardArray[row][col] === 1) {
            counter++;
          }
          row++;
          col++;
        }
      }

      return (counter > 1) ? true : false;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      let rowLength = this.rows().length;
      // because row length is the same with column length
      let colLength = rowLength;
      for (let row = 0; row < rowLength; row++) {
        for (let col = 0; col < colLength; col++) {
          if (this.hasMajorDiagonalConflictAt(col, row)) {
            return true;
          }
        }
      }
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow, row) {
      row = row || 0;
      let allRows = this.rows();
      let boardArray = this.turnBoardIntoBoardArray();
      let counter = 0;
      let col = minorDiagonalColumnIndexAtFirstRow;
      for (let i = 0; i < allRows.length; i++) {
        if (this._isInBounds(row, col)) {
          if (boardArray[row][col] === 1) {
            counter++;
          }
          row++;
          col--;
        }
      }
      return (counter > 1) ? true : false;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      let rowLength = this.rows().length;
      let colLength = rowLength;
      for (let row = 0; row < rowLength; row++) {
        for (let col = 0; col < colLength; col++) {
          if (this.hasMinorDiagonalConflictAt(col, row)) {
            return true;
          }
        }
      }
      return false;
    },

    /*--------------------  End of Helper Functions  ---------------------*/


    turnBoardIntoBoardArray: function() {
      let allRows = this.rows();
      let boardArray = [];
      for (var i = 0; i < allRows.length; i++) {
        var currentRow = allRows[i];
        boardArray.push(currentRow);
      }
      return boardArray;
    }
  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
