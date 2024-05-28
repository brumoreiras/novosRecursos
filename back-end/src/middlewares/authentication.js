const pool = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UsuarioLogado = require('../design/UsuarioLogado');

module.exports = {
    async authentication(req, res) {
        const { email, senha } = req.body;

        try {

            /* const usuarioL = UsuarioLogado.getInstance().getUsuario();
            if(usuarioL) {
                console.log("Usuário já está logado:", usuarioL);
                return res.status(200).json({mensagem: 'Usuário já está logado', usuario: usuarioL });
            }
            console.log("usuario autentic:. ", req); */

            const usuario = await pool.query(
                'SELECT * FROM usuarios WHERE email = $1',
                [email]
            );

            if (usuario.rowCount < 1) {
                return res.status(404).json({ mensagem: 'E-mail ou senha inválidos!' });
            }

            const validaSenha = await bcrypt.compare(senha, usuario.rows[0].senha);

            if (!validaSenha) {
                console.log("Senha inválida.");
                return res.status(400).json({ mensagem: 'E-mail ou senha inválidos!' });
            }


            const { senha: _, ...usuarioLogado } = usuario.rows[0];

            UsuarioLogado.getInstance().setUsuario(usuarioLogado);

            const token = jwt.sign(
                {
                    id: usuario.rows[0].id
                },
                'TESTEOK',
                { expiresIn: '1h' }
            );
            console.log("Usuário logado com sucesso:", usuarioLogado);
            return res.status(200).json({ usuario: usuarioLogado, token });

        } catch (error) {
            return res.status(500).json({ mensagem: 'Erro interno do servidor' });
        }
    },

    async validaToken(req, res, next) {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(401).json({ mensagem: 'Token não fornecido.' });
        }

        const token = authorization.split(' ')[1];

        try {
            const tokenUsuario = jwt.verify(token, 'TESTEOK')
            console.log('token do usuario ', tokenUsuario)
            const { id } = jwt.verify(token, 'TESTEOK')

            const { rows, rowCount } = await pool.query(
                'SELECT * FROM usuarios WHERE id = $1',
                [id]
            )

            if (rowCount < 1) {
                return res.status(401).json({ mensagem: 'Usuário não encontrado' })
            }

            req.usuario = rows[0]
            console.log(req.usuario)
            next();
        } catch (error) {
            return res.status(403).json({ mensagem: 'Token inválido.' });
        }
    },

    async logout(req, res) {
        try {
            // Limpar as informações de autenticação do usuário
            // Por exemplo, remover o token JWT do cabeçalho de autorização
            delete req.headers.authorization;
            console.log('Logout realizado com sucesso:', req.headers)
    

         
            console.log('Logout realizado com sucesso:  .', req.headers.authorization)
            console.log('Logout realizado com sucesso:  .', req.headers)

            // Ou, se você estiver usando cookies para armazenar o token, limpar o cookie
          

            // Se você estiver usando sessões, destrua a sessão do usuário
            

            // Ou, se você estiver usando uma biblioteca de autenticação como o Passport.js, use seu método de logout
          

            // Envie uma resposta indicando que o logout foi bem-sucedido
            return res.status(200).json({ mensagem: 'Logout realizado com sucesso.' });
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            return res.status(500).json({ mensagem: 'Erro interno do servidor' });
        }
    }


}
