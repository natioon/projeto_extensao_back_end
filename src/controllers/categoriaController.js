const db = require('../config/db'); // Confirme se o caminho do seu db é esse mesmo

const listarCategorias = async (req, res) => {
    try {
        const resultado = await db.query('SELECT * FROM categoria');
        return res.status(200).json(resultado.rows);
    } catch (error) {
        console.error('Erro ao listar categorias:', error);
        return res.status(500).json({ error: 'Erro ao buscar categorias' });
    }
};

module.exports = {
    listarCategorias
};