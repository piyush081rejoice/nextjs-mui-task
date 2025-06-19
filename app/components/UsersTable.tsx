"use client"

import type React from "react"
import { useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  TablePagination,
  Paper,
  CircularProgress,
  Box,
  Alert,
  Avatar,
  Button,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Stack,
} from "@mui/material"
import { Refresh as RefreshIcon } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../hooks/redux"
import { fetchUsers, setPagination, clearError } from "../store/slices/dashboardSlice"

export function UsersTable() {
  const dispatch = useAppDispatch()
  const { users, pagination, loading, error } = useAppSelector((state) => state.dashboard)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"))

  useEffect(() => {
    // fetch first page on component mount
    dispatch(fetchUsers({ page: pagination.page, limit: pagination.limit }))
  }, [dispatch])

  const handleChangePage = (_event: unknown, newPage: number) => {
    const page = newPage + 1 
    dispatch(setPagination({ page }))
    dispatch(fetchUsers({ page, limit: pagination.limit }))
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const limit = Number.parseInt(event.target.value, 10)
    const page = 1
    dispatch(setPagination({ page, limit }))
    dispatch(fetchUsers({ page, limit }))
  }

  const handleRetry = () => {
    dispatch(clearError())
    dispatch(fetchUsers({ page: pagination.page, limit: pagination.limit }))
  }

  if (error) {
    return (
      <Alert
        severity="error"
        sx={{ mb: 2 }}
        action={
          <Button color="inherit" size="small" onClick={handleRetry} startIcon={<RefreshIcon />}>
            Retry
          </Button>
        }
      >
        <Typography variant="body2">
          <strong>Error loading users:</strong> {error}
        </Typography>
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          Please check your internet connection and try again.
        </Typography>
      </Alert>
    )
  }
  if (isSmallMobile) {
    return (
      <Box>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={4}>
            <CircularProgress size={30} />
            <Typography variant="body2" sx={{ ml: 2 }}>
              Loading users...
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {users.map((user) => (
              <Card key={user.id} elevation={2}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar src={user.avatar} sx={{ width: 50, height: 50, mr: 2 }}>
                      {user.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" color="primary">
                        {user.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        @{user.username}
                      </Typography>
                    </Box>
                    <Chip label={user.id} size="small" color="primary" variant="outlined" sx={{ ml: "auto" }} />
                  </Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Email:</strong> {user.email}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Phone:</strong> {user.phone}
                  </Typography>
                  <Typography variant="body2" color="secondary.main">
                    <strong>Website:</strong> {user.website}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}

        <TablePagination
          rowsPerPageOptions={[6, 12, 18]}
          component="div"
          count={pagination.total}
          rowsPerPage={pagination.limit}
          page={pagination.page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ mt: 2 }}
        />
      </Box>
    )
  }
  return (
    <Paper elevation={3}>
      <TableContainer>
        <Table size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              <TableCell sx={{ color: "primary.contrastText", fontWeight: "bold" }}>Avatar</TableCell>
              <TableCell sx={{ color: "primary.contrastText", fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ color: "primary.contrastText", fontWeight: "bold" }}>Name</TableCell>
              {!isMobile && <TableCell sx={{ color: "primary.contrastText", fontWeight: "bold" }}>Username</TableCell>}
              <TableCell sx={{ color: "primary.contrastText", fontWeight: "bold" }}>Email</TableCell>
              {!isMobile && <TableCell sx={{ color: "primary.contrastText", fontWeight: "bold" }}>Phone</TableCell>}
              {!isMobile && <TableCell sx={{ color: "primary.contrastText", fontWeight: "bold" }}>Website</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={isMobile ? 4 : 7}>
                  <Box display="flex" justifyContent="center" alignItems="center" py={4}>
                    <CircularProgress size={30} />
                    <Typography variant="body2" sx={{ ml: 2 }}>
                      Loading users...
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isMobile ? 4 : 7}>
                  <Box display="flex" justifyContent="center" alignItems="center" py={4}>
                    <Typography variant="body2" color="text.secondary">
                      No users found
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{
                    "&:nth-of-type(odd)": { bgcolor: "action.hover" },
                    "&:hover": { bgcolor: "action.selected" },
                  }}
                >
                  <TableCell>
                    <Avatar src={user.avatar} sx={{ width: isMobile ? 32 : 40, height: isMobile ? 32 : 40 }}>
                      {user.name.charAt(0)}
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <Chip label={user.id} size="small" color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant={isMobile ? "body2" : "subtitle2"}
                      sx={{ fontWeight: "bold", color: "primary.main" }}
                    >
                      {user.name}
                    </Typography>
                    {isMobile && (
                      <Typography variant="caption" color="text.secondary">
                        @{user.username}
                      </Typography>
                    )}
                  </TableCell>
                  {!isMobile && (
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        @{user.username}
                      </Typography>
                    </TableCell>
                  )}
                  <TableCell>
                    <Typography variant="body2">{user.email}</Typography>
                  </TableCell>
                  {!isMobile && (
                    <TableCell>
                      <Typography variant="body2">{user.phone}</Typography>
                    </TableCell>
                  )}
                  {!isMobile && (
                    <TableCell>
                      <Typography variant="body2" color="secondary.main">
                        {user.website}
                      </Typography>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[6, 12, 18, 24]}
        component="div"
        count={pagination.total}
        rowsPerPage={pagination.limit}
        page={pagination.page - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ borderTop: 1, borderColor: "divider" }}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} of ${count !== -1 ? count : `more than ${to}`} (Page ${pagination.page} of ${pagination.totalPages})`
        }
      />
    </Paper>
  )
}
