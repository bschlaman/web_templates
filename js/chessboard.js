window.onload = function(){
	let mouseCol;
	let mouseRow;
	let selSquare;
	let specialSquares = [];
	let blackView = false;

	const squares = {
		a8:   0, b8:   1, c8:   2, d8:   3, e8:   4, f8:   5, g8:   6, h8:   7,
		a7:  16, b7:  17, c7:  18, d7:  19, e7:  20, f7:  21, g7:  22, h7:  23,
		a6:  32, b6:  33, c6:  34, d6:  35, e6:  36, f6:  37, g6:  38, h6:  39,
		a5:  48, b5:  49, c5:  50, d5:  51, e5:  52, f5:  53, g5:  54, h5:  55,
		a4:  64, b4:  65, c4:  66, d4:  67, e4:  68, f4:  69, g4:  70, h4:  71,
		a3:  80, b3:  81, c3:  82, d3:  83, e3:  84, f3:  85, g3:  86, h3:  87,
		a2:  96, b2:  97, c2:  98, d2:  99, e2: 100, f2: 101, g2: 102, h2: 103,
		a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
  };
	const pieceChars = ".PNBRQKpnbrqkx";
	const startFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
	let testFen = "1r1qkb1r/1bp2pp1/p2p1n1p/3Np3/2pPP3/5N2/PPPQ1PPP/R1B2RK1 w k - 0 13";

	const pieceFileNames = {
		bp: "images/pieces/pawn_black_60.png",
		bn: "images/pieces/night_black_60.png",
		bb: "images/pieces/bishop_black_60.png",
		br: "images/pieces/rook_black_60.png",
		bq: "images/pieces/queen_black_60.png",
		bk: "images/pieces/king_black_60.png",
		wp: "images/pieces/pawn_white_60.png",
		wn: "images/pieces/night_white_60.png",
		wb: "images/pieces/bishop_white_60.png",
		wr: "images/pieces/rook_white_60.png",
		wq: "images/pieces/queen_white_60.png",
		wk: "images/pieces/king_white_60.png",
	};

	let boardState = {
		pieces: [],
		castlePermission: "KQkq",
		enPas: "-",
	};

	// load helper functions
	// TODO: this is clunky
	helperFunctions();

	// put the pieces where i want in pieces[] and then use the array to put them on the board
	setPiece(boardState.pieces, "bk", "a8");
	setPiece(boardState.pieces, "bb", "b8");
	setPiece(boardState.pieces, "wk", "c8");
	setPiece(boardState.pieces, "bp", "a7");
	setPiece(boardState.pieces, "bp", "b7");
	setPiece(boardState.pieces, "wp", "c6");
	setPiece(boardState.pieces, "wr", "a1");

	createHTMLPieces(boardState.pieces, pieceFileNames);
	console.log(boardState);

	let pieceImages = document.querySelectorAll(".chessboard-wrapper img");
	for(let i = 0 ; i < pieceImages.length ; i++){
		makeDragable(pieceImages[i]);
	}
}

function makeDragable(element){
	let cursorStartX, cursorStartY, cursorOffsetX, cursorOffsetY;
	let newX, newY;
	let boundary = document.querySelector(".chessboard-wrapper").clientWidth - element.clientWidth;
	element.onmousedown = (e) => {
		e = e || window.event;
		e.preventDefault();
		element.style.zIndex = "2";
		cursorStartX = e.clientX;
		cursorStartY = e.clientY;
		document.onmouseup = () => {
			document.onmouseup = null;
			document.onmousemove = null;
			element.style.zIndex = "1";
			snapToBoard(element);
		};
    document.onmousemove = (e) => {
			e = e || window.event;
			e.preventDefault();
			cursorOffsetX = cursorStartX - e.clientX;
			cursorOffsetY = cursorStartY - e.clientY;
			cursorStartX = e.clientX;
			cursorStartY = e.clientY;
			newX = element.offsetLeft - cursorOffsetX;
			newY = element.offsetTop - cursorOffsetY;
			if(newX > boundary){ newX = boundary; } else if(newX < 0){ newX = 0; }
			if(newY > boundary){ newY = boundary; } else if(newY < 0){ newY = 0; }
			element.style.left = newX + "px";
			element.style.top = newY + "px";
		};
	};
}

function snapToBoard(element){
	let squareSize = document.querySelector(".chessboard td").clientWidth;
	let col = Math.floor((element.offsetLeft+element.clientWidth/2) / squareSize);
	let row = Math.floor((element.offsetTop+element.clientHeight/2) / squareSize);
	element.style.left = (col * squareSize) + "px";
	element.style.top = (row * squareSize) + "px";
	let alg = helperFunctions.sq120ToAlg(helperFunctions.rcToSq120(row, col));
	// simple scenenario for now, just removing the piece that's there
	let toPiece = document.querySelector(".chessboard-pieces .sq-" + alg);
	if(toPiece && element != toPiece){
		toPiece.remove();
	}
	element.className = "sq-" + alg;
}

