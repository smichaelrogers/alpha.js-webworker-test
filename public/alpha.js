'use strict';

var MAXPLY = 16;
var INFINITY = 10000000;
var WHITE = 0;
var BLACK = 1;
var PAWN = 0;
var KNIGHT = 1;
var BISHOP = 2;
var ROOK = 3;
var QUEEN = 4;
var KING = 5;
var NULL = -1;
var EMPTY = 6;
var FORWARD = [-8, 8];
var PAWN_RANK = [7, 0];
var PIECE_RANK = [6, 1];
var PROMOTION_RANK = [0, 7];

var STEPS = [
	[],
	[-21, -19, -12, -8, 8, 12, 19, 21],
	[11, -11, -9, 9],
	[1, 10, -1, -10],
	[-9, 9, -11, 11, -10, 10, -1, 1],
	[-9, 9, -11, 11, -10, 10, -1, 1]
];
var SLIDES = [false, false, true, true, true, false];
var MATERIAL = [100, 320, 330, 540, 960, 32000];
var DELTA = MATERIAL[QUEEN];

var SQ = [
	 0,  1,  2,  3,  4,  5,  6,  7,
	 8,  9, 10, 11, 12, 13, 14, 15,
	16, 17, 18, 19, 20, 21, 22, 23,
	24, 25, 26, 27, 28, 29, 30, 31,
	32, 33, 34, 35, 36, 37, 38, 39,
	40, 41, 42, 43, 44, 45, 46, 47,
	48, 49, 50, 51, 52, 53, 54, 55,
	56, 57, 58, 59, 60, 61, 62, 63
];

var SQ64 = [
	21, 22, 23, 24, 25, 26, 27, 28,
	31, 32, 33, 34, 35, 36, 37, 38,
	41, 42, 43, 44, 45, 46, 47, 48,
	51, 52, 53, 54, 55, 56, 57, 58,
	61, 62, 63, 64, 65, 66, 67, 68,
	71, 72, 73, 74, 75, 76, 77, 78,
	81, 82, 83, 84, 85, 86, 87, 88,
	91, 92, 93, 94, 95, 96, 97, 98
];

var SQ120 = [
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	-1,  0,  1,  2,  3,  4,  5,  6,  7, -1,
	-1,  8,  9, 10, 11, 12, 13, 14, 15, -1,
	-1, 16, 17, 18, 19, 20, 21, 22, 23, -1,
	-1, 24, 25, 26, 27, 28, 29, 30, 31, -1,
	-1, 32, 33, 34, 35, 36, 37, 38, 39, -1,
	-1, 40, 41, 42, 43, 44, 45, 46, 47, -1,
	-1, 48, 49, 50, 51, 52, 53, 54, 55, -1,
	-1, 56, 57, 58, 59, 60, 61, 62, 63, -1,
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	-1, -1, -1, -1, -1, -1, -1, -1, -1, -1
];

var FEN_INITIAL = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
var FEN_EMPTY = '8/8/8/8/8/8/8/8 w KQkq - 0 1';
var PIECES = [
	['P','N','B','R','Q','K','_'],
	['p','n','b','r','q','k','_']
];
var COLORS = ['w', 'b'];
var UNICODE = [
	['♙', '♘', '♗', '♖', '♕', '♔', '_'],
	['♟', '♞', '♝', '♜', '♛', '♚', '_']
];
var SQUARES = [
	'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8',
	'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
	'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
	'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
	'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
	'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
	'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
	'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'
];

var PST_PAWN = [
    0,  0,  0,  0,  0,  0,  0,  0,
   40, 70, 80, 90, 90, 80, 70, 40,
   10, 30, 40, 50, 50, 40, 30, 10,
    0,  5, 15, 15, 15, 15,  5,  0,
  -20, -5, 15, 30, 30, 15, -5,-20,
  -20,-10, 10, 10, 10, 10,-10,-20,
   25, 20, -5,-10,-10, -5, 20, 25,
    0,  0,  0,  0,  0,  0,  0,  0
];

var PST_KNIGHT = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50
];

var PST_BISHOP = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 15, 15,  5,  5,-10,
  -10,  0, 10, 15, 15, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  3,  5,  5,  3,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20
];

var PST_ROOK = [
    0,  0,  0,  0,  0,  0,  0,  0,
    5, 10, 10, 10, 10, 10, 10,  5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
    0,  0,  0,  5,  5,  0,  0,  0
];

