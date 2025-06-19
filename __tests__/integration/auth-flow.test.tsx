import type React from "react"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { configureStore } from "@reduxjs/toolkit"
import { Provider } from "react-redux"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import LoginPage from "../../app/login/page"
import { Sidebar } from "../../app/components/Sidebar"
import authReducer from "../../app/store/slices/authSlice"
import dashboardReducer from "../../app/store/slices/dashboardSlice"
import theme from "../../app/theme"
import { render } from "@testing-library/react"
import jest from "jest"

const mockPush = jest.fn()
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => "/home",
}))

describe("Authentication Flow Integration", () => {
  let store: ReturnType<typeof configureStore>

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
        dashboard: dashboardReducer,
      },
    })
    mockPush.mockClear()
  })

  const renderWithStore = (component: React.ReactElement) => {
    return render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {component}
        </ThemeProvider>
      </Provider>,
    )
  }

  it("completes full authentication flow", async () => {
    const user = userEvent.setup()

    // 1. render login page
    renderWithStore(<LoginPage />)

    // 2. fill in login form
    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole("button", { name: /sign in/i })

    await user.type(emailInput, "admin@example.com")
    await user.type(passwordInput, "password")
    await user.click(submitButton)

    // 3. wait for login to complete
    await waitFor(() => {
      const state = store.getState()
      expect(state.auth.isAuthenticated).toBe(true)
      expect(state.auth.user?.email).toBe("admin@example.com")
      expect(mockPush).toHaveBeenCalledWith("/home")
    })

    // 4 . render sidebar with authenticated state
    renderWithStore(<Sidebar mobileOpen={false} onMobileToggle={jest.fn()} />)

    // 5. verify user info is displayed
    expect(screen.getByText("Welcome, Admin User")).toBeInTheDocument()
    expect(screen.getByText("admin@example.com")).toBeInTheDocument()

    // 6 . test logout
    const logoutButton = screen.getByText("Logout")
    await user.click(logoutButton)

    // 7 . verify logout completed
    await waitFor(() => {
      const state = store.getState()
      expect(state.auth.isAuthenticated).toBe(false)
      expect(state.auth.user).toBe(null)
      expect(mockPush).toHaveBeenCalledWith("/login")
    })
  })

  it("handles login failure correctly", async () => {
    const user = userEvent.setup()

    renderWithStore(<LoginPage />)

    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole("button", { name: /sign in/i })

    await user.type(emailInput, "wrong@example.com")
    await user.type(passwordInput, "wrongpassword")
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText("Invalid email or password")).toBeInTheDocument()
      const state = store.getState()
      expect(state.auth.isAuthenticated).toBe(false)
      expect(state.auth.user).toBe(null)
    })
  })
})
