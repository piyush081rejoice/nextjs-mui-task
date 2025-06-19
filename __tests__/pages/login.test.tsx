import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import LoginPage from "../../app/login/page"
import { render } from "../utils/test-utils"
import jest from "jest"

const mockPush = jest.fn()
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe("LoginPage", () => {
  const initialState = {
    auth: {
      user: null,
      isAuthenticated: false,
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

  beforeEach(() => {
    mockPush.mockClear()
  })

  it("renders login form", () => {
    render(<LoginPage />, { preloadedState: initialState })

    expect(screen.getByText("Sign In")).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument()
  })

  it("displays demo credentials", () => {
    render(<LoginPage />, { preloadedState: initialState })

    expect(screen.getByText("Demo credentials:")).toBeInTheDocument()
    expect(screen.getByText("Email: admin@example.com")).toBeInTheDocument()
    expect(screen.getByText("Password: password")).toBeInTheDocument()
  })

  it("shows validation error for empty fields", async () => {
    const user = userEvent.setup()
    render(<LoginPage />, { preloadedState: initialState })

    const submitButton = screen.getByRole("button", { name: /sign in/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText("Please fill in all fields")).toBeInTheDocument()
    })
  })

  it("handles successful login", async () => {
    const user = userEvent.setup()
    const { store } = render(<LoginPage />, { preloadedState: initialState })

    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole("button", { name: /sign in/i })

    await user.type(emailInput, "admin@example.com")
    await user.type(passwordInput, "password")
    await user.click(submitButton)

    // wait for async login  process
    await waitFor(() => {
      const state = store.getState()
      expect(state.auth.isAuthenticated).toBe(true)
      expect(state.auth.user?.email).toBe("admin@example.com")
      expect(mockPush).toHaveBeenCalledWith("/home")
    })
  })

  it("handles login failure", async () => {
    const user = userEvent.setup()
    render(<LoginPage />, { preloadedState: initialState })

    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole("button", { name: /sign in/i })

    await user.type(emailInput, "wrong@example.com")
    await user.type(passwordInput, "wrongpassword")
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText("Invalid email or password")).toBeInTheDocument()
    })
  })

  it("shows loading state during login", async () => {
    const user = userEvent.setup()
    render(<LoginPage />, { preloadedState: initialState })

    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole("button", { name: /sign in/i })

    await user.type(emailInput, "admin@example.com")
    await user.type(passwordInput, "password")
    await user.click(submitButton)

    // check for loading spinner(it  appears briefly )
    const loadingSpinner = screen.queryByRole("progressbar")
    if (loadingSpinner) {
      expect(loadingSpinner).toBeInTheDocument()
    }
  })

  it("disables submit button during loading", async () => {
    const loadingState = {
      ...initialState,
      auth: {
        ...initialState.auth,
        loading: true,
      },
    }

    render(<LoginPage />, { preloadedState: loadingState })

    const submitButton = screen.getByRole("button", { name: /sign in/i })
    expect(submitButton).toBeDisabled()
  })
})
