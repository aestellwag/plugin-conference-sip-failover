import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';

import AddConferenceParticipant from './components/addConferenceParticipant';

import reducers, { namespace } from './states';

const PLUGIN_NAME = 'ConferenceSipFailoverPlugin';

/*

TODO:  Summary of Work:  
    Amazing progress today, we have tested out TLS/SRTP formating and have this "working" without SIP Header Invalid errors.  We've also corrected the X-Header formating and that works as well
    alongside the TLS/SRTP!!  Big win there.  We also have the statusCallback working where we are passing in query parameters and consuming those so we know what to target in the failure.  There is
    a specific event, event.CallStatus, if this is "failed" we use this as the trigger to try another target!  We have the full solution working end to end, attempt SIPA, if failed, attempt SIPB, if failed
    call the DID!.  Now we need to do some logic clean up for task attributes and the UI, then further testing on failure scenarios and you should be good!

  1 - Setup button to call the function to add a participant
    (COMPLETE)
  2 - Setup the simple PSTN use case
    (COMPLETE)
  3 - Setup the more difficult SIP use case with x-headers, TLS, and secure Media
    (COMPLETE)
    3a - Test the SIP Conference call to your Bria phone to ensure it is working (hard code the to your bria sip address)
    (COMPLETE)
  4 - Work on failover to SIPB
    (COMPLETE)
    4a - build out the SIPB Function for the conference status callback 
        You can add query parameters to the callStatusCallback to help that endpoint determine how to handle the call failure
        Things like the conference SID, next SIP or PSTN target, etc.
        (COMPLETE)
  5 - Work on failvoer to PSTN
    (COMPLETE)
    5a - build out the PSTN function for the conference status callback
        (COMPLETE)
  6 - Clean up and make it each field dynamic to simulate pulling from task attributes
    6a - For the Custom Headers, see if we can build a way to interate through the array/object to add it dynamically if it exists (within addConferenceParticipant.js)
    6b - For the TLS/SRTP flags, see if we can build a way have a TLS Enabled and SRTP Enabled flag to true, if so add it to the end of the SIP Target (within addConferenceParticipant.js)
  7 - UI Clean Up:
    7a - Show Number/Name for newly added PSAP/RSA Vendor
    7b - Add timeout to the button clicks to prevent repeat clicks
    7c - Add UI around when it's attempting to dial (Spinning wheel?)
    7d - Add UI feedback when it fails
  8 - Test TLS and SRTP - Pending, working with TRodgers on testing against an Aspect PBX to validate this and the X-Headers
  9 - Clean up ReadME
    9a - Special call out, make sure you call out the statusCallback URLs need updated manually after publish
  10 - TOYOTA SPECIFIC USE CASES:
    9a - Need to discuss query parameters for SIPB and PSTN statusCallbacks with Toyota.  May just pass in the vendor name for security reasons and hard code vhe variables within the respective functions


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
