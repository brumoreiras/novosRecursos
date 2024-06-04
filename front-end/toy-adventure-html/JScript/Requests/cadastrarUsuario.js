function navigate(route) {
    window.location.href = route;
}

export async function aoSalvar(dados) {
    // console.log('O que está sendo recebido:::> ', dados)
    //const { nome, cpf, email, grupo, senha } = dados;
    console.table(dados)
    try {
        const token = localStorage.getItem('token');
        // console.log('token :::> ', token)

        const response = await fetch("http://localhost:3033/usuario", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dados)
        })

        if (response.ok) {
             navigate("/Pages/listar-usuario.html");
            
            console.table('Retorno dos dados', dados)
        } else {
            alert("Erro ao cadastrar usuário:", response.statusText);
            console.log("Erro ao cadastrar usuário:", response);
        }

        const data = await response.json();
        console.log('resposta::: ', await response.json());
    } catch (error) {

        console.error('Ocorreu um erro ao cadastrar usuário:', error);
    }
}
