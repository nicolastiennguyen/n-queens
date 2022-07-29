/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting

// togglePiece: function(rowIndex, colIndex) {
//   this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
//   this.trigger('change');
// },


// window.findSolution = function(row, n, board, validator, callback) {
//   // if all rows exhausted, this is a valid solution.
//   // callback() maybe rowConflicts() or colConflict() or something like that
//   if (row === n) {
//     return callback();
//   }
//   // iterate over possible decisions
//   for (var i = 0; i < n; i++) {
//     // place a piece
//     board.togglePiece(row, i);
//     // recurse into remaining problem
//     if (!board[validator]()) {
//       var result = findSolution(row + 1, n, board, validator, callback);
//       if (result) {
//         return result; // EJECT
//       }
//     }
//     // unplace a piece
//     board.togglePiece(row, i);
//   }
// };


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other
window.findNRooksSolution = function(n) {
  // console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));

  n = n || 0;

  if (n === 0) { return 0; }

  var board = new Board({n:n});


  // reuse find solution
  // if the solution count is > 0, return true
  var findSolution = function(row) {
    if (row === n) {
      // solutionCount++;
      return n;
    }
    for (let i = 0; i < n; i++) {
      board.togglePiece(row, i);
      if (!board.hasAnyRooksConflicts()) {
        var result = findSolution(row + 1);
        if (result) {
          return n;
        }
      }
      board.togglePiece(row, i);
    }

    return 0;
    // unplace a piece
  };

  return findSolution(0); // {'n': 4} assuming n = 4
};

// var printBoard = function(board) {
//   board = board || {};

  // console.log(JSON.stringify(board));
// };

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = 0;

  var board = new Board({n:n});

  var findSolution = function(row) {
    // if all rows exhausted
    if (row === n) {
      // increment solutionCount
      solutionCount++;
      // stop
      return;
    }
    // iterate over possible decisions
    for (let i = 0; i < n; i++) {
      // place a piece
      board.togglePiece(row, i);
      // recurse into remaining problem
      if (!board.hasAnyRooksConflicts()) {
        var result = findSolution(row + 1);
        if (result) {
          return result;
        }
      }
      // unplace a piece
      board.togglePiece(row, i);
    }
  };

  findSolution(0);
  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = undefined; //fixme

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = 0;

  var board = new Board({n:n});

  var findSolution = function(row) {
    // if all rows exhausted
    if (row === n) {
      // increment solutionCount
      solutionCount++;
      // stop
      return;
    }
    // iterate over possible decisions
    for (let i = 0; i < n; i++) {
      // place a piece
      board.togglePiece(row, i);
      // recurse into remaining problem
      if (!board.hasAnyQueensConflicts()) {
        var result = findSolution(row + 1);
        if (result) {
          return result;
        }
      }
      // unplace a piece
      board.togglePiece(row, i);
    }
  };

  findSolution(0);
  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
