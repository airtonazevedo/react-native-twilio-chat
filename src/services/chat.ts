import Twilio from 'twilio';

const TWILIO_ACCOUNT_SID = 'ACe0f460d4b98c98fec869d40734f6de66'
const TWILIO_API_KEY = 'SK4d28fd66f4709aae38879c491b443315'
const TWILIO_API_SECRET = '6vhWyHeKYHmX6yCMA8IQgEUPsCWwGpWT'
const TWILIO_CHAT_SERVICE_SID = 'IS09d8c1cb9bcf419ca41a667813a150d1'
const TWILIO_AUTH_TOKEN = '4be07c228bd247b8100cdb23fbc777ee';
/*
export function syncServiceDetails() {
    const syncServiceSid =  'default';

    const client = Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

    client.sync
        .services(syncServiceSid)
        .fetch()
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        });

}*/