// Set your app credentials
const credentials = {
    apiKey: 'atsk_e3aa4375aedba35a31d26631cc22b5e87aed5a6c05e296e9f5cb69102096009998802c0d',
    username: 'muhoro',
}

// Initialize the SDK
const AfricasTalking = require('africastalking')(credentials);

// Get the SMS service
const sms = AfricasTalking.SMS;

function sendMessage() {
    const options = {
        // Set the numbers you want to send to in international format
        to: ['+254792466821'],
        // Set your message
        message: "It is africas talking",
        // Set your shortCode or senderId
        from: 'AFTKNG'
    }

    // That’s it, hit send and we’ll take care of the rest
    sms.send(options)
        .then(console.log)
        .catch(console.log);
}

sendMessage();