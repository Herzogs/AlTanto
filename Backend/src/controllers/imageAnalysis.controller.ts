import { Request, Response, NextFunction } from 'express';
import {IImageAnalysisService} from '../services/interfaces/imageAnalysis.service.interface';
import { ITranslateText } from '../services/interfaces/translate.service.interface';

class AnalysisController {

    private imageAnalysisService: IImageAnalysisService<Buffer>;
    private translateText: ITranslateText;

    constructor({ imageAnalysisService, translateText }: { imageAnalysisService: IImageAnalysisService<Buffer>, translateText: ITranslateText}) {
        this.imageAnalysisService = imageAnalysisService;
        this.translateText = translateText;
    }

    async analyzeImage(req: Request, res: Response, next: NextFunction) {
        try {
            if(!req.file) return next({ message: 'No image provided', status: 400 });

            const description = await this.imageAnalysisService.analyzeImage(req.file.buffer);
            
            if (description) {
                const translatedDescription = await this.translateText.translate(description);
                return res.json({ description: translatedDescription });
            }
            return next({ message: 'Unable to analyze the image', status: 500 });
        } catch (error) {
            return next({ message: 'Error analyzing the image', status: 500 });
        }
    }
}

export default AnalysisController;