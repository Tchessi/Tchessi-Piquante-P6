# Tchessi-Piquante-P6

Projet 6 - Construire une API sécurisée pour l'application d'avis gastronomiques
# Objectifs du projet
Développer dune application web nommée "Piquante" dans laquelle les utilisateurs peuvent ajouter leurs sauces préférées et liker ou disliker les sauces proposées par les autres utilisateurs. Le but est de créer le backend de l'application, le frontend étant déjà codé et fourni.
# Les technique utilisés
Développement Backend en Javascript
Serveur Node.js,
Framework Express,
Utiliser la base de données MongoDB,
API REST

# MESURES DE SECURITE MISE EN PLACE
.Hashage du mot de passe utilisateur avec bcrypt

.Cryptage des emails utilisateurs dans la base de données avec crypto-js

.Manupulation sécurisée de la base de donnée avec mongoose

.Vérification que l'email utilisateur soit unique dans la base de données avec mongoose-unique-validator

.Utilisation de variables d'environnement pour les données sensibles avec dotenv

.Authentification de l'utilisateur par token avec jsonwebtoken

# Tester l'application

1 - Cloner le repository, et le lancer :

Dans un terminal, accéder au dossier du frontend

Installer les dépendances avec: npm install

Lancer le frontend avec: npm start

2 - Lancer le backend

Dans un autre terminal, accéder au dossier du backend

Installer les dépendances: npm install

Lancer le backend avec : nodemon server

3 - Le frontend est accessible à l'adresse http://localhost:4200

4 - Pour des tests spécifiques (avec postman par exemple), le backend répond à l'adresse: http://localhost:3000

