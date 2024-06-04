import { carregarUsuarios } from './listarUsuario.js';
import {deletarUsuario} from './deletarUsuario.js';

document.getElementById('pesquisaUsuario').addEventListener('input', function (event) {
    const query = event.target.value;
    console.log('Query:', query);
    buscarUsuarios(query);
});

async function buscarUsuarios(query) {
    if (query.length === 0) {
        carregarUsuarios();
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3033/buscar-usuarios?query=${query}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const usuarios = await response.json();
            exibirUsuarios(usuarios);
        } else {
            console.error('Erro ao buscar usuários:', response.statusText);
        }
    } catch (error) {
        console.error('Ocorreu um erro ao buscar os usuários:', error);
    }
}

function exibirUsuarios(usuarios, query) {
    const tabelaUsuarios = document.getElementById('create_list');
    tabelaUsuarios.innerHTML = ''; // Limpa a lista atual

    if (usuarios.length === 0) {
        const linha = document.createElement('tr');
        const coluna = document.createElement('td');
        coluna.colSpan = 7;
        coluna.textContent = query ? `Nenhum usuário encontrado para "${query}"` : 'Nenhum usuário encontrado';
        linha.appendChild(coluna);
        tabelaUsuarios.appendChild(linha);
        return;
    }

    usuarios.forEach(usuario => {
        const linha = document.createElement('tr');
        linha.setAttribute('data-id', usuario.id);

        linha.innerHTML = `
        <td class="coluna-nome">${usuario.nome}</td>
        <td>${usuario.email}</td>
        <td class="coluna-grupo">${usuario.grupo[0].toUpperCase() + usuario.grupo.substring(1)}</td>
        <td>${usuario.ativo ? 'Ativo' : 'Inativo'}</td>
        <td class="button-cell">
                <button  class="btn__alterar open-modal" data-id="${usuario.id}">Alterar</button>
        </td>
        <td class="button-cell" style="text-align: center;">
            <button class="btn__desativar ${usuario.ativo ? 'desativar' : 'ativar'}" 
                    data-id="${usuario.id}" 
                    data-ativo="${usuario.ativo}">
                ${usuario.ativo ? 'Desativar' : 'Ativar'}
            </button>
        </td>
        <td style="text-align: center;">
           
            <img src="../Images/icones/delete.svg" alt="icone de uma lixeira para deletar dados cadastrados" id="deleteButton" onclick="deletarUsuario(${usuario.id})">
        </td>
          
        `;

        tabelaUsuarios.appendChild(linha);
    });
}