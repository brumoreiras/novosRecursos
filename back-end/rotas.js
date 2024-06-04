const express = require('express');


const rotas = express();
const { registrarUsuario, getUsuario, atualizarUsuario, listarUsuarios, alterarStatusUsuario, buscarUsuarios, deletarUsuario } = require('./src/controladores/usuariosController.js');

const { authentication, validaToken, logout } = require('./src/middlewares/authentication.js');
const { validaCampoCadastro, validaCampoLogin, validaAlteracaoUsuario } = require('./src/middlewares/validation.js');
const { cadastroProdutos } = require('./src/controladores/produtoController.js');
const multer = require('multer');

//rotas usuarios
/* rotas.post('/usuario',  registrarUsuario); */ //cadastrarUsuario
rotas.post('/login', authentication); //login do usuario
/* rotas.get('/listar-usuario', listarUsuarios)
rotas.put('/alterar-status', alterarStatusUsuario)
rotas.get('/usuario', getUsuario); 
rotas.put('/alterar-usuario', atualizarUsuario) */
rotas.post('/logout', logout)

rotas.post('/produto', cadastroProdutos);


rotas.use(validaToken); //Os endpoints abaixo só podem funcionar se for valido o token. 
rotas.post('/usuario',  registrarUsuario); 
rotas.get('/listar-usuario', listarUsuarios)
rotas.get('/usuario', getUsuario); //detalhar usuario
rotas.put('/alterar-usuario', atualizarUsuario); //atualizar usuario
rotas.put('/alterar-status', alterarStatusUsuario);
rotas.get('/buscar-usuarios', buscarUsuarios);
rotas.delete('/deletar-usuario', deletarUsuario);


module.exports = rotas;

