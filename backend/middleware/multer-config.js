// On importe multer qui est un package qui permet de gérer les fichiers entrants dans les requêtes HTTP
const multer = require('multer');

// Création d'un objet pour ajouter une extention en fonction du type mime du ficher
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

// Création d'un objet de configuration pour préciser à multer à quel endroit enregistrer les fichiers images et les renommer
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // chemin d'enregistrement des images
    callback(null, 'images'); // On passe le dossier images qu'on a créé dans le backend
  },
  // On dit à multer quel nom de fichier on utilise pour éviter les doublons
  filename: (req, file, callback) => {
    // On génère un nouveau nom avec le nom d'origine, on supprime les espaces (white space avec split) et on insère des underscores à la place
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    // On appelle le callback, on passe null pour dire qu'il n'y a pas d'erreur
    // Genère le nom complet du fichier- Nom d'origine + numero unique + . + extension
    callback(null, name + Date.now() + '.' + extension);
  },
});
// On export le module, on lui passe l'objet storage, la méthode single pour dire que c'est un fichier unique et on précise que c'est une image
module.exports = multer({ storage: storage }).single('image');
