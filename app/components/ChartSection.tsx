"use client";

import { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, Box, CircularProgress, useTheme, useMediaQuery, Alert, Button, Chip } from "@mui/material";
import { Refresh as RefreshIcon, TrendingUp, People, Business, Palette } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchAllUsers, clearChartsError } from "../store/slices/dashboardSlice";

function AdvancedBarChart({ data, labels, title, color }: { data: number[]; labels: string[]; title: string; color: string }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  if (data.length === 0) {
    return (
      <Box
        sx={{
          height: { xs: 180, sm: 220, md: 280 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No data available
        </Typography>
      </Box>
    );
  }

  const maxValue = Math.max(...data) || 1;

  return (
    <Box
      sx={{
        height: { xs: 200, sm: 240, md: 300 },
        p: { xs: 1, sm: 1.5, md: 2 },
        width: "100%",
      }}
    >
      <Typography
        variant={isMobile ? "body2" : "subtitle2"}
        color="text.secondary"
        gutterBottom
        sx={{
          fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
          textAlign: { xs: "center", sm: "left" },
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "end",
          gap: { xs: 0.5, sm: 0.8, md: 1 },
          height: { xs: 140, sm: 170, md: 220 },
          overflowX: data.length > (isMobile ? 4 : isTablet ? 6 : 8) ? "auto" : "visible",
          overflowY: "visible",
          pb: 1,
          px: { xs: 0.5, sm: 1 },
          "&::-webkit-scrollbar": {
            height: 6,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "rgba(0,0,0,0.1)",
            borderRadius: 3,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.3)",
            borderRadius: 3,
          },
        }}
      >
        {data.map((value, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: data.length > (isMobile ? 4 : 8) ? "0 0 auto" : 1,
              minWidth: { xs: "35px", sm: "45px", md: "auto" },
              mx: { xs: 0.2, sm: 0.3, md: 0 },
            }}
          >
            <Box
              sx={{
                width: { xs: "28px", sm: "40px", md: "100%" },
                height: `${(value / maxValue) * (isMobile ? 100 : isTablet ? 130 : 160)}px`,
                background: `linear-gradient(45deg, ${color}, ${color}88)`,
                borderRadius: { xs: 0.5, sm: 1 },
                mb: 1,
                display: "flex",
                alignItems: "end",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                pb: { xs: 0.3, sm: 0.5 },
                minHeight: "15px",
                fontSize: { xs: "0.6rem", sm: "0.75rem", md: "0.875rem" },
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: { xs: "scale(1.05)", md: "scale(1.1)" },
                  boxShadow: { xs: 1, md: 3 },
                },
                cursor: "pointer",
              }}
            >
              {isMobile && value > 99 ? "99+" : value}
            </Box>
            <Typography
              variant="caption"
              sx={{
                textAlign: "center",
                fontSize: { xs: "0.55rem", sm: "0.65rem", md: "0.75rem" },
                fontWeight: "bold",
                transform: isMobile && labels[index].length > 4 ? "rotate(-30deg)" : "none",
                transformOrigin: "center",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: { xs: "35px", sm: "50px", md: "none" },
                lineHeight: 1,
                mt: 0.5,
              }}
            >
              {isMobile && labels[index].length > 5
                ? labels[index].substring(0, 4) + "..."
                : isTablet && labels[index].length > 8
                ? labels[index].substring(0, 6) + "..."
                : labels[index]}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function InteractiveDonutChart({ data, labels, title }: { data: number[]; labels: string[]; title: string }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const total = data.reduce((sum, value) => sum + value, 0);

  if (total === 0) {
    return (
      <Box
        sx={{
          height: { xs: 180, sm: 220, md: 280 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No data available
        </Typography>
      </Box>
    );
  }

  let currentAngle = 0;
  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F"];
  const size = isMobile ? 120 : isTablet ? 160 : 200;
  const radius = isMobile ? 45 : isTablet ? 60 : 75;
  const centerRadius = isMobile ? 18 : isTablet ? 25 : 30;

  return (
    <Box
      sx={{
        height: { xs: 200, sm: 240, md: 300 },
        p: { xs: 1, sm: 1.5, md: 2 },
        width: "100%",
      }}
    >
      <Typography
        variant={isMobile ? "body2" : "subtitle2"}
        color="text.secondary"
        gutterBottom
        sx={{
          fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
          textAlign: { xs: "center", sm: "left" },
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "column", md: "row" },
          alignItems: "center",
          justifyContent: { xs: "center", md: "space-between" },
          height: { xs: 160, sm: 190, md: 240 },
          gap: { xs: 1, sm: 1.5, md: 2 },
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {data.map((value, index) => {
              const angle = (value / total) * 360;
              const startAngle = currentAngle;
              const endAngle = currentAngle + angle;
              currentAngle += angle;

              const centerX = size / 2;
              const centerY = size / 2;

              const startX = centerX + radius * Math.cos(((startAngle - 90) * Math.PI) / 180);
              const startY = centerY + radius * Math.sin(((startAngle - 90) * Math.PI) / 180);
              const endX = centerX + radius * Math.cos(((endAngle - 90) * Math.PI) / 180);
              const endY = centerY + radius * Math.sin(((endAngle - 90) * Math.PI) / 180);

              const largeArcFlag = angle > 180 ? 1 : 0;

              const pathData = [`M ${centerX} ${centerY}`, `L ${startX} ${startY}`, `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`, `Z`].join(" ");

              return (
                <path
                  key={index}
                  d={pathData}
                  fill={colors[index % colors.length]}
                  stroke="white"
                  strokeWidth="2"
                  style={{
                    cursor: "pointer",
                    opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.7,
                    transform: hoveredIndex === index ? "scale(1.05)" : "scale(1)",
                    transformOrigin: `${centerX}px ${centerY}px`,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onTouchStart={() => setHoveredIndex(index)}
                  onTouchEnd={() => setTimeout(() => setHoveredIndex(null), 1000)}
                />
              );
            })}
            <circle cx={size / 2} cy={size / 2} r={centerRadius} fill="white" />
            <text x={size / 2} y={size / 2 + (isMobile ? 3 : 5)} textAnchor="middle" fontSize={isMobile ? "8" : isTablet ? "10" : "12"} fontWeight="bold" fill="#333">
              Total: {total}
            </text>
          </svg>
        </Box>
        <Box
          sx={{
            width: { xs: "100%", md: "auto" },
            maxWidth: { xs: "100%", md: "200px" },
            maxHeight: { xs: "80px", sm: "100px", md: "200px" },
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: 4,
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "rgba(0,0,0,0.1)",
              borderRadius: 2,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,0.3)",
              borderRadius: 2,
            },
          }}
        >
          <Grid container spacing={{ xs: 0.5, sm: 0.8, md: 1 }}>
            {labels.map((label, index) => (
              <Grid item xs={6} sm={4} md={12} key={index}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: { xs: 0.3, sm: 0.5, md: 0.8 },
                    borderRadius: 1,
                    backgroundColor: hoveredIndex === index ? "action.hover" : "transparent",
                    cursor: "pointer",
                    minHeight: { xs: "24px", sm: "28px", md: "32px" },
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onTouchStart={() => setHoveredIndex(index)}
                  onTouchEnd={() => setTimeout(() => setHoveredIndex(null), 1000)}
                >
                  <Box
                    sx={{
                      width: { xs: 8, sm: 10, md: 12 },
                      height: { xs: 8, sm: 10, md: 12 },
                      bgcolor: colors[index % colors.length],
                      mr: { xs: 0.5, sm: 0.8, md: 1 },
                      borderRadius: 0.5,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: hoveredIndex === index ? "bold" : "normal",
                      fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.8rem" },
                      lineHeight: 1.2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: { xs: "nowrap", md: "normal" },
                    }}
                  >
                    {isMobile && label.length > 6 ? label.substring(0, 4) + "..." : label}: {data[index]} ({((data[index] / total) * 100).toFixed(0)}%)
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

function MultiLineChart({ datasets, labels, title }: { datasets: any[]; labels: string[]; title: string }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  if (datasets.length === 0 || labels.length === 0) {
    return (
      <Box
        sx={{
          height: { xs: 180, sm: 220, md: 280 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No data available
        </Typography>
      </Box>
    );
  }

  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"];
  const maxValue = Math.max(...datasets.flatMap((d) => d.data));
  const minValue = Math.min(...datasets.flatMap((d) => d.data));
  const range = maxValue - minValue || 1;

  const chartWidth = isMobile ? 280 : isTablet ? 350 : 400;
  const chartHeight = isMobile ? 140 : isTablet ? 180 : 220;

  return (
    <Box
      sx={{
        height: { xs: 200, sm: 240, md: 300 },
        p: { xs: 1, sm: 1.5, md: 2 },
        width: "100%",
      }}
    >
      <Typography
        variant={isMobile ? "body2" : "subtitle2"}
        color="text.secondary"
        gutterBottom
        sx={{
          fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
          textAlign: { xs: "center", sm: "left" },
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          position: "relative",
          height: { xs: 160, sm: 190, md: 240 },
          overflowX: "auto",
          overflowY: "visible",
          "&::-webkit-scrollbar": {
            height: 6,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "rgba(0,0,0,0.1)",
            borderRadius: 3,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.3)",
            borderRadius: 3,
          },
        }}
      >
        <svg width="100%" height={chartHeight + 40} viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`} style={{ minWidth: isMobile ? "280px" : "auto" }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1="40" y1={30 + (i * chartHeight) / 4} x2={chartWidth - 40} y2={30 + (i * chartHeight) / 4} stroke="#e0e0e0" strokeWidth="1" />
          ))}
          {datasets.map((dataset, datasetIndex) => {
            const points = dataset.data
              .map((value: number, index: number) => {
                const x = 40 + (index / Math.max(dataset.data.length - 1, 1)) * (chartWidth - 80);
                const y = chartHeight + 10 - ((value - minValue) / range) * chartHeight;
                return `${x},${y}`;
              })
              .join(" ");

            return (
              <g key={datasetIndex}>
                <polyline
                  points={points}
                  fill="none"
                  stroke={colors[datasetIndex % colors.length]}
                  strokeWidth={isMobile ? "2" : "3"}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                {dataset.data.map((value: number, index: number) => {
                  const x = 40 + (index / Math.max(dataset.data.length - 1, 1)) * (chartWidth - 80);
                  const y = chartHeight + 10 - ((value - minValue) / range) * chartHeight;
                  return <circle key={index} cx={x} cy={y} r={isMobile ? "2" : "3"} fill={colors[datasetIndex % colors.length]} stroke="white" strokeWidth="1" />;
                })}
              </g>
            );
          })}
        </svg>
        <Box
          sx={{
            position: "absolute",
            top: { xs: 2, sm: 5, md: 8 },
            right: { xs: 2, sm: 5, md: 8 },
            bgcolor: "rgba(255, 255, 255, 0.95)",
            borderRadius: 1,
            p: { xs: 0.5, sm: 0.8, md: 1 },
            boxShadow: 1,
            backdropFilter: "blur(4px)",
          }}
        >
          {datasets.map((dataset, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 0.3 }}>
              <Box
                sx={{
                  width: { xs: 6, sm: 8, md: 10 },
                  height: { xs: 6, sm: 8, md: 10 },
                  bgcolor: colors[index % colors.length],
                  mr: { xs: 0.3, sm: 0.5, md: 0.8 },
                  borderRadius: 0.5,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontSize: { xs: "0.55rem", sm: "0.65rem", md: "0.75rem" },
                  fontWeight: 500,
                }}
              >
                {dataset.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

interface ChartSectionProps {
  users: any[];
  loading: boolean;
}

export function ChartSection({ users: propUsers, loading: propLoading }: ChartSectionProps) {
  const dispatch = useAppDispatch();
  const { allUsers, chartsLoading, chartsError } = useAppSelector((state) => state.dashboard);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    // fetch all users for comprehensive chart
    if (allUsers.length === 0) {
      dispatch(fetchAllUsers());
    }
  }, [dispatch, allUsers.length]);

  const handleRetry = () => {
    dispatch(clearChartsError());
    dispatch(fetchAllUsers());
  };

  if (chartsError) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={handleRetry} startIcon={<RefreshIcon />}>
            Retry
          </Button>
        }
      >
        <Typography variant="body2">
          <strong>Error loading chart data:</strong> {chartsError}
        </Typography>
      </Alert>
    );
  }

  if (chartsLoading || allUsers.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={40} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading comprehensive analytics...
        </Typography>
      </Box>
    );
  }
  const genderData = allUsers.reduce((acc: { [key: string]: number }, user) => {
    const gender = user.gender || "unknown";
    acc[gender] = (acc[gender] || 0) + 1;
    return acc;
  }, {});

  const ageGroups = allUsers.reduce((acc: { [key: string]: number }, user) => {
    if (!user.age) return acc;
    if (user.age < 25) acc["18-24"] = (acc["18-24"] || 0) + 1;
    else if (user.age < 35) acc["25-34"] = (acc["25-34"] || 0) + 1;
    else if (user.age < 45) acc["35-44"] = (acc["35-44"] || 0) + 1;
    else if (user.age < 55) acc["45-54"] = (acc["45-54"] || 0) + 1;
    else acc["55+"] = (acc["55+"] || 0) + 1;
    return acc;
  }, {});

  const bloodGroups = allUsers.reduce((acc: { [key: string]: number }, user) => {
    const bloodGroup = user.bloodGroup || "unknown";
    acc[bloodGroup] = (acc[bloodGroup] || 0) + 1;
    return acc;
  }, {});

  const eyeColors = allUsers.reduce((acc: { [key: string]: number }, user) => {
    const eyeColor = user.eyeColor || "unknown";
    acc[eyeColor] = (acc[eyeColor] || 0) + 1;
    return acc;
  }, {});

  const departments = allUsers.reduce((acc: { [key: string]: number }, user) => {
    const department = user.company?.department || "unknown";
    acc[department] = (acc[department] || 0) + 1;
    return acc;
  }, {});

  const ageHeightData = allUsers
    .filter((user) => user.age && user.height)
    .sort((a, b) => a.age! - b.age!)
    .reduce(
      (acc: { ages: number[]; heights: number[]; weights: number[] }, user) => {
        acc.ages.push(user.age!);
        acc.heights.push(user.height!);
        acc.weights.push(user.weight || 0);
        return acc;
      },
      { ages: [], heights: [], weights: [] }
    );

  const multiLineDatasets = [
    { label: "Height (cm)", data: ageHeightData.heights },
    { label: "Weight (kg)", data: ageHeightData.weights.map((w) => w * 2) },
  ];

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <Box sx={{ mb: { xs: 2, sm: 2.5, md: 3 }, px: { xs: 1, sm: 0 } }}>
        <Typography
          variant={isMobile ? "h6" : isTablet ? "h5" : "h4"}
          gutterBottom
          color="primary"
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
            textAlign: { xs: "center", sm: "left" },
            gap: { xs: 0.5, sm: 1 },
          }}
        >
          <TrendingUp sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem", md: "2rem" } }} />
          Comprehensive User Analytics
        </Typography>
        <Typography
          variant={isMobile ? "body2" : "body1"}
          color="text.secondary"
          sx={{
            mb: { xs: 1.5, sm: 2 },
            textAlign: { xs: "center", sm: "left" },
            px: { xs: 0.5, sm: 0 },
            lineHeight: { xs: 1.4, sm: 1.6 },
          }}
        >
          Advanced data visualization showcasing insights from {allUsers.length} users across multiple dimensions
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: { xs: 0.5, sm: 1 },
            flexWrap: "wrap",
            justifyContent: { xs: "center", sm: "flex-start" },
          }}
        >
          <Chip
            icon={<People sx={{ fontSize: { xs: "0.9rem", sm: "1.1rem" } }} />}
            label={`${allUsers.length} Total Users`}
            color="primary"
            size={isMobile ? "small" : "medium"}
            sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem" } }}
          />
          <Chip
            icon={<Business sx={{ fontSize: { xs: "0.9rem", sm: "1.1rem" } }} />}
            label={`${Object.keys(departments).length} Departments`}
            color="secondary"
            size={isMobile ? "small" : "medium"}
            sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem" } }}
          />
          <Chip
            icon={<Palette sx={{ fontSize: { xs: "0.9rem", sm: "1.1rem" } }} />}
            label={`${Object.keys(eyeColors).length} Eye Colors`}
            color="success"
            size={isMobile ? "small" : "medium"}
            sx={{ fontSize: { xs: "0.7rem", sm: "0.8rem" } }}
          />
        </Box>
      </Box>

      <Grid container spacing={{ xs: 1, sm: 1.5, md: 2, lg: 3 }}>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Card elevation={3} sx={{ height: "100%", minHeight: { xs: 220, sm: 260, md: 320 } }}>
            <CardContent sx={{ p: { xs: 1, sm: 1.5, md: 2 }, height: "100%" }}>
              <InteractiveDonutChart data={Object.values(genderData)} labels={Object.keys(genderData)} title="👥 Gender Distribution Analysis" />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Card elevation={3} sx={{ height: "100%", minHeight: { xs: 220, sm: 260, md: 320 } }}>
            <CardContent sx={{ p: { xs: 1, sm: 1.5, md: 2 }, height: "100%" }}>
              <AdvancedBarChart data={Object.values(ageGroups)} labels={Object.keys(ageGroups)} title="📊 Age Group Demographics" color="#4ECDC4" />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Card elevation={3} sx={{ height: "100%", minHeight: { xs: 220, sm: 260, md: 320 } }}>
            <CardContent sx={{ p: { xs: 1, sm: 1.5, md: 2 }, height: "100%" }}>
              <AdvancedBarChart data={Object.values(bloodGroups)} labels={Object.keys(bloodGroups)} title="🩸 Blood Group Distribution" color="#FF6B6B" />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Card elevation={3} sx={{ height: "100%", minHeight: { xs: 220, sm: 260, md: 320 } }}>
            <CardContent sx={{ p: { xs: 1, sm: 1.5, md: 2 }, height: "100%" }}>
              <InteractiveDonutChart data={Object.values(eyeColors)} labels={Object.keys(eyeColors)} title="👁️ Eye Color Diversity" />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card elevation={3} sx={{ minHeight: { xs: 220, sm: 260, md: 320 } }}>
            <CardContent sx={{ p: { xs: 1, sm: 1.5, md: 2 } }}>
              <AdvancedBarChart data={Object.values(departments)} labels={Object.keys(departments)} title="🏢 Department-wise Employee Distribution" color="#45B7D1" />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card elevation={3} sx={{ minHeight: { xs: 220, sm: 260, md: 320 } }}>
            <CardContent sx={{ p: { xs: 1, sm: 1.5, md: 2 } }}>
              <MultiLineChart datasets={multiLineDatasets} labels={ageHeightData.ages.map((age) => age.toString())} title="📈 Height & Weight Correlation Analysis" />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
              <Typography
                variant={isMobile ? "subtitle1" : "h6"}
                gutterBottom
                color="primary"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: { xs: "center", sm: "flex-start" },
                  mb: { xs: 1.5, sm: 2, md: 3 },
                  gap: 1,
                }}
              >
                <TrendingUp sx={{ fontSize: { xs: "1.1rem", sm: "1.3rem" } }} />
                Advanced Statistical Insights
              </Typography>
              <Grid container spacing={{ xs: 1, sm: 1.5, md: 2 }}>
                {[
                  {
                    value: Math.round(allUsers.reduce((sum, user) => sum + (user.age || 0), 0) / allUsers.length),
                    label: "Avg Age",
                    color: "primary.main",
                  },
                  {
                    value: Math.round(allUsers.reduce((sum, user) => sum + (user.height || 0), 0) / allUsers.length),
                    label: "Avg Height (cm)",
                    color: "secondary.main",
                  },
                  {
                    value: Math.round(allUsers.reduce((sum, user) => sum + (user.weight || 0), 0) / allUsers.length),
                    label: "Avg Weight (kg)",
                    color: "success.main",
                  },
                  {
                    value: Object.keys(departments).length,
                    label: "Departments",
                    color: "warning.main",
                  },
                ].map((stat, index) => (
                  <Grid item xs={6} sm={3} key={index}>
                    <Card
                      sx={{
                        bgcolor: stat.color,
                        color: "white",
                        textAlign: "center",
                        minHeight: { xs: 80, sm: 100, md: 120 },
                      }}
                    >
                      <CardContent
                        sx={{
                          py: { xs: 1.5, sm: 2, md: 2.5 },
                          px: { xs: 1, sm: 1.5, md: 2 },
                          "&:last-child": { pb: { xs: 1.5, sm: 2, md: 2.5 } },
                        }}
                      >
                        <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold" sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" } }}>
                          {stat.value}
                        </Typography>
                        <Typography
                          variant={isMobile ? "caption" : "body2"}
                          sx={{
                            fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
                            opacity: 0.9,
                          }}
                        >
                          {stat.label}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
