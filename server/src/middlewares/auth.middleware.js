import jwt from 'jsonwebtoken';

// authenticateToken middleware to verify JWT token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ 
      message: 'Fehlendes Token, Zugriff verweigert!' 
    });
  }

  const token = authHeader.slice(7);

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(401).json({ message: 'Ungültiges oder abgelaufenes Token!' });
    }

    req.user = decodedUser;
    next();
  });
};

// Allow only admin users to access certain routes
export const isAdmin = (req, res, next) => {

  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      message: 'Zugriff verweigert!'
    });
  }
  next();
};