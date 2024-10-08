'use strict';
const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
const util = require('util');
const http = require('https');

exports.logExecuteData = [];

// Função para registrar os dados da requisição
function logData(req) {
  exports.logExecuteData.push({
    body: req.body,
    headers: req.headers,
    method: req.method,
    url: req.url,
    params: req.params,
    query: req.query,
    cookies: req.cookies,
    ip: req.ip,
    path: req.path,
    host: req.host,
    protocol: req.protocol,
    secure: req.secure,
    originalUrl: req.originalUrl,
  });
  console.log('Corpo: ' + util.inspect(req.body));
  console.log('Cabeçalhos: ' + req.headers);
  console.log('Método: ' + req.method);
  console.log('URL: ' + req.url);
  console.log('Parâmetros: ' + util.inspect(req.params));
  console.log('Query: ' + util.inspect(req.query));
  console.log('Cookies: ' + req.cookies);
  console.log('IP: ' + req.ip);
  console.log('Caminho: ' + req.path);
  console.log('Host: ' + req.host);
  console.log('Protocolo: ' + req.protocol);
  console.log('Seguro: ' + req.secure);
  console.log('URL Original: ' + req.originalUrl);
}

/*
 * Handler POST para a rota / da Atividade (esta é a rota de edição).
 */
exports.edit = function (req, res) {
  logData(req);
  res.status(200).json({ status: 'success', message: 'Edit' });
};

/*
 * Handler POST para a rota /save/ da Atividade.
 */
exports.save = function (req, res) {
  logData(req);
  res.status(200).json({ status: 'success', message: 'Save' });
};

/*
 * Handler POST para a rota /execute/ da Atividade.
 * Aqui, o JWT é decodificado e as ações são realizadas com base nos argumentos.
 */
exports.execute = function (req, res) {
  // Exemplo de como decodificar o JWT
  JWT(req.body, process.env.jwtSecret, (err, decoded) => {
    // Verificação de erro -> requisição não autorizada
    if (err) {
      console.error(err);
      return res.status(401).send('Erro na autenticação JWT');
    }

    // Verifica se os argumentos decodificados são válidos
    if (
      decoded &&
      Array.isArray(decoded.inArguments) &&
      decoded.inArguments.length > 0
    ) {
      const decodedArgs = decoded.inArguments[0];
      console.log('Requisição: ', decodedArgs);
      res.status(200).json({ status: 'success', message: 'Execute' });
    } else {
      console.error('inArguments inválidos.');
      return res.status(400).send('inArguments inválidos');
    }
  });
};

/*
 * Handler POST para a rota /publish/ da Atividade.
 * Esta função é chamada quando a atividade é publicada.
 */
exports.publish = function (req, res) {
  logData(req);
  res.status(200).json({ status: 'success', message: 'Publish' });
};

/*
 * Handler POST para a rota /validate/ da Atividade.
 * Esta função é chamada para validar os dados da atividade.
 */
exports.validate = function (req, res) {
  logData(req);
  res.status(200).json({ status: 'success', message: 'Validate' });
};