var PST_QUEEN = [
  -20,-10,-10, -5, -5,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5,  5,  5,  5,  0,-10,
   -5,  0,  5,  5,  5,  5,  0, -5,
    0,  0,  5,  5,  5,  5,  0, -5,
  -10,  5,  5,  5,  5,  5,  0,-10,
  -10,  0,  5,  0,  0,  0,  0,-10,
  -20,-10,-10, -5, -5,-10,-10,-20
];

var PST_KING = [
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -20,-30,-30,-40,-40,-30,-30,-20,
  -10,-20,-20,-20,-20,-20,-20,-10,
  -10,-10,-10,-10,-10,-10,-10,-10,
  -10,-10,-10,-10,-10,-10,-10,-10
];

function getOpp(i) {
  return i ^ 56;
}

function flipPST(arr) {
	return SQ.map(function(i) {
		return arr[getOpp(i)];
	});
}

var PST = [];
PST[PAWN] = [PST_PAWN, flipPST(PST_PAWN)];
PST[KNIGHT] = [PST_KNIGHT, flipPST(PST_KNIGHT)];
PST[BISHOP] = [PST_BISHOP, flipPST(PST_BISHOP)];
PST[ROOK] = [PST_ROOK, flipPST(PST_ROOK)];
PST[QUEEN] = [PST_QUEEN, flipPST(PST_QUEEN)];
PST[KING] = [PST_KING, flipPST(PST_KING)];


function sum(arr) {
  return arr.reduce(function (acc, val) {
    return acc + val;
  }, 0);
}

function getFile(i) {
  return i & 7;
}

function getRank(i) {
  return i >> 3;
}

function getPiece(s) {
  return PIECES[0].indexOf(s.toUpperCase());
}

function getColor(s) {
  return s === '_' ? EMPTY : s === s.toUpperCase() ? WHITE : BLACK;
}

function getNPP() {
	return nodes.filter(function(n) {
		return n > 0;
	})
}

function getNodes() {
  return sum(nodes);
}

function getNPS(n, ms) {
  return Math.floor(1000 * n / ms);
}

function serializeMove(move) {
  return {
    from: SQUARES[move.from],
    to: SQUARES[move.to],
    piece: PIECES[0][move.piece],
    target: PIECES[0][move.target],
    san: getSAN(move)
  }
}

function getSAN(move) {
  if (!move) return;
  var san = '';
  if (move.piece !== PAWN) san += PIECES[0][move.piece];
  if (move.target !== EMPTY) san += 'x';
  san += SQUARES[move.to];
  if (move.piece === PAWN && getRank(move.to) % 7 === 0) san += '=Q';

  return san;
}

function getFEN() {
  return SQ.map(function (i) {
    return (i > 0 && i % 8 === 0 ? '/' : '') + PIECES[colors[i] % 6][pieces[i]];
  }).join('').replace(/_+/g, function (n) {
    return n.length;
  }).concat(' ' + COLORS[mx] + ' - - 0 ' + turn);
}

function renderBoard() {
  return SQ.map(function (i) {
    var square = UNICODE[colors[i] % 6][pieces[i]];
    if (i > 0 && i % 8 === 0) return '\n' + square;
    return square;
  }).join(' ');
}

function formatMoveString(move) {
  if (!move) return '';
  return getSAN(move, inCheck()) + ' (' + PIECES[0][move.piece] + ' to ' + SQUARES[move.to] + ')';
}

function printBoard() {
  var board = '';
  for (var i = 0; i < 64; i++) {
    if (i > 0 && i % 8 == 0) board += '\n';
    board += UNICODE[colors[i] % 6][pieces[i]] + ' ';
  }
  log(board);
}

function parseFEN(str) {
  var chunks = str.split(' ');
  fen = str;
  mx = chunks[1] == 'b' ? BLACK : WHITE;
  mn = mx ^ 1;
  turn = parseInt(chunks[5]) || 1;
  chunks[0].replace(/[\/1-8]/g, function (n) {
    return '_'.repeat(+n);
  }).split('').forEach(function (s, i) {
    pieces[i] = getPiece(s);
    colors[i] = getColor(s);
    if (pieces[i] == KING) kings[colors[i]] = i;
  });
}

function getBestMove() {
	return pv[0][0];
}

