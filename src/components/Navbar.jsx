import React, { useContext, useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext.jsx';
import { AuthContext } from '../contexts/AuthContext.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/custom.css';

const Navbar = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');

  // Cargar productos de FakeStore API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://fakestoreapi.com/products');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <nav className={`navbar navbar-expand-lg ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Pokémon</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/components">Componentes</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/api">API</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/useReducer">useReducer</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/voiceInput">VoiceInput</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/informes">Informes</NavLink>
            </li>
          </ul>
          <form className="d-flex position-relative" style={{ flex: 1, maxWidth: '400px' }}>
            <input
              type="text"
              className="form-control me-2"
              placeholder="Buscar productos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <div
                className="search-results position-absolute bg-white shadow rounded mt-2"
                style={{
                  top: '100%', // Mueve los resultados justo debajo del campo de búsqueda
                  left: 0,
                  right: 0,
                }}
              >
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div key={product.id} className="d-flex align-items-center p-2 border-bottom">
                      <img
                        src={product.image}
                        alt={product.title}
                        style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                        className="me-2"
                      />
                      <div>
                        <h6 className="mb-0">{product.title}</h6>
                        <small className="text-muted">${product.price}</small>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="p-2 text-muted">No se encontraron resultados.</p>
                )}
              </div>
            )}
          </form>
          <ul className="navbar-nav align-items-center ms-3">
            {user ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/profile">Perfil</NavLink>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={logout}>Logout</button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <NavLink className="nav-link" to="/login">Login</NavLink>
              </li>
            )}
            <li className="nav-item ms-3">
              <div className="form-check form-switch">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  checked={darkMode} 
                  onChange={toggleTheme} 
                  id="themeSwitch" 
                />
                <label className="form-check-label" htmlFor="themeSwitch">
                  {darkMode ? 'Oscuro' : 'Claro'}
                </label>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
