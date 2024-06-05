// Função para listar produtos
async function listarProdutos() {
    try {
        const resposta = await fetch('http://localhost:3033/produto');
        if (!resposta.ok) {
            throw new Error('Erro ao buscar produtos');
        }

        const produtos = await resposta.json();
        console.log('Produtos:', produtos);

        const tabelaProdutos = document.getElementById('create_list_produto');
        tabelaProdutos.innerHTML = ''; // Limpa a tabela antes de adicionar os produtos

        produtos.forEach(produto => {
            const linhaProduto = document.createElement('tr');

            linhaProduto.innerHTML = `
                <td>${produto.id}</td>
                <td>${produto.nome}</td>
                <td style="text-align: center;">${produto.qtd_estoque}</td>
                <td style="text-align: center;">${produto.status ? 'Ativo' : 'Inativo'}</td>
                <td class="button-cell">
                    <a class="btn__alterar" href="alterar-dados.html?id=${produto.id}">Alterar</a>
                </td>
                <td class="button-cell">
                    <button class="btn__desativar" onclick="alterarStatusProduto(${produto.id})">${produto.status ? 'Desativar' : 'Ativar'}</button>
                </td>
                <td>
                    <a href="/front-end/toy-adventure-html/Pages/detalhe-produtos.html?id=${produto.id}"><img src="../Images/icones/inventory.svg" alt="Ver Detalhes"></a>
                
                </td>
            `;

            tabelaProdutos.appendChild(linhaProduto);
        });
    } catch (error) {
        console.error('Erro ao listar produtos:', error);
    }
}

// Chama a função listarProdutos quando a página carrega
document.addEventListener('DOMContentLoaded', listarProdutos);

// Função para alterar o status do produto (ativar/desativar)
function alterarStatusProduto(id) {
    // Implementar lógica para alterar o status do produto
    console.log(`Alterar status do produto com id ${id}`);
}

// Função para deletar o produto
function deletarProduto(id) {
    // Implementar lógica para deletar o produto
    console.log(`Deletar produto com id ${id}`);
}
