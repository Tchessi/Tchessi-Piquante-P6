// Récupération du modèle 'sauce' créé grâce à la fonction schéma de mongoose
const Sauce = require('../models/sauce');

// Récupération du module 'file system' de Node qui permet de gérer ici les téléchargements et modifications d'images
const fs = require('fs');
const sauce = require('../models/sauce');

/*** PERMET LA CREATION DE NOUVELLE 'SAUCE' */
exports.createSauce = (req, res, next) => {
  // Stockage des données soumises par le front-end sous forme de form-data dans une variable en les transformant en objet js
  const sauceObject = JSON.parse(req.body.sauce);

  // On supprime l'id généré automatiquement et envoyé par le front-end. L'id de la sauce est créé par la base MongoDB lors de la création dans la base
  delete sauceObject._id;

  //  Création d'une instance du modèle Sauce
  const sauce = new Sauce({
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],

    // Modification de  l'URL de l'image
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
  });

  // Sauvegarde de la sauce dans la base de données
  sauce
    .save()
    // Envoie de la response au frontend avec un statut 201
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
    .catch((error) => res.status(400).json({ error }));
};

/*** PERMET LA MODIFICATION DE "SAUCE" */
exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.userId) {
        res.status(403).json({
          message: 'Action non autorisée',
        });
        return;
      }
      const sauceObject = req.file
        ? {
            // On modifie les données et on ajoute la nouvelle image
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${
              req.file.filename
            }`,
          }
        : { ...req.body };
      Sauce.updateOne(
        { _id: req.params.id },
        { ...sauceObject, _id: req.params.id }
      )
        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ message: 'Souce non trouvée' }));
};

/*** PERMET LA SUPPRESSION DE "SAUCE" */
exports.deleteSauce = (req, res, next) => {
  // Avant de supprimer l'objet, on va le chercher pour obtenir l'url de l'image et supprimer le fichier image de la base
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.userId) {
        res.status(403).json({
          message: 'Action non autorisée',
        });
        return;
      }
      // Pour extraire ce fichier, on récupère l'url de la sauce, et on le split autour de la chaine de caractères, donc le nom du fichier
      const filename = sauce.imageUrl.split('/images/')[1];
      // Avec ce nom de fichier, on appelle unlink pour suppr le fichier
      fs.unlink(`images/${filename}`, () => {
        // On supprime le document correspondant dans la base de données
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// Récupération d'une sauce identifiée par son id depuis la base MongoDB
exports.getOneSauce = (req, res, next) => {
  // On utilise la méthode findOne et on lui passe l'objet de comparaison, on veut que l'id de la sauce soit le même que le paramètre de requête
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

// Récupération de toutes les sauces dans la base MongoDB
exports.getAllSauces = (req, res, next) => {
  // On utilise la méthode find pour obtenir la liste complète des sauces trouvées dans la base données
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// Mise en place des Like et Dislike des sauces
exports.likeDislikeSauce = (req, res, next) => {
  let like = req.body.like; // Like présent dans le body
  let userId = req.body.userId; // On récupère le userID
  let sauceId = req.params.id; // On récupère l'id de la sauce

  switch (like) {
    case 1:
      // En cas de Like on push l'utilisateur et on incrémente le compteur de 1
      Sauce.updateOne(
        { _id: sauceId },
        { $push: { usersLiked: userId }, $inc: { likes: +1 } }
      )
        .then(() => res.status(200).json({ message: `J'aime` }))
        .catch((error) => res.status(400).json({ error }));

      break;

    case 0:
      // Dislike
      Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
          if (sauce.usersLiked.includes(userId) != req.userId) {
            res.status(403).json({
              message: 'Action non autorisée',
            });
            return;
            Sauce.updateOne(
              { _id: sauceId },
              { $pull: { usersLiked: userId }, $inc: { likes: -1 } } // On incrémente de -1
            )
              .then(() => res.status(200).json({ message: `Neutre` }))
              .catch((error) => res.status(400).json({ error }));
          }
          // On annule un Dislike, on incrémente de -1
          if (sauce.usersDisliked.includes(userId)) {
            Sauce.updateOne(
              { _id: sauceId },
              { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } }
            )
              .then(() => res.status(200).json({ message: `Neutre` }))
              .catch((error) => res.status(400).json({ error }));
          }
        })
        .catch((error) => res.status(404).json({ error }));
      break;

    case -1:
      Sauce.updateOne(
        { _id: sauceId },
        { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } }
      )
        .then(() => {
          res.status(200).json({ message: `Je n'aime pas` });
        })
        .catch((error) => res.status(400).json({ error }));
      break;

    default:
      console.log(error);
  }
};
