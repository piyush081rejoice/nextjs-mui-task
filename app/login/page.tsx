"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../hooks/redux"
import { loginStart, loginSuccess, loginFailure } from "../store/slices/authSlice"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const dispatch = useAppDispatch()
  const { loading } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    dispatch(loginStart())

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // mock authentication. in real app, this would be an api call
      if (email === "admin@example.com" && password === "password") {
        dispatch(
          loginSuccess({
            id: "1",
            email: email,
            name: "Admin User",
          }),
        )
        router.push("/home")
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (err) {
      dispatch(loginFailure())
      setError("Invalid email or password")
    }
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ px: { xs: 2, sm: 3 } }}>
      <Box
        sx={{
          marginTop: { xs: 4, sm: 8 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
          justifyContent: { xs: "flex-start", sm: "center" },
        }}
      >
        <Paper elevation={3} sx={{ padding: { xs: 3, sm: 4 }, width: "100%", maxWidth: 400 }}>
          <Typography component="h1" variant={isMobile ? "h5" : "h4"} align="center" gutterBottom>
            Sign In
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size={isMobile ? "medium" : "medium"}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size={isMobile ? "medium" : "medium"}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: { xs: 1.5, sm: 1.5 } }}
              disabled={loading}
              size={isMobile ? "large" : "large"}
            >
              {loading ? <CircularProgress size={24} /> : "Sign In"}
            </Button>
          </Box>

          <Box sx={{ mt: 2, p: { xs: 1.5, sm: 2 }, bgcolor: "grey.100", borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Demo credentials:
            </Typography>
            <Typography variant={isMobile ? "caption" : "body2"}>Email: admin@example.com</Typography>
            <Typography variant={isMobile ? "caption" : "body2"}>Password: password</Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}
