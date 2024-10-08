'use strict';
var util = require('util');

// Dependencies
const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
var util = require('util');
var http = require('https');

exports.logExecuteData = [];

// Function to log the request data
function logData(req) {
  exports.logExecuteData.push({
    body: req.body,
    headers: req.headers,
    trailers: req.trailers,
    method: req.method,
    url: req.url,
    params: req.params,
    query: req.query,
    route: req.route,
    cookies: req.cookies,
    ip: req.ip,
    path: req.path,
    host: req.host,
    fresh: req.fresh,
    stale: req.stale,
    protocol: req.protocol,
    secure: req.secure,
    originalUrl: req.originalUrl,
  });
  console.log('Body: ' + util.inspect(req.body));
  console.log('Headers: ' + req.headers);
  console.log('Trailers: ' + req.trailers);
  console.log('Method: ' + req.method);
  console.log('URL: ' + req.url);
  console.log('Parameters: ' + util.inspect(req.params));
  console.log('Query: ' + util.inspect(req.query));
  console.log('Route: ' + req.route);
  console.log('Cookies: ' + req.cookies);
  console.log('IP: ' + req.ip);
  console.log('Path: ' + req.path);
  console.log('Host: ' + req.host);
  console.log('Fresh: ' + req.fresh);
  console.log('Stale: ' + req.stale);
  console.log('Protocol: ' + req.protocol);
  console.log('Secure: ' + req.secure);
  console.log('Original URL: ' + req.originalUrl);
}

/*
 * POST handler for the / route of the Activity (this is the edit route).
 */
exports.edit = function (req, res) {
  logData(req);
  res.status(200).send('Edit');
};

/*
 * POST handler for the /save/ route of the Activity.
 */
exports.save = function (req, res) {
  logData(req);
  res.status(200).send('Save');
};

/*
 * POST handler for the /execute/ route of the Activity.
 * Here, the JWT is decoded and actions are taken based on the arguments.
 */
exports.execute = function (req, res) {
  // Example of how to decode the JWT
  JWT(req.body, process.env.jwtSecret, (err, decoded) => {
    // Error check -> unauthorized request
    if (err) {
      console.error(err);
      return res.status(401).end();
    }

    // Check if the decoded arguments are valid
    if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {
      var decodedArgs = decoded.inArguments[0];

      console.log('Request: ', decodedArgs);
      res.status(200).send('Execute');
    } else {
      console.error('Invalid inArguments.');
      return res.status(400).end();
    }
  });
};

/*
 * POST handler for the /publish/ route of the Activity.
 * This function is called when the activity is published.
 */
exports.publish = function (req, res) {
  logData(req);
  res.status(200).send('Publish');
};

/*
 * POST handler for the /validate/ route of the Activity.
 * This function is called to validate the activity data.
 */
exports.validate = function (req, res) {
  logData(req);
  res.status(200).send('Validate');
};
