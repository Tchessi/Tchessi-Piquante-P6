//***** Contient les fonctions qui s'appliquent ausx différentes routes pour les utilisateur *****/

const express = require('express'); // On importe express
const router = express.Router(); // On crée un routeur avec la méthode mise à disposition par Express

const userCtrl = require('../controllers/user'); // On associe les fonctions aux différentes routes
const checkEmail = require('../middleware/check-email');
//const checkPassword = require('../middleware/check-password');

router.post('/signup', checkEmail, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
