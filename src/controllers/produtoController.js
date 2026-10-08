const db = require('../config/db');

const listarProdutosPorLoja = async (req, res) => {
    try {
        const { id_loja } = req.params;
        const resultado = await db.query('SELECT * FROM produto WHERE id_loja = $1 AND disponivel = true', [id_loja]);

        return res.status(200).json(resultado.rows);
    } catch (error) {
        console.error('Erro ao listar produtos por loja:', error);
        return res.status(500).json({ error: 'Erro ao listar produtos por loja' });
    }
};

const criarProduto = async (req, res) => {
    try {
        const { id_loja } = req.params;
        const { id_categoria, nome, descricao, preco } = req.body;
        const { id_comerciante } = req.user;
        const resultado = await db.query(
            `INSERT INTO produto (id_loja, id_categoria, nome, descricao, preco) 
             SELECT $1, $2, $3, $4, $5 
             WHERE EXISTS (
                 SELECT 1 FROM loja WHERE id_loja = $1 AND id_comerciante = $6
             ) 
             RETURNING *`,
            [id_loja, id_categoria, nome, descricao, preco, id_comerciante]
        );
        if (resultado.rowCount === 0) {
            return res.status(403).json({
                error: 'Loja não encontrada ou você não tem permissão para cadastrar produtos nela'
            });
        }
        return res.status(201).json(resultado.rows[0]);
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        return res.status(500).json({ error: 'Erro ao criar produto' });
    }
};
const atualizarProduto = async (req, res) => {
    try {
        const { id_produto } = req.params;
        const { id_categoria, nome, descricao, preco } = req.body;
        const { id_comerciante } = req.user;

        const resultado = await db.query(
            'UPDATE produto SET id_categoria = COALESCE($1, id_categoria), nome = COALESCE($2, nome), descricao = COALESCE($3, descricao), preco = COALESCE($4, preco) WHERE id_produto = $5 AND id_loja IN (SELECT id_loja FROM loja WHERE id_comerciante = $6) RETURNING *',
            [id_categoria, nome, descricao, preco, id_produto, id_comerciante]
        );

        if (resultado.rowCount === 0) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        return res.status(200).json(resultado.rows[0]);
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        return res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
};

const deletarProduto = async (req, res) => {
    try {
        const { id_produto } = req.params;
        const { id_comerciante } = req.user;

        const resultado = await db.query(
            'DELETE FROM produto WHERE id_produto = $1 AND id_loja IN (SELECT id_loja FROM loja WHERE id_comerciante = $2) RETURNING *',
            [id_produto, id_comerciante]
        );

        if (resultado.rowCount === 0) {
            return res.status(404).json({ error: 'Produto não encontrado Ou você não é o proprietário' });
        }

        return res.status(200).json({ message: 'Produto deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        return res.status(500).json({ error: 'Erro ao deletar produto' });
    }
};
const obterProdutoPorId = async (req, res) => {
    try {
        const { id_produto } = req.params;

        const resultado = await db.query(
            `SELECT id_produto, id_loja, id_categoria, nome, descricao, preco 
             FROM produto 
             WHERE id_produto = $1`,
            [id_produto]
        );

        if (resultado.rowCount === 0) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        return res.status(200).json(resultado.rows[0]);
    } catch (error) {
        console.error('Erro ao buscar produto por ID:', error);
        return res.status(500).json({ error: 'Erro ao buscar produto' });
    }
};
module.exports = {
    listarProdutosPorLoja,
    criarProduto,
    atualizarProduto,
    deletarProduto,
    obterProdutoPorId,
};