'use strict';

// Deps
var activity = require('./activity');

/*
 * GET home page.
 */
exports.index = function (req, res) {
  if (!req.session.token) {
    res.render('index', {
      title: 'Unauthenticated',
      errorMessage:
        'This app may only be loaded via Salesforce Marketing Cloud',
    });
  } else {
    res.render('index', {
      title: 'Journey Builder Activity',
      results: activity.logExecuteData || [], // Garante que results sempre tenha um valor
    });
  }
};

exports.login = function (req, res) {
  console.log('req.body: ', req.body);
  res.redirect('/'); // Redireciona para a página inicial
};

exports.logout = function (req, res) {
  req.session.token = ''; // Limpa o token
  res.redirect('/login'); // Redireciona para a página de login
};
