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
    // The vendorTarget will be our target
    // The vid = the Vehicle ID/number that should be passed to the vendors - AKA the FROM or ANI
    const targetType = "PSTN";
    const vendorPrimaryTarget = "sip:+13179519753@pstest.sip.twilio.com";
    const vendorSecondaryTarget = "+13172222222@pstest.sip.twilio.com";
    const vendorPSTNfallback = "+13172222222";
    const vid = "+17656363406"

    // We could technically have one function do all the transfer, but I'm splitting it up for visibility sake
    // note you can consolidate into one by doing a check or passing in the targetType to the function vs the plugin itself :)
    if (targetType == "PSTN") {
      ConferenceService.addParticipantPSTN(conferenceSID, vendorPrimaryTarget, vid);
    } else {
      // TODO: Will pull from tasks if x-headers exist, may just do this as an array or object to pass into the event payload
      // For the SIP use case only
      const xh1title = "test1";
      const xh1 = "test1";
      const xh2title = "test2";
      const xh2 = "test2";
      ConferenceService.addParticipantSIP(conferenceSID, vendorPrimaryTarget, vendorSecondaryTarget, vendorPSTNfallback , vid, xh1title, xh1, xh2title, xh2);
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
