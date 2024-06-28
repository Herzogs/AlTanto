import { Lifetime } from 'awilix';
import container from '../../src/container';
import ImageAnalysis from '../../src/services/imageAnalysis.service';
import { Request, Response, NextFunction } from 'express';
import TranslateText from '../../src/services/translate.service';
import AnalysisController from '../../src/controllers/imageAnalysis.controller';

jest.mock('../../src/services/imageAnalysis.service', () => {
    return jest.fn().mockImplementation(() => {
        return {
            analyzeImage: jest.fn(),
        };
    });
});

jest.mock('../../src/services/translate.service', () => {
    return jest.fn().mockImplementation(() => {
        return {
            translate: jest.fn(),
        };
    });
});

describe('ImageAnalysisController', () => {
    let imageAnalysis: jest.Mocked<ImageAnalysis>;
    let analysisController: AnalysisController;
    let translateText: jest.Mocked<TranslateText>;

    beforeAll(() => {
        container.loadModules([
            ['../../src/services/*.service.ts', Lifetime.SCOPED],
        ]);
        imageAnalysis = container.resolve<ImageAnalysis>('imageAnalysis') as jest.Mocked<ImageAnalysis>;
        translateText = container.resolve<TranslateText>('translateText') as jest.Mocked<TranslateText>;
        analysisController = new AnalysisController({ imageAnalysis, translateText });
    });

    test('should analyze an image', async () => {
        const req = { file: { buffer: Buffer.from('image') } } as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        imageAnalysis.analyzeImage.mockResolvedValue('description');
        translateText.translate.mockResolvedValue('translated description');

        await analysisController.analyzeImage(req, res, next);

        expect(imageAnalysis.analyzeImage).toHaveBeenCalledWith(Buffer.from('image'));
        expect(translateText.translate).toHaveBeenCalledWith('description');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ description: 'translated description', category: { id: 4, name: 'Alerta', tags: [] }});
    });

    test('should return an error if no image is provided', async () => {
        const req = {} as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await analysisController.analyzeImage(req, res, next);

        expect(next).toHaveBeenCalledWith({ message: 'No image provided', status: 400 });
    });

    test('should return an error if an error occurs analyzing the image', async () => {
        const req = { file: { buffer: Buffer.from('image') } } as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        imageAnalysis.analyzeImage.mockRejectedValue('error');

        await analysisController.analyzeImage(req, res, next);

        expect(next).toHaveBeenCalledWith({ message: 'Error analyzing the image', status: 500 });
    });

    test('should return an error if an error occurs translating the description', async () => {
        const req = { file: { buffer: Buffer.from('image') } } as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        imageAnalysis.analyzeImage.mockResolvedValue('description');
        translateText.translate.mockRejectedValue('error');

        await analysisController.analyzeImage(req, res, next);

        expect(next).toHaveBeenCalledWith({ message: 'Error analyzing the image', status: 500 });
    })


})