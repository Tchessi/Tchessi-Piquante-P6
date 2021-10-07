/***On retrouve ici la logique métier en lien avec nos utilisateurs, appliqué aux routes POST pour les opérations d'inscription et de connexion */

// On utilise l'algorithme bcrypt pour hasher le mot de passe des utilisateurs
const bcrypt = require('bcrypt');

// Utilisation du package jsonwebtoken pour attribuer un token à un utilisateur lorqu'il se connecte
const jwt = require('jsonwebtoken');

// Configuration du package Dotenv
// chargement automatiquement des variables d'environnement d'un .env fichier dans l' process.env objet.
require('dotenv').config();

// Récupération du model User ,créer avec le schéma mongoose
const User = require('../models/User');

// Ce middleware sauvegarde un nouvel utilisateur et crypte son mot de passe avec un hash généré par bcrypt
exports.signup = (req, res, next) => {
  // On appelle la méthode hash de bcrypt et on lui passe le mdp de l'utilisateur et on le salte 10 fois
  bcrypt
    .hash(req.body.password, 10)
    // On récupère le hash du mdp qu'on enregiste en tant que nouvel utilisateur dans la base de données
    .then((hash) => {
      // Création du nouvel utilisateur avec le model mongoose
      const user = new User({
        // On passe l'email qu'on trouve dans le corps de la requête
        email: req.body.email,
        password: hash, // On récupère le mdp hashé de bcrypt
      });

      // On enregistre l'utilisateur dans la base de données
      user
        .save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Lors de la connexion d'un utilisateur on verifie si l'utilisateur existe déjà dans la base de données lors du login
//si oui il vérifie son mot de passe, s'il est bon il renvoie un TOKEN contenant l'id de l'utilisateur, sinon il renvoie une erreur
exports.login = (req, res, next) => {
  // On trouve l'utilisateur dans la BDD qui correspond à l'adresse entrée par l'utilisateur
  User.findOne({ email: req.body.email })
    .then((user) => {
      // Si on trouve pas l'utilisateur on va renvoyer un code 401 "Utilisateur non trouvé!"
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      // On utilise bcrypt pour comparer les hashs et savoir si ils ont la même chaine de caratères d'origine
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          // Si c'est invalide(false), c'est que ce n'est pas le bon utilisateur, ou le mot de passe est incorrect
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          // Si true, on renvoie un statut 200 et un objet JSON avec un userID + un token
          res.status(200).json({
            userId: user._id, //On vérifie si la requête est authentifiée
            // Encode un nouveau token avec une chaine de développement temporaire avec une expiration au bout de 24h
            token: jwt.sign({ userId: user._id }, process.env.SECRET_TOKEN, {
              expiresIn: '24h',
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
