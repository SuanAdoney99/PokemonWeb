// src/components/Profile.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';
import '../styles/custom.css';

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h2>Perfil</h2>
      <p>Bienvenido, {user?.name}!</p>
    </div>
  );
};

export default Profile;
