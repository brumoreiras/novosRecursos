const Produto = require('./Produto');

class ProdutoFactory {
    static criarProduto(nome, avaliacao, descricao, preco, qtd_estoque) {
        return new Produto(nome, avaliacao, descricao, preco, qtd_estoque);
    }
}

module.exports = ProdutoFactory;
