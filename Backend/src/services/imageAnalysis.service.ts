import { AzureKeyCredential } from '@azure/core-auth';
import createImageAnalysisClient, { ImageAnalysisClient, isUnexpected } from '@azure-rest/ai-vision-image-analysis';

const imageAnalysisService = async (image: Buffer): Promise<string> => {
    try {
        const endpoint = process.env.CV_ENDPOINT;
        const key = process.env.CV_KEY;
        const credential = new AzureKeyCredential(key);
        const client: ImageAnalysisClient = createImageAnalysisClient(endpoint, credential);

        const analysis = await client.path('/imageanalysis:analyze').post({
            body: image,
            queryParameters: {
                features: ['Caption']
            },
            headers: {
                'Content-Type': 'application/octet-stream'
            }
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

export default imageAnalysisService;