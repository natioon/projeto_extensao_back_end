const express = require('express');
const router = express.Router();

const { 
    listarAvaliacoesPorLoja, 
    criarAvaliacao, 
    obterMediaLoja 
} = require('../controllers/avaliacaoController');

// Rotas públicas de interação do cliente
router.get('/loja/:id_loja', listarAvaliacoesPorLoja);
router.get('/loja/:id_loja/media', obterMediaLoja);
router.post('/loja/:id_loja', criarAvaliacao);

module.exports = router;