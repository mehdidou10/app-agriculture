import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    administrateur: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Erreur lors de l\'inscription');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Créer un compte</h2>
      <input name="nom" placeholder="Nom" onChange={handleChange} required />
      <input name="prenom" placeholder="Prénom" onChange={handleChange} required />
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input name="motDePasse" type="password" placeholder="Mot de passe" onChange={handleChange} required />
      <label>
        <input name="administrateur" type="checkbox" onChange={handleChange} />
        Vous êtes administrateur ?
      </label>
      <button type="submit">Créer un compte</button>
    </form>
  );
};

export default Register;
