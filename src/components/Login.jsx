// src/components/Login.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';
import '../styles/custom.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(username.trim()){
      login(username);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre de Usuario</label>
            <input 
              type="text" 
              className="form-control" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary">Acceder</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
