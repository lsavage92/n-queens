/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

window.findNRooksSolution = function(num, col) {
  var board = new Board({n: num});
  var boardArr = board.rows();
  col = col || 0;

  board.togglePiece(0, col);

  var findMove = function(row){
    if ( row > boardArr.length - 1){
      return;
    }
    //iterate over next row
    for(var i = 0; i < boardArr.length; i++){
      //Toggle on piece,
      board.togglePiece(row, i); //try at index 1, which will work
      //If column conflict
      if ( board.hasColConflictAt(i) ){
        // Toggle off piece
        board.togglePiece(row, i);
      }
      //Else advance to next row + repeat
      else {
        findMove(row + 1);
      }
    }
  };

  findMove(1);

  var solution = board.rows(); //fixme
  console.log('Single solution for ' + num + ' rooks:', JSON.stringify(solution));
  return solution;
};



// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(num) {
  //Create board
  // if( num === 2 ){
  //   debugger;
  // }
  var board = new Board({n : num});
  var solutionCount = 0;

  //Inner function takes board parameter, row parameter
  var getSolutions = function(thisBoard, row){
    //Iterate over current row
    console.log('just passed in' + JSON.stringify(thisBoard.rows()));
    var boardArr = thisBoard.rows();
    for(var i = 0; i < boardArr.length; i++){
      //Toggle a piece at current index
      thisBoard.togglePiece(row, i);
      console.log('toggle on' + JSON.stringify(thisBoard.rows()));
      //If there are no column conflicts
      if( !thisBoard.hasAnyRooksConflicts() ){
        //If row = n - 1
        if( row === num - 1 ){
          //Increment counter, return
          console.log('solution reached ' + JSON.stringify(thisBoard.rows()));
          solutionCount++;
          // for(var p = 1; p < boardArr.length; p++){
          //   for(var j = 0; j < boardArr.length; j++){
          //     if( boardArr[p][j] === 1 ){
          //       thisBoard.togglePiece(p, j);
          //     }
          //   }
          // }

          thisBoard.whyAreDoingThis = 'here';
          return;
        }
        //Call inner function on row + 1
        if ( row < num - 1){
          var copyBoard = {};
          for(var key in thisBoard){
            copyBoard[key] = thisBoard[key];
          }
          getSolutions(copyBoard, row + 1); //We are NOT passing a copy but we SHOULD be passing a copy of thisBoard. That's the bug.
        }
      }
      //Untoggle piece
      if( row === 1 ){
        debugger;
      }
      thisBoard.togglePiece(row, i);
      console.log('toggle off' + JSON.stringify(thisBoard.rows()));
    }
    //Recursive call on row + 1
    // if ( row < num - 1 ){
    //   getSolutions(thisBoard, row + 1);
    // }
  };

  getSolutions(board, 0);
  console.log('Number of solutions for ' + num + ' rooks:', solutionCount);
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
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
