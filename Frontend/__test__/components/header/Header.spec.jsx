import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from "react-router-dom";
import Header from "@components/header/Header";

vi.mock("@mui/icons-material/List", () => ({ __esModule: true, default: () => <span>ListIconMock</span> }));
vi.mock("@store", () => ({
    userStore: () => ({ token: "mockToken" })
}));
vi.mock("@assets/logo-altanto.png", () => ({ default: () => <span>logo</span> }));

describe("Header Component", () => {
    it("renders Header component with logged-in state", () => {
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );
        waitFor(() => {
            expect(screen.getByAltText("Logo Al Tanto")).toBeInTheDocument();
            expect(screen.getByText("ListIconMock")).toBeInTheDocument();
            expect(screen.getByText("Cerrar sesión")).toBeInTheDocument();
        });
    });
    it("renders Header component with logged-out state", () => {
        vi.mock("@store", () => ({
            userStore: () => ({ token: null })
        }));
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        waitFor(() => {
            expect(screen.getByAltText("Logo Al Tanto")).toBeInTheDocument();
            expect(screen.getByText("ListIconMock")).toBeInTheDocument();
            expect(screen.getByText("Iniciar sesión")).toBeInTheDocument();
            expect(screen.getByText("Verificar usuario")).toBeInTheDocument();
        });
    });
});