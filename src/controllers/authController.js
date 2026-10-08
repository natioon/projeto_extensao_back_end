const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const inserirUsuario = async (req, res) => {
    try {
        const { nome, email, senha, cpf_cnpj } = req.body;
        const saltRounds = 10;
        const senhaHash = await bcrypt.hash(senha, saltRounds);
        const resultado = await db.query(
            'INSERT INTO comerciante (nome, email, senha, cpf_cnpj) VALUES ($1, $2, $3, $4) RETURNING id_comerciante, nome, email, cpf_cnpj',
            [nome, email, senhaHash, cpf_cnpj]
        );
        return res.status(201).json(resultado.rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ error: 'Email ou CPF/CNPJ já cadastrado' });
        }

        console.error('Erro ao inserir usuário:', error);
        return res.status(500).json({ error: 'Erro ao inserir usuário' });
    }
};

const loginUsuario = async (req, res) => {
    try {
        const { email, senha } = req.body;
        if (!email || !senha) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }
        const resultado = await db.query('SELECT * FROM comerciante WHERE email = $1', [email]);
        if (resultado.rowCount === 0) {
            return res.status(401).json({ error: 'Email ou senha inválidos' });
        }
        const usuario = resultado.rows[0];
        const senhaValida = await bcrypt.compare(senha,usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ error: 'Email ou senha inválidos' });
        }
        const payload = { id_comerciante: usuario.id_comerciante, nome: usuario.nome, email: usuario.email };
        const secretKey = process.env.JWT_SECRET || 'segredo';
        const token = jwt.sign(payload, secretKey, { expiresIn: '3h' });
        return res.status(200).json({
            message: 'Login realizado com sucesso!',
            token,
            usuario: {
                id_comerciante: usuario.id_comerciante,
                nome: usuario.nome,
                email: usuario.email
            }
        });

    } catch (error) {
        console.error('Erro no login:', error);
        return res.status(500).json({ error: 'Erro ao processar login' });
    }
};

const obterPerfilUsuario = async (req, res) => {
    try {
        const { id_comerciante } = req.user;
        const resultado = await db.query('SELECT id_comerciante, nome, email, cpf_cnpj FROM comerciante WHERE id_comerciante = $1', [id_comerciante]);
        if (resultado.rowCount === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        return res.status(200).json(resultado.rows[0]);
    } catch (error) {
        console.error('Erro ao obter perfil do usuário:', error);
        return res.status(500).json({ error: 'Erro ao obter perfil do usuário' });
    }
};

module.exports = {
    inserirUsuario,
    loginUsuario,
    obterPerfilUsuario
};