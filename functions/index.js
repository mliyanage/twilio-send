const functions = require("firebase-functions");
const admin = require('firebase-admin');
const accountSid = functions.config().twilio.sid;
const authToken = functions.config().twilio.token;
const serviceId = functions.config().twilio.serviceid;
const client = require('twilio')(accountSid, authToken);
const cors = require('cors');

admin.initializeApp();

const db = admin.firestore();

//Send an OTP to new user
exports.onUserCreate = functions.firestore.document('users/{phone}').onCreate(async(snap, context)=>{
    const values = snap.data();
    //Send OTP
    await db.collection('message-log').add({description: `OTP has been sent to user to:${values.phone} `});
    client.verify.services(serviceId)
             .verifications
             .create({to: values.phone, channel: 'sms'})
             .then(verification => console.log(verification.status));

})

//Validate the OTP
exports.otpVerificationCheck = functions.https.onRequest(async (req, res) => { cors()(req, res, () => {
    // Check for POST request
    if(req.method !== "POST"){
        res.status(400).send('Please send a POST request');
        return;
    }
    const msgStatus = req.body;
    client.verify.services(serviceId)
      .verificationChecks
      .create({to: msgStatus.phone, code: msgStatus.otp})
      .then(verification_check => res.json({result: verification_check.status}));
      
  });
});

 //Send a new OTP
 exports.otpSend = functions.https.onRequest(async (req, res) => { cors()(req, res, () => {
    // Check for POST request
    if(req.method !== "POST"){
        res.status(400).send('Please send a POST request');
        return;
    }
    const request = req.body;
    const resp = client.verify.services(serviceId)
             .verifications
             .create({to: request.phone, channel: 'sms'})
             .then(otp => res.json({result: otp}));
            
 });
});

exports.textSend = functions.https.onRequest(async (req, res) => { cors()(req, res, () => {
    // Check for POST request
    if(req.method !== "POST"){
        res.status(400).send('Please send a POST request');
        return;
    }
    const request = req.body;
    client.messages
    .create({
       body: request.messageText,
       from: '+61485866056',
       statusCallback: 'https://us-central1-testapp-c07dd.cloudfunctions.net/addMessageStatus',
       to: request.phone
     })
     .then(text => res.json({result: text}));
 });
});

//http webhook to get message statues updates
exports.addMessageStatus = functions.https.onRequest(async (req, res) => {
    // Check for POST request
    if(req.method !== "POST"){
        res.status(400).send('Please send a POST request');
        return;
    }
    const msgStatus = req.body;
    const writeResult = await admin.firestore().collection('message-log').add({msgStatus: msgStatus});
  });

  
  
