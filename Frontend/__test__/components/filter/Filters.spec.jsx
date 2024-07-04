import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, beforeEach, afterEach } from 'vitest';
import Filter from '@components/filter/Filters';
import { getCategoryFromApi } from '@services/getCategory';

// Mock the getCategoryFromApi function
vi.mock("@services/getCategory", () => ({
    getCategoryFromApi: vi.fn(),
}));

// Mock the icon imports
vi.mock("@assets/iconRed.png", () => ({ default: "iconRed.png" }));
vi.mock("@assets/iconBlue.png", () => ({ default: "iconBlue.png" }));
vi.mock("@assets/iconGreen.png", () => ({ default: "iconGreen.png" }));
vi.mock("@assets/iconYellow.png", () => ({ default: "iconYellow.png" }));
vi.mock("@assets/iconOrange.png", () => ({ default: "iconOrange.png" }));

describe("Filter component", () => {
    const mockCategories = [
        { id: 1, name: "Category 1" },
        { id: 2, name: "Category 2" },
        { id: 3, name: "Category 3" },
        { id: 4, name: "Category 4" },
        { id: 5, name: "Category 5" },
    ];

    beforeEach(() => {
        getCategoryFromApi.mockResolvedValue(mockCategories);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("should fetch and display categories excluding category with id 5", async () => {
        const setSelectedCategories = vi.fn();

        render(
            <Filter
                selectedCategories={[]}
                setSelectedCategories={setSelectedCategories}
            />
        );

        await waitFor(() => {
            expect(getCategoryFromApi).toHaveBeenCalled();
            expect(screen.queryByText("Category 5")).not.toBeInTheDocument();
        });

        mockCategories
            .filter((category) => category.id !== 5)
            .forEach((category) => {
                expect(screen.getByLabelText(category.name)).toBeInTheDocument();
            });

        expect(setSelectedCategories).toHaveBeenCalledWith(
            mockCategories.filter((category) => category.id !== 5).map((c) => c.id)
        );
    });

    it("should handle checkbox changes", async () => {
        const setSelectedCategories = vi.fn();
        const selectedCategories = [1, 2];

        render(
            <Filter
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
            />
        );

        await waitFor(() => {
            expect(screen.getByLabelText("Category 1")).toBeChecked();
            expect(screen.getByLabelText("Category 2")).toBeChecked();
            expect(screen.getByLabelText("Category 3")).not.toBeChecked();
            expect(screen.getByLabelText("Category 4")).not.toBeChecked();
        });

        fireEvent.click(screen.getByLabelText("Category 1"));
         waitFor(() => {
            expect(screen.getByLabelText("Category 1")).not.toBeChecked();
        });

        fireEvent.click(screen.getByLabelText("Category 3"));
         waitFor(() => {
            expect(screen.getByLabelText("Category 3")).toBeChecked();
        });

    });

    it("should reset selected categories when clearing selection", async () => {
        const setSelectedCategories = vi.fn();
        const selectedCategories = [1];

        render(
            <Filter
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
            />
        );

        await waitFor(() => {
            expect(screen.getByLabelText("Category 1")).toBeChecked();
            expect(screen.getByLabelText("Category 2")).not.toBeChecked();
            expect(screen.getByLabelText("Category 3")).not.toBeChecked();
            expect(screen.getByLabelText("Category 4")).not.toBeChecked();
        });

        fireEvent.click(screen.getByLabelText("Category 1"));     
         waitFor(() => {
            expect(setSelectedCategories).toHaveBeenCalledWith([]);
        });
    });
   
});
