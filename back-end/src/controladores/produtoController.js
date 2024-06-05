/* const pool = require('../conexao.js');
const multer = require('multer');
const path = require('path');

// Configuração do armazenamento das imagens com o Multer
const storage = multer.diskStorage({
    destination: '../../uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB para o tamanho do arquivo
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb("Erro: Arquivo deve ser uma imagem válida (jpeg, jpg, png)");
    }
}).array('images', 10); // Permite o upload de até 10 imagens

async function verificarProdutoExistente(nome) {
    const dados = await pool.query('SELECT * FROM produtos WHERE nome = $1', [nome]);
    return dados.rows.length > 0;
}

async function inserirProduto(nome, avaliacao, descricao, preco, qtd_estoque) {
    const result = await pool.query(
        'INSERT INTO produtos (nome, avaliacao, descricao, preco, qtd_estoque) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [nome, avaliacao, descricao, preco, qtd_estoque]
    );
    return result.rows[0].id;
}

async function inserirImagens(produtoId, files) {
    const imagensPromises = files.map(file => {
        const caminhoImagem = file.path;
        return pool.query(
            'INSERT INTO imagens (produto_id, caminho, padrao) VALUES ($1, $2, $3)',
            [produtoId, caminhoImagem, false]
        );
    });
    await Promise.all(imagensPromises);
}

module.exports = {
    cadastroProdutos: (req, res) => {
        upload(req, res, async (err) => {
            if (err) {
                console.error('Erro ao fazer upload da imagem:', err);
                return res.status(500).json({ mensagem: 'Erro interno do servidor ao fazer upload da imagem' });
            }

            const { nome, avaliacao, descricao, preco, qtd_estoque } = req.body;
            if (!nome || !avaliacao || !descricao || !preco || !qtd_estoque) {
                return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
            }

            try {
                if (await verificarProdutoExistente(nome)) {
                    return res.status(400).json({ mensagem: 'Produto já cadastrado' });
                }

                const produtoId = await inserirProduto(nome, avaliacao, descricao, preco, qtd_estoque);
                await inserirImagens(produtoId, req.files);

                return res.status(201).json({ id: produtoId, nome, avaliacao, descricao, preco, qtd_estoque, imagens: req.files });
            } catch (error) {
                console.error('Erro ao cadastrar produto:', error);
                return res.status(500).json({ mensagem: 'Erro interno do servidor' });
            }
        });
    }, 
    listarProdutos(){}
};
 */

const pool = require('../conexao.js');
const multer = require('multer');
const path = require('path');

// Configuração do armazenamento das imagens com o Multer
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB para o tamanho do arquivo
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb("Erro: Arquivo deve ser uma imagem válida (jpeg, jpg, png)");
    }
}).array('images', 10); // Permite o upload de até 10 imagens

async function verificarProdutoExistente(nome) {
    const dados = await pool.query('SELECT * FROM produtos WHERE nome = $1', [nome]);
    return dados.rows.length > 0;
}

async function inserirProduto(nome, avaliacao, descricao, preco, qtd_estoque) {
    const result = await pool.query(
        `INSERT INTO produtos (nome, avaliacao, descricao, preco, qtd_estoque, ativo, criado_em)
         VALUES ($1, $2, $3, $4, $5, TRUE, CURRENT_TIMESTAMP) RETURNING id`,
        [nome, avaliacao, descricao, preco, qtd_estoque]
    );
    return result.rows[0].id;
}

async function inserirImagens(produtoId, files) {
    const imagensPromises = files.map(file => {
        const caminhoImagem = file.path;
        return pool.query(
            'INSERT INTO imagens (produto_id, caminho, padrao) VALUES ($1, $2, $3)',
            [produtoId, caminhoImagem, false]
        );
    });
    await Promise.all(imagensPromises);
}



module.exports = {
    cadastroProdutos: (req, res) => {
        upload(req, res, async (err) => {
            if (err) {
                console.error('Erro ao fazer upload da imagem:', err);
                return res.status(500).json({ mensagem: 'Erro interno do servidor ao fazer upload da imagem' });
            }

            const { nome, avaliacao, descricao, preco, qtd_estoque } = req.body;
            if (!nome || !avaliacao || !descricao || !preco || !qtd_estoque) {
                return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
            }

            try {
                if (await verificarProdutoExistente(nome)) {
                    return res.status(400).json({ mensagem: 'Produto já cadastrado' });
                }

                const produtoId = await inserirProduto(nome, avaliacao, descricao, preco, qtd_estoque);
                await inserirImagens(produtoId, req.files);

                return res.status(201).json({ id: produtoId, nome, avaliacao, descricao, preco, qtd_estoque, imagens: req.files });
            } catch (error) {
                console.error('Erro ao cadastrar produto:', error);
                return res.status(500).json({ mensagem: 'Erro interno do servidor' });
            }
        });
    },
    async listarProdutos(req, res) {
        try {
            let query = 'SELECT id, nome, qtd_estoque, ativo AS status FROM produtos';
            const produto = await pool.query(query);
            return res.status(200).json(produto.rows);
        } catch (error) {
            console.error('Erro ao listar produtos:', error);
            return res.status(500).json({ mensagem: 'Erro interno do servidor' });
        }
    },
    async obterProduto(req, res) {
        const { id } = req.query;
        try {
            // Consulta para obter os dados do produto e suas imagens associadas
            const query = `
                SELECT 
                    p.*, 
                    i.caminho 
                FROM 
                    produtos p 
                LEFT JOIN 
                    imagens i 
                ON 
                    p.id = i.produto_id 
                WHERE 
                    p.id = $1
            `;
            const { rows } = await pool.query(query, [id]);

            // Verifica se o produto foi encontrado
            if (rows.length === 0) {
                return res.status(404).json({ mensagem: 'Produto não encontrado' });
            }

            // Organiza os dados do produto e suas imagens em um objeto
            const produto = {
                id: rows[0].id,
                nome: rows[0].nome,
                avaliacao: rows[0].avaliacao,
                descricao: rows[0].descricao,
                preco: rows[0].preco,
                qtd_estoque: rows[0].qtd_estoque,
                imagens: rows.map(row => row.caminho).filter(caminho => caminho) // Filtra caminhos nulos
            };

            return res.status(200).json(produto);
        } catch (error) {
            console.error('Erro ao obter produto:', error);
            return res.status(500).json({ mensagem: 'Erro interno do servidor' });
        }
    }

};
