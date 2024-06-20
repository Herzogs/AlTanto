import { Request, Response, NextFunction } from 'express';
import {IImageAnalysisService} from '../services/interfaces/imageAnalysis.service.interface';
import { ITranslateText } from '../services/interfaces/translate.service.interface';
import { STATUS_CODE } from '../utilities/statusCode.utilities';

class AnalysisController {

    private imageAnalysis: IImageAnalysisService<Buffer>;
    private translateText: ITranslateText;

    constructor({ imageAnalysis, translateText }: { imageAnalysis: IImageAnalysisService<Buffer>, translateText: ITranslateText}) {
        this.imageAnalysis = imageAnalysis;
        this.translateText = translateText;
    }

    async analyzeImage(req: Request, res: Response, next: NextFunction) {
        try {
            if(!req.file) return next({ message: 'No image provided', status: STATUS_CODE.BAD_REQUEST });

            const description = await this.imageAnalysis.analyzeImage(req.file.buffer);
            const translatedDescription = await this.translateText.translate(description);
            return res.status(STATUS_CODE.SUCCESS).json({ description: translatedDescription });
        } catch (error) {
            return next({ message: 'Error analyzing the image', status: STATUS_CODE.SERVER_ERROR });
        }
    }
}

export default AnalysisController;