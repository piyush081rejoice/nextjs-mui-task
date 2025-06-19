import { screen } from "@testing-library/react"
import HomePage from "../../app/home/page"
import { render } from "../utils/test-utils"

describe("HomePage", () => {
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
  }

  it("renders welcome message with user name", () => {
    render(<HomePage />, { preloadedState: mockAuthState })

    expect(screen.getByText("Welcome, Test User!")).toBeInTheDocument()
  })

  it("renders dashboard overview card", () => {
    render(<HomePage />, { preloadedState: mockAuthState })

    expect(screen.getByText("Dashboard Overview")).toBeInTheDocument()
    expect(screen.getByText(/Navigate to the Dashboard to view data/)).toBeInTheDocument()
  })

  it("renders user profile card", () => {
    render(<HomePage />, { preloadedState: mockAuthState })

    expect(screen.getByText("User Profile")).toBeInTheDocument()
    expect(screen.getByText("Email:")).toBeInTheDocument()
    expect(screen.getByText("test@example.com")).toBeInTheDocument()
    expect(screen.getByText("User ID:")).toBeInTheDocument()
    expect(screen.getByText("1")).toBeInTheDocument()
  })

  it("renders statistics cards", () => {
    render(<HomePage />, { preloadedState: mockAuthState })

    expect(screen.getByText("100+")).toBeInTheDocument()
    expect(screen.getByText("Users Available")).toBeInTheDocument()
    expect(screen.getByText("24/7")).toBeInTheDocument()
    expect(screen.getByText("System Uptime")).toBeInTheDocument()
    expect(screen.getByText("Real-time")).toBeInTheDocument()
    expect(screen.getByText("Data Updates")).toBeInTheDocument()
  })

  it("has responsive layout structure", () => {
    render(<HomePage />, { preloadedState: mockAuthState })
    const mainContainer = screen.getByText("Welcome, Test User!").closest("div")
    expect(mainContainer).toBeInTheDocument()
  })
})
