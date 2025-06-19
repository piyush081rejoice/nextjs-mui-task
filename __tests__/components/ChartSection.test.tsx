import { screen, waitFor } from "@testing-library/react";
import { ChartSection } from "../../app/components/ChartSection";
import { render } from "../utils/test-utils";
import type { jest } from "@jest/globals";

// Mock fetch
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe("ChartSection", () => {
  const mockAllUsers = [
    {
      id: 1,
      name: "John Doe",
      username: "johndoe",
      email: "john@example.com",
      phone: "123-456-7890",
      website: "https://johndoe.com",
      age: 25,
      gender: "male",
      bloodGroup: "A+",
      eyeColor: "brown",
      company: { department: "Engineering" },
      height: 180,
      weight: 75,
    },
    {
      id: 2,
      name: "Jane Smith",
      username: "janesmith",
      email: "jane@example.com",
      phone: "098-765-4321",
      website: "https://janesmith.com",
      age: 30,
      gender: "female",
      bloodGroup: "B+",
      eyeColor: "blue",
      company: { department: "Marketing" },
      height: 165,
      weight: 60,
    },
  ];

  const mockDashboardState = {
    auth: {
      user: null,
      isAuthenticated: false,
      loading: false,
    },
    dashboard: {
      users: [],
      allUsers: mockAllUsers,
      pagination: { page: 1, limit: 6, total: 0, totalPages: 0 },
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
        users: mockAllUsers,
        total: 2,
      }),
    } as Response);
  });

  it("renders chart section with title", async () => {
    render(<ChartSection users={[]} loading={false} />, { preloadedState: mockDashboardState });

    await waitFor(() => {
      expect(screen.getByText("Comprehensive User Analytics")).toBeInTheDocument();
    });
  });

  it("shows loading state when charts are loading", () => {
    const loadingState = {
      ...mockDashboardState,
      dashboard: {
        ...mockDashboardState.dashboard,
        chartsLoading: true,
        allUsers: [],
      },
    };

    render(<ChartSection users={[]} loading={false} />, { preloadedState: loadingState });

    expect(screen.getByText("Loading comprehensive analytics...")).toBeInTheDocument();
  });

  it("shows error state with retry button", () => {
    const errorState = {
      ...mockDashboardState,
      dashboard: {
        ...mockDashboardState.dashboard,
        chartsError: "Failed to fetch chart data",
        allUsers: [],
      },
    };

    render(<ChartSection users={[]} loading={false} />, { preloadedState: errorState });

    expect(screen.getByText(/Error loading chart data/)).toBeInTheDocument();
    expect(screen.getByText("Failed to fetch chart data")).toBeInTheDocument();
    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  it("renders statistical insights", async () => {
    render(<ChartSection users={[]} loading={false} />, { preloadedState: mockDashboardState });

    await waitFor(() => {
      expect(screen.getByText("Advanced Statistical Insights")).toBeInTheDocument();
      expect(screen.getByText("Avg Age")).toBeInTheDocument();
      expect(screen.getByText("Avg Height (cm)")).toBeInTheDocument();
      expect(screen.getByText("Avg Weight (kg)")).toBeInTheDocument();
      expect(screen.getByText("Departments")).toBeInTheDocument();
    });
  });

  it("renders chart titles", async () => {
    render(<ChartSection users={[]} loading={false} />, { preloadedState: mockDashboardState });

    await waitFor(() => {
      expect(screen.getByText("👥 Gender Distribution Analysis")).toBeInTheDocument();
      expect(screen.getByText("📊 Age Group Demographics")).toBeInTheDocument();
      expect(screen.getByText("🩸 Blood Group Distribution")).toBeInTheDocument();
      expect(screen.getByText("👁️ Eye Color Diversity")).toBeInTheDocument();
      expect(screen.getByText("🏢 Department-wise Employee Distribution")).toBeInTheDocument();
      expect(screen.getByText("📈 Height & Weight Correlation Analysis")).toBeInTheDocument();
    });
  });

  it("displays user statistics chips", async () => {
    render(<ChartSection users={[]} loading={false} />, { preloadedState: mockDashboardState });

    await waitFor(() => {
      expect(screen.getByText("2 Total Users")).toBeInTheDocument();
      expect(screen.getByText("2 Departments")).toBeInTheDocument();
      expect(screen.getByText("2 Eye Colors")).toBeInTheDocument();
    });
  });

  it("calculates and displays correct averages", async () => {
    render(<ChartSection users={[]} loading={false} />, { preloadedState: mockDashboardState });

    await waitFor(() => {
      expect(screen.getByText("28")).toBeInTheDocument();
      expect(screen.getByText("173")).toBeInTheDocument();
      expect(screen.getByText("68")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
    });
  });

  it("renders SVG charts", async () => {
    render(<ChartSection users={[]} loading={false} />, { preloadedState: mockDashboardState });

    await waitFor(() => {
      const svgElements = screen.getAllByRole("img", { hidden: true });
      expect(svgElements.length).toBeGreaterThan(0);
    });
  });
});
