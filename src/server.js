const cors = require('cors'); 
const express = require('express');
const app = express();
app.use(express.json());
app.use(cors()); 
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const lojaRoutes = require('./routes/lojaRoutes');
const avaliacaoRoutes = require('./routes/avaliacaoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');

app.use('/categorias', categoriaRoutes);
app.use('/auth', authRoutes);
app.use('/produtos', produtoRoutes);
app.use('/lojas', lojaRoutes);
app.use('/avaliacoes', avaliacaoRoutes);    

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
