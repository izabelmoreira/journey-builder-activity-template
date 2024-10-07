'use strict';
// Dependências de Módulos
// -----------------------
var express = require('express');
var bodyParser = require('body-parser');
var errorhandler = require('errorhandler');
var http = require('http');
var path = require('path');
var request = require('request');
var routes = require('./routes');
var activity = require('./routes/activity');

var app = express();

// Configuração do Express
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.raw({ type: 'application/jwt' })); // Define o parser para JWT
// app.use(bodyParser.urlencoded({ extended: true })); // Se necessário, ativar para outros tipos de dados

// app.use(express.methodOverride()); // Não necessário, removido para limpeza
// app.use(express.favicon()); // Não necessário, removido para limpeza

// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do Express no modo de desenvolvimento
if (app.get('env') === 'development') {
  app.use(errorhandler()); // Usa o middleware de tratamento de erros no modo dev
}

// Rotas HubExchange
app.get('/', routes.index); // Rota principal
app.post('/login', routes.login); // Rota de login
app.post('/logout', routes.logout); // Rota de logout

// Rotas da Atividade Customizada "Hello World"
app.post('/journeybuilder/save/', activity.save); // Salvar a atividade
app.post('/journeybuilder/validate/', activity.validate); // Validar a atividade
app.post('/journeybuilder/publish/', activity.publish); // Publicar a atividade
app.post('/journeybuilder/execute/', activity.execute); // Executar a atividade

// Cria o servidor HTTP e começa a escutar na porta configurada
http.createServer(app).listen(app.get('port'), function () {
  console.log('Servidor Express ouvindo na porta ' + app.get('port'));
});
