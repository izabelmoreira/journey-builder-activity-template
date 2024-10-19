define(['postmonger'], function (Postmonger) {
  'use strict';

  var connection = new Postmonger.Session();
  var eventDefinitionKey;
  var authTokens = {};
  var payload = {};
  var contactKey = ''; // Variable to store the ContactKey
  var MID; //Variable to store the MID

  $(window).ready(onRender);

  //Define events
  connection.on('initActivity', initialize); // Connection function, doesn't need trigger
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

  //Get the actions
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
    console.log('___________________');
    console.log(inArguments);
    console.log('___________________');

    $.each(inArguments, function (index, inArgument) {
      // Capture the ContactKey
      if (inArgument.ContactKey) {
        contactKey = inArgument.ContactKey;
      }
      console.log('esse MID deve ser recuperado no frontend', inArgument.MID);
      if (inArgument.MID) {
        $('#MID').val(MID);
      }
    });

    connection.trigger('updateButton', {
      button: 'next',
      text: 'done',
      visible: true,
    });
  }

  function onGetTokens(tokens) {
    console.log('This is my MID :', tokens.MID);
    MID = tokens.MID;
  }

  function onGetEndpoints(endpoints) {
    console.log(endpoints);
  }

  // Function to save the activity with the correct data
  function save() {
    console.log(
      'Saving activity with Event Definition Key: ' + eventDefinitionKey
    );

    // Capture the values from the country and language selects
    var selectedCountry = $('#country').val();
    var selectedLanguage = $('#language').val();

    // Check if the values are filled in
    if (!selectedCountry || !selectedLanguage) {
      alert('Please select a country and a language before continuing.');
      return;
    }

    // Check if the ContactKey was captured
    if (!contactKey) {
      contactKey = '{{Event.' + eventDefinitionKey + '.ContactKey}}';
    }

    // Update the payload with the ContactKey, MID and the country and language values
    payload['arguments'].execute.inArguments = [
      {
        ContactKey: contactKey,
        Country: selectedCountry,
        Language: selectedLanguage,
        MID: MID,
      },
    ];

    payload['metaData'].isConfigured = true; // Indicates that the activity has been configured

    console.log('Payload being saved:', JSON.stringify(payload));

    // Trigger the event to save the activity
    connection.trigger('updateActivity', payload);
  }

  // Function called when the activity is executed
  function execute() {
    console.log('Executing the activity...');
    // No webhook sending functionality included
  }

  // Connect the execute function to the activity execution event
  connection.on('clickedNext', function () {
    save();
    console.log('Activity saved.');
    // Removed the call to execute since no webhook is used
  });
});
