import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import Filter from '@components/filter/Filters';

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

    // Verify setSelectedCategories was called with the correct initial values
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
    expect(setSelectedCategories).toHaveBeenCalledWith([2]);

    fireEvent.click(screen.getByLabelText("Category 3"));
    expect(setSelectedCategories).toHaveBeenCalledWith([1, 2, 3]);
  });

  it("should display the correct icons", async () => {
    const setSelectedCategories = vi.fn();

    render(
      <Filter
        selectedCategories={[]}
        setSelectedCategories={setSelectedCategories}
      />
    );

    await waitFor(() => {
      mockCategories
        .filter((category) => category.id !== 5)
        .forEach((category) => {
          expect(screen.getByAltText(category.name)).toBeInTheDocument();
        });
    });
  });
});