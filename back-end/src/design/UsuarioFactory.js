const Usuario = require('./Usuario');
const bcrypt = require('bcrypt');

class UsuarioFactory {
    static async criarUsuario(nome, cpf, email, senha, grupo) {
        const crypSenha = await bcrypt.hash(senha, 10);
        return new Usuario(nome, cpf, email, crypSenha, grupo);
    }
}

module.exports = UsuarioFactory;
