// Using the TokenValidator to authenticate so we can query the API
// We could do this directly from the plugin, but that requires us to provide
// the AccoundSID and AuthToken, which we do not want to have leak into the front end
// This the #1 why we are query this via a function vs directly in the plugin!

const TokenValidator = require('twilio-flex-token-validator').functionValidator;

exports.handler = TokenValidator(async (context, event, callback) => {
  
    // '*' allows being called from any origin, this not the best security
    // practice and should only be used for testing; when builiding
    // a production plugin you should set the allowed origin to
    // 'https://flex.twilio.com' (or any custom domain serving the plugin)

    const response = new Twilio.Response();
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST');
    response.appendHeader('Content-Type', 'application/json');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type'); 

    const {
        conferenceSID,
        vendorPrimaryTarget,
        vendorSecondaryTarget,
        vendorPSTNfallback,
        vid,
        xh1title,
        xh1,
        xh2title,
        xh2
    } = event;

    console.log(`Adding ${vendorTarget} to named conference ${conferenceSID}`);
    
    const client = context.getTwilioClient();

    // This is a custom SIP target with support for Custom Headers, TLS Support and Secure Media (SRTP)
    
    const to = `${vendorPrimaryTarget}?x-${xh1title}=${xh1}&x-${xh2title}=${xh2};transport=tls;secure=true`;
    const from = vid;

    try {
      participantResponse = await client
          .conferences(conferenceSID)
          .participants
          .create({
              to,
              from,
              earlyMedia: true,
              label: 'psap-rsa',
              endConferenceOnExit: false
          })
    } catch (error){
      console.error(error);
    }
    console.log('Participant response properties:');
    
    response.setBody({
      status: 200,
      participantResponse
    });

    return callback(null, response);

});