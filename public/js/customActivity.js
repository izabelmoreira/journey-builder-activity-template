define(['postmonger'], function (Postmonger) {
  'use strict';

  var connection = new Postmonger.Session();
  var eventDefinitionKey;
  var authTokens = {};
  var payload = {};
  $(window).ready(onRender);

  connection.on('initActivity', initialize);
  connection.on('requestedTokens', onGetTokens);
  connection.on('requestedEndpoints', onGetEndpoints);
  connection.on('requestedInteraction', function (settings) {
    if (settings.triggers && settings.triggers.length > 0) {
      eventDefinitionKey = settings.triggers[0].metaData.eventDefinitionKey;
      console.log('Initializing data: ' + JSON.stringify(eventDefinitionKey));
    } else {
      console.error('No triggers found in the settings.');
    }
  });
  connection.on(
    'requestedTriggerEventDefinition',
    onRequestedTriggerEventDefinition
  );
  connection.on('requestedDataSources', onRequestedDataSources);
  connection.on('clickedNext', save);

  function onRender() {
    connection.trigger('ready');
    connection.trigger('requestTokens');
    connection.trigger('requestEndpoints');
    connection.trigger('requestInteraction');
    connection.trigger('requestTriggerEventDefinition');
    connection.trigger('requestDataSources');
  }

  function onRequestedDataSources(dataSources) {
    console.log('*** requestedDataSources ***');
    console.log(dataSources);
  }

  function onRequestedTriggerEventDefinition(eventDefinitionModel) {
    console.log('*** requestedTriggerEventDefinition ***');
    console.log(eventDefinitionModel);
  }

  function initialize(data) {
    console.log(data);
    if (data) {
      payload = data;
    }

    var hasInArguments = Boolean(
      payload['arguments'] &&
        payload['arguments'].execute &&
        payload['arguments'].execute.inArguments &&
        payload['arguments'].execute.inArguments.length > 0
    );

    var inArguments = hasInArguments
      ? payload['arguments'].execute.inArguments
      : {};

    console.log(inArguments);

    // Iteração sobre inArguments, se necessário
    $.each(inArguments, function (index, inArgument) {
      // Se precisar processar inArgument, faça isso aqui
    });

    connection.trigger('updateButton', {
      button: 'next',
      text: 'done',
      visible: true,
    });
  }

  function onGetTokens(tokens) {
    console.log(tokens);
    authTokens = tokens;
  }

  function onGetEndpoints(endpoints) {
    console.log(endpoints);
  }

  function save() {
    console.log(
      'Saving activity with Event Definition Key: ' + eventDefinitionKey
    );

    // Atualizando o payload com os argumentos necessários para a execução
    payload['arguments'].execute.inArguments = [
      {
        ContactKey: '{{Event.' + eventDefinitionKey + '.ContactKey}}',
      },
    ];

    payload['metaData'].isConfigured = true; // Define que a atividade foi configurada

    console.log('Payload being saved:', JSON.stringify(payload));

    // Disparar o evento para salvar a atividade
    connection.trigger('updateActivity', payload);
  }
});
