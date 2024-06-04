const button = document.getElementById('botao');
const form = document.getElementById('fomrLogin');

function navigate(route) {
    window.location.href = route;
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('emailL').value;
    const senha = document.getElementById('senhaA').value;

    try {
        const response = await fetch("http://localhost:3033/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (response.ok) {
            const { token, usuario } = data;

            // Armazenar token e informações do usuário no localStorage
            localStorage.setItem('token', token);
            // localStorage.setItem('usuario', JSON.stringify(usuario));

           
            navigate("../front-end/toy-adventure-html/Pages/painel-de-controle.html");
            console.log("Login realizado com sucesso ",data.nomeUsuario);

        } else {
            alert('Esta tela de login é apenas para usuários de backoffice');
            console.log("Erro de acesso");
           
        }
        
    } catch (error) {
        console.error('Ocorreu um erro ao fazer login:', error);
    }

    console.log('Botão clicado => ', email, senha);
});


/* const button = document.getElementById('botao');
const form = document.getElementById('fomrLogin');

function navigate(route) {
    window.location.href = route;
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('emailL').value;
    const senha = document.getElementById('senhaA').value;

    try {
        const response = await fetch("http://localhost:3033/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (response.ok) {
            const { token, usuario } = data;

            // Verificar se o usuário já está logado
            if (localStorage.getItem('token')) {
                // Se já estiver logado, perguntar ao usuário se deseja sair
                const confirmLogout = confirm('Você já está logado. Deseja sair?');
                if (confirmLogout) {
                    // Fazer a chamada para o endpoint de logout
                    const response = await fetch("http://localhost:3033/logout", {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    // Limpar as informações de autenticação do usuário
                    localStorage.removeItem('token');
                    // Navegar para a página de login
                    navigate("../front-end/toy-adventure-html/Pages/login.html");
                }
            } else {
                // Se não houver token, o usuário não está logado
                // Armazenar token e informações do usuário no localStorage
                localStorage.setItem('token', token);
                // localStorage.setItem('usuario', JSON.stringify(usuario));
                // Navegar para a página de painel de controle
                navigate("../front-end/toy-adventure-html/Pages/painel-de-controle.html");
            }
        } else {
            // Se o login for inválido, exibir mensagem de erro
            if (data.mensagem === 'Usuário já está logado') {
                // Exibe um alerta ou uma mensagem indicando que o usuário já está logado
                alert('Usuário já está logado!');
            } else {
                // Exibe um alerta ou uma mensagem indicando que houve um erro no login
                alert('E-mail ou senha inválidos!');
            }
        }
    } catch (error) {
        console.error('Ocorreu um erro ao fazer login:', error);
    }

    console.log('Botão clicado => ', email, senha);
});
 */