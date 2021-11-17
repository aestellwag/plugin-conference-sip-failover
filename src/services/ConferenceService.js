import { Manager } from '@twilio/flex-ui';
import { request } from './request';

class ConferenceService {

  manager = Manager.getInstance();

  // We are calling the Add Participant PSTN Twilio function
  // passing the conferenceSID and the target
  addParticipantPSTN = (conferenceSID, vendorTarget, vid) => {
    console.log(`Passing conference: ${conferenceSID}, attempting to add: ${vendorTarget} to the conference`);
    return new Promise((resolve, reject) => {
      request('addParticipantPSTN', this.manager, {
        conferenceSID,
        vendorTarget,
        vid
      }).then(response => {
        console.log(`Succefully added ${vendorTarget} to the conference`, response);
        resolve();
      }).catch(error => {
        console.error(`Error adding ${vendorTarget} to the conference`, error);
        reject(error);
      });
    });
  }

  // We are calling the Add Participant SIP Twilio function
  // passing the conferenceSID and the target
  addParticipantSIP = (conferenceSID, vendorTarget, vid) => {
    console.log(`Passing conference: ${conferenceSID}, attempting to add: ${vendorTarget} to the conference`);
    return new Promise((resolve, reject) => {
      request('addParticipantSIP', this.manager, {
        conferenceSID,
        vendorTarget,
        vid
      }).then(response => {
        console.log(`Succefully added ${vendorTarget} to the conference`, response);
        resolve();
      }).catch(error => {
        console.error(`Error adding ${vendorTarget} to the conference`, error);
        reject(error);
      });
    });
  }
}

const conferenceService = new ConferenceService();

export default conferenceService;
