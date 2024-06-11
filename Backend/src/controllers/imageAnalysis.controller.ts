import { Request, Response, NextFunction } from 'express';
import translateText from '../utilities/translateText.utilities';
import imageAnalysisService from '../services/imageAnalysis.service';

const analyzeImage = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        if(!req.file) return next({ message: 'No image provided', status: 400 });

        const description = await imageAnalysisService(req.file.buffer);
        
        if (description) {
            const translatedDescription = await translateText(description);
            return res.json({ description: translatedDescription });
        }
        return next({ message: 'Unable to analyze the image', status: 500 });
    } catch (error) {
        return next({ message: 'Error analyzing the image', status: 500 });
    }
}

export default analyzeImage;