class ReportNotFoundException extends Error {
    constructor(message: string = "Report not found") {
        super(message);
    }
}

class ReportNotCreatedException extends Error {
    constructor(message: string = "Report could not be created") {
        super(message);
    }
}

export { ReportNotCreatedException, ReportNotFoundException };