exports.handler = async (context, event, callback) => { 

  console.log('SIPB - Status Callback');

  // Here just to see what is within the event payload - this can be removed if needed
  // console.log('====EVENT=====');
  // Object.keys(event).forEach(key => {
  //     console.log(`${key}: ${event[key]}`);
  // });
  
  // Pulled from the query paramaters in the addParticipantSIP statusCallback URL
  const vendorSecondaryTarget = event.vendorSecondaryTarget;
  const vendorPSTNfallback = event.vendorPSTNfallback;
  const conferenceSID = event.conference;

  console.log(`vendorSecondaryTarget = ${vendorSecondaryTarget}`);
  console.log(`vendorPSTNfallback = ${vendorPSTNfallback}`);
  console.log(`conferenceSID = ${conferenceSID}`);

  if(event.CallStatus === "failed") {
console.log(`Adding ${vendorSecondaryTarget} to named conference ${conferenceSID}`);
    
    const client = context.getTwilioClient();
    
    const to = vendorSecondaryTarget;
    const from = event.Caller;

    //IMPORTANT UPDATE STEP:  Ensure the statusCallback is pointed to your function URL below!!!
    try {
      const participantResponse = await client
          .conferences(conferenceSID)
          .participants
          .create({
              to,
              from,
              earlyMedia: false,
              label: 'psap-rsa',
              endConferenceOnExit: false,
              statusCallbackEvent: ['initiated', 'answered', 'ringing', 'completed'],
              statusCallback: `https://toyota-testing-3394.twil.io/failover_PSTN_statusCallback?vendorPSTNfallback=${vendorPSTNfallback}&conference=${conferenceSID}`,
              statusCallbackMethod: 'POST'
          })

      response.setBody({
        status: 200,
        participantResponse
      });
    } catch (error){
      console.error(error);
    }
    return callback(null, response);
  } else {
    return callback(null);
  }
};