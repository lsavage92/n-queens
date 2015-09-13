// This file is a Backbone Model

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
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


    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      //Store row in a local variable
      var board = this.get(rowIndex);
      //Create counter
      var count = 0;
      //Iterate over row
      for(var i = 0; i < board.length; i++){
        //If we encounter a piece
        if( board[i] === 1 ){
          //Increment counter
          count++;
        }
      }
      //If counter > 1, return true
      if( count > 1 ){
        return true;
      }
      return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var board = this.rows();
      //Iterate over board
      for(var i = 0; i < board.length; i++){
        //Run hasRowConflictAt on each row
        if( this.hasRowConflictAt(i) ){
          //If it returns true, return true
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
      //Create a local variable for board
      var board = this.rows();
      //Create a count variable
      var count = 0;
      //Iterate over board
      for(var i = 0; i < board.length; i++){
        //If we encounter a piece, increment counter
        if( board[i][colIndex] === 1 ){
          count++;
        }
      }
      //If counter > 1, return true
      if ( count > 1 ){
        return true;
      }
      return false; // fixme
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var board = this.rows();
      //Iterate over board
      for(var i = 0; i < board.length; i++){
        //Run hasColConflictAt on each row
        if( this.hasColConflictAt(i) ){
          //If it returns true, return true
          return true;
        }
      }
      return false; // fixme
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow, row) {
      var count = 0;
      var board = this.rows();

      row = row || 0;

      var diagCheck = function(index, row){
        if( index > board.length - 1 || row > board.length - 1 ){
          return;
        }

        if(board[row][index] === 1){
          count++;
        }

        diagCheck(index + 1, row + 1);
      };

      diagCheck(majorDiagonalColumnIndexAtFirstRow, row);

      if(count > 1){
        return true;
      }

      return false; // fixme
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var count = 0;
      var board = this.rows();

      for(var i = 0; i < board.length - 1; i++){
        if( this.hasMajorDiagonalConflictAt(i) ){
          return true;
        }
      }

      for(var i = 1; i < board.length - 1; i++){
        if( this.hasMajorDiagonalConflictAt(0,i) ){
          return true;
        }
      }

      return false; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow, row) {
      var count = 0;
      var board = this.rows();

      row = row || 0;

      var diagCheck = function(index, row){
        if( index === -1 || row > board.length - 1 ){
          return;
        }

        if(board[row][index] === 1){
          count++;
        }

        diagCheck(index - 1, row + 1);
      };

      diagCheck(minorDiagonalColumnIndexAtFirstRow, row);

      if( count > 1 ){
        return true;
      }
      return false;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var count = 0;
      var board = this.rows();

      //Iterate over the first row, beginning at the last index, decrementing
      for(var i = board[0].length - 1; i >= 0 ; i--){
        //If hasMinorDiagonalConflictAt on current index returns true, return true
        if( this.hasMinorDiagonalConflictAt(i) ){
          return true;
        }
      }

      //Iterate over remaining rows using only the last index of each row
      for(var i = board[0].length - 1; i > 0; i--){
        //If hasMinorDiagonalConflictAt on current index returns true, return true
        if( this.hasMinorDiagonalConflictAt(board[0].length - 1, 1) ){
          return true;
        }
      }
      return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
