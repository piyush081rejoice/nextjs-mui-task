import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  avatar?: string
  age?: number
  gender?: string
  birthDate?: string
  bloodGroup?: string
  height?: number
  weight?: number
  eyeColor?: string
  hair?: {
    color: string
    type: string
  }
  address?: {
    city: string
    state: string
    country: string
  }
  company?: {
    name: string
    department: string
    title: string
  }
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface DashboardState {
  users: User[]
  allUsers: User[]
  pagination: PaginationInfo
  loading: boolean
  chartsLoading: boolean
  error: string | null
  chartsError: string | null
}

const initialState: DashboardState = {
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

// fetch paginated users for table
export const fetchUsers = createAsyncThunk(
  "dashboard/fetchUsers",
  async ({ page, limit }: { page: number; limit: number }) => {
    try {
      const skip = (page - 1) * limit
      const url = `https://dummyjson.com/users?limit=${limit}&skip=${skip}`

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.users || !Array.isArray(data.users)) {
        throw new Error("Invalid response format from API")
      }

      const users: User[] = data.users.map((user: any) => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        username: user.username,
        email: user.email,
        phone: user.phone,
        website: user.domain ? `https://${user.domain}` : `https://${user.username}.example.com`,
        avatar: user.image,
        age: user.age,
        gender: user.gender,
        birthDate: user.birthDate,
        bloodGroup: user.bloodGroup,
        height: user.height,
        weight: user.weight,
        eyeColor: user.eyeColor,
        hair: user.hair,
        address: user.address,
        company: user.company,
      }))

      return {
        users,
        pagination: {
          page,
          limit,
          total: data.total,
          totalPages: Math.ceil(data.total / limit),
        },
      }
    } catch (error) {
      console.error("API Error:", error)
      throw new Error(`Failed to fetch users: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  },
)

// fetch all users for comprehensive charts
export const fetchAllUsers = createAsyncThunk("dashboard/fetchAllUsers", async () => {
  try {
    const url = `https://dummyjson.com/users?limit=100&skip=0`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.users || !Array.isArray(data.users)) {
      throw new Error("Invalid response format from API")
    }

    // transform DummyJSON data with full  details
    const allUsers: User[] = data.users.map((user: any) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      username: user.username,
      email: user.email,
      phone: user.phone,
      website: user.domain ? `https://${user.domain}` : `https://${user.username}.example.com`,
      avatar: user.image,
      age: user.age,
      gender: user.gender,
      birthDate: user.birthDate,
      bloodGroup: user.bloodGroup,
      height: user.height,
      weight: user.weight,
      eyeColor: user.eyeColor,
      hair: user.hair,
      address: user.address,
      company: user.company,
    }))

    return allUsers
  } catch (error) {
    console.error("Charts API Error:", error)
    throw new Error(`Failed to fetch all users for charts: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
})

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearChartsError: (state) => {
      state.chartsError = null
    },
    setPagination: (state, action: PayloadAction<Partial<PaginationInfo>>) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
  },
  extraReducers: (builder) => {
    builder
      //paginated users for table
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload.users
        state.pagination = action.payload.pagination
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch users"
      })
      // all users for charts
      .addCase(fetchAllUsers.pending, (state) => {
        state.chartsLoading = true
        state.chartsError = null
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.chartsLoading = false
        state.allUsers = action.payload
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.chartsLoading = false
        state.chartsError = action.error.message || "Failed to fetch users for charts"
      })
  },
})

export const { clearError, clearChartsError, setPagination } = dashboardSlice.actions
export default dashboardSlice.reducer
