import jwt from 'jsonwebtoken';

// JWT token hitelesítő middleware
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Az "Bearer TOKEN" formátumból kinyerjük a tokent
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Fehlendes Token, Zugriff verweigert!' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(401).json({ message: 'Ungültiges oder abgelaufenes Token!' });
    }

    req.user = decodedUser;
    next();
  });
};

export const isAdmin = (req, res, next) => {

  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      message: 'Zugriff verweigert!'
    });
  }
};