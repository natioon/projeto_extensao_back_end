const express = require('express');
const router = express.Router();

const {
   BuscarLojaPorId,
   listarLojas,
   criarLoja,
   atualizarLoja,
   deletarLoja,
   listarLojasDoComerciante,
} = require('../controllers/lojaController');

const authmiddleware = require('../middlewares/authMiddleware');
router.get('/minhas-lojas', authmiddleware, listarLojasDoComerciante);

// Rotas públicas (vitrine de lojas para clientes)
router.get('/', listarLojas);
router.get('/:id_loja', BuscarLojaPorId);

// Rotas privadas do comerciante (exigem token JWT)
router.post('/', authmiddleware, criarLoja);
router.put('/:id_loja', authmiddleware, atualizarLoja);
router.delete('/:id_loja', authmiddleware, deletarLoja);

module.exports = router;