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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    LinearProgress
} from "@mui/material";
import {
    Share,
    WhatsApp,
    Facebook,
    Email,
    CloudUpload,
    Send,
    History,
    Celebration
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { createBulkMail, getBulkMailHistory, clearError, clearSuccess } from "../../features/bulkMailSlice";

export default function FestivalGreetingPage() {
    const dispatch = useDispatch();
    const { loading, error, success, bulkMails } = useSelector((state) => state.bulkMail);

    const [selectedReligion, setSelectedReligion] = useState("");
    const [festivalName, setFestivalName] = useState("");
    const [customFestivalName, setCustomFestivalName] = useState("");
    const [customMessage, setCustomMessage] = useState("");
    const [senderName, setSenderName] = useState("");
    const [sendToAll, setSendToAll] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [snackOpen, setSnackOpen] = useState(false);
    const [historyDialog, setHistoryDialog] = useState(false);

    // Predefined festival suggestions
    const festivalSuggestions = {
        Muslim: ["Eid al-Fitr", "Eid al-Adha", "Ramadan", "Mawlid", "Ashura"],
        Hindu: ["Diwali", "Holi", "Dussehra", "Makar Sankranti", "Raksha Bandhan"],
        Christian: ["Christmas", "Easter", "Good Friday", "Thanksgiving", "Halloween"],
        Sikh: ["Gurpurab", "Baisakhi", "Lohri", "Hola Mohalla", "Bandhi Chhor Divas"],
        All: ["New Year", "Thanksgiving", "Friendship Day", "Independence Day", "Republic Day"]
    };

    // Form reset function
    const resetForm = () => {
        setFestivalName("");
        setCustomFestivalName("");
        setCustomMessage("");
        setSenderName("");
        setPhoto(null);
        // Don't reset religion and sendToAll
    };

    useEffect(() => {
        if (success) {
            setSnackOpen(true);
            resetForm(); // Reset form on success
            dispatch(clearSuccess());
        }
    }, [success, dispatch]);

    const handleCreateBulkMail = async () => {
        const finalFestivalName = festivalName === "Other" ? customFestivalName : festivalName;

        if (!finalFestivalName || !customMessage || !senderName) {
            dispatch(clearError());
            dispatch(createBulkMail.rejected({ message: "Please fill all required fields" }));
            return;
        }

        const formData = new FormData();
        formData.append("religion", selectedReligion);
        formData.append("festivalName", finalFestivalName);
        formData.append("customMessage", customMessage);
        formData.append("yourName", senderName);
        formData.append("sendToAll", sendToAll.toString());
        if (photo) {
            formData.append("photo", photo);
        }

        console.log("Sending form data:", {
            religion: selectedReligion,
            festivalName: finalFestivalName,
            customMessage,
            yourName: senderName,
            sendToAll: sendToAll.toString(),
            hasPhoto: !!photo
        });

        dispatch(createBulkMail(formData));
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                dispatch(clearError());
                dispatch(createBulkMail.rejected({ message: "File size should be less than 5MB" }));
                return;
            }
            setPhoto(file);
        }
    };

    const handleViewHistory = () => {
        console.log("Fetching history for religion:", selectedReligion);
        dispatch(getBulkMailHistory({ religion: selectedReligion, page: 1, limit: 10 }));
        setHistoryDialog(true);
    };

    const getGreetingPreview = () => {
        if (customMessage) return customMessage;

        const defaultGreetings = {
            Muslim: "Eid Mubarak! May Allah bless you with happiness, peace, and prosperity.",
            Hindu: "Happy Diwali! May the festival of lights bring joy and happiness to your life.",
            Christian: "Merry Christmas! Wishing you and your family a wonderful holiday season.",
            Sikh: "Happy Gurpurab! May the Guru's blessings always be with you.",
            All: "Warm greetings and best wishes to you and your family!"
        };

        return defaultGreetings[selectedReligion] || "Warm wishes on this special occasion!";
    };

    const getFinalFestivalName = () => {
        return festivalName === "Other" ? customFestivalName : festivalName;
    };

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
                    🎉 Festival Greetings 🎉
                </Typography>
                <Typography variant="h6" color="white" sx={{ opacity: 0.9 }}>
                    Send beautiful festival wishes to all society members
                </Typography>
            </Box>

            <Grid container spacing={4} justifyContent="center">
                {/* Left Side - Form */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{
                        p: 4,
                        borderRadius: 4,
                        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                        background: "white"
                    }}>
                        <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
                            <Celebration sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Create Festival Greeting
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
                                {error}
                            </Alert>
                        )}

                        {success && (
                            <Alert severity="success" sx={{ mb: 2 }}>
                                ✅ Bulk mail created successfully! Emails are being sent.
                            </Alert>
                        )}

                        {/* Send to All Toggle */}
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={sendToAll}
                                    onChange={(e) => {
                                        const isChecked = e.target.checked;
                                        setSendToAll(isChecked);
                                        if (isChecked) {
                                            setSelectedReligion("All");
                                        } else {
                                            setSelectedReligion("Muslim");
                                        }
                                    }}
                                    color="primary"
                                />
                            }
                            label={
                                <Typography variant="h6" color="primary">
                                    Send to <strong>ALL</strong> Members
                                </Typography>
                            }
                            sx={{ mb: 3 }}
                        />

                        {/* Religion Selection - Only show if not sending to all */}
                        {!sendToAll && (
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel>Select Religion</InputLabel>
                                <Select
                                    value={selectedReligion}
                                    label="Select Religion"
                                    onChange={(e) => setSelectedReligion(e.target.value)}
                                >
                                    <MenuItem value="Muslim">Muslim</MenuItem>
                                    <MenuItem value="Hindu">Hindu</MenuItem>
                                    <MenuItem value="Christian">Christian</MenuItem>
                                    <MenuItem value="Sikh">Sikh</MenuItem>
                                </Select>
                            </FormControl>
                        )}

                        {/* Festival Name Section */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Festival Name *
                            </Typography>

                            {/* Dropdown for predefined festivals */}
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Choose Festival</InputLabel>
                                <Select
                                    value={festivalName}
                                    label="Choose Festival"
                                    onChange={(e) => setFestivalName(e.target.value)}
                                >
                                    {/* Show festivals based on selection */}
                                    {sendToAll ? (
                                        festivalSuggestions["All"]?.map(festival => (
                                            <MenuItem key={festival} value={festival}>
                                                {festival}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        festivalSuggestions[selectedReligion]?.map(festival => (
                                            <MenuItem key={festival} value={festival}>
                                                {festival}
                                            </MenuItem>
                                        ))
                                    )}
                                    <MenuItem value="Other">Other (Custom Name)</MenuItem>
                                </Select>
                            </FormControl>

                            {/* Custom festival name input */}
                            {festivalName === "Other" && (
                                <TextField
                                    label="Enter Custom Festival Name *"
                                    value={customFestivalName}
                                    onChange={(e) => setCustomFestivalName(e.target.value)}
                                    fullWidth
                                    placeholder={sendToAll ? "e.g., Society Anniversary, Community Event" : "e.g., Pongal, Onam, Chhath"}
                                    helperText="Enter any festival or occasion name"
                                />
                            )}

                            {/* Direct text input for quick entry */}
                            <TextField
                                label="Or Type Festival Name Directly *"
                                value={festivalName === "Other" ? customFestivalName : festivalName}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setCustomFestivalName(value);
                                    setFestivalName("Other");
                                }}
                                fullWidth
                                sx={{ mt: 2 }}
                                placeholder={sendToAll ? "Enter any occasion name..." : "Enter festival name..."}
                                helperText="Type any festival or occasion name directly"
                            />
                        </Box>

                        {/* Custom Message */}
                        <TextField
                            label="Custom Greeting Message *"
                            multiline
                            rows={4}
                            value={customMessage}
                            onChange={(e) => setCustomMessage(e.target.value)}
                            fullWidth
                            placeholder={getGreetingPreview()}
                            sx={{ mb: 3 }}
                            helperText="Write a heartfelt message for the festival"
                        />

                        {/* Sender Name */}
                        <TextField
                            label="Your Name *"
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            fullWidth
                            sx={{ mb: 3 }}
                            helperText="This will appear as the sender name"
                        />

                        {/* Photo Upload */}
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<CloudUpload />}
                            fullWidth
                            sx={{ mb: 3, py: 1.5 }}
                        >
                            {photo ? "Change Festival Photo" : "Upload Festival Photo (Optional)"}
                            <input hidden accept="image/*" type="file" onChange={handlePhotoUpload} />
                        </Button>

                        {photo && (
                            <Box textAlign="center" mb={3}>
                                <Avatar
                                    src={URL.createObjectURL(photo)}
                                    alt="Festival"
                                    variant="rounded"
                                    sx={{
                                        width: "100%",
                                        height: 200,
                                        borderRadius: 3,
                                        boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
                                    }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                    {photo.name}
                                </Typography>
                                <Button
                                    size="small"
                                    color="error"
                                    onClick={() => setPhoto(null)}
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
                                startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                                onClick={handleCreateBulkMail}
                                disabled={loading || !getFinalFestivalName() || !customMessage || !senderName}
                                fullWidth
                                sx={{ py: 1.5 }}
                            >
                                {loading ? "Sending..." : "Send Bulk Email"}
                            </Button>
                        </Stack>

                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="outlined"
                                startIcon={<History />}
                                onClick={handleViewHistory}
                                fullWidth
                            >
                                View Sent History
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
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
                        <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
                            <Share sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Email Preview
                        </Typography>

                        <Card sx={{
                            border: "2px solid",
                            borderColor: "primary.light",
                            borderRadius: 3,
                            overflow: "hidden",
                            minHeight: 400
                        }}>
                            {photo && (
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={URL.createObjectURL(photo)}
                                    alt="Festival"
                                />
                            )}

                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" color="primary" gutterBottom>
                                    🎉 {getFinalFestivalName() || "Festival Name"} Greetings 🎉
                                </Typography>

                                <Typography variant="body1" paragraph sx={{ lineHeight: 1.6, minHeight: 120 }}>
                                    {customMessage || getGreetingPreview()}
                                </Typography>

                                {senderName && (
                                    <Typography variant="body2" color="text.secondary">
                                        With warm regards,
                                        <br />
                                        <strong>{senderName}</strong>
                                    </Typography>
                                )}

                                <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        This email will be sent to:{" "}
                                        <strong>
                                            {sendToAll ? "ALL society members" : `${selectedReligion} members only`}
                                        </strong>
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Paper>
                </Grid>
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
                        Sent Email History - {selectedReligion || "All"}
                    </Typography>
                </DialogTitle>

                <DialogContent>
                    {bulkMails && bulkMails.length === 0 ? (
                        <Typography color="text.secondary" textAlign="center" py={4}>
                            No sent emails found for {selectedReligion || "All"}
                        </Typography>
                    ) : (
                        <Stack spacing={2}>
                            {bulkMails?.map((mail) => (
                                <Card key={mail._id} variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6">
                                            <Celebration sx={{ mr: 1, verticalAlign: 'middle', fontSize: 20 }} />
                                            {mail.festivalName}
                                        </Typography>
                                        <Typography color="text.secondary">
                                            Religion: {mail.religion} |
                                            Recipients: {mail.totalRecipients} |
                                            Sent: {mail.sentCount} |
                                            Failed: {mail.failedCount}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Date: {new Date(mail.createdAt).toLocaleDateString()}
                                            Status: <strong>{mail.status}</strong>
                                        </Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={(mail.sentCount / mail.totalRecipients) * 100}
                                            sx={{ mt: 1 }}
                                        />
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
                message="✅ Bulk mail created successfully! Form has been reset."
            />
        </Box>
    );
}

// import React, { useState, useEffect } from "react";
// import {
//     Box,
//     Typography,
//     Grid,
//     Paper,
//     TextField,
//     Button,
//     Stack,
//     Snackbar,
//     Avatar,
//     CircularProgress,
//     Alert,
//     Card,
//     CardContent,
//     CardMedia,
//     FormControl,
//     InputLabel,
//     Select,
//     MenuItem,
//     Switch,
//     FormControlLabel,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     LinearProgress,
//     Chip,
//     IconButton,
//     Autocomplete,
//     Tabs,
//     Tab,
//     Badge
// } from "@mui/material";
// import {
//     Share,
//     WhatsApp,
//     Facebook,
//     Email,
//     CloudUpload,
//     Send,
//     History,
//     Celebration,
//     Cake,
//     Person,
//     Phone,
//     Close,
//     CalendarToday
// } from "@mui/icons-material";
// import { useDispatch, useSelector } from "react-redux";
// import { createBulkMail, getBulkMailHistory, clearError, clearSuccess } from "../features/bulkMailSlice";

// // Tab Panel Component
// function TabPanel(props) {
//     const { children, value, index, ...other } = props;
//     return (
//         <div
//             role="tabpanel"
//             hidden={value !== index}
//             id={`greeting-tabpanel-${index}`}
//             aria-labelledby={`greeting-tab-${index}`}
//             {...other}
//         >
//             {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
//         </div>
//     );
// }

// export default function FestivalGreetingPage() {
//     const dispatch = useDispatch();
//     const { loading, error, success, bulkMails } = useSelector((state) => state.bulkMail);

//     // Tab state
//     const [activeTab, setActiveTab] = useState(0);

//     // Common states
//     const [selectedReligion, setSelectedReligion] = useState("");
//     const [senderName, setSenderName] = useState("");
//     const [sendToAll, setSendToAll] = useState(false);
//     const [snackOpen, setSnackOpen] = useState(false);
//     const [historyDialog, setHistoryDialog] = useState(false);

//     // Festival states
//     const [festivalName, setFestivalName] = useState("");
//     const [customFestivalName, setCustomFestivalName] = useState("");
//     const [festivalMessage, setFestivalMessage] = useState("");
//     const [festivalPhoto, setFestivalPhoto] = useState(null);

//     // Birthday states
//     const [birthdayMembers, setBirthdayMembers] = useState([]);
//     const [todayBirthdays, setTodayBirthdays] = useState([]);
//     const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
//     const [selectedBirthdayMember, setSelectedBirthdayMember] = useState(null);
//     const [birthdayMessage, setBirthdayMessage] = useState("");
//     const [birthdayPhoto, setBirthdayPhoto] = useState(null);
//     const [loadingBirthdays, setLoadingBirthdays] = useState(false);
//     const [sendingBirthday, setSendingBirthday] = useState(false);

//     // Predefined messages
//     const birthdayMessageTemplates = [
//         "Happy Birthday! Wishing you a wonderful day filled with joy and blessings!",
//         "Warmest wishes on your special day! May your year ahead be as amazing as you are!",
//         "Happy Birthday! May your day be as bright as your smile and as wonderful as you are!",
//         "Sending you heartfelt birthday wishes for health, happiness, and success in everything you do!",
//         "Happy Birthday! May this special day bring you endless happiness and wonderful memories!"
//     ];

//     const festivalSuggestions = {
//         Muslim: ["Eid al-Fitr", "Eid al-Adha", "Ramadan", "Mawlid", "Ashura"],
//         Hindu: ["Diwali", "Holi", "Dussehra", "Makar Sankranti", "Raksha Bandhan"],
//         Christian: ["Christmas", "Easter", "Good Friday", "Thanksgiving", "Halloween"],
//         Sikh: ["Gurpurab", "Baisakhi", "Lohri", "Hola Mohalla", "Bandhi Chhor Divas"],
//         All: ["New Year", "Thanksgiving", "Friendship Day", "Independence Day", "Republic Day"]
//     };

//     // Form reset functions
//     const resetFestivalForm = () => {
//         setFestivalName("");
//         setCustomFestivalName("");
//         setFestivalMessage("");
//         setFestivalPhoto(null);
//     };

//     const resetBirthdayForm = () => {
//         setSelectedBirthdayMember(null);
//         setBirthdayMessage("");
//         setBirthdayPhoto(null);
//     };

//     // Fetch birthday members
//     const fetchBirthdayMembers = async () => {
//         if (activeTab !== 1) return; // Only fetch when on birthday tab

//         setLoadingBirthdays(true);
//         try {
//             const today = new Date();
//             const currentMonth = today.getMonth() + 1;
//             const currentDay = today.getDate();

//             // Simulated API call - replace with your actual API
//             const response = await fetch(`/api/members/birthdays?month=${currentMonth}&day=${currentDay}`);
//             const data = await response.json();

//             setTodayBirthdays(data.today || []);
//             setUpcomingBirthdays(data.upcoming || []);

//             // Combine all birthday members for selection
//             const allMembers = [...(data.today || []), ...(data.upcoming || [])];
//             setBirthdayMembers(allMembers);
//         } catch (error) {
//             console.error("Error fetching birthdays:", error);
//             dispatch(clearError());
//             dispatch(createBulkMail.rejected({ message: "Failed to fetch birthday data" }));
//         } finally {
//             setLoadingBirthdays(false);
//         }
//     };

//     // Handle festival bulk mail creation
//     const handleCreateFestivalMail = async () => {
//         const finalFestivalName = festivalName === "Other" ? customFestivalName : festivalName;

//         if (!finalFestivalName || !festivalMessage || !senderName) {
//             dispatch(clearError());
//             dispatch(createBulkMail.rejected({ message: "Please fill all required fields" }));
//             return;
//         }

//         const formData = new FormData();
//         formData.append("religion", sendToAll ? "All" : selectedReligion);
//         formData.append("festivalName", finalFestivalName);
//         formData.append("customMessage", festivalMessage);
//         formData.append("yourName", senderName);
//         formData.append("sendToAll", sendToAll.toString());
//         formData.append("type", "festival"); // Add type to identify festival greeting
//         if (festivalPhoto) {
//             formData.append("photo", festivalPhoto);
//         }

//         console.log("Sending festival form data:", {
//             religion: sendToAll ? "All" : selectedReligion,
//             festivalName: finalFestivalName,
//             festivalMessage,
//             yourName: senderName,
//             sendToAll: sendToAll.toString(),
//             hasPhoto: !!festivalPhoto
//         });

//         dispatch(createBulkMail(formData));
//     };

//     // Handle birthday greeting send
//     const handleSendBirthdayGreeting = async () => {
//         if (!selectedBirthdayMember) {
//             dispatch(clearError());
//             dispatch(createBulkMail.rejected({ message: "Please select a birthday member" }));
//             return;
//         }

//         if (!birthdayMessage.trim()) {
//             dispatch(clearError());
//             dispatch(createBulkMail.rejected({ message: "Please enter a birthday message" }));
//             return;
//         }

//         setSendingBirthday(true);
//         try {
//             const formData = new FormData();
//             formData.append("memberId", selectedBirthdayMember._id);
//             formData.append("memberName", selectedBirthdayMember.personalDetails?.nameOfMember || "");
//             formData.append("type", "birthday");
//             formData.append("message", birthdayMessage);
//             formData.append("yourName", senderName || "Society Management");
//             if (birthdayPhoto) {
//                 formData.append("photo", birthdayPhoto);
//             }

//             // Here you would call your birthday-specific API
//             // For now, using the same bulkMail action but with type=birthday
//             await dispatch(createBulkMail(formData)).unwrap();

//             // Show success and reset form
//             setSnackOpen(true);
//             resetBirthdayForm();
//         } catch (error) {
//             console.error("Error sending birthday greeting:", error);
//             dispatch(clearError());
//             dispatch(createBulkMail.rejected({ message: "Failed to send birthday greeting" }));
//         } finally {
//             setSendingBirthday(false);
//         }
//     };

//     const handlePhotoUpload = (e, setPhoto) => {
//         const file = e.target.files[0];
//         if (file) {
//             if (file.size > 5 * 1024 * 1024) {
//                 dispatch(clearError());
//                 dispatch(createBulkMail.rejected({ message: "File size should be less than 5MB" }));
//                 return;
//             }
//             setPhoto(file);
//         }
//     };

//     const handleViewHistory = () => {
//         const religion = activeTab === 0 ?
//             (sendToAll ? "All" : selectedReligion) :
//             "birthday";

//         console.log("Fetching history for:", religion);
//         dispatch(getBulkMailHistory({ religion, page: 1, limit: 10 }));
//         setHistoryDialog(true);
//     };

//     // Get greeting preview based on active tab
//     const getGreetingPreview = () => {
//         if (activeTab === 0) {
//             return festivalMessage || getDefaultFestivalGreeting();
//         } else {
//             return birthdayMessage || birthdayMessageTemplates[0];
//         }
//     };

//     const getDefaultFestivalGreeting = () => {
//         const defaultGreetings = {
//             Muslim: "Eid Mubarak! May Allah bless you with happiness, peace, and prosperity.",
//             Hindu: "Happy Diwali! May the festival of lights bring joy and happiness to your life.",
//             Christian: "Merry Christmas! Wishing you and your family a wonderful holiday season.",
//             Sikh: "Happy Gurpurab! May the Guru's blessings always be with you.",
//             All: "Warm greetings and best wishes to you and your family!"
//         };
//         return defaultGreetings[selectedReligion] || "Warm wishes on this special occasion!";
//     };

//     const getFinalFestivalName = () => {
//         return festivalName === "Other" ? customFestivalName : festivalName;
//     };

//     // Get days until birthday
//     const getDaysUntilBirthday = (dob) => {
//         if (!dob) return null;

//         const today = new Date();
//         const birthDate = new Date(dob);
//         const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());

//         if (nextBirthday < today) {
//             nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
//         }

//         const diffTime = nextBirthday - today;
//         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//         return diffDays;
//     };

//     // Effects
//     useEffect(() => {
//         if (success) {
//             setSnackOpen(true);
//             if (activeTab === 0) resetFestivalForm();
//             else resetBirthdayForm();
//             dispatch(clearSuccess());
//         }
//     }, [success, dispatch, activeTab]);

//     useEffect(() => {
//         if (!sendToAll && selectedReligion === "") {
//             setSelectedReligion("Muslim");
//         }
//     }, [sendToAll, selectedReligion]);

//     useEffect(() => {
//         fetchBirthdayMembers();
//     }, [activeTab]);

//     return (
//         <Box sx={{
//             p: 4,
//             bgcolor: "background.default",
//             minHeight: "100vh",
//             background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
//         }}>
//             {/* Header */}
//             <Box textAlign="center" mb={4}>
//                 <Typography
//                     variant="h3"
//                     fontWeight="bold"
//                     color="white"
//                     gutterBottom
//                     sx={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
//                 >
//                     🎉 Greetings Manager 🎂
//                 </Typography>
//                 <Typography variant="h6" color="white" sx={{ opacity: 0.9 }}>
//                     Send beautiful festival wishes and birthday greetings to all society members
//                 </Typography>
//             </Box>

//             {/* Tabs */}
//             <Box sx={{ maxWidth: 800, mx: "auto", mb: 4 }}>
//                 <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
//                     <Tabs
//                         value={activeTab}
//                         onChange={(e, newValue) => setActiveTab(newValue)}
//                         variant="fullWidth"
//                         sx={{
//                             "& .MuiTab-root": { py: 2, fontSize: "1rem" },
//                             "& .Mui-selected": { fontWeight: "bold" }
//                         }}
//                     >
//                         <Tab
//                             icon={<Celebration />}
//                             label={
//                                 <Badge badgeContent={0} color="error">
//                                     Festival Greetings
//                                 </Badge>
//                             }
//                             iconPosition="start"
//                         />
//                         <Tab
//                             icon={<Cake />}
//                             label={
//                                 <Badge
//                                     badgeContent={todayBirthdays.length}
//                                     color="error"
//                                     sx={{
//                                         '& .MuiBadge-badge': {
//                                             fontSize: '0.75rem',
//                                             height: 20,
//                                             minWidth: 20
//                                         }
//                                     }}
//                                 >
//                                     Birthday Greetings
//                                 </Badge>
//                             }
//                             iconPosition="start"
//                         />
//                     </Tabs>
//                 </Paper>
//             </Box>

//             <Grid container spacing={4} justifyContent="center">
//                 {/* Left Side - Form */}
//                 <Grid size={{ xs: 12, md: 6 }}>
//                     <Paper sx={{
//                         p: 4,
//                         borderRadius: 4,
//                         boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
//                         background: "white"
//                     }}>
//                         <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
//                             {activeTab === 0 ? (
//                                 <><Celebration sx={{ mr: 1, verticalAlign: 'middle' }} />Create Festival Greeting</>
//                             ) : (
//                                 <><Cake sx={{ mr: 1, verticalAlign: 'middle' }} />Send Birthday Greeting</>
//                             )}
//                         </Typography>

//                         {error && (
//                             <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
//                                 {error}
//                             </Alert>
//                         )}

//                         {success && (
//                             <Alert severity="success" sx={{ mb: 2 }}>
//                                 ✅ {activeTab === 0 ? "Bulk mail" : "Birthday greeting"} created successfully!
//                             </Alert>
//                         )}

//                         {/* Sender Name - Common for both tabs */}
//                         <TextField
//                             label="Your Name *"
//                             value={senderName}
//                             onChange={(e) => setSenderName(e.target.value)}
//                             fullWidth
//                             sx={{ mb: 3 }}
//                             helperText="This will appear as the sender name"
//                         />

//                         {/* FESTIVAL TAB CONTENT */}
//                         <TabPanel value={activeTab} index={0}>
//                             {/* Send to All Toggle */}
//                             <FormControlLabel
//                                 control={
//                                     <Switch
//                                         checked={sendToAll}
//                                         onChange={(e) => {
//                                             const isChecked = e.target.checked;
//                                             setSendToAll(isChecked);
//                                             if (isChecked) {
//                                                 setSelectedReligion("All");
//                                             } else {
//                                                 setSelectedReligion("Muslim");
//                                             }
//                                         }}
//                                         color="primary"
//                                     />
//                                 }
//                                 label={
//                                     <Typography variant="h6" color="primary">
//                                         Send to <strong>ALL</strong> Members
//                                     </Typography>
//                                 }
//                                 sx={{ mb: 3 }}
//                             />

//                             {/* Religion Selection - Only show if not sending to all */}
//                             {!sendToAll && (
//                                 <FormControl fullWidth sx={{ mb: 3 }}>
//                                     <InputLabel>Select Religion</InputLabel>
//                                     <Select
//                                         value={selectedReligion}
//                                         label="Select Religion"
//                                         onChange={(e) => setSelectedReligion(e.target.value)}
//                                     >
//                                         <MenuItem value="Muslim">Muslim</MenuItem>
//                                         <MenuItem value="Hindu">Hindu</MenuItem>
//                                         <MenuItem value="Christian">Christian</MenuItem>
//                                         <MenuItem value="Sikh">Sikh</MenuItem>
//                                     </Select>
//                                 </FormControl>
//                             )}

//                             {/* Festival Name Section */}
//                             <Box sx={{ mb: 3 }}>
//                                 <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
//                                     Festival Name *
//                                 </Typography>

//                                 {/* Dropdown for predefined festivals */}
//                                 <FormControl fullWidth sx={{ mb: 2 }}>
//                                     <InputLabel>Choose Festival</InputLabel>
//                                     <Select
//                                         value={festivalName}
//                                         label="Choose Festival"
//                                         onChange={(e) => setFestivalName(e.target.value)}
//                                     >
//                                         {/* Show festivals based on selection */}
//                                         {sendToAll ? (
//                                             festivalSuggestions["All"]?.map(festival => (
//                                                 <MenuItem key={festival} value={festival}>
//                                                     {festival}
//                                                 </MenuItem>
//                                             ))
//                                         ) : (
//                                             festivalSuggestions[selectedReligion]?.map(festival => (
//                                                 <MenuItem key={festival} value={festival}>
//                                                     {festival}
//                                                 </MenuItem>
//                                             ))
//                                         )}
//                                         <MenuItem value="Other">Other (Custom Name)</MenuItem>
//                                     </Select>
//                                 </FormControl>

//                                 {/* Custom festival name input */}
//                                 {festivalName === "Other" && (
//                                     <TextField
//                                         label="Enter Custom Festival Name *"
//                                         value={customFestivalName}
//                                         onChange={(e) => setCustomFestivalName(e.target.value)}
//                                         fullWidth
//                                         placeholder={sendToAll ? "e.g., Society Anniversary, Community Event" : "e.g., Pongal, Onam, Chhath"}
//                                         helperText="Enter any festival or occasion name"
//                                     />
//                                 )}

//                                 {/* Direct text input for quick entry */}
//                                 <TextField
//                                     label="Or Type Festival Name Directly *"
//                                     value={festivalName === "Other" ? customFestivalName : festivalName}
//                                     onChange={(e) => {
//                                         const value = e.target.value;
//                                         setCustomFestivalName(value);
//                                         setFestivalName("Other");
//                                     }}
//                                     fullWidth
//                                     sx={{ mt: 2 }}
//                                     placeholder={sendToAll ? "Enter any occasion name..." : "Enter festival name..."}
//                                     helperText="Type any festival or occasion name directly"
//                                 />
//                             </Box>

//                             {/* Festival Message */}
//                             <TextField
//                                 label="Custom Greeting Message *"
//                                 multiline
//                                 rows={4}
//                                 value={festivalMessage}
//                                 onChange={(e) => setFestivalMessage(e.target.value)}
//                                 fullWidth
//                                 placeholder={getDefaultFestivalGreeting()}
//                                 sx={{ mb: 3 }}
//                                 helperText="Write a heartfelt message for the festival"
//                             />

//                             {/* Photo Upload for Festival */}
//                             <Button
//                                 variant="outlined"
//                                 component="label"
//                                 startIcon={<CloudUpload />}
//                                 fullWidth
//                                 sx={{ mb: 3, py: 1.5 }}
//                             >
//                                 {festivalPhoto ? "Change Festival Photo" : "Upload Festival Photo (Optional)"}
//                                 <input hidden accept="image/*" type="file" onChange={(e) => handlePhotoUpload(e, setFestivalPhoto)} />
//                             </Button>

//                             {festivalPhoto && (
//                                 <Box textAlign="center" mb={3}>
//                                     <Avatar
//                                         src={URL.createObjectURL(festivalPhoto)}
//                                         alt="Festival"
//                                         variant="rounded"
//                                         sx={{
//                                             width: "100%",
//                                             height: 200,
//                                             borderRadius: 3,
//                                             boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
//                                         }}
//                                     />
//                                     <Typography variant="caption" color="text.secondary">
//                                         {festivalPhoto.name}
//                                     </Typography>
//                                     <Button
//                                         size="small"
//                                         color="error"
//                                         onClick={() => setFestivalPhoto(null)}
//                                         sx={{ mt: 1 }}
//                                     >
//                                         Remove Photo
//                                     </Button>
//                                 </Box>
//                             )}

//                             {/* Festival Action Buttons */}
//                             <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
//                                 <Button
//                                     variant="contained"
//                                     startIcon={loading ? <CircularProgress size={20} /> : <Send />}
//                                     onClick={handleCreateFestivalMail}
//                                     disabled={loading || !getFinalFestivalName() || !festivalMessage || !senderName}
//                                     fullWidth
//                                     sx={{ py: 1.5 }}
//                                 >
//                                     {loading ? "Sending..." : "Send Bulk Email"}
//                                 </Button>
//                             </Stack>
//                         </TabPanel>

//                         {/* BIRTHDAY TAB CONTENT */}
//                         <TabPanel value={activeTab} index={1}>
//                             {loadingBirthdays ? (
//                                 <Box display="flex" justifyContent="center" py={4}>
//                                     <CircularProgress />
//                                 </Box>
//                             ) : (
//                                 <>
//                                     {/* Birthday Member Selection */}
//                                     <Box sx={{ mb: 3 }}>
//                                         <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
//                                             Select Birthday Member *
//                                         </Typography>

//                                         {todayBirthdays.length > 0 && (
//                                             <Box sx={{ mb: 2 }}>
//                                                 <Typography variant="subtitle2" color="error.main" fontWeight="bold" gutterBottom>
//                                                     🎉 Today's Birthdays
//                                                 </Typography>
//                                                 <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
//                                                     {todayBirthdays.slice(0, 3).map((member) => (
//                                                         <Chip
//                                                             key={member._id}
//                                                             icon={<Cake sx={{ color: 'error.main' }} />}
//                                                             label={member.personalDetails?.nameOfMember}
//                                                             onClick={() => setSelectedBirthdayMember(member)}
//                                                             color={selectedBirthdayMember?._id === member._id ? "error" : "default"}
//                                                             variant={selectedBirthdayMember?._id === member._id ? "filled" : "outlined"}
//                                                         />
//                                                     ))}
//                                                     {todayBirthdays.length > 3 && (
//                                                         <Chip
//                                                             label={`+${todayBirthdays.length - 3} more`}
//                                                             variant="outlined"
//                                                         />
//                                                     )}
//                                                 </Stack>
//                                             </Box>
//                                         )}

//                                         {upcomingBirthdays.length > 0 && (
//                                             <Box sx={{ mb: 2 }}>
//                                                 <Typography variant="subtitle2" color="primary.main" fontWeight="bold" gutterBottom>
//                                                     📅 Upcoming Birthdays (Next 7 Days)
//                                                 </Typography>
//                                                 <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
//                                                     {upcomingBirthdays.slice(0, 3).map((member) => {
//                                                         const daysUntil = getDaysUntilBirthday(member.personalDetails?.dateOfBirth);
//                                                         return (
//                                                             <Chip
//                                                                 key={member._id}
//                                                                 icon={<CalendarToday fontSize="small" />}
//                                                                 label={`${member.personalDetails?.nameOfMember} (in ${daysUntil}d)`}
//                                                                 onClick={() => setSelectedBirthdayMember(member)}
//                                                                 color={selectedBirthdayMember?._id === member._id ? "primary" : "default"}
//                                                                 variant={selectedBirthdayMember?._id === member._id ? "filled" : "outlined"}
//                                                             />
//                                                         );
//                                                     })}
//                                                     {upcomingBirthdays.length > 3 && (
//                                                         <Chip
//                                                             label={`+${upcomingBirthdays.length - 3} more`}
//                                                             variant="outlined"
//                                                         />
//                                                     )}
//                                                 </Stack>
//                                             </Box>
//                                         )}

//                                         {/* Member Search/Select */}
//                                         <Autocomplete
//                                             options={birthdayMembers}
//                                             getOptionLabel={(option) =>
//                                                 `${option.personalDetails?.nameOfMember} - ${option.contactDetails?.mobileNo || 'No Phone'}`
//                                             }
//                                             value={selectedBirthdayMember}
//                                             onChange={(event, newValue) => {
//                                                 setSelectedBirthdayMember(newValue);
//                                                 if (newValue) {
//                                                     setBirthdayMessage(birthdayMessageTemplates[0]);
//                                                 }
//                                             }}
//                                             renderInput={(params) => (
//                                                 <TextField
//                                                     {...params}
//                                                     label="Search or select member"
//                                                     variant="outlined"
//                                                     fullWidth
//                                                     placeholder="Type to search members..."
//                                                 />
//                                             )}
//                                             renderOption={(props, option) => {
//                                                 const isToday = todayBirthdays.some(m => m._id === option._id);
//                                                 const daysUntil = getDaysUntilBirthday(option.personalDetails?.dateOfBirth);
//                                                 return (
//                                                     <li {...props}>
//                                                         <Box sx={{ width: '100%' }}>
//                                                             <Box display="flex" justifyContent="space-between" alignItems="center">
//                                                                 <Typography variant="body1">
//                                                                     <Person sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
//                                                                     {option.personalDetails?.nameOfMember}
//                                                                 </Typography>
//                                                                 {isToday ? (
//                                                                     <Chip
//                                                                         label="TODAY"
//                                                                         size="small"
//                                                                         color="error"
//                                                                         sx={{ fontSize: '0.7rem' }}
//                                                                     />
//                                                                 ) : (
//                                                                     <Chip
//                                                                         label={`in ${daysUntil}d`}
//                                                                         size="small"
//                                                                         color="primary"
//                                                                         variant="outlined"
//                                                                         sx={{ fontSize: '0.7rem' }}
//                                                                     />
//                                                                 )}
//                                                             </Box>
//                                                             {option.contactDetails?.mobileNo && (
//                                                                 <Typography variant="caption" color="text.secondary" display="block">
//                                                                     <Phone sx={{ fontSize: 12, mr: 0.5, verticalAlign: 'middle' }} />
//                                                                     {option.contactDetails.mobileNo}
//                                                                 </Typography>
//                                                             )}
//                                                         </Box>
//                                                     </li>
//                                                 );
//                                             }}
//                                         />
//                                     </Box>

//                                     {/* Selected Member Info */}
//                                     {selectedBirthdayMember && (
//                                         <Card sx={{ mb: 3, borderColor: "primary.main", borderWidth: 1, borderStyle: 'solid' }}>
//                                             <CardContent>
//                                                 <Box display="flex" justifyContent="space-between" alignItems="flex-start">
//                                                     <Box>
//                                                         <Typography variant="h6" gutterBottom>
//                                                             <Cake sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
//                                                             {selectedBirthdayMember.personalDetails?.nameOfMember}
//                                                         </Typography>
//                                                         <Typography variant="body2" color="text.secondary">
//                                                             <Phone sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
//                                                             {selectedBirthdayMember.contactDetails?.mobileNo || 'No phone number'}
//                                                         </Typography>
//                                                         <Typography variant="body2" color="text.secondary">
//                                                             <CalendarToday sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
//                                                             DOB: {new Date(selectedBirthdayMember.personalDetails?.dateOfBirth).toLocaleDateString('en-IN', {
//                                                                 day: 'numeric',
//                                                                 month: 'long',
//                                                                 year: 'numeric'
//                                                             })}
//                                                         </Typography>
//                                                     </Box>
//                                                     <IconButton
//                                                         size="small"
//                                                         onClick={() => setSelectedBirthdayMember(null)}
//                                                         color="error"
//                                                     >
//                                                         <Close />
//                                                     </IconButton>
//                                                 </Box>
//                                             </CardContent>
//                                         </Card>
//                                     )}

//                                     {/* Birthday Message */}
//                                     <TextField
//                                         label="Birthday Message Template"
//                                         select
//                                         fullWidth
//                                         variant="outlined"
//                                         value={birthdayMessage}
//                                         onChange={(e) => setBirthdayMessage(e.target.value)}
//                                         SelectProps={{ native: true }}
//                                         sx={{ mb: 2 }}
//                                     >
//                                         <option value="">Select a template</option>
//                                         {birthdayMessageTemplates.map((template, index) => (
//                                             <option key={index} value={template}>
//                                                 Template {index + 1}
//                                             </option>
//                                         ))}
//                                     </TextField>

//                                     <TextField
//                                         label="Custom Birthday Message *"
//                                         multiline
//                                         rows={4}
//                                         value={birthdayMessage}
//                                         onChange={(e) => setBirthdayMessage(e.target.value)}
//                                         fullWidth
//                                         placeholder="Write a personalized birthday message..."
//                                         sx={{ mb: 3 }}
//                                         helperText="You can edit the template or write your own message"
//                                     />

//                                     {/* Photo Upload for Birthday */}
//                                     <Button
//                                         variant="outlined"
//                                         component="label"
//                                         startIcon={<CloudUpload />}
//                                         fullWidth
//                                         sx={{ mb: 3, py: 1.5 }}
//                                     >
//                                         {birthdayPhoto ? "Change Birthday Photo" : "Upload Birthday Photo (Optional)"}
//                                         <input hidden accept="image/*" type="file" onChange={(e) => handlePhotoUpload(e, setBirthdayPhoto)} />
//                                     </Button>

//                                     {birthdayPhoto && (
//                                         <Box textAlign="center" mb={3}>
//                                             <Avatar
//                                                 src={URL.createObjectURL(birthdayPhoto)}
//                                                 alt="Birthday"
//                                                 variant="rounded"
//                                                 sx={{
//                                                     width: "100%",
//                                                     maxWidth: 300,
//                                                     height: 200,
//                                                     borderRadius: 3,
//                                                     boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
//                                                     mx: 'auto'
//                                                 }}
//                                             />
//                                             <Typography variant="caption" color="text.secondary">
//                                                 {birthdayPhoto.name}
//                                             </Typography>
//                                             <Button
//                                                 size="small"
//                                                 color="error"
//                                                 onClick={() => setBirthdayPhoto(null)}
//                                                 sx={{ mt: 1 }}
//                                             >
//                                                 Remove Photo
//                                             </Button>
//                                         </Box>
//                                     )}

//                                     {/* Birthday Action Buttons */}
//                                     <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
//                                         <Button
//                                             variant="contained"
//                                             color="secondary"
//                                             startIcon={sendingBirthday ? <CircularProgress size={20} /> : <Send />}
//                                             onClick={handleSendBirthdayGreeting}
//                                             disabled={sendingBirthday || !selectedBirthdayMember || !birthdayMessage.trim()}
//                                             fullWidth
//                                             sx={{ py: 1.5 }}
//                                         >
//                                             {sendingBirthday ? "Sending..." : "Send Birthday Greeting"}
//                                         </Button>
//                                     </Stack>
//                                 </>
//                             )}
//                         </TabPanel>

//                         {/* Common Buttons for both tabs */}
//                         <Stack direction="row" spacing={2}>
//                             <Button
//                                 variant="outlined"
//                                 startIcon={<History />}
//                                 onClick={handleViewHistory}
//                                 fullWidth
//                             >
//                                 View Sent History
//                             </Button>
//                             <Button
//                                 variant="outlined"
//                                 color="secondary"
//                                 onClick={activeTab === 0 ? resetFestivalForm : resetBirthdayForm}
//                                 fullWidth
//                             >
//                                 Clear Form
//                             </Button>
//                         </Stack>
//                     </Paper>
//                 </Grid>

//                 {/* Right Side - Preview */}
//                 <Grid size={{ xs: 12, md: 6 }}>
//                     <Paper sx={{
//                         p: 4,
//                         borderRadius: 4,
//                         boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
//                         background: "white",
//                         height: "fit-content"
//                     }}>
//                         <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
//                             {activeTab === 0 ? (
//                                 <><Share sx={{ mr: 1, verticalAlign: 'middle' }} />Festival Email Preview</>
//                             ) : (
//                                 <><Cake sx={{ mr: 1, verticalAlign: 'middle' }} />Birthday Greeting Preview</>
//                             )}
//                         </Typography>

//                         <Card sx={{
//                             border: "2px solid",
//                             borderColor: activeTab === 0 ? "primary.light" : "secondary.light",
//                             borderRadius: 3,
//                             overflow: "hidden",
//                             minHeight: 400
//                         }}>
//                             {/* Preview Photo */}
//                             {(activeTab === 0 ? festivalPhoto : birthdayPhoto) && (
//                                 <CardMedia
//                                     component="img"
//                                     height="200"
//                                     image={URL.createObjectURL(activeTab === 0 ? festivalPhoto : birthdayPhoto)}
//                                     alt={activeTab === 0 ? "Festival" : "Birthday"}
//                                 />
//                             )}

//                             <CardContent sx={{ p: 3 }}>
//                                 {/* Preview Title */}
//                                 {activeTab === 0 ? (
//                                     <Typography variant="h6" color="primary" gutterBottom>
//                                         🎉 {getFinalFestivalName() || "Festival Name"} Greetings 🎉
//                                     </Typography>
//                                 ) : (
//                                     <Typography variant="h6" color="secondary" gutterBottom>
//                                         🎂 Birthday Wishes for {selectedBirthdayMember?.personalDetails?.nameOfMember || "Member Name"} 🎂
//                                     </Typography>
//                                 )}

//                                 {/* Preview Message */}
//                                 <Typography variant="body1" paragraph sx={{ lineHeight: 1.6, minHeight: 120 }}>
//                                     {getGreetingPreview()}
//                                 </Typography>

//                                 {/* Sender Info */}
//                                 {senderName && (
//                                     <Typography variant="body2" color="text.secondary">
//                                         With warm regards,
//                                         <br />
//                                         <strong>{senderName}</strong>
//                                     </Typography>
//                                 )}

//                                 {/* Recipient Info Box */}
//                                 <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
//                                     <Typography variant="caption" color="text.secondary">
//                                         {activeTab === 0 ? (
//                                             <>This email will be sent to:{" "}
//                                                 <strong>
//                                                     {sendToAll ? "ALL society members" : `${selectedReligion} members only`}
//                                                 </strong>
//                                             </>
//                                         ) : (
//                                             <>This greeting will be sent to:{" "}
//                                                 <strong>
//                                                     {selectedBirthdayMember ?
//                                                         `${selectedBirthdayMember.personalDetails?.nameOfMember} (${selectedBirthdayMember.contactDetails?.mobileNo || 'No phone'})` :
//                                                         "Select a member"}
//                                                 </strong>
//                                             </>
//                                         )}
//                                     </Typography>
//                                 </Box>
//                             </CardContent>
//                         </Card>

//                         {/* Birthday Stats Section */}
//                         {activeTab === 1 && (
//                             <Box sx={{ mt: 3 }}>
//                                 <Grid container spacing={2}>
//                                     <Grid size={{ xs: 6 }}>
//                                         <Card sx={{ bgcolor: 'error.light', color: 'error.contrastText' }}>
//                                             <CardContent sx={{ textAlign: 'center', py: 2 }}>
//                                                 <Typography variant="h4">
//                                                     {todayBirthdays.length}
//                                                 </Typography>
//                                                 <Typography variant="body2">
//                                                     🎉 Birthdays Today
//                                                 </Typography>
//                                             </CardContent>
//                                         </Card>
//                                     </Grid>
//                                     <Grid size={{ xs: 6 }}>
//                                         <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
//                                             <CardContent sx={{ textAlign: 'center', py: 2 }}>
//                                                 <Typography variant="h4">
//                                                     {upcomingBirthdays.length}
//                                                 </Typography>
//                                                 <Typography variant="body2">
//                                                     📅 Upcoming (7 days)
//                                                 </Typography>
//                                             </CardContent>
//                                         </Card>
//                                     </Grid>
//                                 </Grid>
//                             </Box>
//                         )}
//                     </Paper>
//                 </Grid>
//             </Grid>

//             {/* History Dialog */}
//             <Dialog
//                 open={historyDialog}
//                 onClose={() => setHistoryDialog(false)}
//                 maxWidth="md"
//                 fullWidth
//             >
//                 <DialogTitle>
//                     <Typography variant="h6" fontWeight="bold">
//                         <History sx={{ mr: 1, verticalAlign: 'middle' }} />
//                         Sent Greeting History - {activeTab === 0 ? (sendToAll ? "All" : selectedReligion) : "Birthday"}
//                     </Typography>
//                 </DialogTitle>

//                 <DialogContent>
//                     {bulkMails && bulkMails.length === 0 ? (
//                         <Typography color="text.secondary" textAlign="center" py={4}>
//                             No sent greetings found
//                         </Typography>
//                     ) : (
//                         <Stack spacing={2}>
//                             {bulkMails?.map((mail) => (
//                                 <Card key={mail._id} variant="outlined">
//                                     <CardContent>
//                                         <Box display="flex" alignItems="center" gap={1} mb={1}>
//                                             {mail.type === 'birthday' ? (
//                                                 <Cake sx={{ color: 'secondary.main' }} />
//                                             ) : (
//                                                 <Celebration sx={{ color: 'primary.main' }} />
//                                             )}
//                                             <Typography variant="h6">
//                                                 {mail.festivalName || "Birthday Greeting"}
//                                             </Typography>
//                                         </Box>
//                                         <Typography color="text.secondary">
//                                             Type: {mail.type} |
//                                             {mail.type === 'festival' && ` Religion: ${mail.religion} |`}
//                                             {mail.type === 'birthday' && ` To: ${mail.memberName} |`}
//                                             Recipients: {mail.totalRecipients || 1} |
//                                             Sent: {mail.sentCount || 1} |
//                                             Failed: {mail.failedCount || 0}
//                                         </Typography>
//                                         <Typography variant="caption" color="text.secondary">
//                                             Date: {new Date(mail.createdAt).toLocaleDateString()} |
//                                             Status: <strong>{mail.status}</strong>
//                                         </Typography>
//                                         {mail.type === 'festival' && mail.totalRecipients > 0 && (
//                                             <LinearProgress
//                                                 variant="determinate"
//                                                 value={((mail.sentCount || 1) / (mail.totalRecipients || 1)) * 100}
//                                                 sx={{ mt: 1 }}
//                                             />
//                                         )}
//                                     </CardContent>
//                                 </Card>
//                             ))}
//                         </Stack>
//                     )}
//                 </DialogContent>

//                 <DialogActions>
//                     <Button onClick={() => setHistoryDialog(false)}>Close</Button>
//                 </DialogActions>
//             </Dialog>

//             {/* Success Snackbar */}
//             <Snackbar
//                 open={snackOpen}
//                 autoHideDuration={4000}
//                 onClose={() => setSnackOpen(false)}
//                 message={`✅ ${activeTab === 0 ? "Bulk mail" : "Birthday greeting"} created successfully! Form has been reset.`}
//             />
//         </Box>
//     );
// }