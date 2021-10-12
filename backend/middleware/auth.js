// Récupération du package jsonwebtoken
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Vérification de TOKEN de l'utilisateur, s'il correspond à l'id de l'utilisateur dans la requête, il sera autorisé à changer les données correspondantes.

// Ce middleware sera appliqué à toutes les routes afin de les sécuriser
module.exports = (req, res, next) => {
  try {
    // On récupère le token dans le header de la requête autorisation, on récupère uniquement le deuxième élément du tableau (car split)
    const token = req.headers.authorization.split(' ')[1];
    // Vérification de token décodé avec la clé secrète initiéé avec la création du token encodé initialement (Cf Controller user), les clés doivent correspondre
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
    const userId = decodedToken.userId; // On vérifie que le userId envoyé avec la requête correspond au userId encodé dans le token
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      req.userId = userId;
      next();
    }
    // probleme d'autentification si erreur dans les inscrutions
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!'),
    });
  }
};
