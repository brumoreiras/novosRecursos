// Adicione este script ao seu arquivo JS
document.getElementById('formCadastroProduto').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evita o comportamento padrão do formulário (recarregamento da página)

    const formData = new FormData(this); // Cria um objeto FormData para enviar dados do formulário

    try {
        const resposta = await fetch('http://localhost:3033/produto', {
            method: 'POST',
            body: formData // Envia o FormData diretamente sem cabeçalhos Content-Type
        });

        if (!resposta.ok) {
            throw new Error('Erro na resposta do servidor');
        }

        const data = await resposta.json(); // Transforma a resposta em JSON
        console.log('Resposta do servidor:', data); // Manipula a resposta do servidor
        // Faça algo com a resposta, como redirecionar o usuário ou exibir uma mensagem de sucesso
    } catch (error) {
        console.error('Erro ao enviar dados:', error); // Manipula erros
        // Exiba uma mensagem de erro ao usuário ou faça outra ação apropriada
    }
});
