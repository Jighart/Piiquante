// Import du schéma de données
const Sauce = require('../models/Sauce');

// Import du package file system
const fs = require('fs');

// Controleur de la route POST
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};

// Controleur de la route GET (récupération d'une sauce spécifique)
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
        res.status(200).json(sauce);
    })
    .catch((error) => {
        res.status(404).json({
        error: error
        });
    });
};

// Controleur de la route PUT
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

// Controleur de la route DELETE
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// Controleur de la route GET (récupération de toutes les sauces)
exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

// Controleur de la fonction like
exports.likeSauce = function (req, res, next) {
    Sauce.findOne({ _id: req.params.id })
    .then(function (likedSauce) {
        switch (req.body.like) {

          // Like
          case 1:
            if (!likedSauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
              Sauce.updateOne({ _id: req.params.id },
                {
                  $inc: { likes: 1 }, $push: { usersLiked: req.body.userId }
                })
                .then(function () {
                  res.status(201).json({ message: "La sauce a été likée !" });
                })
                .catch(function (error) {
                  res.status(400).json({ error: error });
                });
            }
            break;

          // Dislike
          case -1:
            if (!likedSauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
              Sauce.updateOne({ _id: req.params.id },
                { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId }, }
              )
                .then(function () {
                  res.status(201).json({ message: "La sauce a été dislikée !" });
                })
                .catch(function (error) {
                  res.status(400).json({ error: error });
                });
            }
            break;

          // Annulation du like
          case 0:
            if (likedSauce.usersLiked.includes(req.body.userId)) {
              Sauce.updateOne({ _id: req.params.id },
                { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId }, }
              )
                .then(function () {
                  res.status(201).json({ message: "Le like de la sauce a été annulé !" });
                })
                .catch(function (error) {
                  res.status(400).json({ error: error });
                });
            }
            
            // Annulation du dislike 
            if (likedSauce.usersDisliked.includes(req.body.userId)) {
              Sauce.updateOne(
                { _id: req.params.id },
                { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId }, }
              )
                .then(function () {
                  res.status(201).json({ message: "Le dislike de la sauce a été annulé !" });
                })
                .catch(function (error) {
                  res.status(400).json({ error: error });
                });
            }
            break;
        }
      })
      .catch(function (error) {
        res.status(404).json({ error: error });
      });
  };