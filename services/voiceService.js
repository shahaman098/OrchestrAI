const axios = require('axios');
require('dotenv').config();

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM'; // Default to Rachel

async function generateVoiceReport({ savings, deliveryDate, orderCount }) {
    const script = `Mission successful. I executed ${orderCount} orders. We saved $${savings} by choosing the bulk pizza. Tracking numbers have been sent.`;

    // Safety: If no API key, return fallback immediately to avoid unnecessary API call attempt
    if (!ELEVENLABS_API_KEY) {
        console.warn('ELEVENLABS_API_KEY is missing. Returning fallback.');
        return { audio: null, text: "Voice unavailable" };
    }

    try {
        const response = await axios.post(
            `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
            {
                text: script,
                model_id: "eleven_monolingual_v1",
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.5
                }
            },
            {
                headers: {
                    'Accept': 'audio/mpeg',
                    'xi-api-key': ELEVENLABS_API_KEY,
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer' // Important for audio data
            }
        );

        return {
            audio: Buffer.from(response.data),
            text: script
        };

    } catch (error) {
        console.error('Error calling ElevenLabs API:', error.message);
        // Fallback as requested
        return { audio: null, text: "Voice unavailable" };
    }
}

module.exports = { generateVoiceReport };
