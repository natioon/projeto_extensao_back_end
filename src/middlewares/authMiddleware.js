const jwt = require('jsonwebtoken');
const authmiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if(!token) {
    return res.status(401).json({ erro: 'Acesso negado'});
  }
  try {
    const secretKey = process.env.JWT_SECRET || 'segredo';
    const payloadDecod = jwt.verify (token, secretKey);
    req.user = payloadDecod;
    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return res.status(401).json({ erro: 'Token inválido'});
  }
};

module.exports = authmiddleware;