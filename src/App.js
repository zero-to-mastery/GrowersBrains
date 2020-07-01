import React, { Component } from 'react'

import Toolbar from './components/Toolbar/Toolbar';
import SideDrawer from './components/SideDrawer/SideDrawer';
import BackDrop from './components/BackDrop/BackDrop';

class App extends Component {
  state = {
    sideDrawerOpen: false
  };

  drawerToggleClick = () => {
    this.setState((prevState) => {
      return { sideDrawerOpen: !prevState.sideDrawerOpen };
    });
  };

  backdropClick = () => {
    this.setState({ sideDrawerOpen: false });
  };

  render() {
    let backdrop;

    if (this.state.sideDrawerOpen) {
      backdrop = <BackDrop click={this.backdropClick} />;
    }
    return (
      <div style={{ height: '100%' }} className="App">
        <Toolbar drawerClick={this.drawerToggleClick} />
        <SideDrawer show={this.state.sideDrawerOpen} />
        {backdrop}
      </div>
    );
  }
}

export default App

