import React, { useState } from "react";
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Badge,
    Paper
} from "@mui/material";
import {
    Celebration,
    Cake
} from "@mui/icons-material";
import FestivalGreetingTab from "../Greeting/FestivalGreetingTab";
import BirthdayGreetingTab from "../Greeting/BirthdayGreetingTab";

// Tab Panel Component
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`greeting-tabpanel-${index}`}
            aria-labelledby={`greeting-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
}

export default function GreetingPage() {
    const [activeTab, setActiveTab] = useState(0);
    const [todayBirthdaysCount, setTodayBirthdaysCount] = useState(0);

    return (
        <Box sx={{
            p: 4,
            bgcolor: "background.default",
            minHeight: "100vh",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        }}>
            {/* Header */}
            <Box textAlign="center" mb={4}>
                <Typography
                    variant="h3"
                    fontWeight="bold"
                    color="white"
                    gutterBottom
                    sx={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
                >
                    🎉 Greetings Manager 🎂
                </Typography>
                <Typography variant="h6" color="white" sx={{ opacity: 0.9 }}>
                    Send beautiful festival wishes and birthday greetings to all society members
                </Typography>
            </Box>

            {/* Tabs */}
            <Box sx={{ maxWidth: 800, mx: "auto", mb: 4 }}>
                <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
                    <Tabs
                        value={activeTab}
                        onChange={(e, newValue) => setActiveTab(newValue)}
                        variant="fullWidth"
                        sx={{
                            "& .MuiTab-root": { py: 2, fontSize: "1rem" },
                            "& .Mui-selected": { fontWeight: "bold" }
                        }}
                    >
                        <Tab
                            icon={<Celebration />}
                            label="Festival Greetings"
                            iconPosition="start"
                        />
                        <Tab
                            icon={<Cake />}
                            label={
                                <Badge
                                    badgeContent={todayBirthdaysCount}
                                    color="error"
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            fontSize: '0.75rem',
                                            height: 20,
                                            minWidth: 20
                                        }
                                    }}
                                >
                                    Birthday Greetings
                                </Badge>
                            }
                            iconPosition="start"
                        />
                    </Tabs>
                </Paper>
            </Box>

            {/* Tab Content */}
            <Box>
                <TabPanel value={activeTab} index={0}>
                    <FestivalGreetingTab />
                </TabPanel>
                <TabPanel value={activeTab} index={1}>
                    <BirthdayGreetingTab
                        setTodayBirthdaysCount={setTodayBirthdaysCount}
                    />
                </TabPanel>
            </Box>
        </Box>
    );
}