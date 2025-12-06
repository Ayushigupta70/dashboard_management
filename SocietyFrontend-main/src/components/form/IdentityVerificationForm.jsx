import React, { useState } from "react";
import {
  Card,
  CardContent,
  Grid,
  Box,
  Button,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Badge as BadgeIcon,
  CloudUpload as UploadIcon,
  Edit as EditIcon
} from "@mui/icons-material";
import StyledTextField from "../../ui/StyledTextField";
import SectionHeader from "../../layout/SectionHeader";

const IdentityVerificationForm = ({ formData, handleChange }) => {
  const identityProofs = formData.identityProofs;
  const theme = useTheme();
  const [errors, setErrors] = useState({});

  // Validation patterns
  const validationPatterns = {
    aadhaar: /^[2-9]\d{11}$/, // 12 digits, cannot start with 0 or 1
    pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, // 5 letters, 4 numbers, 1 letter
    voterId: /^[A-Z]{3}[0-9]{7}$/, // Example pattern - adjust as needed
    passport: /^[A-Z]{1}[0-9]{7}$/, // 1 letter + 7 digits for Indian passport
    drivingLicense: /^[A-Z]{2}[0-9]{2}\s?[0-9]{11}\s?[0-9]{2}$/, // State code, year, 11 digits, 2 digits
    rationCard: /^[A-Z0-9]{10,20}$/ // Alphanumeric, 10-20 characters
  };

  // Handle changes for identity proof fields
  const handleIdentityFieldChange = (field, value) => {
    handleChange('identityProofs', field, value);

    // Clear error when field is being edited
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }

    // Validate field if it has a validation pattern
    validateField(field, value);
  };

  // Field validation
  const validateField = (fieldName, value) => {
    if (!value || value.trim() === "") {
      setErrors(prev => ({ ...prev, [fieldName]: null }));
      return true;
    }

    let isValid = true;
    let errorMessage = "";

    switch (fieldName) {
      case "aadhaarCardNumber":
        isValid = validationPatterns.aadhaar.test(value);
        errorMessage = "Enter a valid 12-digit Aadhaar number (cannot start with 0 or 1)";
        break;

      case "panNumber":
        // Remove spaces for validation
        const cleanPan = value.replace(/\s/g, '').toUpperCase();
        isValid = validationPatterns.pan.test(cleanPan);
        errorMessage = "Enter a valid PAN number (e.g., ABCDE1234F)";
        break;

      case "voterIdNumber":
        // Remove spaces and make uppercase
        const cleanVoterId = value.replace(/\s/g, '').toUpperCase();
        isValid = validationPatterns.voterId.test(cleanVoterId);
        errorMessage = "Enter a valid Voter ID (e.g., ABC1234567)";
        break;

      case "passportNumber":
        const cleanPassport = value.replace(/\s/g, '').toUpperCase();
        isValid = validationPatterns.passport.test(cleanPassport);
        errorMessage = "Enter a valid Passport number (e.g., A1234567)";
        break;

      case "drivingLicenseNumber":
        // Remove extra spaces but allow single spaces in format
        const cleanDL = value.toUpperCase().replace(/\s+/g, ' ').trim();
        isValid = validationPatterns.drivingLicense.test(cleanDL);
        errorMessage = "Enter a valid Driving License number (e.g., MH0220110001234)";
        break;

      case "rationCardNumber":
        const cleanRation = value.replace(/\s/g, '').toUpperCase();
        isValid = validationPatterns.rationCard.test(cleanRation);
        errorMessage = "Enter a valid Ration Card number (10-20 alphanumeric characters)";
        break;

      default:
        break;
    }

    if (!isValid) {
      setErrors(prev => ({ ...prev, [fieldName]: errorMessage }));
    } else {
      setErrors(prev => ({ ...prev, [fieldName]: null }));
    }

    return isValid;
  };

  // Format input values for better UX
  const formatInputValue = (fieldName, value) => {
    switch (fieldName) {
      case "aadhaarCardNumber":
        // Format as XXXX-XXXX-XXXX
        const aadhaar = value.replace(/\D/g, '');
        return aadhaar.replace(/(\d{4})(?=\d)/g, '$1-').substring(0, 14);

      case "panNumber":
        // Format as ABCDE1234F (uppercase, no spaces)
        const pan = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        return pan;

      case "voterIdNumber":
        // Format as ABC1234567
        const voterId = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        return voterId;

      case "passportNumber":
        // Format as A1234567
        const passport = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        return passport;

      case "drivingLicenseNumber":
        // Format with spaces: XX 02 20110001234
        const dl = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (dl.length > 2) {
          return `${dl.substring(0, 2)} ${dl.substring(2, 4)} ${dl.substring(4)}`;
        }
        return dl;

      case "rationCardNumber":
        // Keep as is, just uppercase
        return value.toUpperCase().replace(/[^A-Z0-9]/g, '');

      default:
        return value;
    }
  };

  // Validate all fields (can be called before submission)
  const validateAllFields = () => {
    const newErrors = {};
    const fieldsToValidate = [
      "aadhaarCardNumber",
      "panNumber",
      "voterIdNumber",
      "passportNumber",
      "drivingLicenseNumber",
      "rationCardNumber"
    ];

    fieldsToValidate.forEach(field => {
      if (identityProofs[field]) {
        const isValid = validateField(field, identityProofs[field]);
        if (!isValid && !newErrors[field]) {
          newErrors[field] = errors[field] || "Invalid format";
        }
      }
    });

    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  // Handle file upload
  const handleFileUpload = (fileField, previewField, e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          [fileField]: "Please upload a valid image (JPEG, PNG, JPG) or PDF file"
        }));
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          [fileField]: "File size should be less than 5MB"
        }));
        return;
      }

      const preview = URL.createObjectURL(file);
      handleIdentityFieldChange(fileField, file);
      handleIdentityFieldChange(previewField, preview);

      // Clear any previous file errors
      setErrors(prev => ({ ...prev, [fileField]: null }));
    }
  };

  // Helper component for file + preview
  const UploadBox = ({
    label,
    fileField,
    previewField,
    height = 140,
    required = false
  }) => (
    <Box sx={{ textAlign: "center" }}>
      <Button
        variant="outlined"
        component="label"
        startIcon={<UploadIcon />}
        fullWidth
        sx={{
          mt: 1,
          borderRadius: 2,
          border: `2px dashed ${errors[fileField] ? theme.palette.error.main : theme.palette.primary.main}`,
          backgroundColor: errors[fileField]
            ? alpha(theme.palette.error.main, 0.04)
            : alpha(theme.palette.primary.main, 0.04),
          "&:hover": {
            backgroundColor: errors[fileField]
              ? alpha(theme.palette.error.main, 0.08)
              : alpha(theme.palette.primary.main, 0.08),
            border: `2px dashed ${errors[fileField] ? theme.palette.error.dark : theme.palette.primary.dark}`,
          },
        }}
      >
        {identityProofs[fileField]
          ? `Uploaded: ${identityProofs[fileField].name}`
          : `${required ? "* " : ""}${label}`}
        <input
          type="file"
          accept="image/*,.pdf"
          hidden
          onChange={(e) => handleFileUpload(fileField, previewField, e)}
        />
      </Button>

      {errors[fileField] && (
        <Typography
          variant="caption"
          color="error"
          sx={{ display: 'block', mt: 1 }}
        >
          {errors[fileField]}
        </Typography>
      )}

      {identityProofs[previewField] && !errors[fileField] && (
        <Box
          component="img"
          src={identityProofs[previewField]}
          alt={label}
          sx={{
            mt: 2,
            width: "100%",
            maxWidth: 220,
            height: height,
            objectFit: "contain",
            borderRadius: 2,
            border: `2px solid ${theme.palette.success.main}`,
            boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.2)}`,
            backgroundColor: "#fff",
          }}
        />
      )}
    </Box>
  );

  // Common text field styles
  const textFieldStyles = (fieldName) => ({
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      backgroundColor: alpha(theme.palette.background.paper, 0.8),
      transition: 'all 0.2s ease-in-out',
      height: '56px',
      '&:hover': {
        backgroundColor: alpha(theme.palette.background.paper, 0.9),
      },
      '&.Mui-focused': {
        backgroundColor: theme.palette.background.paper,
        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
      },
      '&.Mui-error': {
        borderColor: theme.palette.error.main,
        '&:hover': {
          backgroundColor: alpha(theme.palette.error.main, 0.05),
        }
      }
    },
    '& .MuiInputLabel-root': {
      fontSize: '0.9rem',
      fontWeight: 500,
      '&.Mui-error': {
        color: theme.palette.error.main,
      }
    },
    '& .MuiFormHelperText-root': {
      fontSize: '0.75rem',
      marginLeft: 0,
      '&.Mui-error': {
        color: theme.palette.error.main,
        fontWeight: 500,
      }
    }
  });

  return (
    <Card sx={{
      borderRadius: 4,
      boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
      background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.default, 0.8)} 100%)`,
      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      overflow: 'hidden',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
      }
    }}>
      <CardContent sx={{ p: 5 }}>
        <SectionHeader
          icon={
            <Box
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                borderRadius: 3,
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
              }}
            >
              <BadgeIcon
                sx={{
                  color: theme.palette.primary.main,
                  fontSize: 28
                }}
              />
            </Box>
          }
          title="Identity Verification"
          subtitle="Upload required documents and signatures"
          sx={{
            mb: 4,
            '& .MuiTypography-h5': {
              background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${alpha(theme.palette.text.primary, 0.8)} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
            },
            '& .MuiTypography-subtitle1': {
              color: theme.palette.text.secondary,
              fontSize: '0.95rem',
            }
          }}
        />

        {/* 🔹 Passport Size Photo & Signature Section */}
        <Grid container spacing={4} sx={{ mt: 2 }} alignItems="center">
          {/* Passport Size Photo */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                p: 3,
                borderRadius: 3,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main, fontWeight: 600 }}>
                Passport Size Photo *
              </Typography>
              <UploadBox
                label="Upload Passport Size Photo"
                fileField="passportSizePhoto"
                previewField="passportSizePreview"
                height={180}
                required={true}
              />
            </Box>
          </Grid>

          {/* Signed Photo with Digital Signature */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                p: 3,
                borderRadius: 3,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: theme.palette.secondary.main, fontWeight: 600 }}>
                Signed Photo *
              </Typography>
              <UploadBox
                label="Upload Signed Photo with Signature"
                fileField="signedPhoto"
                previewField="signedPhotoPreview"
                height={120}
                required={true}
              />
            </Box>
          </Grid>
        </Grid>

        {/* 🔹 Aadhaar Card */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, color: theme.palette.primary.main, fontWeight: 600 }}>
            Aadhaar Card
          </Typography>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={4}>
              <StyledTextField
                label="Aadhaar Number"
                name="aadhaarCardNumber"
                value={identityProofs.aadhaarCardNumber || ""}
                onChange={(e) => {
                  const formattedValue = formatInputValue("aadhaarCardNumber", e.target.value);
                  handleIdentityFieldChange('aadhaarCardNumber', formattedValue);
                }}
                onBlur={(e) => validateField("aadhaarCardNumber", e.target.value)}
                error={!!errors.aadhaarCardNumber}
                helperText={errors.aadhaarCardNumber}
                sx={textFieldStyles("aadhaarCardNumber")}
                placeholder="Enter 12-digit Aadhaar number"
                inputProps={{
                  maxLength: 14,
                  pattern: "[2-9][0-9]{11}"
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <UploadBox
                label="Upload Aadhaar Front Photo"
                fileField="aadhaarFrontPhoto"
                previewField="aadhaarFrontPreview"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <UploadBox
                label="Upload Aadhaar Back Photo"
                fileField="aadhaarBackPhoto"
                previewField="aadhaarBackPreview"
              />
            </Grid>
          </Grid>
        </Box>

        {/* 🔹 PAN Card */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, color: theme.palette.primary.main, fontWeight: 600 }}>
            PAN Card
          </Typography>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={4}>
              <StyledTextField
                label="PAN Number"
                name="panNumber"
                value={identityProofs.panNumber || ""}
                onChange={(e) => {
                  const formattedValue = formatInputValue("panNumber", e.target.value);
                  handleIdentityFieldChange('panNumber', formattedValue);
                }}
                onBlur={(e) => validateField("panNumber", e.target.value)}
                error={!!errors.panNumber}
                helperText={errors.panNumber}
                sx={textFieldStyles("panNumber")}
                placeholder="Enter PAN number (e.g., ABCDE1234F)"
                inputProps={{
                  maxLength: 10,
                  style: { textTransform: 'uppercase' }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <UploadBox
                label="Upload PAN Card Photo *"
                fileField="panCardPhoto"
                previewField="panCardPreview"
                required={!!identityProofs.panNumber}
              />
            </Grid>
          </Grid>
        </Box>

        {/* 🔹 Voter ID Card */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, color: theme.palette.primary.main, fontWeight: 600 }}>
            Voter ID Card
          </Typography>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={4}>
              <StyledTextField
                label="Voter ID Number"
                name="voterIdNumber"
                value={identityProofs.voterIdNumber || ""}
                onChange={(e) => {
                  const formattedValue = formatInputValue("voterIdNumber", e.target.value);
                  handleIdentityFieldChange('voterIdNumber', formattedValue);
                }}
                onBlur={(e) => validateField("voterIdNumber", e.target.value)}
                error={!!errors.voterIdNumber}
                helperText={errors.voterIdNumber}
                sx={textFieldStyles("voterIdNumber")}
                placeholder="Enter Voter ID number"
                inputProps={{
                  maxLength: 10,
                  style: { textTransform: 'uppercase' }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <UploadBox
                label="Upload Voter ID Front Photo"
                fileField="voterFrontPhoto"
                previewField="voterFrontPreview"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <UploadBox
                label="Upload Voter ID Back Photo"
                fileField="voterBackPhoto"
                previewField="voterBackPreview"
              />
            </Grid>
          </Grid>
        </Box>

        {/* 🔹 Passport */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, color: theme.palette.primary.main, fontWeight: 600 }}>
            Passport
          </Typography>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={4}>
              <StyledTextField
                label="Passport Number"
                name="passportNumber"
                value={identityProofs.passportNumber || ""}
                onChange={(e) => {
                  const formattedValue = formatInputValue("passportNumber", e.target.value);
                  handleIdentityFieldChange('passportNumber', formattedValue);
                }}
                onBlur={(e) => validateField("passportNumber", e.target.value)}
                error={!!errors.passportNumber}
                helperText={errors.passportNumber}
                sx={textFieldStyles("passportNumber")}
                placeholder="Enter Passport number"
                inputProps={{
                  maxLength: 8,
                  style: { textTransform: 'uppercase' }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <UploadBox
                label="Upload Passport Photo"
                fileField="passportPhoto"
                previewField="passportPreview"
              />
            </Grid>
          </Grid>
        </Box>

        {/* 🔹 Driving License */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, color: theme.palette.primary.main, fontWeight: 600 }}>
            Driving License
          </Typography>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={4}>
              <StyledTextField
                label="Driving License Number"
                name="drivingLicenseNumber"
                value={identityProofs.drivingLicenseNumber || ""}
                onChange={(e) => {
                  const formattedValue = formatInputValue("drivingLicenseNumber", e.target.value);
                  handleIdentityFieldChange('drivingLicenseNumber', formattedValue);
                }}
                onBlur={(e) => validateField("drivingLicenseNumber", e.target.value)}
                error={!!errors.drivingLicenseNumber}
                helperText={errors.drivingLicenseNumber}
                sx={textFieldStyles("drivingLicenseNumber")}
                placeholder="Enter DL number (e.g., MH0220110001234)"
                inputProps={{
                  maxLength: 16,
                  style: { textTransform: 'uppercase' }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <UploadBox
                label="Upload DL Front Photo"
                fileField="drivingFrontPhoto"
                previewField="drivingFrontPreview"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <UploadBox
                label="Upload DL Back Photo"
                fileField="drivingBackPhoto"
                previewField="drivingBackPreview"
              />
            </Grid>
          </Grid>
        </Box>

        {/* 🔹 Ration Card */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, color: theme.palette.primary.main, fontWeight: 600 }}>
            Ration Card
          </Typography>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={4}>
              <StyledTextField
                label="Ration Card Number"
                name="rationCardNumber"
                value={identityProofs.rationCardNumber || ""}
                onChange={(e) => {
                  const formattedValue = formatInputValue("rationCardNumber", e.target.value);
                  handleIdentityFieldChange('rationCardNumber', formattedValue);
                }}
                onBlur={(e) => validateField("rationCardNumber", e.target.value)}
                error={!!errors.rationCardNumber}
                helperText={errors.rationCardNumber}
                sx={textFieldStyles("rationCardNumber")}
                placeholder="Enter Ration Card number"
                inputProps={{
                  maxLength: 20,
                  style: { textTransform: 'uppercase' }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <UploadBox
                label="Upload Ration Front Photo"
                fileField="rationFrontPhoto"
                previewField="rationFrontPreview"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <UploadBox
                label="Upload Ration Back Photo"
                fileField="rationBackPhoto"
                previewField="rationBackPreview"
              />
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default IdentityVerificationForm;