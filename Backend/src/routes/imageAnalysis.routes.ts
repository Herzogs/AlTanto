import express from 'express';
import multer from 'multer';
import axios from 'axios';
import { AzureKeyCredential } from '@azure/core-auth';
import createClient from '@azure-rest/ai-vision-image-analysis';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const endpoint = process.env.VITE_CV_ENDPOINT;
const key = process.env.VITE_CV_KEY;
const googleTranslateApiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

const credential = new AzureKeyCredential(key);
const client = createClient(endpoint, credential);

const translateText = async (text: string) => {
  const response = await axios.post(`https://translation.googleapis.com/language/translate/v2?key=${googleTranslateApiKey}`, {
    q: text,
    target: 'es' // Traducir a español
  });

  return response.data.data.translations[0].translatedText;
};

router.post('/analyze-image', upload.single('image'), async (req, res) => {
  try {
    const { buffer } = req.file;

    const result = await client.path('/imageanalysis:analyze').post({
      body: buffer,
      queryParameters: {
        features: ['Caption']
      },
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    });

    const iaResult = result.body;

    if (iaResult.captionResult) {
      const translatedDescription = await translateText(iaResult.captionResult.text);
      res.json({ description: translatedDescription });
    } else {
      res.status(500).json({ error: 'Unable to analyze the image' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error analyzing the image' });
  }
});

export default router;