function setPiece(pieces, piece, alg){
	pieces[helperFunctions.algToSq120(alg)] = piece;
}

function createHTMLPieces(pieces, pieceFileNames){
	let squareSize = document.querySelector(".chessboard td").clientWidth;
	let piecesContainer = document.querySelector(".chessboard-pieces");
	// p is the sq120 number
	for(let i = 0 ; i < 120 ; i++){
		if(pieces[i] != null){
			let img = document.createElement("img");
			img.className = "sq-" + helperFunctions.sq120ToAlg(i);
			img.src = pieceFileNames[pieces[i]];
			let [row, col] = helperFunctions.algToRC(helperFunctions.sq120ToAlg(i));
			img.style.left = (col * squareSize) + "px";
			img.style.top = (row * squareSize) + "px";
			img.style.position = "absolute";
			img.style.width = "12.5%";
			img.style.height = "12.5%";
			piecesContainer.appendChild(img);
		}
	}
}

function updateSide(){
	document.getElementsByClassName("tomove")[0].innerHTML = side;
}

function switchSide(){
	if(side == "white"){ side = "black"; }
	else if(side == "black"){ side = "white"; }
	updateSide();
}

var getKSquare = function(i){
	let [r,c] = index2RC(i);
	let avail = [];
	let a = [-1, 1];
	for(let x = 0 ; x < a.length ; x++){
		for(let y = 0 ; y < a.length ; y++){
			a1 = r + 2 * a[x];
			a2 = c + 1 * a[y];
			a3 = r + 1 * a[x];
			a4 = c + 2 * a[y];
			if(a1 < 8 && a1 > -1 && a2 < 8 && a2 > -1){
				avail.push(rc2Index(a1, a2));
			}
			if(a3 < 8 && a3 > -1 && a4 < 8 && a4 > -1){
				avail.push(rc2Index(a3, a4));
			}
		}
	}
	return avail;
	// specialSquares.push(rc2Index(mouseRow + 2 * r[x], mouseCol + 1 * c[y]));
	// specialSquares.push(rc2Index(mouseRow + 1 * r[x], mouseCol + 2 * c[y]));
}

var selectSquare = function(){
	// console.log(rc2Index(mouseRow, mouseCol));
	if(selSquare == -1){
		selSquare = rc2Index(mouseRow, mouseCol);
	} else {
		selSquare = blackView ? blackIndex(selSquare) : selSquare;
		let piece = pieces[selSquare];
		pieces[selSquare] = "-";
		let targetSquare = rc2Index(mouseRow,mouseCol);
		targetSquare = blackView ? blackIndex(targetSquare) : targetSquare;
		pieces[targetSquare] = piece;
		selSquare = -1;
	}
}

var cumulativeOffset = function(element) {
	var top = 0, left = 0;
	do {
		top += element.offsetTop || 0;
		left += element.offsetLeft || 0;
		element = element.offsetParent;
	} while(element);

	return {
		top: top,
		left: left
	};
}

var blackIndex = function(i){
	return pieces.length - 1 - i;
}

var square = function(row, col){
	return String.fromCharCode(col+97) + (8-row);
}

var rc2Index = function(row, col){
	return 8 * row + col;
}

var index2RC = function(i){
	let c = i % 8;
	let r = (i-c) / 8;
	return [r,c];
}

// helper functions
var helperFunctions = function(){
	function sq120To64(sq120){
		return sq120 - 17 - 2 * (sq120 - sq120 % 10) / 10;
	}
	function sq64To120(sq64){
		return sq64 + 21 + 2 * (sq64 - sq64 % 8) / 8;
	}
	// row 0 is at the top; used for html positioning
	function algToRC(alg){
		return [8 - parseInt(alg.charAt(1)), alg.charCodeAt(0) - 97];
	}
	function algToSq120(alg){
		let [row, col] = algToRC(alg);
		return sq64To120(col + 8 * (7 - row));
	}
	function sq120ToAlg(sq120){
		let sq64 = sq120To64(sq120);
		let file = sq64 % 8;
		let rank = 1 + ((sq64 - sq64 % 8) / 8);
		return String.fromCharCode(file + 97) + rank.toString();
	}
	function rcToSq120(row, col){
		return sq64To120(col + 8 * (7 - row));
	}
	helperFunctions.sq120To64 = sq120To64;
	helperFunctions.sq64To120 = sq64To120;
	helperFunctions.algToRC = algToRC;
	helperFunctions.algToSq120 = algToSq120;
	helperFunctions.sq120ToAlg = sq120ToAlg;
	helperFunctions.rcToSq120 = rcToSq120;
}

