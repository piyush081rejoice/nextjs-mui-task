"use client"

import type React from "react"
import { useState } from "react"
import { Typography, Box, Tabs, Tab, Paper, useTheme, useMediaQuery } from "@mui/material"
import { useAppSelector } from "../../hooks/redux"
import { ChartSection } from "../../components/ChartSection"
import { UsersTable } from "../../components/UsersTable"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: { xs: 2, sm: 3 } }}>{children}</Box>}
    </div>
  )
}

export default function DashboardPage() {
  const [tabValue, setTabValue] = useState(0)
  const { users, pagination, loading } = useAppSelector((state) => state.dashboard)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <Box>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        gutterBottom
        sx={{
          color: "primary.main",
          fontWeight: "bold",
          mb: { xs: 1, sm: 2 },
        }}
      >
        Dashboard Analytics
      </Typography>
      <Typography variant={isMobile ? "body2" : "subtitle1"} color="text.secondary" sx={{ mb: { xs: 2, sm: 3 } }}>
        Server-side paginated user data with analytics
      </Typography>

      <Paper sx={{ width: "100%" }} elevation={3}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant={isMobile ? "fullWidth" : "standard"}
            sx={{
              "& .MuiTab-root": {
                fontWeight: "bold",
                fontSize: isMobile ? "0.875rem" : "1rem",
                minHeight: { xs: 48, sm: 64 },
              },
            }}
          >
            <Tab label={isMobile ? `Users (${pagination.total})` : `Users Table (${pagination.total} total)`} />
            <Tab label={isMobile ? "Charts" : "Charts & Analytics"} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <UsersTable />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <ChartSection users={users} loading={loading} />
        </TabPanel>
      </Paper>
    </Box>
  )
}
