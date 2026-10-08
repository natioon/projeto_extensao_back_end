const db = require('../config/db');

const listarLojas = async (req, res) => {
    try {
        const { bairro } = req.query;
        let sqltexto = 'SELECT * FROM loja';
        let parametro = [];

        if (bairro) {
            sqltexto += ' WHERE bairro ILIKE $1';
            parametro.push(`%${bairro}%`);
        }
        const resultado = await db.query(sqltexto, parametro);
        return res.status(200).json(resultado.rows);

    } catch (error) {
        console.error('Erro ao listar lojas:', error);
        return res.status(500).json({ error: 'Erro ao listar lojas' });
    }
};
const BuscarLojaPorId = async (req, res) => {
    try { const {loja_id} = req.params;
    const resultado = await db.query('SELECT * FROM loja WHERE id_loja = $1', [loja_id]);
    if (resultado.rowCount === 0) {
        return res.status(404).json({ error: 'Loja não encontrada' });
    }
    return res.status(200).json(resultado.rows[0]);
    } catch (error) {
        console.error('Erro ao buscar loja por ID:', error);
        return res.status(500).json({ error: 'Erro ao buscar loja por ID' });
    }       
};
const listarLojasDoComerciante = async (req, res) => {
    try {
        const id_comerciante = req.user.id_comerciante; 
        const resultado = await db.query('SELECT * FROM loja WHERE id_comerciante = $1', [id_comerciante]);
        return res.status(200).json(resultado.rows);
    } catch (error) {
        console.error('Erro ao listar lojas do comerciante:', error);
        return res.status(500).json({ error: 'Erro interno ao buscar lojas.' });
    }
};
const criarLoja = async (req, res) => {
    try {
        const {id_comerciante} = req.user;
        const { nome_fantasia, whatsapp, bairro, endereco } = req.body;
        const resultado = await db.query('INSERT INTO loja (id_comerciante,nome_fantasia, whatsapp, bairro, endereco) VALUES ($1, $2, $3, $4, $5) RETURNING *', [id_comerciante, nome_fantasia, whatsapp, bairro, endereco]);
        return res.status(201).json(resultado.rows[0]);
    } catch (error) {
        console.error('Erro ao criar loja:', error);
        return res.status(500).json({ error: 'Erro ao criar loja' });
    }
};
const atualizarLoja = async (req, res) => {
    try {
        const { loja_id } = req.params;
        const {id_comerciante} = req.user;
        const { nome_fantasia, whatsapp, bairro, endereco } = req.body;
        const resultado = await db.query('UPDATE  loja SET nome_fantasia = COALESCE($1, nome_fantasia), whatsapp = COALESCE($2, whatsapp), bairro = COALESCE($3, bairro), endereco = COALESCE($4, endereco) WHERE id_loja = $5 AND id_comerciante = $6 RETURNING *', [nome_fantasia, whatsapp, bairro, endereco, loja_id,id_comerciante]);
        if (resultado.rowCount === 0) {
            return res.status(404).json({ error: 'Loja não encontrada ou você não tem permissão para atualizar esta loja' });
        }
        return res.status(200).json(resultado.rows[0]);
    } catch (error) {
        console.error('Erro ao atualizar loja:', error);
        return res.status(500).json({ error: 'Erro ao atualizar loja' });
    }
}

const deletarLoja = async (req, res) => {
    try {
        const { loja_id } = req.params;
        const {id_comerciante} = req.user;
        const resultado = await db.query('DELETE FROM loja WHERE id_loja = $1 AND id_comerciante = $2 RETURNING *', [loja_id,id_comerciante]); 
        if (resultado.rowCount === 0) {
            return res.status(404).json({ error: 'Loja não encontrada ou você não tem permissão para deletar esta loja' });
        }
        return res.status(200).json({ message: 'Loja deletada com sucesso' });         
    } catch (error) {
        console.error('Erro ao deletar loja:', error);
        return res.status(500).json({ error: 'Erro ao deletar loja' });
    }
}
module.exports = {
    listarLojas,
    BuscarLojaPorId,
    criarLoja,
    atualizarLoja,
    deletarLoja,
    listarLojasDoComerciante,

};