// Création du router qui contient les fonctions qui s'appliquent aux différentes routes pour les sauces

// On importe express
const express = require('express');
// On appel le routeur avec la méthode mise à disposition par Express
const router = express.Router();

// On associe les fonctions aux différentes routes, on importe le controller
const sauceCtrl = require('../controllers/sauce');
//** Importation des Middleware */
// On importe le middleware auth pour sécuriser les routes
const auth = require('../middleware/auth');

//On importe le middleware multer pour la gestion des images
const multer = require('../middleware/multer-config');

const checkSauceInput = require('../middleware/check-sauce-input');

//** Création des route pour créer les 'sauces' */

router.post('/', auth, multer, checkSauceInput, sauceCtrl.createSauce); // Route qui permet de créer une sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce); // Route de permet de modifier une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce); // Route  qui permet de supprimer une sauce
router.get('/:id', auth, sauceCtrl.getOneSauce); // Route qui permet de récupérer une sauce precise
router.get('/', auth, sauceCtrl.getAllSauces); // Route qui permet de récupérer toutes les sauces
router.post('/:id/like', auth, sauceCtrl.likeDislikeSauce); // Route qui permet de gérer les Likes des sauces

module.exports = router;
