import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';

import AddConferenceParticipant from './components/addConferenceParticipant';

import reducers, { namespace } from './states';

const PLUGIN_NAME = 'ConferenceSipFailoverPlugin';

/*

TODO:  Summary of Work:  In thinking through this, calling a conferenceStatus Callback

  1 - Setup button to call the function to add a participant
    (COMPLETE)
  2 - Setup the simple PSTN use case
    (COMPLETE)
  3 - Setup the more difficult SIP use case with x-headers, TLS, and secure Media
    (COMPLETE)
    3a - Need to test this out  - Terence is going to setup an Aspect PBX for me to test TLS/Secure Media
    (Target: Mid-Late December)
  4 - Work on failover to SIPB
    4a - build out the SIPB Function for the conference status callback 
        You can add query parameters to the callStatusCallback to help that endpoint determine how to handle the call failure
        Things like the conference SID, next SIP or PSTN target, etc.
  5 - Work on failvoer to PSTN
    5a - build out the PSTN function for the conference status callback
  6 - Clean up and make it each field dynamic to simulate pulling from task attributes
  7 - UI Clean Up:
    7a - Show Number/Name for newly added PSAP/RSA Vendor
    7b - Add UI around when it's attempting to dial (Spinning wheel?)
    7c - Add UI feedback when it fails


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
