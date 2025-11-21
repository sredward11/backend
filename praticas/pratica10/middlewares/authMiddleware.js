const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

function verificarToken(req, res, next) {
     const { authorization } = req.headers;
    try {
     const payload = jwt.verify(authorization, process.env.JWT_SECRET);
        req.usuario = payload;
        next();
    } catch (error) {
        console.log(error);

        return res.status(401).json({ msg: "Token invalido" });
    }
}

function gerarToken(payload) {
    try {
        const expiresIn = process.env.JWT_EXPIRES;
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
    } catch (error) {
         console.log(error);
        throw new Error("Erro ao gerar o token");
    }
}

function cifrarSenha(senha) {
    const salto = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(senha, salto);
    return hash;
}

function compararSenha(senha, hash) {
    return bcrypt.compareSync(senha, hash);
}

module.exports = { verificarToken, gerarToken, cifrarSenha, compararSenha };