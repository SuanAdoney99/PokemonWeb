// src/components/ComponentsPage.jsx
import React, { useState } from 'react';
import '../styles/custom.css';

const Componente = ({ title, children }) => {
  const [visible, setVisible] = useState(true);
  
  return (
    <div className="card m-2 p-2">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5>{title}</h5>
        <button 
          className="btn btn-sm btn-outline-primary" 
          onClick={() => setVisible(prev => !prev)}>
          {visible ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>
      {visible && <div className="card-body">{children}</div>}
    </div>
  );
};

const ComponentsPage = () => {
  return (
    <div className="components-container">
      <Componente title="Componente 1">
        <p>Contenido del Componente 1</p>
      </Componente>
      <Componente title="Componente 2">
        <p>Contenido del Componente 2</p>
      </Componente>
      <Componente title="Componente 3">
        <p>Contenido del Componente 3</p>
      </Componente>
    </div>
  );
};

export default ComponentsPage;
