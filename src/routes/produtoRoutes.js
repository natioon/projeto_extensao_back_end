const express = require('express');
const router = express.Router();

const { 
    listarProdutosPorLoja, 
    obterProdutoPorId, 
    criarProduto, 
    atualizarProduto, 
    deletarProduto 
} = require('../controllers/produtoController');

const authmiddleware = require('../middlewares/authMiddleware');

// Rotas públicas (cardápio/catálogo para os clientes)
router.get('/loja/:id_loja', listarProdutosPorLoja);
router.get('/:id_produto', obterProdutoPorId);

// Rotas privadas do comerciante (exigem token JWT)
router.post('/loja/:id_loja', authmiddleware, criarProduto);
router.put('/:id_produto', authmiddleware, atualizarProduto);
router.delete('/:id_produto', authmiddleware, deletarProduto);

module.exports = router;