var setFEN = function(fen){
	let piece;
	let rank = 8;
	let file = 1;
	for(let i = 0 ; i < fen.length && rank > 0 ; i++){
		let count = 1;
		switch(fen[i]){
			case "p":
			case "r":
			case "n":
			case "b":
			case "q":
			case "k":
			case "P":
			case "R":
			case "N":
			case "B":
			case "Q":
			case "K":
				piece = fen[i];
				break;
			case "1":
			case "2":
			case "3":
			case "4":
			case "5":
			case "6":
			case "7":
			case "8":
				piece = "-"
				count = parseInt(fen[i]);
				break;
			case "/":
			case " ":
				rank--;
				file = 1;
				continue;
			default:
				console.log("Error with FEN!");
		}
		for(let x = 0 ; x < count ; x++){
			let boardIndex = 8 * (8-rank) + file - 1;
			pieces[boardIndex] = piece;
			file++;
		}
	}
	let stateInfo = fen.split(' ');
	side = stateInfo[1] == "b" ? "black" : "white";
	castlePermission = stateInfo[2];
	enPas = stateInfo[3];
	updateSide();
}

// This can be written better
var genFEN = function(){
	let fen = '';
	let empty = 0;
	for(let i = 0 ; i < pieces.length ; i++){
		if(i % 8 == 0 && i > 0){
			if(empty){ fen += empty; empty = 0; }
			fen += "/";
		}
		if(pieces[i] == "-"){
			empty++;
		} else {
			if(empty){ fen += empty; empty = 0; }
			fen += pieces[i];
		}
	}
	if(empty){ fen += empty; empty = 0; }
	fen += ' ';
	fen += side == "black" ? "b" : "w";
	fen += ' ';
	fen += castlePermission;
	fen += ' ';
	fen += enPas;

	return fen;
}

var drawPieces = function(){
	let canv = document.getElementById("canv");
	let ctx = canv.getContext("2d");
	let path;
	for(let i = 0 ; i < pieces.length ; i++){
		switch(pieces[i]){
			case "p": path = "./pieces/pawn_black_60.png"; break;
			case "r": path = "./pieces/rook_black_60.png"; break;
			case "n": path = "./pieces/night_black_60.png"; break;
			case "b": path = "./pieces/bishop_black_60.png"; break;
			case "q": path = "./pieces/queen_black_60.png"; break;
			case "k": path = "./pieces/king_black_60.png"; break;
			case "P": path = "./pieces/pawn_white_60.png"; break;
			case "R": path = "./pieces/rook_white_60.png"; break;
			case "N": path = "./pieces/night_white_60.png"; break;
			case "B": path = "./pieces/bishop_white_60.png"; break;
			case "Q": path = "./pieces/queen_white_60.png"; break;
			case "K": path = "./pieces/king_white_60.png"; break;
			default: path = null;
		}
		if(path){
			let imgObj = new Image();
			imgObj.src = path;
			let x = blackView ? 7 - i % 8 : i % 8;
			let y = blackView ? (56-i+(i%8)) / 8 : (i-x) / 8;
			ctx.drawImage(
				imgObj,
				(x + 0.5) * squareSize - imgObj.width / 2,
				(y + 0.5) * squareSize - imgObj.height / 2
			);
		}
	}
}

function formatPOSTData(object) {
	var encodedString = '';
	for (var key in object) {
		if (object.hasOwnProperty(key)) {
			if (encodedString.length > 0) {
				encodedString += '&';
			}
			encodedString += encodeURI(key + '=' + object[key]);
		}
	}
	return encodedString;
}

var randMove = function(){
	let fen = genFEN();
	let xhr = new XMLHttpRequest();
	// let url = "http://192.168.1.90:5812/fen?fen=" + fen;
	let url = "https://www.schlamalama.com:5812/fen?fen=" + fen;
	console.log(url);

	xhr.open('GET', url);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onload = function(){
		if (xhr.status !== 200){
			alert('Something went wrong with submission.  Please contact Brendan.')
		} else {
			// success
			let randFEN = xhr.responseText.split('\n')[0];
			console.log("res: " + randFEN);
			if(randFEN == fen){
				alert("MATE");
			} else {
				let input = document.querySelectorAll("form input.input")[0];
				input.value = randFEN;
				setFEN(randFEN);
			}
		}
	};
	xhr.send();
}

var saveFEN = function(){
	let fen = genFEN();
	let url = './handle_input.php';

	let xhr = new XMLHttpRequest();
	xhr.open('POST', url);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onload = function(){
		if (xhr.status !== 200){
			alert('Something went wrong with submission.  Please contact Brendan.')
		} else {
			alert("Successfully saved board!")
		}
		console.log(xhr.status);
	};
	let payload = {
		fen: fen
	};
	xhr.send(formatPOSTData(payload));
}

var loadFEN = function(){
	let url = './handle_input.php';

	let xhr = new XMLHttpRequest();
	xhr.open('GET', url);
	xhr.onload = function(){
		if (xhr.status !== 200){
			alert('Something went wrong with submission.  Please contact Brendan.')
		}
		console.log(xhr.status);
	};
	xhr.onload = function() {
		if (xhr.status != 200) { // analyze HTTP status of the response
			alert(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
		} else { // show the result
			// alert(`Data: ${xhr.response}`); // responseText is the server
			let res = JSON.parse(xhr.response);
			fen = res.fen;
			setFEN(fen);
		}
	};
	xhr.send();
}

var resetFEN = function(){
	fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
	setFEN(fen);
}
