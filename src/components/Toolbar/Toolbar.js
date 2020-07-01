import React from 'react';

import DrawerToggleBtn from '../SideDrawer/DrawerToggleBtn';
import './Toolbar.css';

const toolbar = props => (
   <header className="toolbar">
      <nav className="toolbar_nav">
         <div className="toolbar_togglebtn">
            <DrawerToggleBtn click={props.drawerClick} />
         </div>
         <div className="toolbar_logo"><a href="/">LOGO</a></div>
         <div className="space"></div>
         <div className="toolbar_nav-items">
            <ul>
               <li><a href="/">Consulting</a></li>
               <li><a href="/">Greenhouse</a></li>
               <li><a href="/">Contest</a></li>
               <li><a href="/">Products</a></li>
               <li><a href="/">Daily Grow</a></li>
            </ul>
         </div>
      </nav>
   </header>
);

export default toolbar;

