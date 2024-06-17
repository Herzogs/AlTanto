import axios from 'axios';
import {ITranslateText} from './interfaces/translate.service.interface';

class TranslateText implements ITranslateText{

  private googleTranslateApiKey: string;

  constructor(){
    this.googleTranslateApiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  }

  async translate(text: string) {
    const response = await axios.post(`https://translation.googleapis.com/language/translate/v2?key=${this.googleTranslateApiKey}`, {
      q: text,
      target: 'es' // Traducir a español
    });
  
    return response.data.data.translations[0].translatedText;
  }

}

export default TranslateText;