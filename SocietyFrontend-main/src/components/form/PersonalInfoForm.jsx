import React, { useState, useEffect } from "react";
import { Card, CardContent, Grid, Box, useTheme, alpha, Typography } from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import StyledTextField from "../../ui/StyledTextField";
import SectionHeader from "../../layout/SectionHeader";
import Autocomplete from "@mui/material/Autocomplete";

const PersonalInfoForm = ({ formData, handleChange }) => {
  const personalInfo = formData.personalDetails || formData.personalInformation || {};
  const [dobError, setDobError] = useState("");
  const [errors, setErrors] = useState({});
  const [civilScoreText, setCivilScoreText] = useState("");
  const theme = useTheme();

  // Validation regex patterns
  const validationPatterns = {
    phone: /^[6-9]\d{9}$/, // Indian mobile numbers starting with 6-9, 10 digits
    landline: /^[0-9]\d{9,11}$/, // 10-12 digits for landline
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    whatsapp: /^[6-9]\d{9}$/ // WhatsApp validation same as phone
  };

  const handleFieldChange = (field, value) => {
    if (formData.personalDetails) {
      handleChange("personalDetails", field, value);
    } else {
      handleChange("personalInformation", field, value);
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }

    // Validate specific fields on change
    validateField(field, value);
  };
  // Field-specific validation
  const validateField = (fieldName, value) => {
    if (!value || value.trim() === "") {
      setErrors(prev => ({ ...prev, [fieldName]: null }));
      return true;
    }

    let isValid = true;
    let errorMessage = "";

    switch (fieldName) {
      case "phoneNo1":
      case "phoneNo2":
        isValid = validationPatterns.phone.test(value);
        errorMessage = "Enter a valid 10-digit mobile number starting with 6-9";
        break;

      case "whatsappNumber":
        isValid = validationPatterns.whatsapp.test(value);
        errorMessage = "Enter a valid 10-digit WhatsApp number starting with 6-9";
        break;

      case "landlineNo":
      case "landlineOffice":
        isValid = validationPatterns.landline.test(value);
        errorMessage = "Enter a valid landline number (10-12 digits)";
        break;

      case "emailId1":
      case "emailId2":
      case "emailId3":
        isValid = validationPatterns.email.test(value);
        errorMessage = "Enter a valid email address";
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

  // Validate all fields (can be called before submission)
  const validateAllFields = () => {
    const newErrors = {};
    const fieldsToValidate = [
      "phoneNo1",
      "phoneNo2",
      "whatsappNumber",
      "landlineNo",
      "landlineOffice",
      "emailId1",
      "emailId2",
      "emailId3"
    ];

    fieldsToValidate.forEach(field => {
      if (personalInfo[field]) {
        const isValid = validateField(field, personalInfo[field]);
        if (!isValid && !newErrors[field]) {
          newErrors[field] = errors[field] || "Invalid format";
        }
      }
    });

    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  // Civil Score logic
  const handleCivilScoreChange = (score) => {
    handleFieldChange("civilScore", score);

    if (!score) {
      setCivilScoreText("");
      return;
    }

    const numericScore = parseInt(score);
    if (isNaN(numericScore)) {
      setCivilScoreText("Invalid score");
      return;
    }

    if (numericScore >= 300 && numericScore <= 550) {
      setCivilScoreText("Poor");
    } else if (numericScore >= 551 && numericScore <= 650) {
      setCivilScoreText("Average");
    } else if (numericScore >= 651 && numericScore <= 750) {
      setCivilScoreText("Good");
    } else if (numericScore >= 751 && numericScore <= 900) {
      setCivilScoreText("Excellent");
    } else {
      setCivilScoreText("Invalid Score");
    }
  };

  const ComboBox = ({ label, fieldName, value, options }) => {
    const [inputValue, setInputValue] = useState(value || "");

    useEffect(() => {
      setInputValue(value || "");
    }, [value]);

    return (
      <Autocomplete
        freeSolo
        options={options}
        value={value || ""}
        inputValue={inputValue}
        onInputChange={(e, newInputValue) => {
          setInputValue(newInputValue);
        }}
        onChange={(e, newVal) => {
          handleFieldChange(fieldName, newVal || "");
        }}
        onBlur={() => {
          handleFieldChange(fieldName, inputValue);
        }}
        sx={{
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
            }
          },
          '& .MuiAutocomplete-input': {
            padding: '8.5px 4px 8.5px 6px !important',
          }
        }}
        renderInput={(params) => (
          <StyledTextField
            {...params}
            label={label}
            sx={{
              '& .MuiInputLabel-root': {
                fontSize: '0.9rem',
                fontWeight: 500,
              },
              '& .MuiInputBase-root': {
                height: '56px',
              }
            }}
          />
        )}
      />
    );
  };

  // DOB age logic
  const handleDateOfBirthChange = (dateString) => {
    handleFieldChange("dateOfBirth", dateString);

    if (!dateString) {
      handleFieldChange("ageInYears", "");
      handleFieldChange("minor", "");
      setDobError("");
      return;
    }

    const dob = new Date(dateString);
    const today = new Date();

    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    let days = today.getDate() - dob.getDate();

    if (days < 0) {
      months -= 1;
      days += 30;
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const isMinor = years < 18 ? true : false;
    setDobError("");

    handleFieldChange("ageInYears", `${years} years, ${months} months`);
    handleFieldChange("minor", isMinor);
  };


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
        backgroundColor: alpha(theme.palette.error.main, 0.05),
        borderColor: theme.palette.error.main,
        '&:hover': {
          backgroundColor: alpha(theme.palette.error.main, 0.08),
        },
        '&.Mui-focused': {
          backgroundColor: alpha(theme.palette.error.main, 0.05),
          boxShadow: `0 0 0 2px ${alpha(theme.palette.error.main, 0.2)}`,
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
  // Phone number formatting helper
  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const phoneNumber = value.replace(/\D/g, '');

    // Format as per Indian standard: XXX-XXX-XXXX
    if (phoneNumber.length <= 3) {
      return phoneNumber;
    } else if (phoneNumber.length <= 6) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    } else {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
  };

  // Landline formatting helper
  const formatLandlineNumber = (value) => {
    const number = value.replace(/\D/g, '');

    // Format based on length
    if (number.length <= 2) {
      return number;
    } else if (number.length <= 5) {
      return `${number.slice(0, 2)}-${number.slice(2)}`;
    } else if (number.length <= 8) {
      return `${number.slice(0, 2)}-${number.slice(2, 5)}-${number.slice(5)}`;
    } else {
      return `${number.slice(0, 2)}-${number.slice(2, 5)}-${number.slice(5, 8)}-${number.slice(8, 12)}`;
    }
  };

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
              <PersonIcon
                sx={{
                  color: theme.palette.primary.main,
                  fontSize: 28
                }}
              />
            </Box>
          }
          title="Personal Information"
          subtitle="Basic member details and identification"
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

        <Grid container spacing={3}>


          <Grid size={{ xs: 12, md: 3 }}>
            <StyledTextField
              label="Membership No."
              name="membershipNumber"
              value={personalInfo.membershipNumber || ""}
              onChange={(e) =>
                handleFieldChange("membershipNumber", e.target.value)
              }
              sx={textFieldStyles}
            />
          </Grid>


          <Grid size={{ xs: 12, md: 3 }}>
            <StyledTextField
              label="Membership Date"
              type="date"
              name="membershipDate"
              InputLabelProps={{ shrink: true }}
              value={personalInfo.membershipDate || ""}
              onChange={(e) =>
                handleFieldChange("membershipDate", e.target.value)
              }
              sx={textFieldStyles}
            />
          </Grid>






          <Grid size={{ xs: 12, md: 2 }}>
            <Box sx={{ position: 'relative' }}>
              <ComboBox
                label="Title"
                fieldName="title"
                value={personalInfo.title}
                options={["Mr", "Mrs", "Miss", "Dr", "CA", "Advocate"]}
              />
            </Box>
          </Grid>


          <Grid size={{ xs: 12, md: 4 }}>
            <StyledTextField
              label="Name of Member"
              name="nameOfMember"
              value={personalInfo.nameOfMember || ""}
              onChange={(e) => handleFieldChange("nameOfMember", e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>


          <Grid size={{ xs: 12, md: 2 }}>
            <ComboBox
              label="Father Title"
              fieldName="fatherTitle"
              value={personalInfo.fatherTitle}
              options={["Mr", "Dr", "CA", "Advocate"]}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <StyledTextField
              label="Name of Father"
              name="nameOfFather"
              value={personalInfo.nameOfFather || ""}
              onChange={(e) => handleFieldChange("nameOfFather", e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>


          <Grid size={{ xs: 12, md: 2 }}>
            <ComboBox
              label="Mother Title"
              fieldName="motherTitle"
              value={personalInfo.motherTitle}
              options={["Mrs", "Miss", "Dr", "CA", "Advocate"]}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <StyledTextField
              label="Name of Mother"
              name="nameOfMother"
              value={personalInfo.nameOfMother || ""}
              onChange={(e) => handleFieldChange("nameOfMother", e.target.value)}
              sx={textFieldStyles}
            />
          </Grid>


          <Grid size={{ xs: 12, md: 3 }}>
            <StyledTextField
              label="Date of Birth"
              type="date"
              name="dateOfBirth"
              InputLabelProps={{ shrink: true }}
              value={personalInfo.dateOfBirth || ""}
              onChange={(e) => handleDateOfBirthChange(e.target.value)}
              error={!!dobError}
              helperText={dobError}
              sx={textFieldStyles}
            />
          </Grid>


          <Grid size={{ xs: 12, md: 3 }}>
            <StyledTextField
              label="Age in Years"
              name="ageInYears"
              value={personalInfo.ageInYears || ""}
              InputProps={{ readOnly: true }}
              sx={{
                ...textFieldStyles,
                '& .MuiOutlinedInput-root': {
                  ...textFieldStyles['& .MuiOutlinedInput-root'],
                }
              }}
            />
          </Grid>


          <Grid size={{ xs: 12, md: 3 }}>
            <ComboBox
              label="Minor"
              fieldName="minor"
              value={personalInfo.minor ? "Yes" : "No"}
              options={["Yes", "No"]}
            />
          </Grid>


          {personalInfo.minor === true && (
            <>
              <Grid size={{ xs: 12, md: 4 }}>
                <StyledTextField
                  label="Guardian Name"
                  name="guardianName"
                  value={personalInfo.guardianName || ""}
                  onChange={(e) => handleFieldChange("guardianName", e.target.value)}
                  sx={textFieldStyles}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <ComboBox
                  label="Relation with Guardian"
                  fieldName="guardianRelation"
                  value={personalInfo.guardianRelation}
                  options={[
                    "Father",
                    "Mother",
                    "Grandfather",
                    "Grandmother",
                    "Uncle",
                    "Aunt",
                  ]}
                />
              </Grid>
            </>
          )}

          <Grid size={{ xs: 12, md: 3 }}>
            <Box sx={{ position: 'relative' }}>
              <StyledTextField
                label="Civil Score"
                name="civilScore"
                type="number"
                value={personalInfo.civilScore || ""}
                onChange={(e) => handleCivilScoreChange(e.target.value)}
                sx={textFieldStyles}
                InputProps={{
                  endAdornment: (
                    <Box
                      component="span"
                      sx={{
                        color: civilScoreText === "Excellent" ? 'success.main' :
                          civilScoreText === "Good" ? 'warning.main' :
                            civilScoreText === "Poor" ? 'error.main' : 'text.secondary',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        minWidth: 80,
                        textAlign: 'right'
                      }}
                    >
                      {civilScoreText}
                    </Box>
                  ),
                }}
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <ComboBox
              label="Gender"
              fieldName="gender"
              value={personalInfo.gender}
              options={["Male", "Female", "Other"]}
            />
          </Grid>


          <Grid size={{ xs: 12, md: 3 }}>
            <ComboBox
              label="Religion"
              fieldName="religion"
              value={personalInfo.religion}
              options={[
                "Hindu",
                "Muslim",
                "Christian",
                "Sikh",
                "Buddhist",
                "Jain",
              ]}
            />
          </Grid>


          <Grid size={{ xs: 12, md: 3 }}>
            <ComboBox
              label="Marital Status"
              fieldName="maritalStatus"
              value={personalInfo.maritalStatus}
              options={["Single", "Married", "Divorced", "Widowed"]}
            />
          </Grid>


          {personalInfo.maritalStatus === "Married" && (
            <Grid size={{ xs: 12, md: 4 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <ComboBox
                    label="Spouse Title"
                    fieldName="spouseTitle"
                    value={personalInfo.spouseTitle}
                    options={["Mr", "Mrs", "Dr", "CA", "Advocate"]}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 9 }}>
                  <StyledTextField
                    label="Name of Spouse"
                    name="nameOfSpouse"
                    value={personalInfo.nameOfSpouse || ""}
                    onChange={(e) => handleFieldChange("nameOfSpouse", e.target.value)}
                    sx={textFieldStyles}
                  />
                </Grid>
              </Grid>
            </Grid>
          )}


          <Grid size={{ xs: 12, md: 3 }}>
            <ComboBox
              label="Caste"
              fieldName="caste"
              value={personalInfo.caste}
              options={["General", "OBC", "SC", "ST"]}
            />
          </Grid>


          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                borderBottom: `2px solid ${alpha(theme.palette.divider, 0.1)}`,
                my: 2,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -2,
                  left: 0,
                  width: '100px',
                  height: 2,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, transparent)`,
                }
              }}
            />
          </Grid>


          <Grid size={{ xs: 12, md: 4 }}>
            <StyledTextField
              label="Primary Number"
              name="phoneNo1"
              value={personalInfo.phoneNo1 || ""}
              onChange={(e) => handleFieldChange("phoneNo1", e.target.value)}
              onBlur={(e) => validateField("phoneNo1", e.target.value)}
              error={!!errors.phoneNo1}
              helperText={errors.phoneNo1}
              sx={textFieldStyles("phoneNo1")}
              placeholder="Enter 10-digit mobile number"
              inputProps={{
                maxLength: 10,
                pattern: "[6-9][0-9]{9}"
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <StyledTextField
              label="Secondary Number"
              name="phoneNo2"
              value={personalInfo.phoneNo2 || ""}
              onChange={(e) => handleFieldChange("phoneNo2", e.target.value)}
              onBlur={(e) => validateField("phoneNo2", e.target.value)}
              error={!!errors.phoneNo2}
              helperText={errors.phoneNo2}
              sx={textFieldStyles("phoneNo2")}
              placeholder="Optional 10-digit mobile number"
              inputProps={{
                maxLength: 10,
                pattern: "[6-9][0-9]{9}"
              }}
            />
          </Grid>


          <Grid size={{ xs: 12, md: 4 }}>
            <StyledTextField
              label="WhatsApp Number"
              name="whatsapp"
              value={personalInfo.whatsapp || ""}
              onChange={(e) => handleFieldChange("whatsapp", e.target.value)}
              onBlur={(e) => validateField("whatsappNumber", e.target.value)}
              error={!!errors.whatsappNumber}
              helperText={errors.whatsappNumber}
              sx={textFieldStyles("whatsappNumber")}
              placeholder="Enter 10-digit WhatsApp number"
              inputProps={{
                maxLength: 10,
                pattern: "[6-9][0-9]{9}"
              }}
            />
          </Grid>


          <Grid size={{ xs: 12, md: 4 }}>
            <StyledTextField
              label="Landline No."
              name="landlineNo"
              value={personalInfo.landlineNo || ""}
              onChange={(e) => handleFieldChange("landlineNo", e.target.value)}
              onBlur={(e) => validateField("landlineNo", e.target.value)}
              error={!!errors.landlineNo}
              helperText={errors.landlineNo}
              sx={textFieldStyles("landlineNo")}
              placeholder="Enter 10-12 digit landline number"
              inputProps={{
                maxLength: 12,
              }}
            />
          </Grid>


          <Grid size={{ xs: 12, md: 4 }}>
            <StyledTextField
              label="Office Landline No."
              name="landlineOffice"
              value={personalInfo.landlineOffice || ""}
              onChange={(e) => handleFieldChange("landlineOffice", e.target.value)}
              onBlur={(e) => validateField("landlineOffice", e.target.value)}
              error={!!errors.landlineOffice}
              helperText={errors.landlineOffice}
              sx={textFieldStyles("landlineOffice")}
              placeholder="Enter 10-12 digit office landline"
              inputProps={{
                maxLength: 12,
              }}
            />
          </Grid>


          <Grid size={{ xs: 12, md: 4 }}>
            <StyledTextField
              label="Primary Email"
              name="emailId1"
              type="email"
              value={personalInfo.emailId1 || ""}
              onChange={(e) => handleFieldChange("emailId1", e.target.value)}
              onBlur={(e) => validateField("emailId1", e.target.value)}
              error={!!errors.emailId1}
              helperText={errors.emailId1}
              sx={textFieldStyles("emailId1")}
              placeholder="Enter primary email address"
              inputProps={{
                pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <StyledTextField
              label="Secondary Email"
              name="emailId2"
              type="email"
              value={personalInfo.emailId2 || ""}
              onChange={(e) => handleFieldChange("emailId2", e.target.value)}
              onBlur={(e) => validateField("emailId2", e.target.value)}
              error={!!errors.emailId2}
              helperText={errors.emailId2}
              sx={textFieldStyles("emailId2")}
              placeholder="Optional secondary email"
              inputProps={{
                pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <StyledTextField
              label="Optional Email"
              name="emailId3"
              type="email"
              value={personalInfo.emailId3 || ""}
              onChange={(e) => handleFieldChange("emailId3", e.target.value)}
              onBlur={(e) => validateField("emailId3", e.target.value)}
              error={!!errors.emailId3}
              helperText={errors.emailId3}
              sx={textFieldStyles("emailId3")}
              placeholder="Optional additional email"
              inputProps={{
                pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoForm;