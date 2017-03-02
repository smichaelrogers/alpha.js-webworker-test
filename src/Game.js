import React, { Component } from 'react';
import Chess from 'chess.js';
const chess = new Chess();
const FEN_INITIAL = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const UNICODE = {
  w: { p: '♙', n: '♘', b: '♗', r: '♖', q: '♕', k: '♔' },
  b: { p: '♟', n: '♞', b: '♝', r: '♜', q: '♛', k: '♚' },
  e: { e: '' }
}

export default class Game extends Component {
  constructor() {
    super();
    this.state = {
      fen: FEN_INITIAL,
      data: null,
      depth: 6,
      active: false
    }
  }
  componentDidMount() {
    this.engine = new Worker('alpha.js');
    this.engine.onmessage = this.onMessage.bind(this);
  }
  onMessage({ data }) {
    if(!this.state.active) return;
    this.setState({
      fen: data.complete ? data.fen : this.state.fen,
      data: data
    });
    if(this.state.active) {
      this.queryEngine();
    }
  }
  queryEngine() {
    const { fen, depth } = this.state;
    this.engine.postMessage({ fen, depth });
  }
  renderPiece(square) {
    const piece = chess.get(square) || { color: 'e', type: 'e' }
    return UNICODE[piece.color][piece.type]
  }
  resetGame() {
    this.setState({
      active: false,
      fen: FEN_INITIAL,
      data: null
    })
  }
  toggleActive() {
    if(this.state.active) {
      this.setState({ active: false });
    } else {
      this.setState({ active: true });
      this.queryEngine();
    }
  }
  render() {
    const { fen, data, depth } = this.state;
    chess.load(fen);

    return (
      <div className="Game">
        <div className="Menu">
          <button
            className={this.state.active && 'active'}
            onClick={() => this.toggleActive()}>
            Run
          </button>
          <button
            className={FEN_INITIAL === fen && 'active'}
            onClick={() => this.resetGame()}>
            Reset
          </button>
        </div>
        <div className="Board">
          {chess.SQUARES.map(square => (
            <div className={chess.square_color(square)} key={square}>
              {this.renderPiece(square)}
            </div>
          ))}
        </div>
        <div className="Footer">
          <span>by Scott M. Rogers</span>
          <a href="http://www.scottrogers.tech">Portfolio</a>
          <a href="https://github.com/smichaelrogers">GitHub</a>
        </div>
      </div>
    );
  }
}
