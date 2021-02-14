function showGame(moves) {
    console.log("xiangqi works");
    const config = {
        position: "start",
        showNotation: true,
      };
    const board = Xiangqiboard("myBoard", config);
    movesInArray = moves.split(" ");
    var j;
    for(j = 0; j < movesInArray.length; j++){
		movesInArray[j] = movesInArray[j].substring(0, 2) + "-" + movesInArray[j].substring(2, 4);
    }
    var i = 0;
    
	var afterDiv = document.querySelector('div.xiangqi-board');
	//Insert two new <div> elements
	afterDiv.insertAdjacentHTML('afterend',"<div style='margin: 0 auto; width: 656px; text-align: center; padding-bottom: 5px;'><button id='next' >Next</button><button id='previous'>Previous</button></div>");
    var positions = new Array(movesInArray.length - 1);
    $("#previous").on("click", function () {
      if (i >= 0) {
        console.log(i);
        i--;
        board.position(positions[i]);
      }
    });
    $("#next").on("click", function () {
      // alert(nextItem());
      if (i < movesInArray.length) {
        positions[i] = board.fen();
        board.move(movesInArray[i]);
        console.log(i);
        i++;
      
      }
    });

    $("#startPositionBtn").on("click", board.start);
    
  }