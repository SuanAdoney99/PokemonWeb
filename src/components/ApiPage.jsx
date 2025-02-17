// src/components/ApiPage.jsx
import React, { useEffect, useState } from 'react';
import '../styles/custom.css';

const ApiPage = () => {
  const [cards, setCards] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 20; // Número de cartas por página

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch(`https://api.pokemontcg.io/v2/cards?page=${page}&pageSize=${pageSize}`);
        const data = await response.json();
        setCards(data.data);
      } catch (error) {
        console.error('Error al obtener las cartas:', error);
      }
    };
    fetchCards();
  }, [page]);

  return (
    <div className='api'>
      <h2>Cartas de Pokémon TCG</h2>
      <div className="d-flex flex-wrap justify-content-center">
        {cards.map(card => (
          <div key={card.id} className="m-2" style={{ width: '150px' }}>
            <img src={card.images.small} alt={card.name} className="img-fluid" />
            <p className="text-center">{card.name}</p>
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-between mt-3">
        <button 
          className="btn btn-primary" 
          onClick={() => setPage(prev => Math.max(prev - 1, 1))} 
          disabled={page === 1}>
          Anterior
        </button>
        <button 
          className="btn btn-primary" 
          onClick={() => setPage(prev => prev + 1)}>
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ApiPage;
