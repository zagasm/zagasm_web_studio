// SidebarLoader.js
import React from 'react';
import './Loader.css';

const SidebarLoader = () => {
  return (
    <aside className="shadow-sm side_bar_container">
      <div className="sidebar-loader">
        {[...Array(5)].map((_, i) => (
          <div className="shimmer-line" key={i}></div>
        ))}
        <div className="shimmer-profile mt-auto"></div>
      </div>
    </aside>
  );
};

export default SidebarLoader;
