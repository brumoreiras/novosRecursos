const pool = require('../conexao.js');
const bcrypt = require('bcrypt');
const { TestaCPF } = require('./validador.js');
const UsuarioFactory = require('../design/UsuarioFactory.js');



module.exports = {

    async registrarUsuario(req, res) {
        const { nome, cpf, email, senha, grupo } = req.body;
        console.log(req.body);

        try {
            const usuarioEncontrado = await pool.query(
                'SELECT * FROM usuarios WHERE email = $1',
                [email]
            );

            if (usuarioEncontrado.rows.length > 0) {
                return res.status(400).json({ mensagem: 'Já existe usuário cadastrado com e-mail informado' });
            }

            const usuario = await UsuarioFactory.criarUsuario(nome, cpf, email, senha, grupo);

            const cadastrarUsuario = await pool.query(
                'INSERT INTO usuarios (nome, cpf, email, senha, grupo) VALUES ($1, $2, $3, $4, $5) RETURNING id, nome, cpf, email, senha, grupo',
                [usuario.nome, usuario.cpf, usuario.email, usuario.senha, usuario.grupo]
            );

            return res.status(201).json({ mensagem: 'Cadastro realizado com sucesso!', usuario: cadastrarUsuario.rows[0] });

        } catch (error) {
            console.error('Ocorreu um erro ao registrar o usuário:', error);
            return res.status(500).json({ mensagem: 'Erro interno do servidor' });
        }
    },

    /* async registrarUsuario(req, res) { // está cadastrando e criptografando a senha
        const { nome, cpf, email, senha, grupo } = req.body;
        console.log(req.body)

        try {
            const usuarioEncontrado = await pool.query(
                'SELECT * FROM usuarios WHERE email = $1',
                [email]
            );

            const crypSenha = await bcrypt.hash(senha, 10);         

            if (usuarioEncontrado.rows.length > 0) {
                return res.status(400).json({ mensagem: 'Já existe usuário cadastrado com e-mail informado' });
            }



            const cadastrarUsuario = await pool.query(
                'INSERT INTO usuarios (nome, cpf, email, senha, grupo) VALUES ($1, $2, $3, $4, $5) RETURNING id, nome, cpf, email, senha, grupo',
                [nome, cpf, email, crypSenha, grupo]
            );

            return res.status(201).json({ mensagem: 'Cadastro realizado com sucesso!', usuario: cadastrarUsuario.rows[0] });


        } catch (error) {
            console.error('Ocorreu um erro ao registrar o usuário:', error);
            return res.status(500).json({ mensagem: 'Erro interno do servidor' });
        }
    }, */

    /*     async getUsuario(req, res) {
            console.log('req usuario ', req.usuario);
            try {
                console.log('req usuario ', req.usuario);
                return res.json(req.usuario);
            } catch (error) {
                console.error("Simulando erro", error)
                return res.status(500).json({ mensagem: 'Erro interno do servidor' });
            }
        }, */
    async getUsuario(req, res) {
        const { id } = req.query;
        console.log('User ID: ', id);
        try {
            // Assuming you have a User model with a findById method
            const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id])
            if (result.rows.length === 0) {
                return res.status(404).json({ mensagem: 'Usuário não encontrado' });
            }
            console.log('Usuario encontrado:', result.rows[0])
            return res.json(result.rows[0]);
        } catch (error) {
            console.error("Simulando erro", error)
            return res.status(500).json({ mensagem: 'Erro interno do servidor' });
        }
    },

    async atualizarUsuario(req, res) {
        const { id } = req.query;
        const { nome, senha, grupo } = req.body;

        try {
            console.log('Dados recebidos na requisição:', req.body); // Log dos dados recebidos na requisição

            /*       if (grupo && grupo !== req.usuario.grupo) {
                      console.log('Permissão negada: grupo de usuário diferente do grupo atual.'); // Log da negação de permissão
                      return res.status(403).json({ mensagem: 'Você não tem permissão para alterar o grupo do usuário' });
                  } */

            let crypSenha = null;
            if (senha) {
                crypSenha = await bcrypt.hash(senha, 10);
            }

            await pool.query(
                'UPDATE usuarios SET nome = $1, grupo = $2, senha = $3 WHERE id = $4',
                [nome, grupo, crypSenha, id]
            );

            console.log('Usuário atualizado com sucesso.'); // Log de sucesso na atualização do usuário
            return res.status(200).end();

        } catch (error) {
            console.error('Ocorreu um erro durante a atualização do usuário:', error);
            return res.status(500).json({ mensagem: 'Erro interno do servidor' });
        }
    },


    async listarUsuarios(req, res) { // foi implementado do zero 
        try {
            let query = 'SELECT id, nome, email, grupo, ativo FROM usuarios';

            console.log('Query executada:', query); // Log da query executada

            const usuarios = await pool.query(query);
            console.log('Número de usuários encontrados:', usuarios.rows.length); // Log do número de usuários encontrados
            return res.status(200).json(usuarios.rows);

        } catch (error) {
            console.error('Erro ao listar usuários:', error); // Log de erros
            return res.status(500).json({ mensagem: 'Erro interno do servidor' });
        }
    },

    async alterarStatusUsuario(req, res) {
        const { id } = req.query; // Use req.query para acessar os parâmetros de query
        let { ativo } = req.body;
        console.log(req.body)

        if (ativo)
            ativo = false
        else
            ativo = true

        console.log('ativo req  :::: ', ativo)

        try {
            const { rowCount } = await pool.query(
                'UPDATE usuarios SET ativo = $1 WHERE id = $2',
                [ativo, id]
            );

            if (rowCount === 0) {
                return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
            }

            return res.status(200).json({ mensagem: 'Status do usuário alterado com sucesso.', ativo });

        } catch (error) {
            return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
        }
    },

    async buscarUsuarios(req, res) {
        const { query } = req.query;
        console.log('Query:', query);

        if (!query) {
            return res.status(400).json({ mensagem: 'Query de busca não fornecida' });
        }

        try {
            const usuarios = await pool.query(
                'SELECT id, nome, email, grupo, ativo FROM usuarios WHERE nome ILIKE $1 OR email ILIKE $1',
                [`%${query}%`]
            );

            return res.status(200).json(usuarios.rows);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            return res.status(500).json({ mensagem: 'Erro interno do servidor' });
        }
    },

    async deletarUsuario(req, res) {
        const { id } = req.query;
        console.log('id :::: ', id)
        console.log('id :::: ', req.query)

        try {
            const result = await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);

            if (result.rowCount === 0) {
                return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
            }

            return res.status(200).json({ mensagem: 'Usuário deletado com sucesso.' });
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
        }
    }




}


