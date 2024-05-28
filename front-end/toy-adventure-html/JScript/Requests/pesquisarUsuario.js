// pesquisarUsuario.js
import { gerarTabelaUsuarios } from '../listarUsuarioDoBanco.js'; // Certifique-se de importar a função corretamente

// Inicializa a lista de usuários ao carregar a página
let listaUsuarios = [];

document.addEventListener('DOMContentLoaded', async () => {
    listaUsuarios = await buscarUsuarios();
    gerarTabelaUsuarios(listaUsuarios);
    
    const pesquisaUsuario = document.getElementById('pesquisaUsuario');
    if (pesquisaUsuario) {
        pesquisaUsuario.addEventListener('input', (evento) => {
            const termoPesquisa = evento.target.value.toLowerCase();
            const usuariosFiltrados = listaUsuarios.filter(usuario => {
                return usuario.nome.toLowerCase().includes(termoPesquisa) ||
                       usuario.email.toLowerCase().includes(termoPesquisa) ||
                       usuario.grupo.toLowerCase().includes(termoPesquisa);
            });
            gerarTabelaUsuarios(usuariosFiltrados);
        });
    } else {
        console.error("Elemento com ID 'pesquisaUsuario' não encontrado.");
    }
});

async function buscarUsuarios() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3033/listar-usuario', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data.usuarios || []; // Certifique-se de que a resposta contém uma lista de usuários
        } else {
            console.error('Erro ao buscar usuários:', response.statusText);
            return [];
        }
    } catch (error) {
        console.error('Ocorreu um erro ao buscar usuários:', error);
        return [];
    }
}
