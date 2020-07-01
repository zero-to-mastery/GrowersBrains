import React from 'react';

import './DrawerToggleBtn.css';

const drawerToggleBtn = props => (
   <button className="togglebtn" onClick={props.click}>
      <div className="togglebtn_line"></div>
      <div className="togglebtn_line"></div>
      <div className="togglebtn_line"></div>
   </button>
);

export default drawerToggleBtn;