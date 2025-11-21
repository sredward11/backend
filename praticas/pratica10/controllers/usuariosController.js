const { cifrarSenha, gerarToken, compararSenha } = require('../middlewares/authMiddleware');
const usuariosModel = require('../models/usuariosModel');

async function criar(req, res) {
    try {
        const senhaCifrada = cifrarSenha(req.body.senha);
        const novoUsuario = await usuariosModel.create({
            email: req.body.email,
            senha: senhaCifrada
        });
        res.status(201).json({ _id: novoUsuario._id, email: novoUsuario.email });
    } catch (error) {
        res.status(422).json({ msg: "Email e Senha são obrigatórios" });
    }
}

async function entrar(req, res) {
    const usuarioEncontrado = await usuariosModel.findOne({ email: req.body.usuario });

    if (usuarioEncontrado) {
        const senhaConfere = compararSenha(req.body.senha, usuarioEncontrado.senha);
        if (senhaConfere) {
            const token = gerarToken({ email: req.body.usuario });
            return res.status(200).json({ token });
        }
    }
    return res.status(401).json({ msg: "Credenciais inválidas" });
}

async function renovar(req, res) {
    const token = gerarToken({ email: req.usuario.email }); // req.usuario vem do middleware
    res.status(200).json({ token });
}

async function remover(req, res) {
    // Nota: req.params.id exige que a rota seja definida como /:id
    await usuariosModel.findOneAndDelete({ _id: req.params.id });
    res.status(204).end();
}

module.exports = { criar, entrar, renovar, remover };