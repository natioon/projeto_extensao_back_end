const express = require('express');
const router = express.Router();

const { 
    inserirUsuario, 
    loginUsuario, 
    obterPerfilUsuario 
} = require('../controllers/authController');

const authmiddleware = require('../middlewares/authMiddleware');

// Rotas públicas
router.post('/cadastrar', inserirUsuario);
router.post('/login', loginUsuario);

// Rota protegida
router.get('/perfil', authmiddleware, obterPerfilUsuario);

module.exports = router;