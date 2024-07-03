import { Lifetime } from "awilix";
import container from "../../src/container";
import ReportService from "../../src/services/report.service";
import ReportController from "../../src/controllers/report.controller";
import * as validationReports from "../../src/validator/report.validator";
import { Request, Response, NextFunction } from "express";
import NotificationService from "../../src/services/notification.service";
import { IReportDto } from "../../src/models/reports.interface";

jest.mock("../../src/services/report.service", () => {
    return jest.fn().mockImplementation(() => {
        return {
            createReport: jest.fn(),
            getAll: jest.fn(),
            getById: jest.fn(),
            getByUser: jest.fn(),
            getReportsByGroup: jest.fn(),
            scoringReport: jest.fn(),
        };
    });
});

jest.mock("../../src/validator/report.validator", () => {
    return {
        createReportValidator: {
            safeParseAsync: jest.fn(),
        },
        getReportByIdValidator: {
            safeParseAsync: jest.fn(),
        },
        getReportByUserIDValidator: {
            safeParseAsync: jest.fn(),
        },
        scoringReportValidator: {
            safeParseAsync: jest.fn(),
        },
    };
});

jest.mock("../../src/services/notification.service", () => {
    return jest.fn().mockImplementation(() => {
        return {
            sendNotificationToZone: jest.fn(),
            sendNotificationToGroup: jest.fn(),
        };
    });
});

describe("ReportController", () => {
    let reportController: ReportController;
    let reportService: jest.Mocked<ReportService>;
    let notificationService: jest.Mocked<NotificationService>;

    beforeAll(() => {
        container.loadModules([
            ["../../src/services/*.service.ts", Lifetime.SCOPED],
        ]);
        reportService = container.resolve<ReportService>("reportService") as jest.Mocked<ReportService>;
        notificationService = container.resolve<NotificationService>("notificationService") as jest.Mocked<NotificationService>;
        reportController = new ReportController({ reportService, notificationService });
    });

    const reportData: IReportDto = {
        id: 1,
        content: "Test",
        createAt: new Date(),
        image: "image",
        positiveScore: 1,
        negativeScore: 1,
        category: "Test",
        location: {
            latitude: 1,
            longitude: 1,
        },
        userId: 1,
    };

    test("should create a report", async () => {
        const req = { body: reportData } as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        (validationReports.createReportValidator.safeParseAsync as jest.Mock).mockResolvedValue({ success: true, data: reportData });

        reportService.createReport.mockResolvedValue(reportData);

        await reportController.createReport(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(reportData);
    });

    test("should get all reports", async () => {
        const req = {} as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as unknown as NextFunction;

        reportService.getAll.mockResolvedValue([reportData]);

        await reportController.getAllReports(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([reportData]);
    });

    test("should get report by id", async () => {
        const req = { params: { id: 1 } } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        (validationReports.getReportByIdValidator.safeParseAsync as jest.Mock).mockResolvedValue({ success: true, data: { id: 1 } });

        reportService.getById.mockResolvedValue(reportData);

        await reportController.getReportById(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(reportData);
    });

    test("should return 500 if report not found", async () => {
        const req = { params: { id: 1 } } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        (validationReports.getReportByIdValidator.safeParseAsync as jest.Mock).mockResolvedValue({ success: true, data: { id: 1 } });

        reportService.getById.mockRejectedValue(new Error("Report not found"));

        await reportController.getReportById(req, res, next);

        expect(next).toHaveBeenCalledWith({ message: "Report not found", statusCode: 500 });
    });

    test("should return 400 if validation fails", async () => {
        const req = { params: { id: "invalid" } } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        (validationReports.getReportByIdValidator.safeParseAsync as jest.Mock).mockResolvedValue({ success: false, error: { errors: [{ message: "Invalid id" }] } });

        await reportController.getReportById(req, res, next);

        expect(next).toHaveBeenCalledWith({ message: "Invalid id", statusCode: 400 });
    });

    test("should get report by user", async () => {
        const req = { body: { userId: 1 } } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        (validationReports.getReportByUserIDValidator.safeParseAsync as jest.Mock).mockResolvedValue({ success: true, data: { userId: 1 } });

        reportService.getByUser.mockResolvedValue([reportData]);

        await reportController.getReportByUser(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([reportData]);
    });
});
