import * as React from 'react';
import {
  Actions,
  IconButton,
  TaskHelper,
  withTheme,
  Manager
} from '@twilio/flex-ui';

import ConferenceService from '../services/ConferenceService';
import styled from '@emotion/styled';

const ButtonContainer = styled('div')`
  display: flex;
  margin-top: 6px;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  align-items: center;
  text-align: center;
`;

class AddConferenceParticipant extends React.PureComponent {

  addConferenceParticipant = () => {

    const { task } = this.props;
    const conference = task && task.conference;
    const conferenceSID = conference && conference.conferenceSid;

    // TODO: Update to pull the below variables from the task attributes vs hard coding
    
    /*
      Below are examples of how you can call a SIP Target within Flex to a specific SIP Endpoint or to leverage your BYOC Trunk.  By default any dialing in FLex will leverage Twilio's Super Network for DID calling.  This component + functions allows for us to direct SIP calls over your SIP Endpoint or BYOC Trunk.
    */

    const targetType = "SIP";
    const callerID = "+17656363406"

    /*
      PSTN aka DID calling, if you wanted to dial a number directly, you can leverage the addParticipantPSTN function which is a simple DID dial if you are not targeting a SIP Endpoint.  For SIP Endpoints, any DIDs will traverse the Twilio Super Network.  If you have a configured BYOC Trunk, you can define a BYOC Trunk SID to send the DID over your BYOC Trunk vs Twilio's Carrier Network: https://www.twilio.com/docs/voice/bring-your-own-carrier-byoc#making-calls
    */

    if (targetType == "PSTN") {
      const toNumber = "+13172222222";
      ConferenceService.addParticipantPSTN(conferenceSID, toNumber, callerID);
    } else {
      // FIXME: The below variables are hard coded for testing, this can be enhanced to pull from task attributes if available
      /*
        Below are examples if you were leverage advanced SIP calling like custom/x-headers or TLS/SRTP for your SIP Targets

        Example X-Header / Custom Header SIP Target:
        const sipXheaderTarget =  `${primarySIPTarget}?X-${xh1title}=${xh1}&X-${xh2title}=${xh2};

        Example TLS and Secure Media (SRTP) Target:
        const sipTLSandSRTPTarget =  `${primarySIPTarget};transport=tls;secure=true;

        Example Combination of TLS/SRTP and X-Headers
        const sipPrimaryTarget =  `${primarySIPTarget};transport=tls;secure=true?X-${xh1title}=${xh1}&X-${xh2title}=${xh2};

      */
      const xh1title = "Test1";
      const xh1 = "test1";
      const xh2title = "Test2";
      const xh2 = "test2";
      const primarySIPTarget = 'sip:+13179519753@172.0.33.5';
      const secondarySIPTarget = 'sip:+13179519753@127.7.7.1';

      const sipPrimaryTarget =  `${primarySIPTarget};transport=tls;secure=true?X-${xh1title}=${xh1}&X-${xh2title}=${xh2}`;
      const sipSecondaryTarget = `${secondarySIPTarget};transport=tls;secure=true?X-${xh1title}=${xh1}&X-${xh2title}=${xh2}`;
      const didPSTNfallback = "13172222222";

      ConferenceService.addParticipantSIP(conferenceSID, sipPrimaryTarget, sipSecondaryTarget, didPSTNfallback , callerID);
    }
  }

  //TODO: Update to a dropdown, selectable list, atm it is a hard coded target

  render() {
    const isLiveCall = TaskHelper.isLiveCall(this.props.task);    
    const vendorName = "Dial SIP Endpoint or BYOC Target";

    return (
      <ButtonContainer>
        <IconButton
          icon="Alert"
          disabled={ !isLiveCall  }
          onClick={this.addConferenceParticipant}
          title={vendorName}
          themeOverride={this.props.theme.CallCanvas.Button}
        />
        {vendorName}
      </ButtonContainer>
    );
  }
}

export default withTheme(AddConferenceParticipant);
