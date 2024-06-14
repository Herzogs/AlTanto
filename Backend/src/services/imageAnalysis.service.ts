import { AzureKeyCredential } from '@azure/core-auth';
import createImageAnalysisClient, { ImageAnalysisClient, isUnexpected } from '@azure-rest/ai-vision-image-analysis';

const imageAnalysisService = async (image: Buffer): Promise<string> => {
    try {
        const endpoint = process.env.CV_ENDPOINT as string;
        const key = process.env.CV_KEY as string;
        const credential = new AzureKeyCredential(key as string);
        const client: ImageAnalysisClient = createImageAnalysisClient(endpoint, credential);

        const analysis = await client.path('/imageanalysis:analyze').post({
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

export default imageAnalysisService;