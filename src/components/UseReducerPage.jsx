// src/components/UseReducerPage.jsx
import React, { useReducer, useState } from 'react';
import '../styles/custom.css';

const initialState = {
  tasks: []
};

const reducer = (state, action) => {
  switch(action.type) {
    case 'ADD_TASK':
      return { tasks: [...state.tasks, { id: Date.now(), text: action.payload, completed: false }] };
    case 'TOGGLE_TASK':
      return {
        tasks: state.tasks.map(task =>
          task.id === action.payload ? { ...task, completed: !task.completed } : task
        )
      };
    case 'DELETE_TASK':
      return { tasks: state.tasks.filter(task => task.id !== action.payload) };
    default:
      return state;
  }
};

const UseReducerPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [taskText, setTaskText] = useState('');

  const addTask = () => {
    if (taskText.trim() !== '') {
      dispatch({ type: 'ADD_TASK', payload: taskText });
      setTaskText('');
    }
  };

  return (
    <div>
      <h2>Cartas Favoritas</h2>
      <div className="mb-3">
        <input 
          type="text" 
          className="form-control" 
          placeholder="Nueva carta" 
          value={taskText} 
          onChange={(e) => setTaskText(e.target.value)} 
        />
        <button className="btn btn-primary mt-2" onClick={addTask}>Agregar Carta</button>
      </div>
      <ul className="list-group">
        {state.tasks.map(task => (
          <li key={task.id} className={`list-group-item d-flex justify-content-between align-items-center ${task.completed ? 'list-group-item-success' : ''}`}>
            <span onClick={() => dispatch({ type: 'TOGGLE_TASK', payload: task.id })} style={{ cursor: 'pointer' }}>
              {task.text}
            </span>
            <button className="btn btn-danger btn-sm" onClick={() => dispatch({ type: 'DELETE_TASK', payload: task.id })}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UseReducerPage;
