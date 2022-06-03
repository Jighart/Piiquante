// Import d'Express
const express = require('express');
const app = express();
app.use(express.json());

// Import de mongoDB
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Piiquante:HotSauce123@piiquante.4jumh.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Chemin d'accès à un fichier téléchargé par l'utilisateur
const path = require('path');

// Import des routes
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// Ajout des Middlewares d'autorisation
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Middleware de téléchargement d'images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Mise en place des routes
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

// Export et exploitation de l'API
module.exports = app;