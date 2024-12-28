import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    motDePasse: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      alert('Connexion réussie');
      console.log('Token JWT:', response.data.token);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Erreur lors de la connexion');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Se connecter</h2>
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input name="motDePasse" type="password" placeholder="Mot de passe" onChange={handleChange} required />
      <button type="submit">Se connecter</button>
    </form>
  );
};

export default Login;
