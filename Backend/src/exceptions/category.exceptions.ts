class CategoryNotFoundException extends Error {
    constructor(message: string = "Category not found") {
        super(message);
    }
}

class CategoryNotCreatedException extends Error {
    constructor(message: string = "Category could not be created") {
        super(message);
    }
}

export { CategoryNotCreatedException, CategoryNotFoundException };