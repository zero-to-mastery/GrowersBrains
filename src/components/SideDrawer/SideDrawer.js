import React from 'react';

import './SideDrawer.css';

const sideDrawer = props => {
   let drawerClasses = ['side-drawer'];
   if (props.show) {
      drawerClasses = 'side-drawer open';
   }

   return (
      <nav className={drawerClasses} >
         <ul>
            <li><a href="/">Consulting</a></li>
            <li><a href="/">Greenhouse</a></li>
            <li><a href="/">Contest</a></li>
            <li><a href="/">Products</a></li>
            <li><a href="/">Daily Grow</a></li>
         </ul>
      </nav>);
};

export default sideDrawer;