"use client";

import { Typography, Box, Grid, Card, CardContent, useTheme, useMediaQuery } from "@mui/material";
import { useAppSelector } from "../hooks/redux";

export default function HomePage() {
  const { user } = useAppSelector((state) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "primary.main",
          mb: { xs: 2, sm: 3 },
        }}
      >
        Welcome, {user?.name}!
      </Typography>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" gutterBottom color="primary">
                Dashboard Overview
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Navigate to the Dashboard to view data from the API, including users information with server-side pagination and interactive charts.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" gutterBottom color="primary">
                User Profile
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>Email:</strong> {user?.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>User ID:</strong> {user?.id}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={2} sx={{ textAlign: "center", p: { xs: 2, sm: 3 } }}>
            <CardContent>
              <Typography variant="h4" color="primary" fontWeight="bold">
                100+
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Users Available
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={2} sx={{ textAlign: "center", p: { xs: 2, sm: 3 } }}>
            <CardContent>
              <Typography variant="h4" color="secondary" fontWeight="bold">
                24/7
              </Typography>
              <Typography variant="body2" color="text.secondary">
                System Uptime
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={12} md={4}>
          <Card elevation={2} sx={{ textAlign: "center", p: { xs: 2, sm: 3 } }}>
            <CardContent>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                Real-time
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Data Updates
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
