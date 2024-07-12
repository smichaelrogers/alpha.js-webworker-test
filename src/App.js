import React, { Component } from 'react';
import Game from './Game';

const Header = () => (
  <div className="Header">
    <a href="/">alpha.js</a>
    // <a href="https://github.com/smichaelrogers/alpha.js-webworker-test">view on github</a>
  </div>
)

const Layout = ({ children }) => (
  <div className="Layout">
    {children}
  </div>
)

export default class App extends Component {
  render() {
    return (
      <Layout>
        <div className="App">
          <Header />
          <Game />
        </div>
      </Layout>
    );
  }
}
