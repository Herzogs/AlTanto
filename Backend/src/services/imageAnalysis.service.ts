import { AzureKeyCredential } from '@azure/core-auth';
import createImageAnalysisClient, { ImageAnalysisClient, isUnexpected } from '@azure-rest/ai-vision-image-analysis';
import { IImageAnalysisService } from './interfaces/imageAnalysis.service.interface';

class ImageAnalysis implements IImageAnalysisService<Buffer>{

    private endpoint: string;
    private key: string;
    private client: ImageAnalysisClient
    private credential: AzureKeyCredential;
    
    constructor() {
        this.endpoint = process.env.CV_ENDPOINT;
        this.key = process.env.CV_KEY;
        this.credential = new AzureKeyCredential(this.key);
        this.client = createImageAnalysisClient(this.endpoint, this.credential);
    }

    async analyzeImage(image: Buffer): Promise<string> {
        console.log("ENTRE AL SERVICIO IA ")
        try {
            const analysis = await this.client.path('/imageanalysis:analyze').post({
                body: image,
                queryParameters: {
                    features: ['Caption']
                },
                contentType: 'application/octet-stream'
            });
            if (isUnexpected(analysis)) throw new Error('Error analyzing the image');
            if (!analysis.body || !analysis.body.captionResult) throw new Error('Error analyzing the image');
    
            const description = analysis.body.captionResult.text;
            return description;
        } catch (error) {
            console.error(error);
            throw new Error('Error analyzing the image');
        }
    }

}

export default ImageAnalysis;