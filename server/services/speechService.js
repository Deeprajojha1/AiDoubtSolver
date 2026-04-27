const { AssemblyAI } = require('assemblyai');

const client = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY });

const TRANSCRIBE_PARAMS = {
  speech_models: ['universal-3-pro', 'universal-2'],
  language_detection: true,
  punctuate: true,
  format_text: true,
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isTransientNetworkError = (error) => {
  const msg = (error?.message || '').toLowerCase();
  return msg.includes('fetch failed') || msg.includes('network') || msg.includes('timeout');
};

const transcribeAudio = async (audioFilePath) => {
  try {
    let transcript;

    try {
      transcript = await client.transcripts.transcribe({
        audio: audioFilePath,
        ...TRANSCRIBE_PARAMS,
      });
    } catch (error) {
      // Retry once for transient upstream/network failures.
      if (!isTransientNetworkError(error)) {
        throw error;
      }
      await wait(700);
      transcript = await client.transcripts.transcribe({
        audio: audioFilePath,
        ...TRANSCRIBE_PARAMS,
      });
    }

    if (transcript.status === 'error') {
      throw new Error(`Transcription failed: ${transcript.error}`);
    }

    if (!transcript.text || transcript.text.trim() === '') {
      throw new Error('No speech detected in the audio. Please speak clearly and try again.');
    }

    return transcript.text;
  } catch (error) {
    if (error.message.includes('No speech detected')) throw error;
    throw new Error(`Speech-to-text failed: ${error.message || 'Unknown error'}`);
  }
};

const isSpeechServiceAvailable = () => {
  return !!(process.env.ASSEMBLYAI_API_KEY && process.env.ASSEMBLYAI_API_KEY !== 'your_assemblyai_api_key_here');
};

module.exports = { transcribeAudio, isSpeechServiceAvailable };
