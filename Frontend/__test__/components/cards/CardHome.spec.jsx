import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from "react-router-dom";
import CardHome from "@components/cards/CardHome"; 
import { userStore } from "@store";

/// Mock the userStore
vi.mock("@store", () => ({
    userStore: {
      getState: vi.fn(),
    },
  }));
  
  describe("CardHome component", () => {
    afterEach(() => {
      vi.clearAllMocks();
    });
  
    it("should render 'Invitado' when no user is logged in", () => {
      userStore.getState.mockReturnValue({ user: { id: null, name: "", lastName: "" } });
  
      render(
        <MemoryRouter>
          <CardHome />
        </MemoryRouter>
      );
  
      expect(screen.getByText("Invitado")).toBeInTheDocument();
      expect(screen.queryByText("Perfil")).not.toBeInTheDocument();
    });
  
    it("should render user name and last name when user is logged in", () => {
      userStore.getState.mockReturnValue({ user: { id: "1", name: "John", lastName: "Doe" } });
  
      render(
        <MemoryRouter>
          <CardHome />
        </MemoryRouter>
      );
  
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Perfil")).toBeInTheDocument();
    });
  
    it("should render links when user is logged in", () => {
      userStore.getState.mockReturnValue({ user: { id: "1", name: "John", lastName: "Doe" } });
  
      render(
        <MemoryRouter>
          <CardHome />
        </MemoryRouter>
      );
  
      expect(screen.getByText("Perfil")).toBeInTheDocument();
      expect(screen.getByText("Grupos")).toBeInTheDocument();
      expect(screen.getByText("Zonas")).toBeInTheDocument();
      expect(screen.getByText("Recorridos")).toBeInTheDocument();
      expect(screen.getByText("Notificaciones")).toBeInTheDocument();
    });
  
    it("should not render links when no user is logged in", () => {
      userStore.getState.mockReturnValue({ user: { id: null, name: "", lastName: "" } });
  
      render(
        <MemoryRouter>
          <CardHome />
        </MemoryRouter>
      );
  
      expect(screen.queryByText("Perfil")).not.toBeInTheDocument();
      expect(screen.queryByText("Grupos")).not.toBeInTheDocument();
      expect(screen.queryByText("Zonas")).not.toBeInTheDocument();
      expect(screen.queryByText("Recorridos")).not.toBeInTheDocument();
      expect(screen.queryByText("Notificaciones")).not.toBeInTheDocument();
    });
  });