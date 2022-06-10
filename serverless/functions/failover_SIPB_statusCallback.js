exports.handler = async (context, event, callback) => { 

  // '*' allows being called from any origin, this not the best security
  // practice and should only be used for testing; when builiding
  // a production plugin you should set the allowed origin to
  // 'https://flex.twilio.com' (or any custom domain serving the plugin)

  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST');
  response.appendHeader('Content-Type', 'application/json');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type'); 

  console.log('SIPB - Status Callback');

  // Here just to see what is within the event payload - this can be removed if needed
  // console.log('====EVENT=====');
  // Object.keys(event).forEach(key => {
  //     console.log(`${key}: ${event[key]}`);
  // });
  
  // Pulled from the query paramaters in the addParticipantSIP statusCallback URL

  const {
    sipSecondaryTarget,
    didPSTNfallback,
    conferenceSID,
    Caller
  } = event;

  console.log(`sipSecondaryTarget = ${sipSecondaryTarget}`);
  console.log(`didPSTNfallback = ${didPSTNfallback}`);
  console.log(`conferenceSID = ${conferenceSID}`);

  if(event.CallStatus === "failed") {
console.log(`Adding ${sipSecondaryTarget} to named conference ${conferenceSID}`);
    
    const client = context.getTwilioClient();
    
    const to = sipSecondaryTarget;
    const from = Caller;

    //IMPORTANT UPDATE STEP:  Ensure the statusCallback is pointed to your function URL below!!!
    try {
      participantResponse = await client
          .conferences(conferenceSID)
          .participants
          .create({
              to,
              from,
              earlyMedia: false,
              label: 'customer',
              endConferenceOnExit: false,
              statusCallbackEvent: ['initiated', 'answered', 'ringing', 'completed'],
              statusCallback: `https://toyota-testing-3394.twil.io/failover_PSTN_statusCallback?didPSTNfallback=${didPSTNfallback}&conferenceSID=${conferenceSID}`,
              statusCallbackMethod: 'POST'
          })
    } catch (error){
      console.error(error);
    }

    response.setBody({
      status: 200,
      participantResponse
    });
    return callback(null, response);
  } else {
    return callback(null);
  }
};