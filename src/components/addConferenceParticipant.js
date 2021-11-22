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
    // The targetType let's us know if it's a PSTN or SIP target
    // The vid = the Vehicle ID/number that should be passed to the vendors - AKA the FROM or ANI
    const targetType = "SIP";
    const vid = "+17656363406"

    // We could technically have one function do all the transfer, but I'm splitting it up for visibility sake
    // note you can consolidate into one by doing a check or passing in the targetType to the function vs the plugin itself :)
    if (targetType == "PSTN") {
      // The vendorTarget will be our target
      const vendorPrimaryTarget = "+13172222222";
      ConferenceService.addParticipantPSTN(conferenceSID, vendorPrimaryTarget, vid);
    } else {
      // TODO: The below variables are hard coded for testing, this needs to be enhances to be pulled from the task attributes, likely as an object/array
      // For the SIP use case only
      const xh1title = "test1";
      const xh1 = "test1";
      const xh2title = "test2";
      const xh2 = "test2";
      const primarySIPTarget = 'sip:+13179519753@172.0.33.5';
      const secondarySIPTarget = 'sip:+13179519753@pstest.sip.twilio.com';

      // TODO: Enhance this in the future to interate through an object/array of custom headers and add to the end of the SIP Target
      // TODO: Enhance this to accept TLS Enabled and SRTP with a true/false flag?  Then add it to the end of the SIP Target if true
      const vendorPrimaryTarget = `${primarySIPTarget};transport=tls;secure=true?X-${xh1title}=${xh1}&X-${xh2title}=${xh2}`;
      const vendorSecondaryTarget = `${secondarySIPTarget};transport=tls;secure=true?X-${xh1title}=${xh1}&X-${xh2title}=${xh2}`;
      const vendorPSTNfallback = "13172222222";

      ConferenceService.addParticipantSIP(conferenceSID, vendorPrimaryTarget, vendorSecondaryTarget, vendorPSTNfallback , vid);
    }
  }

  render() {
    const isLiveCall = TaskHelper.isLiveCall(this.props.task);
    // TODO: Update to pull the below variable from the task attributes vs hard coding
    const vendorName = "Intrado";

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
