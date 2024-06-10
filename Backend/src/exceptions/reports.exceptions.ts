import ApiError from "../utilities/apiError";

class ReportNotFoundException extends ApiError {
    constructor(message: string = "Report not found") {
        super(message, 404);
    }
}

class ReportNotCreatedException extends ApiError {
    constructor(message: string = "Report could not be created") {
        super(message, 400);
    }
}

export { ReportNotCreatedException, ReportNotFoundException };