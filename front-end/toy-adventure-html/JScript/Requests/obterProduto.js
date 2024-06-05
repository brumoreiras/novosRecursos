async function obterDetalhesProduto(idProduto) {
    try {
        const resposta = await fetch(`http://localhost:3033/produto?id=${idProduto}`);
        if (!resposta.ok) {
            throw new Error('Erro ao obter detalhes do produto');
        }

        console.log('Resposta:', resposta)

        const produto = await resposta.json();
        console.log('Detalhes do produto:', produto);
        console.log('imagens ', produto.imagens);

        const carrossel = document.querySelector('.container__carrossel');

        produto.imagens.forEach((imagem, index) => {
            const imgElement = document.createElement('img');
            imgElement.src = `../../../../back-end/${imagem}`;
            imgElement.alt = `Imagem ${index + 1}`;
            imgElement.onclick = function () {
                changeImage(this);
            };
            carrossel.appendChild(imgElement);
        });

        // Preencher os campos da página com as informações do produto
        document.getElementById('img-marq-principal').src = `../../../../back-end/${produto.imagens[0]}`; // Define a imagem principal do produto
        console.log(produto.imagens[0]);
        document.querySelector('.titulo h1').textContent = produto.nome; // Define o nome do produto
        document.querySelector('.container__avaiacao p').textContent = `Avaliação: ${produto.avaliacao}`; // Define a avaliação do produto
        document.querySelector('.container__detalhe p').textContent = produto.descricao; // Define a descrição do produto
        document.getElementById('valor').textContent = `R$ ${produto.preco.toFixed(2)}`; // Define o preço do produto


    } catch (error) {
        console.error('Erro ao obter detalhes do produto:', error);
    }
}

// Função para carregar os detalhes do produto quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    // Obter o ID do produto da URL
    const queryParams = new URLSearchParams(window.location.search);
    const idProduto = queryParams.get('id');

    // Verificar se o ID do produto é válido e obter os detalhes do produto
    if (idProduto) {
        obterDetalhesProduto(idProduto);
    } else {
        console.error('ID do produto não encontrado na URL');
    }
});