import authReducer, { loginStart, loginSuccess, loginFailure, logout } from "../../../app/store/slices/authSlice"

describe("authSlice", () => {
  const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
  }

  const mockUser = {
    id: "1",
    email: "test@example.com",
    name: "Test User",
  }

  it("should return the initial state", () => {
    expect(authReducer(undefined, { type: "unknown" })).toEqual(initialState)
  })

  it("should handle loginStart", () => {
    const actual = authReducer(initialState, loginStart())
    expect(actual.loading).toBe(true)
    expect(actual.isAuthenticated).toBe(false)
    expect(actual.user).toBe(null)
  })

  it("should handle loginSuccess", () => {
    const loadingState = { ...initialState, loading: true }
    const actual = authReducer(loadingState, loginSuccess(mockUser))

    expect(actual.loading).toBe(false)
    expect(actual.isAuthenticated).toBe(true)
    expect(actual.user).toEqual(mockUser)
  })

  it("should handle loginFailure", () => {
    const loadingState = { ...initialState, loading: true }
    const actual = authReducer(loadingState, loginFailure())

    expect(actual.loading).toBe(false)
    expect(actual.isAuthenticated).toBe(false)
    expect(actual.user).toBe(null)
  })

  it("should handle logout", () => {
    const authenticatedState = {
      user: mockUser,
      isAuthenticated: true,
      loading: false,
    }
    const actual = authReducer(authenticatedState, logout())

    expect(actual.isAuthenticated).toBe(false)
    expect(actual.user).toBe(null)
    expect(actual.loading).toBe(false)
  })
})
