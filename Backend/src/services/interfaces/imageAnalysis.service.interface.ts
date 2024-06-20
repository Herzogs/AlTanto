export interface IImageAnalysisService <T> {
    analyzeImage(image: T): Promise<string>;
}