// app.js
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const produtosRouter = require('./routes/produtoRouter');

const app = express();
app.use(express.json());
app.use('/produtos', produtosRouter);

// 404 padrão
app.use((req, res) => res.status(404).json({ msg: 'Rota não encontrada' }));
 
// ⚠️ Só conecta no Atlas se NÃO estiver em teste
  const url =
    process.env.MONGODB_URI ||
    `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE}`;
  mongoose
    .connect(url)
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((err) => console.log('Erro ao conectar com MongoDB', err.message));


module.exports = app;
