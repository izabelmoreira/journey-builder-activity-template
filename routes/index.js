'use strict';

// Deps
import { logExecuteData } from './activity';

/*
 * GET home page.
 */
export function index(req, res) {
  if (!req.session.token) {
    res.render('index', {
      title: 'Unauthenticated',
      errorMessage:
        'This app may only be loaded via Salesforce Marketing Cloud',
    });
  } else {
    res.render('index', {
      title: 'Journey Builder Activity',
      results: logExecuteData || [], // Garante que results sempre tenha um valor
    });
  }
}

export function login(req, res) {
  console.log('req.body: ', req.body);
  res.redirect('/'); // Redireciona para a página inicial
}

export function logout(req, res) {
  req.session.token = ''; // Limpa o token
  res.redirect('/login'); // Redireciona para a página de login
}
