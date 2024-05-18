import React, { useState } from 'react';

function  MenuButton  () {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };


  return (
    <div
      style={{
        position: 'absolute',
        bottom: '5%',
        right: '5%',
        zIndex: '999',
      }}
    >
      {!menuOpen && (
        <button onClick={toggleMenu}>Menu</button>
      )}

      {menuOpen && (
        <div className="menu" style={{ padding: '10px', backgroundColor: 'white', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <button>Crear Reporte </button>
          <button>Crar zona</button>
          <button onClick={() => setMenuOpen(false)}>Cerrar</button>
        </div>
      )}
    </div>
  );
};

export default MenuButton;