function printPV() {
	log(getPVString());
}

function getPV() {
  var pvMoves = [];
  for (var j = 0; j < pvLength[0]; j++) {
    pvMoves.push(pv[0][j]);
  }
  return pvMoves;
}

function getPVString() {
  return getPV().map(function (move) {
    return getSAN(move);
  }).join(' ');
}

function updatePV(move) {
  pv[ply][ply] = move;
  for (var i = ply + 1; i < pvLength[ply + 1]; i++) {
    pv[ply][i] = pv[ply + 1][i];
  }
  pvLength[ply] = pvLength[ply + 1];
}

function swapSides() {
  mx ^= 1;
  mn ^= 1;
}

function isSameMove(a, b) {
  if (!(a && b)) return false;
  return a.from === b.from && a.to === b.to && a.piece === b.piece && a.target === b.target;
}

function assertPV() {
  onPV = false;
  if (!pv[0][ply]) return;

  for (var i = 0; i < moves[ply].length; i++) {
    if (isSameMove(pv[0][ply], moves[ply][i])) {
      onPV = true;
      moves[ply][i].score += 1000000;
      return;
    }
  }
}

function isPromotion(move) {
	return move.piece == PAWN  && (
		(move.from == PAWN_RANK[0] && move.to == PIECE_RANK[0]) ||
		(move.from == PAWN_RANK[1] && move.to == PIECE_RANK[1])
	);
}

function isCapture(move) {
	return move.target != EMPTY;
}

var moves;
var pieces;
var colors;
var kings;
var nodes;
var history;
var pv;
var pvLength;
var onPV;
var log;
var height;
var ply;
var fen;
var turn;
var mx;
var mn;
var search;
var running;
var inBrowser = false;


function pvs(alpha, beta, depth) {
  if (depth == 0) return quiesce(alpha, beta);

  pvLength[ply] = ply;
  nodes[ply]++;

  generateMoves(false);

  for (var i = 0; i < moves[ply].length; i++) {
    var val, move = moves[ply][i];

    if (!makeMove(move)) continue;
    if (onPV && i === 0) {
      val = -pvs(-beta, -alpha, depth - 1);
    } else {
      val = -pvs(-alpha - 1, -alpha, depth - 1);
      if (val > alpha && val < beta) {
        val = -pvs(-beta, -alpha, depth - 1);
      }
    }
    unmakeMove(move);

    if (val > alpha) {
      if (move.target === EMPTY) history[move.piece][move.to] += depth * depth;
      if (val >= beta) return beta;
      alpha = val;
      updatePV(move);
    }
  }
  return alpha;
}


function quiesce(alpha, beta) {
  pvLength[ply] = ply;
  nodes[ply]++;

  var standPat = evaluate();
  if (standPat >= beta) return beta;
  if (standPat + DELTA < alpha) return alpha;
  if (ply >= MAXPLY - 1) return standPat;
  if (standPat > alpha) alpha = standPat;

  generateMoves(true);

  for (var i = 0; i < moves[ply].length; i++) {
    var move = moves[ply][i];

    if (!makeMove(move)) continue;
    var val = -quiesce(-beta, -alpha);
    unmakeMove(move);

    if (val > alpha) {
      if (val >= beta) return beta;
      alpha = val;
      updatePV(move);
    }
  }
  return alpha;
}


function generateMoves(filter) {
  var f, s, t;
  moves[ply] = [];

  for (f = 0; f < 64; f++) {
    if (colors[f] !== mx) continue;

    if (pieces[f] === PAWN) {
      t = f + FORWARD[mx];
      if (colors[t + 1] === mn && SQ120[SQ64[t] + 1] != NULL) addMove(f, t + 1);
      if (colors[t - 1] === mn && SQ120[SQ64[t] - 1] != NULL) addMove(f, t - 1);
      if (colors[t] !== EMPTY || filter) continue;

      addMove(f, t);
      t += FORWARD[mx];
      if (colors[t] === EMPTY && getRank(f) === PAWN_RANK[mx]) addMove(f, t);
    } else {

      for (var i = 0; i < STEPS[pieces[f]].length; i++) {
        s = STEPS[pieces[f]][i];
        t = SQ120[SQ64[f] + s];

        while (t != NULL) {
          if (colors[t] === mn || colors[t] === EMPTY && !filter) addMove(f, t);
          if (!(colors[t] == EMPTY && SLIDES[pieces[f]])) break;
          t = SQ120[SQ64[t] + s];
        }
      }
    }
  }
  if (onPV) assertPV();
  moves[ply].sort(function (a, b) {
    return b.score - a.score;
  });
}


