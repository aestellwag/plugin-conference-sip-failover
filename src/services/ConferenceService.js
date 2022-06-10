import { Manager } from '@twilio/flex-ui';
import { request } from './request';

class ConferenceService {

  manager = Manager.getInstance();

  // We are calling the Add Participant PSTN Twilio function
  // passing the conferenceSID and the target
  addParticipantPSTN = (conferenceSID, toNumber, callerID) => {
    console.log(`Passing conference: ${conferenceSID}, attempting to add: ${toNumber} to the conference`);
    return new Promise((resolve, reject) => {
      request('addParticipantPSTN', this.manager, {
        conferenceSID,
        toNumber,
        callerID
      }).then(response => {
        console.log(`Succefully added ${toNumber} to the conference`, response);
        resolve();
      }).catch(error => {
        console.error(`Error adding ${toNumber} to the conference`, error);
        reject(error);
      });
    });
  }
  // We are calling the Add Participant SIP Twilio function
  // passing the conferenceSID and the target
  addParticipantSIP = (conferenceSID, sipPrimaryTarget, sipSecondaryTarget, didPSTNfallback , callerID) => {
    console.log(`Passing conference: ${conferenceSID}, attempting to add: ${sipPrimaryTarget} to the conference`);
    return new Promise((resolve, reject) => {
      request('addParticipantSIP', this.manager, {
        conferenceSID,
        sipPrimaryTarget,
        sipSecondaryTarget,
        didPSTNfallback,
        callerID
      }).then(response => {
        console.log(`Succefully added ${sipPrimaryTarget} to the conference`, response);
        resolve();
      }).catch(error => {
        console.error(`Error adding ${sipPrimaryTarget} to the conference`, error);
        reject(error);
      });
    });
  }
}

const conferenceService = new ConferenceService();

export default conferenceService;
