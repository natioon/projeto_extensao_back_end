const db = require('../config/db');

const listarAvaliacoesPorLoja = async (req, res) => {
    try {
        const { id_loja } = req.params;

        const resultado = await db.query(
            `SELECT id_avaliacao, id_loja, nota, comentario, data_avaliacao 
             FROM avaliacao 
             WHERE id_loja = $1 
             ORDER BY data_avaliacao DESC`,
            [id_loja]
        );

        return res.status(200).json(resultado.rows);
    } catch (error) {
        console.error('Erro ao listar avaliações:', error);
        return res.status(500).json({ error: 'Erro ao listar avaliações' });
    }
};

const criarAvaliacao = async (req, res) => {
    try {
        const { id_loja } = req.params;
        const { nota, comentario } = req.body;

        if (!nota || nota < 1 || nota > 5) {
            return res.status(400).json({ 
                error: 'A nota é obrigatória e deve ser um número entre 1 e 5' 
            });
        }

        const lojaExiste = await db.query('SELECT 1 FROM loja WHERE id_loja = $1', [id_loja]);
        if (lojaExiste.rowCount === 0) {
            return res.status(404).json({ error: 'Loja não encontrada para avaliação' });
        }

        const resultado = await db.query(
            `INSERT INTO avaliacao (id_loja, nota, comentario) 
             VALUES ($1, $2, $3) 
             RETURNING id_avaliacao, id_loja, nota, comentario, data_avaliacao`,
            [id_loja, nota, comentario || null]
        );

        return res.status(201).json(resultado.rows[0]);
    } catch (error) {
        console.error('Erro ao registrar avaliação:', error);
        return res.status(500).json({ error: 'Erro ao registrar avaliação' });
    }
};

const obterMediaLoja = async (req, res) => {
    try {
        const { id_loja } = req.params;

        const resultado = await db.query(
            `SELECT 
                ROUND(AVG(nota)::numeric, 1) AS media,
                COUNT(id_avaliacao)::int AS total_avaliacoes
             FROM avaliacao 
             WHERE id_loja = $1`,
            [id_loja]
        );

        const dados = resultado.rows[0];
        const resposta = {
            id_loja: Number(id_loja),
            media: dados.media !== null ? parseFloat(dados.media) : 0,
            total_avaliacoes: dados.total_avaliacoes
        };

        return res.status(200).json(resposta);
    } catch (error) {
        console.error('Erro ao calcular média da loja:', error);
        return res.status(500).json({ error: 'Erro ao calcular média da loja' });
    }
};

module.exports = {
    listarAvaliacoesPorLoja,
    criarAvaliacao,
    obterMediaLoja
};