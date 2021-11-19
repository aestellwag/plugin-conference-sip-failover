import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';

import AddConferenceParticipant from './components/addConferenceParticipant';

import reducers, { namespace } from './states';

const PLUGIN_NAME = 'ConferenceSipFailoverPlugin';

/*

TODO:  Summary of Work:  
    Validated PSTN and SIP Function/TwiML apps with a single targeted.  Tested SIP using my Bria phone, this worked perfectly.  It will accept a DID or SIP address when adding a user to the conference
    which helps keep the SIP use cases easier.  Next up is going into the callStatusCallback to start working on failover.  ONE ISSUE I experienced was the event payload did not update with the new
    parameters I was passing in.  I shifted from vendorTarget to vendorPrimaryTarget, it was not taking in the new name.  Will need to investigate that when I start to test out primary/secondary/pstn
    in the parameter.  Great progress today.

  1 - Setup button to call the function to add a participant
    (COMPLETE)
  2 - Setup the simple PSTN use case
    (COMPLETE)
  3 - Setup the more difficult SIP use case with x-headers, TLS, and secure Media
    (COMPLETE)
    3a - Test the SIP Conference call to your Bria phone to ensure it is working (hard code the to your bria sip address)
    (COMPLETE)
  4 - Work on failover to SIPB
    4a - build out the SIPB Function for the conference status callback 
        You can add query parameters to the callStatusCallback to help that endpoint determine how to handle the call failure
        Things like the conference SID, next SIP or PSTN target, etc.
  5 - Work on failvoer to PSTN
    5a - build out the PSTN function for the conference status callback
  6 - Clean up and make it each field dynamic to simulate pulling from task attributes
  7 - UI Clean Up:
    7a - Show Number/Name for newly added PSAP/RSA Vendor
    7b - Add timeout to the button clicks to prevent repeat clicks
    7c - Add UI around when it's attempting to dial (Spinning wheel?)
    7d - Add UI feedback when it fails
  8 - Test TLS and SRTP - Pending, working with TRodgers on testing against an Aspect PBX to validate this and the X-Headers


*/

export default class ConferenceSipFailoverPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  async init(flex, manager) {
    this.registerReducers(manager);

    // Adding the Add Conference Participant Button to the Call Canvas
    flex.CallCanvas.Content.add(<AddConferenceParticipant key="add-participant-button"/>);
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint-disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