function addMove(from, to) {
  moves[ply].push({
    from: from,
    to: to,
    piece: pieces[from],
    target: pieces[to],
    score: pieces[to] == EMPTY ? history[pieces[from]][to] : 5000 + pieces[to] - pieces[from]
  });
}


function makeMove(move) {
  ply += 1;

  colors[move.to] = mx;
  pieces[move.to] = move.piece;
  colors[move.from] = EMPTY;
  pieces[move.from] = EMPTY;

  if (move.piece === KING) {
    kings[mx] = move.to;
  } else if (move.piece === PAWN && getRank(move.to) === PROMOTION_RANK[mx]) {
    pieces[move.to] = QUEEN;
  }

  if (inCheck()) {
    swapSides();
    unmakeMove(move);
    return false;
  }
  swapSides();
  return true;
}


function unmakeMove(move) {
  ply -= 1;
  swapSides();

  colors[move.from] = mx;
  pieces[move.from] = move.piece;
  colors[move.to] = move.target === EMPTY ? EMPTY : mn;
  pieces[move.to] = move.target;

  if (move.piece === KING) kings[mx] = move.from;
}


function inCheck() {
  var i, t, s, f = kings[mx];

  for (i = 0; i < 8; i++) {
    t = SQ120[SQ64[f] + STEPS[KNIGHT][i]];
    if (t != NULL && pieces[t] == KNIGHT && colors[t] == mn) return true;

    s = STEPS[KING][i];
    t = SQ120[SQ64[f] + s];
    while (t != NULL && colors[t] == EMPTY) {
      t = SQ120[SQ64[t] + s];
    }

    if (t == NULL || colors[t] != mn) continue;
    switch (pieces[t]) {
      case BISHOP:
        if (i > 3) break;
      case ROOK:
        if (i < 4) break;
      case PAWN:
        if (Math.abs(s - FORWARD[mn]) !== 1) break;
      case KING:
        if (SQ120[SQ64[f] + s] !== t) break;
      case QUEEN:
        return true;
    }
  }
  return false;
}


function evaluate() {
  var x = 0;
  for (var i = 0; i < 64; i++) {
    if (colors[i] == mx) {
			x += (PST[pieces[i]][colors[i]][i] + MATERIAL[pieces[i]]);
    } else if (colors[i] == mn) {
			x -= (PST[pieces[i]][colors[i]][i] + MATERIAL[pieces[i]]);
    }
  }
  return x;
}


function init(options) {
	running		= true;
	log 			= options.log || console.log;
	pieces  	= new Array(64).fill(EMPTY);
  colors  	= new Array(64).fill(EMPTY);
  kings   	= new Array(2).fill(NULL);
  history 	= new Array(6).fill(new Array(64).fill(0));
	moves   	= new Array(MAXPLY).fill([]);
  pv      	= new Array(MAXPLY).fill([]);
  pvLength	= new Array(MAXPLY).fill(0);
  nodes   	= new Array(MAXPLY).fill(0);
	ply 			= 0;
	height		= 1;

	parseFEN(options.fen || FEN_INITIAL);

	search = {
		input: fen,
		depth: options.depth || 8,
		clock: 0,
		complete: false
	}
}


function run(options, callback) {
	init(options);

  var startTime = Date.now();
  for (var i = 1; i <= search.depth; i++) {
    height = i;
    onPV = true;
    pvs(-INFINITY, INFINITY, height);
  }

  if (pv[0][0]) {
		makeMove(pv[0][0]);
	  printBoard();
		search.clock = Date.now() - startTime;
		search.complete = true;
		search.check = inCheck();
		search.fen = getFEN();
		search.move = serializeMove(pv[0][0]);
		search.pv = getPVString();
		search.nodes = getNodes();
		search.nps = getNPS(search.nodes, search.clock);
	}

	callback(search);
}


running = false;

onmessage = function(e) {
	if(running) {
		console.log('search in process; message ignored')
		return;
	}
	inBrowser = true;

	run(e.data, function(result) {
		running = false;
		postMessage(result);
	});
}
