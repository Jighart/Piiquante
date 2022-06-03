const jwt = require('jsonwebtoken');

// Gestion de l'authentification et du token
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'Nz3egZsKxsJHmkd95z54wd7Eo6rzBFyh');
    const userId = decodedToken.userId;
    req.auth = { userId };
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({ error: new Error('Invalid request!') });
  }
};