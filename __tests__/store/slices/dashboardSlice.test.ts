import dashboardReducer, {
  clearError,
  clearChartsError,
  setPagination,
  fetchUsers,
  fetchAllUsers,
} from "../../../app/store/slices/dashboardSlice"
import type { jest } from "@jest/globals"
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe("dashboardSlice", () => {
  const initialState = {
    users: [],
    allUsers: [],
    pagination: {
      page: 1,
      limit: 6,
      total: 0,
      totalPages: 0,
    },
    loading: false,
    chartsLoading: false,
    error: null,
    chartsError: null,
  }

  beforeEach(() => {
    mockFetch.mockClear()
  })

  it("should return the initial state", () => {
    expect(dashboardReducer(undefined, { type: "unknown" })).toEqual(initialState)
  })

  it("should handle clearError", () => {
    const stateWithError = { ...initialState, error: "Some error" }
    const actual = dashboardReducer(stateWithError, clearError())
    expect(actual.error).toBe(null)
  })

  it("should handle clearChartsError", () => {
    const stateWithError = { ...initialState, chartsError: "Charts error" }
    const actual = dashboardReducer(stateWithError, clearChartsError())
    expect(actual.chartsError).toBe(null)
  })

  it("should handle setPagination", () => {
    const newPagination = { page: 2, limit: 12 }
    const actual = dashboardReducer(initialState, setPagination(newPagination))

    expect(actual.pagination).toEqual({
      ...initialState.pagination,
      ...newPagination,
    })
  })

  it("should handle fetchUsers.pending", () => {
    const actual = dashboardReducer(initialState, fetchUsers.pending("", { page: 1, limit: 6 }))

    expect(actual.loading).toBe(true)
    expect(actual.error).toBe(null)
  })

  it("should handle fetchUsers.fulfilled", () => {
    const mockUsers = [
      { id: 1, name: "John Doe", email: "john@example.com", username: "john", phone: "123", website: "john.com" },
    ]
    const mockPayload = {
      users: mockUsers,
      pagination: { page: 1, limit: 6, total: 1, totalPages: 1 },
    }

    const loadingState = { ...initialState, loading: true }
    const actual = dashboardReducer(loadingState, fetchUsers.fulfilled(mockPayload, "", { page: 1, limit: 6 }))

    expect(actual.loading).toBe(false)
    expect(actual.users).toEqual(mockUsers)
    expect(actual.pagination).toEqual(mockPayload.pagination)
  })

  it("should handle fetchUsers.rejected", () => {
    const loadingState = { ...initialState, loading: true }
    const actual = dashboardReducer(
      loadingState,
      fetchUsers.rejected(new Error("API Error"), "", { page: 1, limit: 6 }),
    )

    expect(actual.loading).toBe(false)
    expect(actual.error).toBe("API Error")
  })

  it("should handle fetchAllUsers.pending", () => {
    const actual = dashboardReducer(initialState, fetchAllUsers.pending("", undefined))

    expect(actual.chartsLoading).toBe(true)
    expect(actual.chartsError).toBe(null)
  })

  it("should handle fetchAllUsers.fulfilled", () => {
    const mockAllUsers = [
      { id: 1, name: "John Doe", email: "john@example.com", username: "john", phone: "123", website: "john.com" },
      { id: 2, name: "Jane Doe", email: "jane@example.com", username: "jane", phone: "456", website: "jane.com" },
    ]

    const loadingState = { ...initialState, chartsLoading: true }
    const actual = dashboardReducer(loadingState, fetchAllUsers.fulfilled(mockAllUsers, "", undefined))

    expect(actual.chartsLoading).toBe(false)
    expect(actual.allUsers).toEqual(mockAllUsers)
  })
})
