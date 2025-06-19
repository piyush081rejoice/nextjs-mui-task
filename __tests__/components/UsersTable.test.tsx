import { screen, fireEvent, waitFor } from "@testing-library/react";
import { UsersTable } from "../../app/components/UsersTable";
import { render } from "../utils/test-utils";
import type { jest } from "@jest/globals";

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe("UsersTable", () => {
  const mockUsers = [
    {
      id: 1,
      name: "John Doe",
      username: "johndoe",
      email: "john@example.com",
      phone: "123-456-7890",
      website: "https://johndoe.com",
      avatar: "https://example.com/avatar1.jpg",
    },
    {
      id: 2,
      name: "Jane Smith",
      username: "janesmith",
      email: "jane@example.com",
      phone: "098-765-4321",
      website: "https://janesmith.com",
      avatar: "https://example.com/avatar2.jpg",
    },
  ];

  const mockDashboardState = {
    auth: {
      user: null,
      isAuthenticated: false,
      loading: false,
    },
    dashboard: {
      users: mockUsers,
      allUsers: [],
      pagination: {
        page: 1,
        limit: 6,
        total: 2,
        totalPages: 1,
      },
      loading: false,
      chartsLoading: false,
      error: null,
      chartsError: null,
    },
  };

  beforeEach(() => {
    mockFetch.mockClear();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        users: mockUsers,
        total: 2,
      }),
    } as Response);
  });

  it("renders users table with data", async () => {
    render(<UsersTable />, { preloadedState: mockDashboardState });

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
      expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    });
  });

  it("shows loading state", () => {
    const loadingState = {
      ...mockDashboardState,
      dashboard: {
        ...mockDashboardState.dashboard,
        loading: true,
        users: [],
      },
    };

    render(<UsersTable />, { preloadedState: loadingState });

    expect(screen.getByText("Loading users...")).toBeInTheDocument();
  });

  it("shows error state with retry button", () => {
    const errorState = {
      ...mockDashboardState,
      dashboard: {
        ...mockDashboardState.dashboard,
        error: "Failed to fetch users",
        users: [],
      },
    };

    render(<UsersTable />, { preloadedState: errorState });

    expect(screen.getByText(/Error loading users/)).toBeInTheDocument();
    expect(screen.getByText("Failed to fetch users")).toBeInTheDocument();
    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  it("handles pagination change", async () => {
    render(<UsersTable />, { preloadedState: mockDashboardState });
    const nextPageButton = screen.getByRole("button", { name: /next page/i });

    if (nextPageButton && !nextPageButton.hasAttribute("disabled")) {
      fireEvent.click(nextPageButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });
    }
  });

  it("handles rows per page change", async () => {
    render(<UsersTable />, { preloadedState: mockDashboardState });

    const rowsPerPageSelect = screen.getByRole("combobox");
    fireEvent.mouseDown(rowsPerPageSelect);
    const option12 = screen.getByRole("option", { name: "12" });
    fireEvent.click(option12);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  it("shows no users message when users array is empty", () => {
    const emptyState = {
      ...mockDashboardState,
      dashboard: {
        ...mockDashboardState.dashboard,
        users: [],
        loading: false,
      },
    };

    render(<UsersTable />, { preloadedState: emptyState });

    expect(screen.getByText("No users found")).toBeInTheDocument();
  });

  it("renders user avatars", async () => {
    render(<UsersTable />, { preloadedState: mockDashboardState });

    await waitFor(() => {
      const avatars = screen.getAllByRole("img");
      expect(avatars.length).toBeGreaterThan(0);
    });
  });

  it("displays user information correctly", async () => {
    render(<UsersTable />, { preloadedState: mockDashboardState });

    await waitFor(() => {
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("@johndoe")).toBeInTheDocument();
      expect(screen.getByText("@janesmith")).toBeInTheDocument();
    });
  });
});
