import { screen, fireEvent } from "@testing-library/react";
import { Sidebar } from "../../app/components/Sidebar";
import { render } from "../utils/test-utils";
import jest from "jest"; 

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => "/home",
}));

describe("Sidebar", () => {
  const defaultProps = {
    mobileOpen: false,
    onMobileToggle: jest.fn(),
  };

  const mockAuthState = {
    auth: {
      user: {
        id: "1",
        name: "Test User",
        email: "test@example.com",
      },
      isAuthenticated: true,
      loading: false,
    },
    dashboard: {
      users: [],
      allUsers: [],
      pagination: { page: 1, limit: 6, total: 0, totalPages: 0 },
      loading: false,
      chartsLoading: false,
      error: null,
      chartsError: null,
    },
  };

  beforeEach(() => {
    mockPush.mockClear();
    defaultProps.onMobileToggle.mockClear();
  });

  it("renders sidebar with user information", () => {
    render(<Sidebar {...defaultProps} />, { preloadedState: mockAuthState });

    expect(screen.getByText("Dashboard App")).toBeInTheDocument();
    expect(screen.getByText("Welcome, Test User")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("renders navigation menu items", () => {
    render(<Sidebar {...defaultProps} />, { preloadedState: mockAuthState });

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("navigates to home when Home is clicked", () => {
    render(<Sidebar {...defaultProps} />, { preloadedState: mockAuthState });

    fireEvent.click(screen.getByText("Home"));
    expect(mockPush).toHaveBeenCalledWith("/home");
  });

  it("navigates to dashboard when Dashboard is clicked", () => {
    render(<Sidebar {...defaultProps} />, { preloadedState: mockAuthState });

    fireEvent.click(screen.getByText("Dashboard"));
    expect(mockPush).toHaveBeenCalledWith("/home/dashboard");
  });

  it("renders logout button", () => {
    render(<Sidebar {...defaultProps} />, { preloadedState: mockAuthState });

    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("calls logout when logout button is clicked", () => {
    const { store } = render(<Sidebar {...defaultProps} />, { preloadedState: mockAuthState });

    fireEvent.click(screen.getByText("Logout"));

    // check if logout action was  dispatched
    const state = store.getState();
    expect(state.auth.isAuthenticated).toBe(false);
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("shows close button on mobile when drawer is open", () => {
    render(<Sidebar {...defaultProps} mobileOpen={true} />, { preloadedState: mockAuthState });
    const closeButtons = screen.getAllByTestId("CloseIcon");
    expect(closeButtons.length).toBeGreaterThan(0);
  });
});
