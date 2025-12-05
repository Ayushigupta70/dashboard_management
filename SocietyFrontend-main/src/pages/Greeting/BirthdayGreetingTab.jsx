import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Grid,
    Paper,
    TextField,
    Button,
    Stack,
    Snackbar,
    Avatar,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    CardMedia,
    Autocomplete,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControlLabel,
    Switch,
    Badge
} from "@mui/material";
import {
    Cake,
    CloudUpload,
    Send,
    History,
    Person,
    Phone,
    Close,
    CalendarToday
} from "@mui/icons-material";

export default function BirthdayGreetingTab({ setTodayBirthdaysCount }) {
    // Birthday states
    const [selectedMember, setSelectedMember] = useState(null);
    const [senderName, setSenderName] = useState("");
    const [sendToAllBirthdays, setSendToAllBirthdays] = useState(false);
    const [birthdayMessage, setBirthdayMessage] = useState("");
    const [birthdayPhoto, setBirthdayPhoto] = useState(null);
    const [snackOpen, setSnackOpen] = useState(false);
    const [historyDialog, setHistoryDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Sample data states
    const [todayBirthdays, setTodayBirthdays] = useState([]);
    const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
    const [allMembers, setAllMembers] = useState([]);
    const [birthdayGreetings, setBirthdayGreetings] = useState([]);

    // Predefined messages
    const birthdayMessageTemplates = [
        "Happy Birthday! Wishing you a wonderful day filled with joy and blessings!",
        "Warmest wishes on your special day! May your year ahead be as amazing as you are!",
        "Happy Birthday! May your day be as bright as your smile and as wonderful as you are!",
        "Sending you heartfelt birthday wishes for health, happiness, and success in everything you do!",
        "Happy Birthday! May this special day bring you endless happiness and wonderful memories!"
    ];

    // Form reset
    const resetForm = () => {
        setSelectedMember(null);
        setBirthdayMessage("");
        setBirthdayPhoto(null);
        setSenderName("");
        setError(null);
    };

    // Handle photo upload
    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError("File size should be less than 5MB");
                return;
            }
            setBirthdayPhoto(file);
        }
    };

    // Handle send birthday greeting
    const handleSendBirthdayGreeting = async () => {
        if (sendToAllBirthdays) {
            // Send to all today's birthdays
            if (todayBirthdays.length === 0) {
                setError("No birthdays today");
                return;
            }
        } else {
            // Send to single member
            if (!selectedMember) {
                setError("Please select a birthday member");
                return;
            }
        }

        if (!birthdayMessage.trim()) {
            setError("Please enter a birthday message");
            return;
        }

        setLoading(true);
        setError(null);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            setSnackOpen(true);
            resetForm();
        }, 1500);
    };

    // Handle view history
    const handleViewHistory = () => {
        // Simulate fetching history
        setHistoryDialog(true);
    };

    // Get days until birthday
    const getDaysUntilBirthday = (dob) => {
        if (!dob) return null;

        const today = new Date();
        const birthDate = new Date(dob);
        const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());

        if (nextBirthday < today) {
            nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
        }

        const diffTime = nextBirthday - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Fetch birthday members (simulated)
    useEffect(() => {
        // Simulated data
        const simulatedData = {
            today: [
                {
                    _id: "1",
                    personalDetails: {
                        nameOfMember: "John Doe",
                        dateOfBirth: "1990-12-01"
                    },
                    contactDetails: {
                        mobileNo: "9876543210"
                    }
                },
                {
                    _id: "2",
                    personalDetails: {
                        nameOfMember: "Jane Smith",
                        dateOfBirth: "1985-12-01"
                    },
                    contactDetails: {
                        mobileNo: "9876543211"
                    }
                }
            ],
            upcoming: [
                {
                    _id: "3",
                    personalDetails: {
                        nameOfMember: "Bob Johnson",
                        dateOfBirth: "1992-12-05"
                    },
                    contactDetails: {
                        mobileNo: "9876543212"
                    }
                }
            ]
        };

        setTodayBirthdays(simulatedData.today);
        setUpcomingBirthdays(simulatedData.upcoming);
        if (setTodayBirthdaysCount) {
            setTodayBirthdaysCount(simulatedData.today.length);
        }

        // Combine all members for search
        const allMembers = [...simulatedData.today, ...simulatedData.upcoming];
        setAllMembers(allMembers);
    }, [setTodayBirthdaysCount]);

    // Set default message when member is selected
    useEffect(() => {
        if (selectedMember && !birthdayMessage) {
            setBirthdayMessage(birthdayMessageTemplates[0]);
        }
    }, [selectedMember, birthdayMessage]);

    // Simulated history data
    const simulatedHistory = [
        {
            _id: "1",
            memberName: "John Doe",
            createdAt: new Date().toISOString(),
            status: "Sent",
            totalRecipients: 1
        },
        {
            _id: "2",
            memberName: "Jane Smith",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            status: "Failed",
            totalRecipients: 1
        }
    ];

    return (
        <Grid container spacing={4} justifyContent="center">
            {/* Left Side - Form */}
            <Grid size={{ xs: 12, md: 6 }} >
                <Paper sx={{
                    p: 4,
                    borderRadius: 4,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                    background: "white"
                }}>
                    <Typography variant="h5" fontWeight="bold" color="secondary" gutterBottom>
                        <Cake sx={{ mr: 1, verticalAlign: 'middle' }} />Send Birthday Greeting
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(false)}>
                            ✅ Birthday greeting sent successfully!
                        </Alert>
                    )}

                    {/* Sender Name */}
                    <TextField
                        label="Your Name *"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        fullWidth
                        sx={{ mb: 3 }}
                        helperText="This will appear as the sender name"
                    />

                    {/* Send to All Today's Birthdays Toggle */}
                    <FormControlLabel
                        control={
                            <Switch
                                checked={sendToAllBirthdays}
                                onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    setSendToAllBirthdays(isChecked);
                                    if (isChecked) {
                                        setSelectedMember(null);
                                    }
                                }}
                                color="secondary"
                            />
                        }
                        label={
                            <Typography variant="h6" color="secondary">
                                Send to <strong>ALL</strong> Today's Birthdays ({todayBirthdays.length})
                            </Typography>
                        }
                        sx={{ mb: 3 }}
                    />

                    {/* Birthday Member Selection - Only show if not sending to all */}
                    {!sendToAllBirthdays && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Select Birthday Member *
                            </Typography>

                            {/* Today's Birthdays */}
                            {todayBirthdays.length > 0 && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" color="error.main" fontWeight="bold" gutterBottom>
                                        🎉 Today's Birthdays
                                    </Typography>
                                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                        {todayBirthdays.slice(0, 3).map((member) => (
                                            <Chip
                                                key={member._id}
                                                icon={<Cake sx={{ color: 'error.main' }} />}
                                                label={member.personalDetails?.nameOfMember}
                                                onClick={() => setSelectedMember(member)}
                                                color={selectedMember?._id === member._id ? "error" : "default"}
                                                variant={selectedMember?._id === member._id ? "filled" : "outlined"}
                                            />
                                        ))}
                                        {todayBirthdays.length > 3 && (
                                            <Chip
                                                label={`+${todayBirthdays.length - 3} more`}
                                                variant="outlined"
                                            />
                                        )}
                                    </Stack>
                                </Box>
                            )}

                            {/* Upcoming Birthdays */}
                            {upcomingBirthdays.length > 0 && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" color="primary.main" fontWeight="bold" gutterBottom>
                                        📅 Upcoming Birthdays (Next 7 Days)
                                    </Typography>
                                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                        {upcomingBirthdays.slice(0, 3).map((member) => {
                                            const daysUntil = getDaysUntilBirthday(member.personalDetails?.dateOfBirth);
                                            return (
                                                <Chip
                                                    key={member._id}
                                                    icon={<CalendarToday fontSize="small" />}
                                                    label={`${member.personalDetails?.nameOfMember} (in ${daysUntil}d)`}
                                                    onClick={() => setSelectedMember(member)}
                                                    color={selectedMember?._id === member._id ? "primary" : "default"}
                                                    variant={selectedMember?._id === member._id ? "filled" : "outlined"}
                                                />
                                            );
                                        })}
                                        {upcomingBirthdays.length > 3 && (
                                            <Chip
                                                label={`+${upcomingBirthdays.length - 3} more`}
                                                variant="outlined"
                                            />
                                        )}
                                    </Stack>
                                </Box>
                            )}

                            {/* Member Search/Select */}
                            <Autocomplete
                                options={allMembers}
                                getOptionLabel={(option) =>
                                    `${option.personalDetails?.nameOfMember} - ${option.contactDetails?.mobileNo || 'No Phone'}`
                                }
                                value={selectedMember}
                                onChange={(event, newValue) => {
                                    setSelectedMember(newValue);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Search or select member"
                                        variant="outlined"
                                        fullWidth
                                        placeholder="Type to search members..."
                                    />
                                )}
                                renderOption={(props, option) => {
                                    const isToday = todayBirthdays.some(m => m._id === option._id);
                                    const daysUntil = getDaysUntilBirthday(option.personalDetails?.dateOfBirth);
                                    return (
                                        <li {...props}>
                                            <Box sx={{ width: '100%' }}>
                                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                                    <Typography variant="body1">
                                                        <Person sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                                                        {option.personalDetails?.nameOfMember}
                                                    </Typography>
                                                    {isToday ? (
                                                        <Chip
                                                            label="TODAY"
                                                            size="small"
                                                            color="error"
                                                            sx={{ fontSize: '0.7rem' }}
                                                        />
                                                    ) : (
                                                        <Chip
                                                            label={`in ${daysUntil}d`}
                                                            size="small"
                                                            color="primary"
                                                            variant="outlined"
                                                            sx={{ fontSize: '0.7rem' }}
                                                        />
                                                    )}
                                                </Box>
                                                {option.contactDetails?.mobileNo && (
                                                    <Typography variant="caption" color="text.secondary" display="block">
                                                        <Phone sx={{ fontSize: 12, mr: 0.5, verticalAlign: 'middle' }} />
                                                        {option.contactDetails.mobileNo}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </li>
                                    );
                                }}
                            />
                        </Box>
                    )}

                    {/* Selected Member Info */}
                    {!sendToAllBirthdays && selectedMember && (
                        <Card sx={{ mb: 3, borderColor: "secondary.main", borderWidth: 1, borderStyle: 'solid' }}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                    <Box>
                                        <Typography variant="h6" gutterBottom>
                                            <Cake sx={{ mr: 1, verticalAlign: 'middle', color: 'secondary.main' }} />
                                            {selectedMember.personalDetails?.nameOfMember}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            <Phone sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                                            {selectedMember.contactDetails?.mobileNo || 'No phone number'}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            <CalendarToday sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                                            DOB: {formatDate(selectedMember.personalDetails?.dateOfBirth)}
                                        </Typography>
                                    </Box>
                                    <IconButton
                                        size="small"
                                        onClick={() => setSelectedMember(null)}
                                        color="error"
                                    >
                                        <Close />
                                    </IconButton>
                                </Box>
                            </CardContent>
                        </Card>
                    )}

                    {/* Birthday Message */}
                    <TextField
                        label="Birthday Message Template"
                        select
                        fullWidth
                        variant="outlined"
                        value={birthdayMessage}
                        onChange={(e) => setBirthdayMessage(e.target.value)}
                        SelectProps={{ native: true }}
                        sx={{ mb: 2 }}
                    >
                        <option value="">Select a template</option>
                        {birthdayMessageTemplates.map((template, index) => (
                            <option key={index} value={template}>
                                Template {index + 1}
                            </option>
                        ))}
                    </TextField>

                    <TextField
                        label="Custom Birthday Message *"
                        multiline
                        rows={4}
                        value={birthdayMessage}
                        onChange={(e) => setBirthdayMessage(e.target.value)}
                        fullWidth
                        placeholder="Write a personalized birthday message..."
                        sx={{ mb: 3 }}
                        helperText="You can edit the template or write your own message"
                    />

                    {/* Photo Upload for Birthday */}
                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={<CloudUpload />}
                        fullWidth
                        sx={{ mb: 3, py: 1.5 }}
                        color="secondary"
                    >
                        {birthdayPhoto ? "Change Birthday Photo" : "Upload Birthday Photo (Optional)"}
                        <input hidden accept="image/*" type="file" onChange={handlePhotoUpload} />
                    </Button>

                    {birthdayPhoto && (
                        <Box textAlign="center" mb={3}>
                            <Avatar
                                src={URL.createObjectURL(birthdayPhoto)}
                                alt="Birthday"
                                variant="rounded"
                                sx={{
                                    width: "100%",
                                    maxWidth: 300,
                                    height: 200,
                                    borderRadius: 3,
                                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                                    mx: 'auto'
                                }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                {birthdayPhoto.name}
                            </Typography>
                            <Button
                                size="small"
                                color="error"
                                onClick={() => setBirthdayPhoto(null)}
                                sx={{ mt: 1 }}
                            >
                                Remove Photo
                            </Button>
                        </Box>
                    )}

                    {/* Action Buttons */}
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                            onClick={handleSendBirthdayGreeting}
                            disabled={loading || (!sendToAllBirthdays && !selectedMember) || !birthdayMessage.trim()}
                            fullWidth
                            sx={{ py: 1.5 }}
                        >
                            {loading ? "Sending..." : sendToAllBirthdays ? "Send to All Today's Birthdays" : "Send Birthday Greeting"}
                        </Button>
                    </Stack>

                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="outlined"
                            startIcon={<History />}
                            onClick={handleViewHistory}
                            fullWidth
                            color="secondary"
                        >
                            View Sent History
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={resetForm}
                            fullWidth
                        >
                            Clear Form
                        </Button>
                    </Stack>
                </Paper>
            </Grid>

            {/* Right Side - Preview */}
            <Grid size={{ xs: 12, md: 6 }}>
                <Paper sx={{
                    p: 4,
                    borderRadius: 4,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                    background: "white",
                    height: "fit-content"
                }}>
                    <Typography variant="h5" fontWeight="bold" color="secondary" gutterBottom>
                        <Cake sx={{ mr: 1, verticalAlign: 'middle' }} />Birthday Greeting Preview
                    </Typography>

                    <Card sx={{
                        border: "2px solid",
                        borderColor: "secondary.light",
                        borderRadius: 3,
                        overflow: "hidden",
                        minHeight: 400
                    }}>
                        {/* Preview Photo */}
                        {birthdayPhoto && (
                            <CardMedia
                                component="img"
                                height="200"
                                image={URL.createObjectURL(birthdayPhoto)}
                                alt="Birthday"
                            />
                        )}

                        <CardContent sx={{ p: 3 }}>
                            {/* Preview Title */}
                            <Typography variant="h6" color="secondary" gutterBottom>
                                🎂 Birthday Wishes {
                                    sendToAllBirthdays ?
                                        "for All Today's Birthdays" :
                                        `for ${selectedMember?.personalDetails?.nameOfMember || "Member Name"}`
                                } 🎂
                            </Typography>

                            {/* Preview Message */}
                            <Typography variant="body1" paragraph sx={{ lineHeight: 1.6, minHeight: 120 }}>
                                {birthdayMessage || birthdayMessageTemplates[0]}
                            </Typography>

                            {/* Sender Info */}
                            {senderName && (
                                <Typography variant="body2" color="text.secondary">
                                    With warm regards,
                                    <br />
                                    <strong>{senderName}</strong>
                                </Typography>
                            )}

                            {/* Recipient Info Box */}
                            <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                                <Typography variant="caption" color="text.secondary">
                                    This greeting will be sent to:{" "}
                                    <strong>
                                        {sendToAllBirthdays ?
                                            `ALL ${todayBirthdays.length} members with birthdays today` :
                                            selectedMember ?
                                                `${selectedMember.personalDetails?.nameOfMember} (${selectedMember.contactDetails?.mobileNo || 'No phone'})` :
                                                "Select a member"
                                        }
                                    </strong>
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Birthday Stats Section */}
                    <Box sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Card sx={{ bgcolor: 'error.light', color: 'error.contrastText' }}>
                                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                        <Typography variant="h4">
                                            {todayBirthdays.length}
                                        </Typography>
                                        <Typography variant="body2">
                                            🎉 Birthdays Today
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={6}>
                                <Card sx={{ bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
                                    <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                        <Typography variant="h4">
                                            {upcomingBirthdays.length}
                                        </Typography>
                                        <Typography variant="body2">
                                            📅 Upcoming (7 days)
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Grid>

            {/* History Dialog */}
            <Dialog
                open={historyDialog}
                onClose={() => setHistoryDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Typography variant="h6" fontWeight="bold">
                        <History sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Sent Birthday Greeting History
                    </Typography>
                </DialogTitle>

                <DialogContent>
                    {simulatedHistory.length === 0 ? (
                        <Typography color="text.secondary" textAlign="center" py={4}>
                            No sent birthday greetings found
                        </Typography>
                    ) : (
                        <Stack spacing={2}>
                            {simulatedHistory.map((greeting) => (
                                <Card key={greeting._id} variant="outlined">
                                    <CardContent>
                                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                                            <Cake sx={{ color: 'secondary.main' }} />
                                            <Typography variant="h6">
                                                Birthday Greeting for {greeting.memberName}
                                            </Typography>
                                        </Box>
                                        <Typography color="text.secondary">
                                            Type: Birthday |
                                            To: {greeting.memberName} |
                                            Recipients: {greeting.totalRecipients || 1}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Date: {new Date(greeting.createdAt).toLocaleDateString()} |
                                            Status: <strong style={{
                                                color: greeting.status === "Sent" ? "green" : "red"
                                            }}>{greeting.status}</strong>
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Stack>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setHistoryDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Success Snackbar */}
            <Snackbar
                open={snackOpen}
                autoHideDuration={4000}
                onClose={() => setSnackOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackOpen(false)}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    ✅ Birthday greeting sent successfully! Form has been reset.
                </Alert>
            </Snackbar>
        </Grid>
    );
}