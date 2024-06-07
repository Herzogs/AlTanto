import axios from 'axios';

const googleTranslateApiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
const translateText = async (text: string) => {
    const response = await axios.post(`https://translation.googleapis.com/language/translate/v2?key=${googleTranslateApiKey}`, {
      q: text,
      target: 'es' // Traducir a español
    });
  
    return response.data.data.translations[0].translatedText;
  };

export default translateText;