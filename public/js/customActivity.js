define(['postmonger'], function (Postmonger) {
  'use strict';

  var connection = new Postmonger.Session();
  var eventDefinitionKey;
  var authTokens = {};
  var payload = {};
  var contactKey = ''; // Variável para armazenar o ContactKey

  $(window).ready(onRender);

  connection.on('initActivity', initialize);
  connection.on('requestedTokens', onGetTokens);
  connection.on('requestedEndpoints', onGetEndpoints);
  connection.on('requestedInteraction', function (settings) {
    eventDefinitionKey = settings.triggers[0].metaData.eventDefinitionKey;
    console.log('Initializing data: ' + JSON.stringify(eventDefinitionKey));
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

    $.each(inArguments, function (index, inArgument) {
      // Captura o ContactKey
      if (inArgument.ContactKey) {
        contactKey = inArgument.ContactKey;
      }
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

  // Função para salvar a atividade com os dados corretos
  function save() {
    console.log(
      'Saving activity with Event Definition Key: ' + eventDefinitionKey
    );

    // Captura os valores do select de país e idioma
    var selectedCountry = $('#country').val();
    var selectedLanguage = $('#language').val();

    // Verifica se os valores estão preenchidos
    if (!selectedCountry || !selectedLanguage) {
      alert('Por favor, selecione um país e um idioma antes de continuar.');
      return;
    }

    // Verifica se o ContactKey foi capturado
    if (!contactKey) {
      contactKey = '{{Event.' + eventDefinitionKey + '.ContactKey}}';
    }

    // Atualiza o payload com o ContactKey e os valores de país e idioma
    payload['arguments'].execute.inArguments = [
      {
        ContactKey: contactKey,
        Country: selectedCountry,
        Language: selectedLanguage,
      },
    ];

    payload['metaData'].isConfigured = true; // Define que a atividade foi configurada

    console.log('Payload being saved:', JSON.stringify(payload));

    // Dispara o evento para salvar a atividade
    connection.trigger('updateActivity', payload);
  }

  // Função chamada quando a atividade é executada
  function execute() {
    console.log('Executando a atividade...');

    // Envia os dados para o webhook
    $.ajax({
      url: 'https://webhook.site/1a07f5aa-b6d3-4b9e-8af6-7c6ef2d2e710',
      type: 'POST',
      data: JSON.stringify({
        contactKey: contactKey, // Contact Key
        country: $('#country').val(), // País selecionado
        language: $('#language').val(), // Idioma selecionado
      }),
      contentType: 'application/json',
      success: function (response) {
        console.log('Dados enviados com sucesso ao webhook:', response);
      },
      error: function (error) {
        console.error('Erro ao enviar dados ao webhook:', error);
        alert(
          'Erro ao enviar os dados ao webhook: ' +
            error.statusText +
            ' (' +
            error.status +
            ')'
        );
        console.log('Detalhes do erro:', error.responseText);
      },
    });
  }

  // Conecta a função execute ao evento de execução da atividade
  connection.on('clickedNext', function () {
    save();
    execute(); // Chama a função execute para enviar os dados ao webhook
  });
});
