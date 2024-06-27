import { Request, Response, NextFunction } from 'express';
import {IImageAnalysisService} from '../services/interfaces/imageAnalysis.service.interface';
import { ITranslateText } from '../services/interfaces/translate.service.interface';
import { STATUS_CODE } from '../utilities/statusCode.utilities';

class AnalysisController {

    private imageAnalysis: IImageAnalysisService<Buffer>;
    private translateText: ITranslateText;
    private categories = [
        {
          id: 1,
          name: "Seguridad",
          tags: ["seguridad", "robo", "vidrio", "pinchada", "llanta", "palanca"],
        },
        {
          id: 2,
          name: "Transporte",
          tags: ["accidente", "colectivo", "transporte", "trafico", "tirada"],
        },
        {
          id: 3,
          name: "Via publica",
          tags: ["árbol", "caído", "vereda", "bache", "rampa"],
        },
        {
          id: 4,
          name: "Alerta",
        },
      ];

    constructor({ imageAnalysis, translateText }: { imageAnalysis: IImageAnalysisService<Buffer>, translateText: ITranslateText}) {
        this.imageAnalysis = imageAnalysis;
        this.translateText = translateText;
    }

    private async categorizeDescription(description: string) {
        const words = description.toLowerCase().split(" ");
      
        for (const categoryObj of this.categories) {
          const categoryTags = categoryObj.tags || [];
      
          for (const tag of categoryTags) {
            if (words.includes(tag.toLowerCase())) {
              return categoryObj;
            }
          }
        }
        return { id: 4, name: "Alerta", tags: [] };
      }

    async analyzeImage(req: Request, res: Response, next: NextFunction) {
        try {
            if(!req.file) return next({ message: 'No image provided', status: STATUS_CODE.BAD_REQUEST });

            const description = await this.imageAnalysis.analyzeImage(req.file.buffer);
            const translatedDescription = await this.translateText.translate(description);
            const categorizeDescription = await this.categorizeDescription(translatedDescription);
            return res.status(STATUS_CODE.SUCCESS).json({ description: translatedDescription, category: categorizeDescription});
        } catch (error) {
            return next({ message: 'Error analyzing the image', status: STATUS_CODE.SERVER_ERROR });
        }
    }
}

export default AnalysisController;