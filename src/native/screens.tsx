import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  FlatList,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from "react-native";
import Constants from "expo-constants";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { academicYearOptions, degreeCatalog, groups, interests, majorOptions, semesterOptions } from "./data";
import { Chip, GradientButton, HeroCard, Input, Screen, SectionTitle } from "./components";
import { AppTab, CampusPostComment, CampusPostLike, OnboardingMode, OnboardingStep } from "./types";
import { useAppStore } from "./store";
import { theme } from "./theme";

const TOP_SAFE_INSET = Platform.OS === "ios" ? Math.max(Constants.statusBarHeight, 52) : Math.max(Constants.statusBarHeight, 16);

function uniqueById<T extends { id: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
}

function isValidAcademicEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const domain = normalizedEmail.split("@")[1];

  if (!domain) {
    return false;
  }

  return (
    domain.endsWith(".edu") ||
    domain.endsWith(".edu.in") ||
    domain.endsWith(".ac.in")
  );
}

function BrandIcon({ compact = false }: { compact?: boolean }) {
  const size = compact ? 42 : 64;
  const outerRadius = size / 2;
  const ring2Size = compact ? 32 : 52;
  const ring3Size = compact ? 26 : 40;
  const ring4Size = compact ? 16 : 28;

  return (
    <View style={[styles.brandIconWrap, { width: size, height: size }]}>
      <View style={[styles.brandShell, { width: size, height: size, borderRadius: outerRadius }]}>
        <View style={[styles.brandRingSecondary, { width: ring2Size, height: ring2Size, borderRadius: ring2Size / 2 }]}>
          <View style={[styles.brandRing, { width: ring3Size, height: ring3Size, borderRadius: ring3Size / 2 }]}>
            <View style={[styles.brandRingInner, { width: ring4Size, height: ring4Size, borderRadius: ring4Size / 2 }]} />
          </View>
        </View>
      </View>
    </View>
  );
}

function BrandLockup() {
  return (
    <View style={styles.brandLockup}>
      <BrandIcon />
      <Text style={styles.brandWordmark}>
        <Text style={styles.brandWordmarkBlack}>Un</Text>
        <Text style={styles.brandWordmarkRed}>i</Text>
        <Text style={styles.brandWordmarkBlack}>V</Text>
        <Text style={styles.brandWordmarkRed}>i</Text>
        <Text style={styles.brandWordmarkBlack}>be</Text>
      </Text>
      <Text style={styles.brandSlogan}>
        <Text style={styles.brandSloganBlack}>CAMPUS </Text>
        <Text style={styles.brandSloganRed}>ONLY</Text>
        <Text style={styles.brandSloganBlack}> NETWORK</Text>
      </Text>
    </View>
  );
}

export function SplashScreen({
  onGetStarted,
  onLogin
}: {
  onGetStarted: () => void;
  onLogin: () => void;
}) {
  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1763890763377-abd05301034d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
      }}
      style={styles.splashBg}
    >
      <LinearGradient colors={["rgba(15,10,30,0.25)", "rgba(15,10,30,0.55)", "#0F0A1E"]} style={styles.splashOverlay}>
        <BrandLockup />

        <View style={styles.splashContent}>
          <Text style={styles.heroTitle}>Meet Your Campus{"\n"}People</Text>
          <Text style={styles.heroSubtitle}>
            The only dating and social app exclusively for verified college students.
          </Text>
          <GradientButton title="Get Started With College Email" onPress={onGetStarted} />
          <Pressable onPress={onLogin} style={styles.secondaryHeroButton}>
            <Text style={styles.secondaryHeroButtonText}>Login</Text>
          </Pressable>
          <Text style={styles.splashFooter}>Private verification for real college students</Text>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

export function OnboardingScreen({
  onDone,
  onBackToSplash,
  initialStep = "email",
  mode = "signup"
}: {
  onDone: () => void;
  onBackToSplash: () => void;
  initialStep?: OnboardingStep;
  mode?: OnboardingMode;
}) {
  const {
    token,
    universities,
    searchUniversities,
    sendVerificationCode,
    verifyCode,
    reactivateAccount,
    register,
    updateMe,
    loading,
    error,
    apiBaseUrl
  } = useAppStore();
  const steps: OnboardingStep[] = ["email", "otp", "profile", "interests", "done"];
  const [step, setStep] = useState<OnboardingStep>(initialStep);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [signupToken, setSignupToken] = useState("");
  const [profileBusy, setProfileBusy] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState<string>("");
  const [universityQuery, setUniversityQuery] = useState("");
  const [universityResults, setUniversityResults] = useState(universities);
  const [selectedMajor, setSelectedMajor] = useState("");
  const [selectedDegree, setSelectedDegree] = useState("");
  const [customDegree, setCustomDegree] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [semester, setSemester] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerTitle, setPickerTitle] = useState("");
  const [pickerOptions, setPickerOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [pickerValue, setPickerValue] = useState("");
  const [pickerOnSelect, setPickerOnSelect] = useState<(value: string) => void>(() => () => undefined);
  const [iosDatePickerVisible, setIosDatePickerVisible] = useState(false);
  const [pickerDate, setPickerDate] = useState<Date>(() => new Date(2004, 0, 1));
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const canSendVerificationCode = isValidAcademicEmail(email);
  const bioWordCount = bio.trim() ? bio.trim().split(/\s+/).filter(Boolean).length : 0;
  const degreeOptions = useMemo(() => {
    if (!selectedMajor || selectedMajor === "Other") {
      return [{ label: "Other", value: "Other" }];
    }

    return [
      ...degreeCatalog
        .filter((item) => item.major === selectedMajor)
        .map((item) => ({ label: item.degree, value: item.degree })),
      { label: "Other", value: "Other" }
    ];
  }, [selectedMajor]);
  const selectedUniversityRecord = useMemo(
    () => universities.find((item) => item.slug === selectedUniversity) || universityResults.find((item) => item.slug === selectedUniversity) || null,
    [selectedUniversity, universities, universityResults]
  );
  const resolvedDegreeName = selectedDegree === "Other" || selectedMajor === "Other" ? customDegree.trim() : selectedDegree;
  const canContinueProfile =
    !!profileImage &&
    name.trim().length > 0 &&
    !!selectedUniversityRecord &&
    !!dateOfBirth &&
    !!selectedMajor &&
    !!resolvedDegreeName &&
    !!academicYear &&
    !!semester &&
    bioWordCount <= 200;

  useEffect(() => {
    setUniversityResults(universities);
  }, [universities]);

  useEffect(() => {
    if (step !== "email") {
      return;
    }

    if (universities.length > 0 || universityResults.length > 0) {
      return;
    }

    searchUniversities("")
      .then(setUniversityResults)
      .catch(() => undefined);
  }, [step, universities.length, universityResults.length, searchUniversities]);

  useEffect(() => {
    const normalizedDomain = email.trim().toLowerCase().split("@")[1];
    if (!normalizedDomain) return;

    const matchedUniversity = universities.find((item) => item.email_domain?.toLowerCase() === normalizedDomain);
    if (matchedUniversity) {
      setSelectedUniversity(matchedUniversity.slug);
      setUniversityQuery(matchedUniversity.name);
    }
  }, [email, universities]);

  useEffect(() => {
    const trimmed = universityQuery.trim();

    if (trimmed.length < 2) {
      if (universities.length > 0) {
        setUniversityResults(universities);
        return;
      }

      searchUniversities("")
        .then(setUniversityResults)
        .catch(() => undefined);
      return;
    }

    const timeoutId = setTimeout(() => {
      searchUniversities(trimmed)
        .then(setUniversityResults)
        .catch(() => undefined);
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [universityQuery, universities, searchUniversities]);

  const stepIndex = steps.indexOf(step);
  const progress = ((stepIndex / (steps.length - 1)) * 100).toFixed(0);
  const progressStyle = { width: `${progress}%` } as any;

  const toggleInterest = (value: string) => {
    setSelectedInterests((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : prev.length < 8 ? [...prev, value] : prev
    );
  };

  const next = () => {
    const nextIndex = stepIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex]);
    }
  };

  const back = () => {
    if (step === "email") {
      onBackToSplash();
      return;
    }
    const prevIndex = stepIndex - 1;
    if (prevIndex >= 0) {
      setStep(steps[prevIndex]);
    }
  };

  const openPicker = (
    title: string,
    value: string,
    options: Array<{ label: string; value: string }>,
    onSelect: (value: string) => void
  ) => {
    setPickerTitle(title);
    setPickerValue(value);
    setPickerOptions(options);
    setPickerOnSelect(() => onSelect);
    setPickerVisible(true);
  };

  const openDatePicker = () => {
    const nextDate = dateOfBirth ? new Date(dateOfBirth) : new Date(2004, 0, 1);
    setPickerDate(nextDate);

    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: nextDate,
        mode: "date",
        maximumDate: new Date(),
        onChange: (_event, selectedDate) => {
          if (!selectedDate) {
            return;
          }

          setDateOfBirth([
            selectedDate.getFullYear(),
            String(selectedDate.getMonth() + 1).padStart(2, "0"),
            String(selectedDate.getDate()).padStart(2, "0")
          ].join("-"));
        }
      });
      return;
    }

    setIosDatePickerVisible(true);
  };

  const pickProfileImage = async (source: "camera" | "gallery") => {
    const permission =
      source === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", `Please allow ${source === "camera" ? "camera" : "photo library"} access.`);
      return;
    }

    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.9,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [1, 1]
          })
        : await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 0.9,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [1, 1]
          });

    if (result.canceled || result.assets.length === 0) {
      return;
    }

    const asset = result.assets[0];
    setProfileImage({
      uri: asset.uri,
      name: asset.fileName || `profile-${Date.now()}.jpg`,
      type: asset.mimeType || "image/jpeg"
    });
  };

  const openProfileImageChooser = () => {
    Alert.alert("Profile photo", "Add one clear profile image.", [
      { text: "Take Photo", onPress: () => void pickProfileImage("camera") },
      { text: "Upload From Device", onPress: () => void pickProfileImage("gallery") },
      { text: "Cancel", style: "cancel" }
    ]);
  };

  const finishOnboarding = async () => {
    setProfileBusy(true);
    try {
      await updateMe({
        fullName: name,
        dateOfBirth: dateOfBirth,
        major: selectedMajor,
        degreeName: resolvedDegreeName,
        academicYear,
        semester,
        bio,
        interests: selectedInterests,
        onboardingCompleted: true,
        profileImage
      });
      onDone();
    } finally {
      setProfileBusy(false);
    }
  };

  return (
    <Screen scroll>
      <View style={styles.onboardingHeader}>
        <Pressable onPress={back} style={styles.iconButton}>
          <Text style={styles.iconButtonText}>←</Text>
        </Pressable>
        {step !== "done" ? (
          <View style={styles.progressTrack}>
            <LinearGradient colors={[theme.colors.primary, theme.colors.secondary]} style={[styles.progressFill, progressStyle]} />
          </View>
        ) : (
          <View style={{ flex: 1 }} />
        )}
        <BrandIcon compact />
      </View>

      {step === "email" ? (
        <View>
          <SectionTitle
            title={mode === "login" ? "Login With College Email" : "Your University Email"}
            subtitle={mode === "login" ? "Use your verified academic email to log back in." : "Use your official academic email for verification."}
          />
          {mode === "signup" ? (
            <>
              <Text style={styles.fieldLabel}>UNIVERSITY</Text>
              <Input value={universityQuery} onChangeText={(text) => {
                setUniversityQuery(text);
                setSelectedUniversity("");
              }} placeholder="Search your university or college" />
              <View style={[styles.card, { marginTop: 12, marginBottom: 16 }]}>
                {universityResults.slice(0, 8).map((item) => {
                  const selected = selectedUniversity === item.slug;
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => {
                        setSelectedUniversity(item.slug);
                        setUniversityQuery(item.name);
                        setUniversityResults([item]);
                      }}
                      style={[styles.selectorItem, selected && styles.selectorItemActive]}
                    >
                      <Text style={[styles.selectorLabel, selected && styles.selectorLabelActive]}>{item.name}</Text>
                      <Text style={styles.selectorMeta}>{[item.district_name, item.state_name, item.aishe_code].filter(Boolean).join(" · ") || "Higher education institution"}</Text>
                    </Pressable>
                  );
                })}
                {universityQuery.trim().length >= 2 && universityResults.length === 0 ? (
                  <Text style={styles.subtitle}>No campus found. Try a shorter or simpler name.</Text>
                ) : null}
              </View>
            </>
          ) : null}
          <Text style={styles.fieldLabel}>EMAIL</Text>
          <Input
            value={email}
            onChangeText={(text) => setEmail(text.replace(/\s+/g, "").toLowerCase())}
            placeholder="yourname@college.edu or you@university.ac.in"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <View style={{ height: 16 }} />
          <GradientButton
            title={sendingCode ? "Sending..." : mode === "login" ? "Send Login Code" : "Send Verification Code"}
            onPress={async () => {
              if (sendingCode) return;

              setSendingCode(true);
              try {
                const result = await sendVerificationCode(email);
                if (result.previewCode) {
                  setOtp(result.previewCode);
                }
                next();
              } catch (err) {
                Alert.alert("Could not send code", err instanceof Error ? err.message : "Please try again.");
              } finally {
                setSendingCode(false);
              }
            }}
            disabled={!canSendVerificationCode || (mode === "signup" && !selectedUniversity) || sendingCode}
          />
        </View>
      ) : null}

      {step === "otp" ? (
        <View>
          <SectionTitle title="Check Your Email" subtitle={`We sent a code to ${email || "your inbox"}.`} />
          <Input value={otp} onChangeText={setOtp} placeholder="Enter 6-digit code" />
          <View style={{ height: 16 }} />
          <GradientButton
            title={verifyingCode ? "Verifying..." : "Verify OTP"}
            onPress={async () => {
              if (verifyingCode) return;

              setVerifyingCode(true);
              try {
                const result = await verifyCode(email, otp);

                if ("token" in result) {
                  onDone();
                  return;
                }

                if ("reactivationToken" in result) {
                  Alert.alert(
                    "Account is deactivated",
                    "Your account is currently deactivated. Do you want to reactivate it and continue?",
                    [
                      { text: "Cancel", style: "cancel", onPress: onBackToSplash },
                      {
                        text: "Reactivate",
                        onPress: () => {
                          void (async () => {
                            try {
                              await reactivateAccount(result.reactivationToken);
                              onDone();
                            } catch (reactivateErr) {
                              Alert.alert(
                                "Could not reactivate account",
                                reactivateErr instanceof Error ? reactivateErr.message : "Please try again."
                              );
                            }
                          })();
                        }
                      }
                    ]
                  );
                  return;
                }

                if (mode === "login") {
                  Alert.alert("Account not found", "No account exists for this email yet. Please tap Get Started first.");
                  onBackToSplash();
                  return;
                }

                setSignupToken(result.signupToken);
                await register({
                  signupToken: result.signupToken,
                  universitySlug: selectedUniversity,
                  universityName: selectedUniversityRecord?.name || universityQuery,
                  universityState: selectedUniversityRecord?.state_name,
                  universityDistrict: selectedUniversityRecord?.district_name,
                  institutionType: selectedUniversityRecord?.institution_type,
                  fullName: "",
                  major: "",
                  bio: "",
                  interests: [],
                  onboardingCompleted: false
                });
                setStep("profile");
              } catch (err) {
                Alert.alert("Verification failed", err instanceof Error ? err.message : "Please try again.");
              } finally {
                setVerifyingCode(false);
              }
            }}
            disabled={otp.length < 4 || verifyingCode}
          />
        </View>
      ) : null}

      {step === "profile" ? (
        <View>
          <SectionTitle title="Update Your Profile" subtitle="Finish your account after email verification." />
          <Text style={styles.fieldLabel}>PROFILE IMAGE</Text>
          <Pressable onPress={openProfileImageChooser} style={styles.imageUploader}>
            {profileImage ? (
              <Image source={{ uri: profileImage.uri }} style={styles.profileUploadPreview} />
            ) : (
              <>
                <Text style={styles.optionEmoji}>📸</Text>
                <Text style={styles.imageUploaderText}>Upload 1 profile image</Text>
                <Text style={styles.subtitle}>Camera or device gallery</Text>
              </>
            )}
          </Pressable>
          <Text style={styles.fieldLabel}>NAME</Text>
          <Input value={name} onChangeText={setName} placeholder="Enter your full name" />
          <Text style={styles.fieldLabel}>COLLEGE</Text>
          <View style={styles.readOnlyField}>
            <Text style={styles.readOnlyValue}>{selectedUniversityRecord?.name || "College from verified email"}</Text>
          </View>
          <Text style={styles.fieldLabel}>DATE OF BIRTH</Text>
          <Pressable onPress={openDatePicker} style={styles.dateField}>
            <Text style={dateOfBirth ? styles.readOnlyValue : styles.placeholderText}>
              {dateOfBirth ? new Date(dateOfBirth).toLocaleDateString() : "Select date of birth"}
            </Text>
          </Pressable>
          <Text style={styles.fieldLabel}>MAJOR</Text>
          <Pressable
            onPress={() => openPicker("Select major", selectedMajor, majorOptions.map((item) => ({ label: item, value: item })), (value) => {
              setSelectedMajor(value);
              setSelectedDegree("");
              setCustomDegree("");
            })}
            style={styles.dateField}
          >
            <Text style={selectedMajor ? styles.readOnlyValue : styles.placeholderText}>{selectedMajor || "Choose one major"}</Text>
          </Pressable>
          <Text style={styles.fieldLabel}>DEGREE</Text>
          {selectedMajor ? (
            <>
              <Pressable
                onPress={() => openPicker("Select degree", selectedDegree, degreeOptions, (value) => {
                  setSelectedDegree(value);
                  if (value !== "Other") {
                    setCustomDegree("");
                  }
                })}
                style={styles.dateField}
              >
                <Text style={selectedDegree ? styles.readOnlyValue : styles.placeholderText}>{selectedDegree || "Choose one degree"}</Text>
              </Pressable>
              {selectedDegree === "Other" || selectedMajor === "Other" ? (
                <Input value={customDegree} onChangeText={setCustomDegree} placeholder="Enter your degree name" />
              ) : null}
            </>
          ) : (
            <View style={styles.readOnlyField}>
              <Text style={styles.placeholderText}>Select major first</Text>
            </View>
          )}
          <Text style={styles.fieldLabel}>YEAR</Text>
          <Pressable
            onPress={() => openPicker("Select year", academicYear, academicYearOptions.map((item) => ({ label: item, value: item })), setAcademicYear)}
            style={styles.dateField}
          >
            <Text style={academicYear ? styles.readOnlyValue : styles.placeholderText}>{academicYear || "Choose your year"}</Text>
          </Pressable>
          <Text style={styles.fieldLabel}>SEMESTER</Text>
          <Pressable
            onPress={() => openPicker("Select semester", semester, semesterOptions.map((item) => ({ label: item, value: item })), setSemester)}
            style={styles.dateField}
          >
            <Text style={semester ? styles.readOnlyValue : styles.placeholderText}>{semester || "Choose your semester"}</Text>
          </Pressable>
          <Text style={styles.fieldLabel}>BIO</Text>
          <Input value={bio} onChangeText={setBio} placeholder="Share your vibe, clubs, or what you are looking for." multiline />
          <Text style={[styles.subtitle, { marginTop: 8 }]}>Bio words: {bioWordCount}/200</Text>
          <View style={{ height: 16 }} />
          <GradientButton title="Continue to Interests" onPress={next} disabled={!canContinueProfile} />
        </View>
      ) : null}

      {step === "interests" ? (
        <View>
          <SectionTitle title="Choose Your Interests" subtitle="Pick up to 8 so your matches feel relevant." />
          <View style={styles.wrap}>
            {interests.map((item) => (
              <Chip key={item} label={item} active={selectedInterests.includes(item)} onPress={() => toggleInterest(item)} />
            ))}
          </View>
          <View style={{ height: 16 }} />
          <GradientButton
            title={profileBusy || loading ? "Saving..." : "Finish Setup"}
            onPress={() => void finishOnboarding()}
            disabled={selectedInterests.length === 0 || loading || profileBusy || !canContinueProfile}
          />
        </View>
      ) : null}

      {step === "done" ? (
        <View>
          <SectionTitle title="You’re In" subtitle="Your profile is ready for the campus network." />
          <View style={styles.card}>
            <Text style={styles.doneTitle}>
              {name || "Alex"}, welcome to {universities.find((item) => item.slug === selectedUniversity)?.name || "your campus"}.
            </Text>
            <Text style={styles.subtitle}>Email verified and profile completed successfully.</Text>
          </View>
          <GradientButton
            title={loading ? "Opening..." : "Open UniVibe"}
            onPress={async () => {
              onDone();
            }}
            disabled={!token || loading || profileBusy}
          />
        </View>
      ) : null}

      <Modal transparent visible={pickerVisible} animationType="fade" onRequestClose={() => setPickerVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.doneTitle}>{pickerTitle}</Text>
            <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
              {pickerOptions.map((item) => {
                const active = pickerValue === item.value;
                return (
                  <Pressable
                    key={item.value}
                    onPress={() => {
                      pickerOnSelect(item.value);
                      setPickerVisible(false);
                    }}
                    style={[styles.modalOption, active && styles.modalOptionActive]}
                  >
                    <Text style={[styles.selectorLabel, active && styles.selectorLabelActive]}>{item.label}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            <Pressable onPress={() => setPickerVisible(false)} style={styles.modalCloseButton}>
              <Text style={styles.smallActionText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={iosDatePickerVisible} animationType="fade" onRequestClose={() => setIosDatePickerVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.doneTitle}>Select date of birth</Text>
            <DateTimePicker
              value={pickerDate}
              mode="date"
              display="spinner"
              maximumDate={new Date()}
              onChange={(_event, selectedDate) => {
                if (selectedDate) {
                  setPickerDate(selectedDate);
                }
              }}
              style={styles.iosDatePicker}
              themeVariant="light"
            />
            <View style={styles.datePickerActions}>
              <Pressable onPress={() => setIosDatePickerVisible(false)} style={styles.secondaryActionButton}>
                <Text style={styles.secondaryActionText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setDateOfBirth([
                    pickerDate.getFullYear(),
                    String(pickerDate.getMonth() + 1).padStart(2, "0"),
                    String(pickerDate.getDate()).padStart(2, "0")
                  ].join("-"));
                  setIosDatePickerVisible(false);
                }}
                style={styles.modalCloseButton}
              >
                <Text style={styles.smallActionText}>Done</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {error ? (
        <View style={[styles.card, { marginTop: 16, borderColor: "#FECACA", backgroundColor: "#FEF2F2" }]}>
          <Text style={[styles.subtitle, { color: theme.colors.danger }]}>Backend: {error}</Text>
          <Text style={[styles.subtitle, { marginTop: 6 }]}>API base URL: {apiBaseUrl}</Text>
        </View>
      ) : null}
    </Screen>
  );
}

export function DiscoverScreen() {
  const { discoverProfiles, swipe, loading, error, refreshAuthedData } = useAppStore();
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const cardEntrance = useRef(new Animated.Value(0)).current;
  const detailReveal = useRef(new Animated.Value(0)).current;
  const swipePosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const dislikeBurst = useRef(new Animated.Value(0)).current;
  const likeBurst = useRef(new Animated.Value(0)).current;
  const swipeInFlight = useRef(false);

  const topProfile = discoverProfiles[0];

  useEffect(() => {
    cardEntrance.setValue(0);
    detailReveal.setValue(0);
    swipePosition.setValue({ x: 0, y: 0 });
    swipeInFlight.current = false;
    setDetailsExpanded(false);

    Animated.timing(cardEntrance, {
      toValue: 1,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start();
  }, [topProfile?.id]);

  useEffect(() => {
    Animated.timing(detailReveal, {
      toValue: detailsExpanded ? 1 : 0,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false
    }).start();
  }, [detailsExpanded]);

  const performSwipe = async (action: "nope" | "like" | "super") => {
    if (!topProfile) {
      return;
    }

    if (swipeInFlight.current) {
      return;
    }

    swipeInFlight.current = true;
    setLastAction(action);

    const burst = action === "nope" ? dislikeBurst : action === "like" ? likeBurst : null;
    if (burst) {
      burst.setValue(0);
      Animated.sequence([
        Animated.spring(burst, {
          toValue: 1,
          useNativeDriver: true,
          friction: 6,
          tension: 120
        }),
        Animated.timing(burst, {
          toValue: 0,
          duration: 220,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true
        })
      ]).start();
    }

    const destination =
      action === "nope"
        ? { x: -420, y: 12 }
        : action === "like"
          ? { x: 420, y: 12 }
          : { x: 0, y: -520 };

    Animated.timing(swipePosition, {
      toValue: destination,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start(async () => {
      try {
        await swipe(topProfile.id, action === "nope" ? "pass" : action === "super" ? "super_like" : "like");
      } finally {
        swipePosition.setValue({ x: 0, y: 0 });
      }
    });
  };

  const panResponder = useMemo(
    () => PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_event, gestureState) =>
        !detailsExpanded && !!topProfile && (Math.abs(gestureState.dx) > 6 || Math.abs(gestureState.dy) > 6),
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_event, gestureState) => {
        const nextY = gestureState.dy < 0 ? gestureState.dy : gestureState.dy * 0.18;
        swipePosition.setValue({ x: gestureState.dx, y: nextY });
      },
      onPanResponderRelease: (_event, gestureState) => {
        if (swipeInFlight.current || !topProfile) {
          Animated.spring(swipePosition, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
            friction: 7
          }).start();
          return;
        }

        const strongLeft = gestureState.dx < -110 || (gestureState.dx < -70 && gestureState.vx < -0.45);
        const strongRight = gestureState.dx > 110 || (gestureState.dx > 70 && gestureState.vx > 0.45);
        const strongUp =
          (gestureState.dy < -120 && Math.abs(gestureState.dx) < 110) ||
          (gestureState.dy < -80 && Math.abs(gestureState.dx) < 90 && gestureState.vy < -0.45);

        if (strongUp) {
          void performSwipe("super");
          return;
        }

        if (strongRight) {
          void performSwipe("like");
          return;
        }

        if (strongLeft) {
          void performSwipe("nope");
          return;
        }

        Animated.spring(swipePosition, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
          friction: 7,
          tension: 70
        }).start();
      },
      onPanResponderTerminate: () => {
        Animated.spring(swipePosition, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
          friction: 7,
          tension: 70
        }).start();
      }
    }),
    [detailsExpanded, topProfile, swipePosition]
  );

  const cardRotate = swipePosition.x.interpolate({
    inputRange: [-220, 0, 220],
    outputRange: ["-10deg", "0deg", "10deg"]
  });
  const nopeOpacity = swipePosition.x.interpolate({
    inputRange: [-140, -40, 0],
    outputRange: [1, 0.35, 0],
    extrapolate: "clamp"
  });
  const likeOpacity = swipePosition.x.interpolate({
    inputRange: [0, 40, 140],
    outputRange: [0, 0.35, 1],
    extrapolate: "clamp"
  });
  const superOpacity = swipePosition.y.interpolate({
    inputRange: [-150, -40, 0],
    outputRange: [1, 0.25, 0],
    extrapolate: "clamp"
  });

  return (
    <Screen>
      <View style={styles.discoverFullScreen}>
        <View style={styles.discoverTopRail}>
          <Pressable onPress={() => void refreshAuthedData()} style={[styles.discoverRefreshTopButton, loading && { opacity: 0.65 }]}>
            <Text style={styles.discoverRefreshTopIcon}>{loading ? "…" : "↻"}</Text>
          </Pressable>
        </View>

        {topProfile ? (
          <>
            <Animated.View
              {...(!detailsExpanded ? panResponder.panHandlers : {})}
              style={[styles.discoverCardStage, {
                opacity: cardEntrance,
                transform: [
                  { translateX: swipePosition.x },
                  { translateY: Animated.add(
                    swipePosition.y,
                    cardEntrance.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0]
                    })
                  ) },
                  { rotate: cardRotate },
                  {
                    scale: cardEntrance.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.96, 1]
                    })
                  }
                ]
              }]}
            >
              <View style={styles.tinderCardShell}>
                <ImageBackground
                  source={{ uri: topProfile.avatar_url || topProfile.photo_urls[0] || "https://images.unsplash.com/photo-1660982741734-5a7d2730ff28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" }}
                  imageStyle={styles.tinderCardImage}
                  style={styles.tinderCardImageStage}
                >
                  <LinearGradient
                    colors={["rgba(24,12,31,0.04)", "rgba(24,12,31,0.12)", "rgba(24,12,31,0.72)"]}
                    style={styles.swipeImageGlow}
                  />
                  <Animated.View style={[styles.swipeGestureBadge, styles.swipeGestureNope, { opacity: nopeOpacity }]}>
                    <Text style={styles.swipeGestureBadgeText}>DISLIKE</Text>
                  </Animated.View>
                  <Animated.View style={[styles.swipeGestureBadge, styles.swipeGestureLike, { opacity: likeOpacity }]}>
                    <Text style={styles.swipeGestureBadgeText}>LIKE</Text>
                  </Animated.View>
                  <Animated.View style={[styles.swipeGestureBadge, styles.swipeGestureSuper, { opacity: superOpacity }]}>
                    <Text style={styles.swipeGestureBadgeText}>SUPER</Text>
                  </Animated.View>
                  <Animated.View
                    pointerEvents="none"
                    style={[
                      styles.swipeBurst,
                      styles.dislikeBurst,
                      {
                        opacity: dislikeBurst,
                        transform: [
                          {
                            scale: dislikeBurst.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.6, 1.08]
                            })
                          }
                        ]
                      }
                    ]}
                  >
                    <Text style={styles.swipeBurstIcon}>✕</Text>
                  </Animated.View>
                  <Animated.View
                    pointerEvents="none"
                    style={[
                      styles.swipeBurst,
                      styles.likeBurst,
                      {
                        opacity: likeBurst,
                        transform: [
                          {
                            scale: likeBurst.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.6, 1.08]
                            })
                          }
                        ]
                      }
                    ]}
                  >
                    <Text style={[styles.swipeBurstIcon, styles.likeBurstIcon]}>♥</Text>
                  </Animated.View>

                  {!detailsExpanded ? (
                    <LinearGradient
                      colors={["rgba(24,12,31,0)", "rgba(24,12,31,0.18)", "rgba(24,12,31,0.76)"]}
                      style={styles.collapsedCardFooter}
                    >
                      <View style={styles.collapsedIdentityBlock}>
                        <Text style={styles.collapsedIdentityName}>{topProfile.full_name || "Campus Student"}{topProfile.age ? `, ${topProfile.age}` : ""}</Text>
                      </View>
                      <Pressable onPress={() => setDetailsExpanded(true)} style={styles.viewEyeButton}>
                        <Text style={styles.viewEyeButtonIcon}>👁</Text>
                      </Pressable>
                    </LinearGradient>
                  ) : null}
                </ImageBackground>
              </View>
            </Animated.View>

            <View style={styles.cardActionBar}>
              <Pressable onPress={() => void performSwipe("nope")} style={[styles.topActionButton, styles.topNopeButton]}>
                <Text style={[styles.topActionIcon, { color: theme.colors.danger }]}>✕</Text>
              </Pressable>
              <Pressable onPress={() => void performSwipe("super")} style={[styles.topActionButton, styles.topSuperButton]}>
                <Text style={[styles.topActionIcon, { color: theme.colors.warning }]}>★</Text>
              </Pressable>
              <Pressable onPress={() => void performSwipe("like")} style={[styles.topActionButton, styles.topLikeButton]}>
                <Text style={[styles.topActionIcon, { color: "#8FD84F" }]}>♥</Text>
              </Pressable>
            </View>

            {lastAction ? <Text style={styles.tinderFeedbackText}>
              {lastAction === "nope" ? "Skipped profile" : lastAction === "super" ? "Super like sent" : "Like sent"}
            </Text> : null}

            {error ? <Text style={[styles.subtitle, { color: theme.colors.danger, marginTop: 10, textAlign: "center" }]}>{error}</Text> : null}

            <Modal transparent visible={detailsExpanded} animationType="slide" onRequestClose={() => setDetailsExpanded(false)}>
              <View style={styles.modalOverlay}>
                <View style={styles.feedSheetLarge}>
                  <View style={styles.profileModalHeader}>
                    <Text style={styles.doneTitle}>Profile</Text>
                    <Pressable onPress={() => setDetailsExpanded(false)} style={styles.profileModalCloseButton}>
                      <Text style={styles.profileModalCloseButtonText}>✕</Text>
                    </Pressable>
                  </View>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <Image
                      source={{ uri: topProfile.avatar_url || topProfile.photo_urls[0] || "https://images.unsplash.com/photo-1660982741734-5a7d2730ff28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" }}
                      style={styles.chatProfileHero}
                    />
                    <Text style={[styles.doneTitle, { marginTop: 14 }]}>{topProfile.full_name || "Campus Student"}{topProfile.age ? `, ${topProfile.age}` : ""}</Text>
                    <Text style={styles.cardBodyDark}>{topProfile.bio || "No bio added yet."}</Text>
                    <Text style={styles.profileExpandCollege}>{topProfile.university.name}</Text>
                    <View style={styles.profileExpandDegreePill}>
                      <Text style={styles.profileExpandDegreeText}>{topProfile.degree_name || topProfile.major || "Student"}</Text>
                    </View>
                    <View style={styles.profileMetaPills}>
                      <View style={styles.profileMetaPill}>
                        <Text style={styles.profileMetaPillText}>{topProfile.academic_year || "Year not added"}</Text>
                      </View>
                      <View style={styles.profileMetaPill}>
                        <Text style={styles.profileMetaPillText}>{topProfile.semester || "Semester not added"}</Text>
                      </View>
                    </View>
                    <View style={styles.wrap}>
                      {topProfile.interests.length > 0 ? topProfile.interests.map((item) => (
                        <Chip key={item} label={item} />
                      )) : null}
                    </View>
                  </ScrollView>
                </View>
              </View>
            </Modal>
          </>
        ) : (
          <View style={styles.swipeEmptyState}>
            <Pressable onPress={() => void refreshAuthedData()} style={[styles.refreshOrb, loading && { opacity: 0.6 }]}>
              <Text style={styles.refreshOrbIcon}>{loading ? "…" : "↻"}</Text>
            </Pressable>
            <Text style={styles.refreshOrbLabel}>{loading ? "Refreshing" : "Refresh"}</Text>
            {error ? <Text style={[styles.subtitle, { color: theme.colors.danger, marginTop: 12 }]}>{error}</Text> : null}
          </View>
        )}
      </View>
    </Screen>
  );
}

export function MatchesScreen({
  onOpenChat
}: {
  onOpenChat: (chatId: string) => void;
}) {
  const { matches, pendingLikes, conversations, unreadChatsCount, unreadMessagesCount, loading, error } = useAppStore();
  const [tab, setTab] = useState<"matches" | "chats">("matches");
  const [search, setSearch] = useState("");
  const [plusModalVisible, setPlusModalVisible] = useState(false);
  const visiblePendingLikes = useMemo(() => uniqueById(pendingLikes), [pendingLikes]);
  const visibleMatches = useMemo(() => uniqueById(matches), [matches]);
  const visibleConversations = useMemo(() => uniqueById(conversations), [conversations]);

  const filtered = useMemo(
    () => visibleConversations.filter((item) => (item.other_user.full_name || "").toLowerCase().includes(search.toLowerCase())),
    [search, visibleConversations]
  );

  return (
    <Screen scroll>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.pageTitle}>Likes</Text>
          <Text style={styles.miniText}>Campus-only conversations</Text>
        </View>
        <Pressable onPress={() => setPlusModalVisible(true)} style={styles.glassPlusBadge}>
          <Text style={styles.glassPlusBadgeText}>UniVibe+</Text>
        </Pressable>
      </View>

      <View style={styles.segmentRow}>
        <SegmentButton title={`Likes (${visiblePendingLikes.length + visibleMatches.length})`} active={tab === "matches"} onPress={() => setTab("matches")} />
        <SegmentButton title={`Chats (${visibleConversations.length})`} active={tab === "chats"} onPress={() => setTab("chats")} />
      </View>

      {tab === "chats" && unreadMessagesCount > 0 ? (
        <Text style={[styles.miniText, { marginBottom: 10 }]}>{unreadMessagesCount} unread message{unreadMessagesCount === 1 ? "" : "s"} in {unreadChatsCount} chat{unreadChatsCount === 1 ? "" : "s"}</Text>
      ) : null}

      {tab === "matches" ? (
        <View>
          {visiblePendingLikes.length > 0 ? (
            <>
              <Text style={styles.listSectionTitle}>Liked You</Text>
              <View style={styles.gridTwo}>
                {visiblePendingLikes.map((item) => (
                  <View key={item.id} style={styles.matchCard}>
                    <Image
                      source={{ uri: item.preview_image_url || "https://images.unsplash.com/photo-1660982741734-5a7d2730ff28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" }}
                      style={styles.matchImage}
                      blurRadius={18}
                    />
                    <LinearGradient colors={["rgba(255,255,255,0.05)", "rgba(15,10,30,0.68)"]} style={styles.matchOverlay}>
                      <Text style={styles.matchName}>Someone liked you</Text>
                      <Text style={styles.matchMajor}>Swipe to reveal the match</Text>
                    </LinearGradient>
                  </View>
                ))}
              </View>
            </>
          ) : null}

          {visibleMatches.length > 0 ? (
            <>
              <Text style={styles.listSectionTitle}>Matches</Text>
              <View style={styles.gridTwo}>
                {visibleMatches.map((item) => (
                  <Pressable key={item.id} onPress={() => item.conversation_id && onOpenChat(item.conversation_id)} style={styles.matchCard}>
                    <Image source={{ uri: item.user.avatar_url || item.user.photo_urls[0] || "https://images.unsplash.com/photo-1660982741734-5a7d2730ff28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" }} style={styles.matchImage} />
                    <LinearGradient colors={["transparent", "rgba(15,10,30,0.92)"]} style={styles.matchOverlay}>
                      <Text style={styles.matchName}>{item.user.full_name || "Campus Student"}{item.user.age ? `, ${item.user.age}` : ""}</Text>
                      <Text style={styles.matchMajor}>{item.user.major || item.user.degree_name || "Start the conversation"}</Text>
                    </LinearGradient>
                  </Pressable>
                ))}
              </View>
            </>
          ) : null}

          {visiblePendingLikes.length === 0 && visibleMatches.length === 0 ? <Text style={styles.subtitle}>No likes or matches yet. Keep swiping.</Text> : null}
        </View>
      ) : (
        <View>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search conversations..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
          />
          {filtered.map((item) => (
            <Pressable key={item.id} onPress={() => onOpenChat(item.id)} style={styles.chatRow}>
              <Image source={{ uri: item.other_user.avatar_url || item.other_user.photo_urls[0] || "https://images.unsplash.com/photo-1660982741734-5a7d2730ff28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.rowLabel}>{item.other_user.full_name || "Campus Student"}</Text>
                <Text style={styles.subtitle}>{item.last_message?.body || "Start the conversation"}</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.miniText}>{item.last_message_at ? new Date(item.last_message_at).toLocaleDateString() : ""}</Text>
                {item.unread_count > 0 ? (
                  <View style={styles.unreadBubble}>
                    <Text style={styles.unreadText}>{item.unread_count > 99 ? "99+" : item.unread_count}</Text>
                  </View>
                ) : null}
              </View>
            </Pressable>
          ))}
          {filtered.length === 0 ? <Text style={styles.subtitle}>{loading ? "Loading conversations..." : "No conversations found."}</Text> : null}
        </View>
      )}
      {error ? <Text style={[styles.subtitle, { color: theme.colors.danger, marginTop: 12 }]}>{error}</Text> : null}

      <Modal transparent visible={plusModalVisible} animationType="fade" onRequestClose={() => setPlusModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.featurePopup}>
            <Text style={styles.doneTitle}>UniVibe+</Text>
            <Text style={styles.subtitle}>Subscription features coming soon.</Text>
            <Text style={[styles.cardBodyDark, { marginTop: 10 }]}>Initial plan: Rs 49 per month.</Text>
            <View style={styles.feedSheetActions}>
              <Pressable onPress={() => setPlusModalVisible(false)} style={styles.modalCloseButton}>
                <Text style={styles.smallActionText}>Okay</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

export function ChatScreen({
  chatId,
  onBack,
  onUnmatched
}: {
  chatId: string;
  onBack: () => void;
  onUnmatched: () => void;
}) {
  const { conversationMap, loadConversation, markConversationRead, sendMessage, me, fetchUserProfile, reportUser, unmatchMatch } = useAppStore();
  const thread = conversationMap[chatId];
  const [input, setInput] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);
  const [reportReason, setReportReason] = useState("Inappropriate behavior");
  const [reportNotes, setReportNotes] = useState("");
  const [menuBusy, setMenuBusy] = useState(false);
  const [profileUser, setProfileUser] = useState<any>(null);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    void loadConversation(chatId);
  }, [chatId]);

  useEffect(() => {
    if (!thread?.messages.length) {
      return;
    }

    const hasUnreadIncoming = thread.messages.some((message) => message.sender_id !== me?.id && !message.read_at);
    if (hasUnreadIncoming) {
      void markConversationRead(chatId);
    }
  }, [chatId, thread?.messages, me?.id]);

  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [thread?.messages]);

  if (!thread) {
    return (
      <Screen>
        <View style={[styles.card, { margin: 20 }]}>
          <Text style={styles.doneTitle}>Chat not found</Text>
          <View style={{ height: 16 }} />
          <GradientButton title="Back to Matches" onPress={onBack} />
        </View>
      </Screen>
    );
  }

  const send = (text?: string) => {
    const value = (text ?? input).trim();
    if (!value) {
      return;
    }
    void sendMessage(chatId, value);
    setInput("");
  };

  const openProfile = async () => {
    if (!thread) return;
    setMenuVisible(false);
    setProfileVisible(true);
    try {
      const user = await fetchUserProfile(thread.other_user.id);
      setProfileUser(user);
    } catch {
      setProfileUser(thread.other_user);
    }
  };

  const submitReport = async () => {
    if (!thread || !reportReason.trim()) {
      return;
    }

    setMenuBusy(true);
    try {
      await reportUser(thread.other_user.id, reportReason.trim(), reportNotes.trim());
      setReportVisible(false);
      setMenuVisible(false);
      setReportNotes("");
      Alert.alert("Reported", "Thanks. We have received your report.");
    } catch (err) {
      Alert.alert("Could not report user", err instanceof Error ? err.message : "Please try again.");
    } finally {
      setMenuBusy(false);
    }
  };

  const handleUnmatch = async () => {
    if (!thread) return;

    Alert.alert("Unmatch user", "You will remove this match and close the chat.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Unmatch",
        style: "destructive",
        onPress: async () => {
          setMenuBusy(true);
          try {
            await unmatchMatch(thread.match_id);
            setMenuVisible(false);
            onUnmatched();
          } catch (err) {
            Alert.alert("Could not unmatch", err instanceof Error ? err.message : "Please try again.");
          } finally {
            setMenuBusy(false);
          }
        }
      }
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.chatHeader}>
        <Pressable onPress={onBack} style={styles.iconButton}>
          <Text style={styles.iconButtonText}>←</Text>
        </Pressable>
        <Pressable onPress={() => void openProfile()} style={styles.chatProfileTrigger}>
          <Image source={{ uri: thread.other_user.avatar_url || thread.other_user.photo_urls[0] || "https://images.unsplash.com/photo-1660982741734-5a7d2730ff28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" }} style={styles.avatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.rowLabel}>{thread.other_user.full_name || "Campus Student"}</Text>
            <Text style={styles.miniText}>{thread.other_user.university.name}</Text>
          </View>
        </Pressable>
        <Pressable onPress={() => setMenuVisible(true)} style={styles.iconButton}>
          <Text style={styles.iconButtonText}>⋮</Text>
        </Pressable>
      </View>

      <FlatList
        ref={listRef}
        data={thread.messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.sender_id === me?.id ? styles.myMessage : styles.theirMessage]}>
            <Text style={[styles.messageText, item.sender_id === me?.id && { color: "#fff" }]}>{item.body}</Text>
            <View style={styles.messageMetaRow}>
              <Text style={[styles.messageTime, item.sender_id === me?.id && { color: "rgba(255,255,255,0.72)" }]}>{new Date(item.created_at).toLocaleTimeString()}</Text>
              {item.sender_id === me?.id ? (
                <Text style={styles.messageStatusText}>{item.read_at ? "Read" : "Delivered"}</Text>
              ) : null}
            </View>
          </View>
        )}
      />

      <View style={styles.quickReplyRow}>
        {["Hey! 👋", "Coffee later?", "Same class!", "That’s cool"].map((item) => (
          <Chip key={item} label={item} onPress={() => send(item)} />
        ))}
      </View>

      <View style={styles.composerRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Send a message..."
          placeholderTextColor="#9CA3AF"
          style={styles.composerInput}
        />
        <Pressable onPress={() => send()} style={styles.sendButton}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>Send</Text>
        </Pressable>
      </View>

      <Modal transparent visible={menuVisible} animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.chatMenuSheet}>
            <Pressable onPress={() => void openProfile()} style={styles.chatMenuItem}>
              <Text style={styles.chatMenuText}>View Profile</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setMenuVisible(false);
                setReportVisible(true);
              }}
              style={styles.chatMenuItem}
            >
              <Text style={styles.chatMenuText}>Report</Text>
            </Pressable>
            <Pressable onPress={() => void handleUnmatch()} style={styles.chatMenuItem}>
              <Text style={[styles.chatMenuText, { color: theme.colors.danger }]}>Unmatch</Text>
            </Pressable>
            <Pressable onPress={() => setMenuVisible(false)} style={styles.chatMenuItem}>
              <Text style={[styles.chatMenuText, { color: theme.colors.muted }]}>Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <Modal transparent visible={profileVisible} animationType="slide" onRequestClose={() => setProfileVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.feedSheetLarge}>
            <View style={styles.profileModalHeader}>
              <Text style={styles.doneTitle}>Profile</Text>
              <Pressable onPress={() => setProfileVisible(false)} style={styles.secondaryActionButton}>
                <Text style={styles.secondaryActionText}>Close</Text>
              </Pressable>
            </View>
            {profileUser ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Image
                  source={{ uri: profileUser.avatar_url || profileUser.photo_urls?.[0] || "https://images.unsplash.com/photo-1660982741734-5a7d2730ff28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" }}
                  style={styles.chatProfileHero}
                />
                <Text style={[styles.doneTitle, { marginTop: 14 }]}>{profileUser.full_name || "Campus Student"}{profileUser.age ? `, ${profileUser.age}` : ""}</Text>
                <Text style={styles.subtitle}>
                  {[profileUser.degree_name || profileUser.major || "Student", profileUser.academic_year, profileUser.semester].filter(Boolean).join(" · ")}
                </Text>
                <Text style={styles.subtitle}>{profileUser.university?.name}</Text>
                <Text style={styles.cardBodyDark}>{profileUser.bio || "No intro added yet."}</Text>
                <View style={styles.wrap}>
                  {(profileUser.interests || []).map((item: string) => (
                    <Chip key={item} label={item} />
                  ))}
                </View>
              </ScrollView>
            ) : (
              <Text style={styles.subtitle}>Loading profile...</Text>
            )}
          </View>
        </View>
      </Modal>

      <Modal transparent visible={reportVisible} animationType="fade" onRequestClose={() => setReportVisible(false)}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 18 : 0}
              style={styles.reportKeyboardWrap}
            >
              <View style={styles.featurePopup}>
                <View style={styles.reportHeader}>
                  <View style={styles.reportHeaderTextWrap}>
                    <Text style={styles.doneTitle}>Report user</Text>
                    <Text style={styles.subtitle}>Tell us what happened. We will review it.</Text>
                  </View>
                  <Pressable
                    onPress={() => {
                      Keyboard.dismiss();
                      setReportVisible(false);
                    }}
                    style={styles.reportCloseButton}
                  >
                    <Text style={styles.reportCloseButtonText}>✕</Text>
                  </Pressable>
                </View>
                <View style={{ height: 14 }} />
                <Input value={reportReason} onChangeText={setReportReason} placeholder="Reason" />
                <View style={{ height: 10 }} />
                <Input value={reportNotes} onChangeText={setReportNotes} placeholder="Add more details" multiline />
                <View style={styles.reportActionRow}>
                  <Pressable
                    onPress={() => {
                      Keyboard.dismiss();
                      setReportVisible(false);
                    }}
                    style={[styles.reportActionButton, styles.reportActionButtonSecondary]}
                  >
                    <Text style={styles.reportActionTextSecondary}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => void submitReport()}
                    style={[styles.reportActionButton, styles.reportActionButtonPrimary, menuBusy && styles.actionButtonDisabled]}
                    disabled={menuBusy}
                  >
                    <Text style={styles.reportActionTextPrimary}>{menuBusy ? "Submitting..." : "Report"}</Text>
                  </Pressable>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

export function CampusScreen() {
  const {
    campusPosts,
    campusEvents,
    rsvpEvent,
    loading,
    createCampusPost,
    toggleCampusPostLike,
    loadCampusPostLikes,
    loadCampusPostComments,
    createCampusPostComment
  } = useAppStore();
  const [tab, setTab] = useState<"feed" | "events" | "groups">("feed");
  const [composerVisible, setComposerVisible] = useState(false);
  const [postBody, setPostBody] = useState("");
  const [likesModalVisible, setLikesModalVisible] = useState(false);
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [likers, setLikers] = useState<CampusPostLike[]>([]);
  const [comments, setComments] = useState<CampusPostComment[]>([]);
  const [commentBody, setCommentBody] = useState("");
  const [replyParentId, setReplyParentId] = useState<string | null>(null);
  const [feedBusy, setFeedBusy] = useState(false);
  const [postImage, setPostImage] = useState<{ uri: string; name: string; type: string } | null>(null);

  const openLikes = async (postId: string) => {
    setActivePostId(postId);
    setLikesModalVisible(true);
    const data = await loadCampusPostLikes(postId);
    setLikers(data);
  };

  const openComments = async (postId: string) => {
    setActivePostId(postId);
    setReplyParentId(null);
    setCommentsModalVisible(true);
    const data = await loadCampusPostComments(postId);
    setComments(data);
  };

  const submitPost = async () => {
    if (!postBody.trim() && !postImage) {
      return;
    }

    setFeedBusy(true);
    try {
      await createCampusPost(postBody.trim(), "Campus Life", postImage);
      setPostBody("");
      setPostImage(null);
      setComposerVisible(false);
    } finally {
      setFeedBusy(false);
    }
  };

  const pickPostImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow photo library access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.9,
      mediaTypes: ImagePicker.MediaTypeOptions.Images
    });

    if (result.canceled || result.assets.length === 0) {
      return;
    }

    const asset = result.assets[0];
    setPostImage({
      uri: asset.uri,
      name: asset.fileName || `post-${Date.now()}.jpg`,
      type: asset.mimeType || "image/jpeg"
    });
  };

  const submitComment = async () => {
    if (!activePostId || !commentBody.trim()) {
      return;
    }

    setFeedBusy(true);
    try {
      await createCampusPostComment(activePostId, commentBody.trim(), replyParentId);
      const data = await loadCampusPostComments(activePostId);
      setComments(data);
      setCommentBody("");
      setReplyParentId(null);
    } finally {
      setFeedBusy(false);
    }
  };

  return (
    <Screen scroll>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.pageTitle}>Explore</Text>
          <Text style={styles.miniText}>247 students active now</Text>
        </View>
        {tab === "feed" ? (
          <Pressable onPress={() => setComposerVisible(true)} style={styles.plusPill}>
            <Text style={styles.plusPillText}>+</Text>
          </Pressable>
        ) : (
          <View style={{ width: 44, height: 44 }} />
        )}
      </View>

      <View style={styles.segmentRow}>
        <SegmentButton title="Feed" active={tab === "feed"} onPress={() => setTab("feed")} />
        <SegmentButton title="Events" active={tab === "events"} onPress={() => setTab("events")} />
        <SegmentButton title="Groups" active={tab === "groups"} onPress={() => setTab("groups")} />
      </View>

      {tab === "feed" ? (
        <View>
          {campusPosts.map((post) => (
            <View key={post.id} style={[styles.card, { marginBottom: 12 }]}>
              <View style={styles.listRow}>
                <Image source={{ uri: post.user.avatar_url || post.user.photo_urls[0] || "https://images.unsplash.com/photo-1660982741734-5a7d2730ff28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" }} style={styles.avatar} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowLabel}>{post.user.full_name || "Campus Student"}</Text>
                  <Text style={styles.miniText}>{post.user.major || "Student"} · {new Date(post.published_at).toLocaleDateString()}</Text>
                </View>
                <Chip label={post.likes_count + post.comments_count > 0 ? "Trending" : post.tag} />
              </View>
              {post.image_url ? <Image source={{ uri: post.image_url }} style={styles.feedImage} /> : null}
              <Text style={styles.cardBodyDark}>{post.body}</Text>
              <View style={styles.actionMetaRow}>
                <Pressable onPress={() => void toggleCampusPostLike(post.id)} style={styles.feedAction}>
                  <Text style={[styles.linkText, post.liked_by_me && styles.feedActionActive]}>{post.liked_by_me ? "♥" : "♡"} {post.likes_count}</Text>
                </Pressable>
                <Pressable onPress={() => void openLikes(post.id)} style={styles.feedAction}>
                  <Text style={styles.linkText}>Liked by</Text>
                </Pressable>
                <Pressable onPress={() => void openComments(post.id)} style={styles.feedAction}>
                  <Text style={styles.linkText}>💬 {post.comments_count}</Text>
                </Pressable>
              </View>
            </View>
          ))}
          {campusPosts.length === 0 ? <Text style={styles.subtitle}>{loading ? "Loading posts..." : "No campus posts yet."}</Text> : null}
        </View>
      ) : null}

      {tab === "events" ? (
        <View>
          {campusEvents.map((event) => (
            <HeroCard key={event.id} image={event.creator?.avatar_url || "https://images.unsplash.com/photo-1701709304274-bd9e5402d979?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"} height={220}>
              <Chip label={event.category} active />
              <View style={{ height: 8 }} />
              <Chip label={event.sub_category.replace(/_/g, " ")} />
              <Text style={styles.cardTitle}>{event.title}</Text>
              <Text style={styles.cardMeta}>{new Date(event.starts_at).toLocaleDateString()} · {new Date(event.starts_at).toLocaleTimeString()} · {event.location}</Text>
              <Text style={styles.cardMeta}>{event.university.name}</Text>
              <Text style={styles.cardMeta}>{event.attendees_count} going</Text>
              <View style={{ height: 12 }} />
              <Pressable onPress={() => void rsvpEvent(event.id)} style={styles.smallActionButton}>
                <Text style={styles.smallActionText}>Join Event</Text>
              </Pressable>
            </HeroCard>
          ))}
          {campusEvents.length === 0 ? <Text style={styles.subtitle}>{loading ? "Loading events..." : "No campus events yet."}</Text> : null}
        </View>
      ) : null}

      {tab === "groups" ? (
        <View>
          {groups.map((group) => (
            <View key={group.id} style={[styles.card, { marginBottom: 12 }]}>
              <View style={styles.listRow}>
                <Text style={styles.groupEmoji}>{group.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowLabel}>{group.name}</Text>
                  <Text style={styles.subtitle}>{group.members} members</Text>
                </View>
                <Chip label="Join" active />
              </View>
            </View>
          ))}
        </View>
      ) : null}

      <Modal transparent visible={composerVisible} animationType="slide" onRequestClose={() => setComposerVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.feedSheet}>
            <Text style={styles.doneTitle}>Share with your campus</Text>
            <Text style={styles.subtitle}>Post something trending for your college feed.</Text>
            <View style={{ height: 12 }} />
            <Input value={postBody} onChangeText={setPostBody} placeholder="What is happening on campus today?" multiline />
            <View style={{ height: 12 }} />
            <Pressable onPress={() => void pickPostImage()} style={styles.glassAttachButton}>
              <Text style={styles.glassAttachText}>{postImage ? "Image selected" : "Add image"}</Text>
            </Pressable>
            {postImage ? <Image source={{ uri: postImage.uri }} style={styles.composerImagePreview} /> : null}
            <View style={styles.feedSheetActions}>
              <Pressable onPress={() => setComposerVisible(false)} style={styles.secondaryActionButton}>
                <Text style={styles.secondaryActionText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={() => void submitPost()} style={styles.modalCloseButton}>
                <Text style={styles.smallActionText}>{feedBusy ? "Posting..." : "Post"}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={likesModalVisible} animationType="slide" onRequestClose={() => setLikesModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.feedSheet}>
            <Text style={styles.doneTitle}>People who liked this</Text>
            <ScrollView style={{ marginTop: 12 }} showsVerticalScrollIndicator={false}>
              {likers.map((like) => (
                <View key={like.id} style={styles.feedModalRow}>
                  <Image source={{ uri: like.user.avatar_url || like.user.photo_urls[0] || "https://images.unsplash.com/photo-1660982741734-5a7d2730ff28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" }} style={styles.avatar} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowLabel}>{like.user.full_name || "Campus Student"}</Text>
                    <Text style={styles.subtitle}>{like.user.degree_name || like.user.major || "Student"}</Text>
                  </View>
                </View>
              ))}
              {likers.length === 0 ? <Text style={styles.subtitle}>No likes yet.</Text> : null}
            </ScrollView>
            <View style={styles.feedSheetActions}>
              <Pressable onPress={() => setLikesModalVisible(false)} style={styles.modalCloseButton}>
                <Text style={styles.smallActionText}>Done</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={commentsModalVisible} animationType="slide" onRequestClose={() => setCommentsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.feedSheetLarge}>
            <Text style={styles.doneTitle}>Comments</Text>
            <Text style={styles.subtitle}>
              {replyParentId ? "Replying to a comment" : "See who commented and keep the conversation going."}
            </Text>
            <ScrollView style={{ marginTop: 12 }} showsVerticalScrollIndicator={false}>
              {comments.map((comment) => (
                <CommentThread
                  key={comment.id}
                  comment={comment}
                  onReply={(commentId) => setReplyParentId(commentId)}
                />
              ))}
              {comments.length === 0 ? <Text style={styles.subtitle}>No comments yet.</Text> : null}
            </ScrollView>
            <View style={{ height: 12 }} />
            <Input
              value={commentBody}
              onChangeText={setCommentBody}
              placeholder={replyParentId ? "Write a reply..." : "Write a comment..."}
              multiline
            />
            <View style={styles.feedSheetActions}>
              <Pressable
                onPress={() => {
                  setReplyParentId(null);
                  setCommentsModalVisible(false);
                }}
                style={styles.secondaryActionButton}
              >
                <Text style={styles.secondaryActionText}>Close</Text>
              </Pressable>
              <Pressable onPress={() => void submitComment()} style={styles.modalCloseButton}>
                <Text style={styles.smallActionText}>{feedBusy ? "Sending..." : replyParentId ? "Reply" : "Comment"}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

function CommentThread({
  comment,
  onReply,
  depth = 0
}: {
  comment: CampusPostComment;
  onReply: (commentId: string) => void;
  depth?: number;
}) {
  return (
    <View style={[styles.commentThread, depth > 0 && { marginLeft: 18 }]}>
      <View style={styles.feedModalRow}>
        <Image source={{ uri: comment.user.avatar_url || comment.user.photo_urls[0] || "https://images.unsplash.com/photo-1660982741734-5a7d2730ff28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.rowLabel}>{comment.user.full_name || "Campus Student"}</Text>
          <Text style={styles.cardBodyDark}>{comment.body}</Text>
          <View style={styles.commentMetaRow}>
            <Text style={styles.miniText}>{new Date(comment.created_at).toLocaleString()}</Text>
            <Pressable onPress={() => onReply(comment.id)}>
              <Text style={styles.replyLink}>Reply</Text>
            </Pressable>
          </View>
        </View>
      </View>
      {comment.replies.map((reply) => (
        <CommentThread key={reply.id} comment={reply} onReply={onReply} depth={depth + 1} />
      ))}
    </View>
  );
}

export function ProfileScreen() {
  const { me, updateMe, loading, signOut, deactivateAccount, deleteAccount } = useAppStore();
  const [tab, setTab] = useState<"profile" | "settings">("profile");
  const [editing, setEditing] = useState(false);
  const [saveBusy, setSaveBusy] = useState(false);
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [major, setMajor] = useState("");
  const [degree, setDegree] = useState("");
  const [customDegree, setCustomDegree] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [semester, setSemester] = useState("");
  const [profileImage, setProfileImage] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [iosDatePickerVisible, setIosDatePickerVisible] = useState(false);
  const [pickerDate, setPickerDate] = useState<Date>(() => new Date(2004, 0, 1));
  const [matchNotifications, setMatchNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [eventNotifications, setEventNotifications] = useState(true);
  const [previewMessages, setPreviewMessages] = useState(false);
  const [showActiveStatus, setShowActiveStatus] = useState(true);
  const [showMeOnCampus, setShowMeOnCampus] = useState(true);
  const [preferSameDegree, setPreferSameDegree] = useState(false);
  const [preferSameYear, setPreferSameYear] = useState(false);
  const [preferSameSemester, setPreferSameSemester] = useState(false);
  const degreeOptions = useMemo(() => {
    if (!major || major === "Other") {
      return [{ label: "Other", value: "Other" }];
    }

    return [
      ...degreeCatalog.filter((item) => item.major === major).map((item) => ({ label: item.degree, value: item.degree })),
      { label: "Other", value: "Other" }
    ];
  }, [major]);

  useEffect(() => {
    if (!me) {
      return;
    }

    setFullName(me.full_name || "");
    setBio(me.bio || "");
    setDateOfBirth(me.date_of_birth || "");
    setMajor(me.major || "");
    setDegree(me.degree_name || "");
    setCustomDegree("");
    setAcademicYear(me.academic_year || "");
    setSemester(me.semester || "");
    setProfileImage(null);
    setPreferSameDegree(!!me.prefer_same_degree);
    setPreferSameYear(!!me.prefer_same_year);
    setPreferSameSemester(!!me.prefer_same_semester);
    setShowActiveStatus(me.show_active_status ?? true);
    setShowMeOnCampus(me.show_me_on_campus ?? true);
  }, [me]);

  const openDatePicker = () => {
    const nextDate = dateOfBirth ? new Date(dateOfBirth) : new Date(2004, 0, 1);
    setPickerDate(nextDate);

    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: nextDate,
        mode: "date",
        maximumDate: new Date(),
        onChange: (_event, selectedDate) => {
          if (!selectedDate) {
            return;
          }

          setDateOfBirth([
            selectedDate.getFullYear(),
            String(selectedDate.getMonth() + 1).padStart(2, "0"),
            String(selectedDate.getDate()).padStart(2, "0")
          ].join("-"));
        }
      });
      return;
    }

    setIosDatePickerVisible(true);
  };

  const pickProfileImage = async (source: "camera" | "gallery") => {
    const permission =
      source === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", `Please allow ${source === "camera" ? "camera" : "photo library"} access.`);
      return;
    }

    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.9,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [1, 1]
          })
        : await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 0.9,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [1, 1]
          });

    if (result.canceled || result.assets.length === 0) {
      return;
    }

    const asset = result.assets[0];
    setProfileImage({
      uri: asset.uri,
      name: asset.fileName || `profile-${Date.now()}.jpg`,
      type: asset.mimeType || "image/jpeg"
    });
  };

  const openProfileImageChooser = () => {
    Alert.alert("Edit profile photo", "Choose how you want to update your profile image.", [
      { text: "Take Photo", onPress: () => void pickProfileImage("camera") },
      { text: "Upload From Device", onPress: () => void pickProfileImage("gallery") },
      { text: "Cancel", style: "cancel" }
    ]);
  };

  const saveProfile = async () => {
    setSaveBusy(true);
    try {
      await updateMe({
        fullName,
        dateOfBirth,
        major,
        degreeName: degree === "Other" || major === "Other" ? customDegree.trim() : degree,
        academicYear,
        semester,
        bio,
        interests: me?.interests || [],
        onboardingCompleted: true,
        preferSameDegree,
        preferSameYear,
        preferSameSemester,
        showActiveStatus,
        showMeOnCampus,
        profileImage
      });
      setEditing(false);
    } finally {
      setSaveBusy(false);
    }
  };

  const updateDiscoveryPreference = async (changes: {
    preferSameDegree?: boolean;
    preferSameYear?: boolean;
    preferSameSemester?: boolean;
    showActiveStatus?: boolean;
    showMeOnCampus?: boolean;
  }) => {
    try {
      await updateMe({
        preferSameDegree: changes.preferSameDegree ?? preferSameDegree,
        preferSameYear: changes.preferSameYear ?? preferSameYear,
        preferSameSemester: changes.preferSameSemester ?? preferSameSemester,
        showActiveStatus: changes.showActiveStatus ?? showActiveStatus,
        showMeOnCampus: changes.showMeOnCampus ?? showMeOnCampus
      });
    } catch (err) {
      Alert.alert("Could not update preference", err instanceof Error ? err.message : "Please try again.");
      setPreferSameDegree(!!me?.prefer_same_degree);
      setPreferSameYear(!!me?.prefer_same_year);
      setPreferSameSemester(!!me?.prefer_same_semester);
      setShowActiveStatus(me?.show_active_status ?? true);
      setShowMeOnCampus(me?.show_me_on_campus ?? true);
    }
  };

  return (
    <Screen scroll>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.pageTitle}>My Profile</Text>
          <Text style={styles.miniText}>Campus identity and account settings</Text>
        </View>
        <Pressable onPress={() => setEditing((current) => !current)} style={styles.profileEditButton}>
          <Text style={styles.profileEditIcon}>✎</Text>
          <Text style={styles.profileEditText}>{editing ? "Close" : "Edit"}</Text>
        </Pressable>
      </View>

      <View style={styles.segmentRow}>
        <SegmentButton title="Profile" active={tab === "profile"} onPress={() => setTab("profile")} />
        <SegmentButton title="Settings" active={tab === "settings"} onPress={() => setTab("settings")} />
      </View>

      {tab === "profile" ? (
        <View>
          <HeroCard image={me?.avatar_url || me?.photo_urls[0] || "https://images.unsplash.com/photo-1660982741734-5a7d2730ff28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"} height={320}>
            <Text style={styles.cardTitle}>{me?.full_name || "Campus Student"}{me?.age ? `, ${me.age}` : ""}</Text>
            <Text style={styles.cardMeta}>
              {[me?.degree_name || me?.major || "Undeclared", me?.academic_year, me?.semester].filter(Boolean).join(" · ")}
            </Text>
            <Text style={styles.cardMeta}>{me?.university.name || "University"}</Text>
          </HeroCard>
          <View style={[styles.card, { marginTop: 16 }]}>
            <Text style={styles.cardBodyDark}>{me?.bio || "Complete your profile to help campus connections feel real."}</Text>
            <View style={{ height: 10 }} />
            <Text style={styles.subtitle}>Date of birth: {me?.date_of_birth ? new Date(me.date_of_birth).toLocaleDateString() : "Not added"}</Text>
            <View style={styles.wrap}>
              {(me?.interests || []).map((item) => (
                <Chip key={item} label={item} />
              ))}
            </View>
          </View>

          <View style={styles.photoGrid}>
            {(me?.photo_urls || []).map((photo) => (
              <Image key={photo} source={{ uri: photo }} style={styles.photoTile} />
            ))}
          </View>

          {editing ? (
            <View style={[styles.card, { marginTop: 16 }]}>
              <Text style={styles.doneTitle}>Edit Profile</Text>
              <Text style={styles.fieldLabel}>PROFILE IMAGE</Text>
              <Pressable onPress={openProfileImageChooser} style={styles.imageUploader}>
                {profileImage || me?.photo_urls[0] ? (
                  <Image source={{ uri: profileImage?.uri || me?.photo_urls[0] }} style={styles.profileUploadPreview} />
                ) : (
                  <>
                    <Text style={styles.optionEmoji}>📸</Text>
                    <Text style={styles.imageUploaderText}>Upload 1 profile image</Text>
                  </>
                )}
              </Pressable>

              <Text style={styles.fieldLabel}>NAME</Text>
              <Input value={fullName} onChangeText={setFullName} placeholder="Enter your full name" />
              <Text style={styles.fieldLabel}>COLLEGE</Text>
              <View style={styles.readOnlyField}>
                <Text style={styles.readOnlyValue}>{me?.university.name || "College"}</Text>
              </View>
              <Text style={styles.fieldLabel}>DATE OF BIRTH</Text>
              <Pressable onPress={openDatePicker} style={styles.dateField}>
                <Text style={dateOfBirth ? styles.readOnlyValue : styles.placeholderText}>
                  {dateOfBirth ? new Date(dateOfBirth).toLocaleDateString() : "Select date of birth"}
                </Text>
              </Pressable>
              <Text style={styles.fieldLabel}>MAJOR</Text>
              <Selector value={major} options={majorOptions.map((item) => ({ label: item, value: item }))} onChange={(value) => {
                setMajor(value);
                setDegree("");
                setCustomDegree("");
              }} />
              <Text style={styles.fieldLabel}>DEGREE</Text>
              <Selector value={degree} options={degreeOptions} onChange={(value) => {
                setDegree(value);
                if (value !== "Other") {
                  setCustomDegree("");
                }
              }} />
              {degree === "Other" || major === "Other" ? (
                <Input value={customDegree} onChangeText={setCustomDegree} placeholder="Enter your degree name" />
              ) : null}
              <Text style={styles.fieldLabel}>YEAR</Text>
              <Selector value={academicYear} options={academicYearOptions.map((item) => ({ label: item, value: item }))} onChange={setAcademicYear} />
              <Text style={styles.fieldLabel}>SEMESTER</Text>
              <Selector value={semester} options={semesterOptions.map((item) => ({ label: item, value: item }))} onChange={setSemester} />
              <Text style={styles.fieldLabel}>BIO</Text>
              <Input value={bio} onChangeText={setBio} placeholder="Share your vibe, clubs, or what you are looking for." multiline />
              <View style={{ height: 16 }} />
              <GradientButton title={saveBusy || loading ? "Saving..." : "Save Profile"} onPress={() => void saveProfile()} />
            </View>
          ) : null}
        </View>
      ) : null}

      {tab === "settings" ? (
        <View>
          <View style={[styles.card, { marginBottom: 14 }]}>
            <Text style={styles.settingsSectionTitle}>Notifications</Text>
            <Text style={styles.settingsSectionSubtitle}>Choose what you want us to nudge you about.</Text>
            <View style={styles.settingsStack}>
              <View style={styles.settingRow}>
                <View style={styles.settingCopy}>
                  <Text style={styles.rowLabel}>New matches</Text>
                  <Text style={styles.settingHelper}>Get notified when someone matches with you.</Text>
                </View>
                <Switch value={matchNotifications} onValueChange={setMatchNotifications} trackColor={{ false: "#E7E2F3", true: "#D7B8FF" }} thumbColor={matchNotifications ? theme.colors.primary : "#FFFFFF"} />
              </View>
              <View style={styles.settingRow}>
                <View style={styles.settingCopy}>
                  <Text style={styles.rowLabel}>New messages</Text>
                  <Text style={styles.settingHelper}>Instant alerts for campus chats.</Text>
                </View>
                <Switch value={messageNotifications} onValueChange={setMessageNotifications} trackColor={{ false: "#E7E2F3", true: "#D7B8FF" }} thumbColor={messageNotifications ? theme.colors.primary : "#FFFFFF"} />
              </View>
              <View style={styles.settingRow}>
                <View style={styles.settingCopy}>
                  <Text style={styles.rowLabel}>Events & campus updates</Text>
                  <Text style={styles.settingHelper}>Hear about trending events and college activity.</Text>
                </View>
                <Switch value={eventNotifications} onValueChange={setEventNotifications} trackColor={{ false: "#E7E2F3", true: "#D7B8FF" }} thumbColor={eventNotifications ? theme.colors.primary : "#FFFFFF"} />
              </View>
              <View style={styles.settingRow}>
                <View style={styles.settingCopy}>
                  <Text style={styles.rowLabel}>Preview messages</Text>
                  <Text style={styles.settingHelper}>Show message text inside push notifications.</Text>
                </View>
                <Switch value={previewMessages} onValueChange={setPreviewMessages} trackColor={{ false: "#E7E2F3", true: "#D7B8FF" }} thumbColor={previewMessages ? theme.colors.primary : "#FFFFFF"} />
              </View>
            </View>
          </View>

          <View style={[styles.card, { marginBottom: 14 }]}>
            <Text style={styles.settingsSectionTitle}>Discovery Settings</Text>
            <Text style={styles.settingsSectionSubtitle}>Fine-tune who appears first in your swipe deck.</Text>
            <View style={styles.settingsStack}>
              <View style={styles.settingRow}>
                <View style={styles.settingCopy}>
                  <Text style={styles.rowLabel}>Show active status</Text>
                  <Text style={styles.settingHelper}>Let matches know when you are active on campus.</Text>
                </View>
                <Switch
                  value={showActiveStatus}
                  onValueChange={(value) => {
                    setShowActiveStatus(value);
                    void updateDiscoveryPreference({ showActiveStatus: value });
                  }}
                  trackColor={{ false: "#E7E2F3", true: "#D7B8FF" }}
                  thumbColor={showActiveStatus ? theme.colors.primary : "#FFFFFF"}
                />
              </View>
              <View style={styles.settingRow}>
                <View style={styles.settingCopy}>
                  <Text style={styles.rowLabel}>Show me on campus</Text>
                  <Text style={styles.settingHelper}>Appear in swipe and likes for your college lobby.</Text>
                </View>
                <Switch
                  value={showMeOnCampus}
                  onValueChange={(value) => {
                    setShowMeOnCampus(value);
                    void updateDiscoveryPreference({ showMeOnCampus: value });
                  }}
                  trackColor={{ false: "#E7E2F3", true: "#D7B8FF" }}
                  thumbColor={showMeOnCampus ? theme.colors.primary : "#FFFFFF"}
                />
              </View>
              <View style={styles.settingRow}>
                <View style={styles.settingCopy}>
                  <Text style={styles.rowLabel}>Prefer same degree</Text>
                  <Text style={styles.settingHelper}>Prioritize profiles with the same degree as yours.</Text>
                </View>
                <Switch
                  value={preferSameDegree}
                  onValueChange={(value) => {
                    setPreferSameDegree(value);
                    void updateDiscoveryPreference({ preferSameDegree: value });
                  }}
                  trackColor={{ false: "#E7E2F3", true: "#D7B8FF" }}
                  thumbColor={preferSameDegree ? theme.colors.primary : "#FFFFFF"}
                />
              </View>
              <View style={styles.settingRow}>
                <View style={styles.settingCopy}>
                  <Text style={styles.rowLabel}>Same year</Text>
                  <Text style={styles.settingHelper}>Show students from your academic year first.</Text>
                </View>
                <Switch
                  value={preferSameYear}
                  onValueChange={(value) => {
                    setPreferSameYear(value);
                    void updateDiscoveryPreference({ preferSameYear: value });
                  }}
                  trackColor={{ false: "#E7E2F3", true: "#D7B8FF" }}
                  thumbColor={preferSameYear ? theme.colors.primary : "#FFFFFF"}
                />
              </View>
              <View style={styles.settingRow}>
                <View style={styles.settingCopy}>
                  <Text style={styles.rowLabel}>Same semester</Text>
                  <Text style={styles.settingHelper}>Prefer students from the same semester in discover.</Text>
                </View>
                <Switch
                  value={preferSameSemester}
                  onValueChange={(value) => {
                    setPreferSameSemester(value);
                    void updateDiscoveryPreference({ preferSameSemester: value });
                  }}
                  trackColor={{ false: "#E7E2F3", true: "#D7B8FF" }}
                  thumbColor={preferSameSemester ? theme.colors.primary : "#FFFFFF"}
                />
              </View>
            </View>
          </View>

          <View style={[styles.card, { marginBottom: 14 }]}>
            <Text style={styles.settingsSectionTitle}>Help & FAQ</Text>
            <Text style={styles.settingsSectionSubtitle}>Quick help for account, chats, and campus safety.</Text>
            <View style={styles.settingsStack}>
              <Pressable style={styles.settingLinkRow} onPress={() => Alert.alert("Account help", "Use Login with your college email to recover access.")}>
                <View style={styles.settingCopy}>
                  <Text style={styles.rowLabel}>Account & login help</Text>
                  <Text style={styles.settingHelper}>Trouble signing in or reactivating your account?</Text>
                </View>
                <Text style={styles.settingChevron}>›</Text>
              </Pressable>
              <Pressable style={styles.settingLinkRow} onPress={() => Alert.alert("Campus safety", "Use report, unmatch, and block tools from profiles or chats if something feels off.")}>
                <View style={styles.settingCopy}>
                  <Text style={styles.rowLabel}>Campus safety tips</Text>
                  <Text style={styles.settingHelper}>Best practices for safe student connections.</Text>
                </View>
                <Text style={styles.settingChevron}>›</Text>
              </Pressable>
              <Pressable style={styles.settingLinkRow} onPress={() => Alert.alert("Support", "Email support@univibe.app for direct help.")}>
                <View style={styles.settingCopy}>
                  <Text style={styles.rowLabel}>Contact support</Text>
                  <Text style={styles.settingHelper}>Need a real person? Reach us directly.</Text>
                </View>
                <Text style={styles.settingChevron}>›</Text>
              </Pressable>
            </View>
          </View>

          <View style={[styles.card, styles.destructiveSettingsCard]}>
            <Text style={styles.settingsSectionTitle}>Account</Text>
            <Text style={styles.settingsSectionSubtitle}>Manage your access and account lifecycle.</Text>
            <View style={styles.settingsStack}>
              <Pressable
                style={styles.settingLinkRow}
                onPress={() => {
                  Alert.alert(
                    "Deactivate Account",
                    "Your profile will be hidden until you log in again and reactivate it. Do you want to continue?",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Deactivate",
                        style: "destructive",
                        onPress: () => {
                          void deactivateAccount().catch((err) => {
                            Alert.alert("Could not deactivate account", err instanceof Error ? err.message : "Please try again.");
                          });
                        }
                      }
                    ]
                  );
                }}
              >
                <View style={styles.settingCopy}>
                  <Text style={[styles.rowLabel, styles.destructiveSettingText]}>Deactivate account</Text>
                  <Text style={styles.settingHelper}>Temporarily hide your profile and pause your account.</Text>
                </View>
                <Text style={styles.settingChevron}>›</Text>
              </Pressable>
              <Pressable
                style={styles.settingLinkRow}
                onPress={() => {
                  Alert.alert(
                    "Delete Account Permanently",
                    "This will permanently delete your account, matches, chats, posts, and profile data. This action cannot be undone.",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete",
                        style: "destructive",
                        onPress: () => {
                          void deleteAccount().catch((err) => {
                            Alert.alert("Could not delete account", err instanceof Error ? err.message : "Please try again.");
                          });
                        }
                      }
                    ]
                  );
                }}
              >
                <View style={styles.settingCopy}>
                  <Text style={[styles.rowLabel, styles.destructiveSettingText]}>Delete account</Text>
                  <Text style={styles.settingHelper}>Remove your account and all data permanently.</Text>
                </View>
                <Text style={styles.settingChevron}>›</Text>
              </Pressable>
              <Pressable
                style={styles.settingLinkRow}
                onPress={() => {
                  Alert.alert("Sign Out", "Do you want to sign out of UniVibe?", [
                    { text: "Cancel", style: "cancel" },
                    { text: "Sign Out", style: "destructive", onPress: signOut }
                  ]);
                }}
              >
                <View style={styles.settingCopy}>
                  <Text style={styles.rowLabel}>Sign out</Text>
                  <Text style={styles.settingHelper}>Log out from this device and return to the welcome screen.</Text>
                </View>
                <Text style={styles.settingChevron}>›</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ) : null}

      <Modal transparent visible={iosDatePickerVisible} animationType="fade" onRequestClose={() => setIosDatePickerVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.doneTitle}>Select date of birth</Text>
            <DateTimePicker
              value={pickerDate}
              mode="date"
              display="spinner"
              maximumDate={new Date()}
              onChange={(_event, selectedDate) => {
                if (selectedDate) {
                  setPickerDate(selectedDate);
                }
              }}
              style={styles.iosDatePicker}
              themeVariant="light"
            />
            <View style={styles.datePickerActions}>
              <Pressable onPress={() => setIosDatePickerVisible(false)} style={styles.secondaryActionButton}>
                <Text style={styles.secondaryActionText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setDateOfBirth([
                    pickerDate.getFullYear(),
                    String(pickerDate.getMonth() + 1).padStart(2, "0"),
                    String(pickerDate.getDate()).padStart(2, "0")
                  ].join("-"));
                  setIosDatePickerVisible(false);
                }}
                style={styles.modalCloseButton}
              >
                <Text style={styles.smallActionText}>Done</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

export function BottomTabs({
  tab,
  onChange
}: {
  tab: AppTab;
  onChange: (tab: AppTab) => void;
}) {
  const { unreadChatsCount, pendingLikes } = useAppStore();
  const items: Array<{ key: AppTab; icon: string; label: string }> = [
    { key: "discover", icon: "🔥", label: "Swipe" },
    { key: "matches", icon: "♥", label: "Likes" },
    { key: "campus", icon: "🧭", label: "Explore" },
    { key: "profile", icon: "👤", label: "Profile" }
  ];
  const likesBadgeCount = pendingLikes.length + unreadChatsCount;

  return (
    <View style={styles.bottomTabs}>
      {items.map((item) => (
        <Pressable key={item.key} onPress={() => onChange(item.key)} style={[styles.tabItem, tab === item.key && styles.tabItemActive]}>
          <Text style={[styles.tabIcon, tab === item.key && { opacity: 1 }]}>{item.icon}</Text>
          <Text style={[styles.tabLabel, tab === item.key && styles.tabLabelActive]}>{item.label}</Text>
          {item.key === "matches" && likesBadgeCount > 0 ? (
            <View style={styles.bottomTabBadge}>
              <Text style={styles.bottomTabBadgeText}>{likesBadgeCount > 99 ? "99+" : likesBadgeCount}</Text>
            </View>
          ) : null}
        </Pressable>
      ))}
    </View>
  );
}

function SegmentButton({ title, active, onPress }: { title: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.segmentButton, active && styles.segmentButtonActive]}>
      <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{title}</Text>
    </Pressable>
  );
}

function Selector({
  value,
  options,
  onChange
}: {
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.wrap}>
      {options.map((item) => (
        <Chip key={item.value} label={item.label} active={item.value === value} onPress={() => onChange(item.value)} />
      ))}
    </ScrollView>
  );
}

function ActionCircle({
  label,
  onPress,
  background,
  color
}: {
  label: string;
  onPress: () => void;
  background: string;
  color: string;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.actionCircle, { backgroundColor: background }]}>
      <Text style={[styles.actionCircleText, { color }]}>{label}</Text>
    </Pressable>
  );
}

function labelize(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
}

const styles = StyleSheet.create({
  splashBg: {
    flex: 1,
    backgroundColor: theme.colors.dark
  },
  splashOverlay: {
    flex: 1,
    paddingTop: 72,
    paddingHorizontal: 24,
    paddingBottom: 36
  },
  brandLockup: {
    alignItems: "center",
    marginTop: -6
  },
  brandIconWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6
  },
  brandShell: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 6,
    borderColor: "#7C3AED",
    backgroundColor: "transparent"
  },
  brandRingSecondary: {
    borderWidth: 4,
    borderColor: "#EC4899",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  },
  brandRing: {
    borderWidth: 3,
    borderColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  },
  brandRingInner: {
    borderWidth: 2,
    borderColor: "#E9D5FF",
    backgroundColor: "transparent"
  },
  brandWordmark: {
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 2
  },
  brandWordmarkBlack: {
    color: "#E9D5FF"
  },
  brandWordmarkRed: {
    color: "#EC4899"
  },
  brandSlogan: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 4.2,
    marginTop: 6
  },
  brandSloganBlack: {
    color: "#E9D5FF"
  },
  brandSloganRed: {
    color: "#EC4899"
  },
  splashContent: {
    flex: 1,
    justifyContent: "flex-end",
    paddingTop: 24
  },
  secondaryHeroButton: {
    marginTop: 12,
    minHeight: 58,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.52)",
    backgroundColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center"
  },
  secondaryHeroButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800"
  },
  heroTitle: {
    color: "#fff",
    fontSize: 38,
    lineHeight: 42,
    fontWeight: "800",
    marginBottom: 12,
    textAlign: "center"
  },
  heroSubtitle: {
    color: "#DDD6FE",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
    textAlign: "center"
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 14,
    lineHeight: 20
  },
  splashFooter: {
    color: "#A78BFA",
    fontSize: 12,
    textAlign: "center",
    marginTop: 16
  },
  onboardingHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#F0EBFF",
    alignItems: "center",
    justifyContent: "center"
  },
  iconButtonText: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: "700"
  },
  progressTrack: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#F0EBFF",
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    borderRadius: 999
  },
  fieldLabel: {
    marginTop: 14,
    marginBottom: 8,
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.muted
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#F3F0FF"
  },
  selectorItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F0FF"
  },
  selectorItemActive: {
    backgroundColor: "#F8F4FF",
    borderRadius: 14,
    paddingHorizontal: 12
  },
  selectorLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.text
  },
  selectorLabelActive: {
    color: theme.colors.primary
  },
  selectorMeta: {
    marginTop: 4,
    fontSize: 12,
    color: theme.colors.muted
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  rowEmoji: {
    color: theme.colors.success,
    fontSize: 18
  },
  rowLabel: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "700"
  },
  settingsSectionTitle: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: "800"
  },
  settingsSectionSubtitle: {
    color: theme.colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6
  },
  settingsStack: {
    marginTop: 18,
    gap: 14
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14
  },
  settingLinkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14
  },
  settingCopy: {
    flex: 1
  },
  settingHelper: {
    marginTop: 4,
    color: theme.colors.muted,
    fontSize: 13,
    lineHeight: 18
  },
  settingChevron: {
    color: "#A692B5",
    fontSize: 28,
    lineHeight: 28,
    fontWeight: "400"
  },
  destructiveSettingsCard: {
    borderColor: "#F2D5DF"
  },
  destructiveSettingText: {
    color: theme.colors.danger
  },
  gridTwo: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  optionCard: {
    width: "48%",
    backgroundColor: theme.colors.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#F3F0FF"
  },
  optionCardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: "#F8F4FF"
  },
  optionEmoji: {
    fontSize: 28,
    marginBottom: 12
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text
  },
  optionDesc: {
    fontSize: 13,
    color: theme.colors.muted,
    marginTop: 4
  },
  imageUploader: {
    minHeight: 180,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E9D5FF",
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    overflow: "hidden"
  },
  imageUploaderText: {
    marginTop: 8,
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700"
  },
  profileUploadPreview: {
    width: "100%",
    height: 220,
    borderRadius: 20
  },
  readOnlyField: {
    minHeight: 58,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E9D5FF",
    backgroundColor: "#F5F3FF",
    paddingHorizontal: 18,
    justifyContent: "center",
    marginBottom: 2
  },
  dateField: {
    minHeight: 58,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E9D5FF",
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 18,
    justifyContent: "center"
  },
  readOnlyValue: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600"
  },
  placeholderText: {
    color: theme.colors.muted,
    fontSize: 16,
    fontWeight: "500"
  },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  doneTitle: {
    color: theme.colors.text,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "800",
    marginBottom: 6
  },
  studentIdPreview: {
    width: "100%",
    aspectRatio: 1.6,
    borderRadius: 18,
    backgroundColor: "#EEE7FF"
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F0FF"
  },
  detailLabel: {
    flex: 1,
    color: theme.colors.muted,
    fontSize: 13,
    fontWeight: "700"
  },
  detailValue: {
    flex: 1,
    textAlign: "right",
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "600"
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 10, 30, 0.42)",
    justifyContent: "center",
    padding: 24
  },
  reportKeyboardWrap: {
    width: "100%",
    justifyContent: "center"
  },
  reportHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16
  },
  reportHeaderTextWrap: {
    flex: 1
  },
  reportCloseButton: {
    width: 54,
    height: 54,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6EEFF",
    borderWidth: 1,
    borderColor: "rgba(240,216,242,0.94)"
  },
  reportCloseButtonText: {
    color: "#8E809D",
    fontSize: 24,
    fontWeight: "700"
  },
  modalCard: {
    maxHeight: "70%",
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    padding: 20
  },
  modalList: {
    marginTop: 8
  },
  modalOption: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16
  },
  modalOptionActive: {
    backgroundColor: "#F6EEFF"
  },
  iosDatePicker: {
    alignSelf: "stretch",
    marginTop: 12
  },
  datePickerActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 12
  },
  secondaryActionButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#F6EEFF"
  },
  secondaryActionText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "700"
  },
  modalCloseButton: {
    alignSelf: "flex-end",
    minWidth: 120,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    shadowColor: "#D76BA3",
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18
  },
  discoverFullScreen: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: TOP_SAFE_INSET + 10,
    paddingBottom: 122
  },
  discoverTopRail: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 14
  },
  discoverCountPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.62)",
    borderWidth: 1,
    borderColor: "rgba(240,93,156,0.16)"
  },
  discoverCountText: {
    color: "#7C678C",
    fontSize: 12,
    fontWeight: "700"
  },
  topActionRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
    marginTop: 16,
    marginBottom: 12
  },
  topActionButton: {
    width: 58,
    height: 58,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.34)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.72)",
    shadowColor: "#D76BA3",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4
  },
  topNopeButton: {
    shadowColor: "#F05D9C"
  },
  topSuperButton: {
    shadowColor: "#F5A14A"
  },
  topLikeButton: {
    shadowColor: "#8FD84F"
  },
  topActionIcon: {
    fontSize: 24,
    fontWeight: "900"
  },
  discoverRefreshTopButton: {
    width: 42,
    height: 42,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.82)",
    borderWidth: 1,
    borderColor: "rgba(240,93,156,0.14)"
  },
  discoverRefreshTopIcon: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "700"
  },
  discoverCardStage: {
    flex: 1
  },
  cardImageTopRight: {
    position: "absolute",
    top: 16,
    right: 16
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.text
  },
  miniText: {
    color: theme.colors.muted,
    fontSize: 12
  },
  swipeCampusBadge: {
    minHeight: 42,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.58)",
    borderWidth: 1,
    borderColor: "rgba(240,93,156,0.18)",
    shadowColor: "#F05D9C",
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3
  },
  swipeCampusBadgeText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "700"
  },
  profileEditButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#F3F0FF",
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  profileEditIcon: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "800"
  },
  profileEditText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "700"
  },
  glassPlusBadge: {
    minHeight: 48,
    paddingHorizontal: 18,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(124,58,237,0.12)",
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.22)"
  },
  glassPlusBadgeText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "800"
  },
  plusPill: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(124,58,237,0.10)",
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.22)"
  },
  plusPillText: {
    color: theme.colors.primary,
    fontSize: 26,
    lineHeight: 26,
    fontWeight: "600",
    marginTop: -2
  },
  swipeGlassShell: {
    marginTop: 6,
    borderRadius: 34,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.68)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.78)",
    shadowColor: "#D76BA3",
    shadowOpacity: 0.16,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 12 },
    elevation: 5
  },
  tinderCardShell: {
    flex: 1,
    borderRadius: 34,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.72)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.88)",
    shadowColor: "#D76BA3",
    shadowOpacity: 0.18,
    shadowRadius: 34,
    shadowOffset: { width: 0, height: 18 },
    elevation: 6
  },
  tinderCardImageStage: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#F7D9EA"
  },
  tinderCardImageStageExpanded: {
    minHeight: 520
  },
  tinderCardImage: {
    borderRadius: 34
  },
  tinderTopMeta: {
    paddingHorizontal: 14,
    paddingTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  cardTopActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  tinderPhotoBars: {
    flex: 1,
    flexDirection: "row",
    gap: 6,
    marginRight: 12
  },
  tinderPhotoBar: {
    flex: 1,
    height: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.34)"
  },
  tinderPhotoBarActive: {
    backgroundColor: "rgba(255,255,255,0.96)"
  },
  tinderCampusGhost: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)"
  },
  tinderCampusGhostText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700"
  },
  viewEyeButton: {
    width: 52,
    height: 52,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.44)",
    shadowColor: "#FFFFFF",
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 }
  },
  viewEyeButtonIcon: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800"
  },
  collapsedCardFooter: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 68,
    paddingBottom: 22
  },
  collapsedIdentityBlock: {
    flex: 1,
    maxWidth: "74%",
    paddingRight: 14
  },
  collapsedIdentityName: {
    color: "#FFFFFF",
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "800"
  },
  tinderBottomOverlay: {
    paddingHorizontal: 18,
    paddingTop: 42,
    paddingBottom: 22
  },
  swipeGestureBadge: {
    position: "absolute",
    top: 84,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 14,
    borderWidth: 2,
    backgroundColor: "rgba(255,255,255,0.16)"
  },
  swipeGestureNope: {
    left: 18,
    borderColor: "rgba(244,91,122,0.95)",
    transform: [{ rotate: "-12deg" }]
  },
  swipeGestureLike: {
    right: 18,
    borderColor: "rgba(143,216,79,0.95)",
    transform: [{ rotate: "12deg" }]
  },
  swipeGestureSuper: {
    alignSelf: "center",
    borderColor: "rgba(244,162,97,0.95)"
  },
  swipeGestureBadgeText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 1.2
  },
  swipeBurst: {
    position: "absolute",
    top: "42%",
    width: 96,
    height: 96,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)"
  },
  dislikeBurst: {
    left: 28
  },
  likeBurst: {
    right: 28
  },
  swipeBurstIcon: {
    fontSize: 44,
    fontWeight: "900",
    color: "#F45B7A"
  },
  likeBurstIcon: {
    color: "#8FD84F"
  },
  tinderInfoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)"
  },
  tinderInfoBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700"
  },
  tinderInfoBadgeMuted: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(18,10,26,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)"
  },
  tinderInfoBadgeMutedText: {
    color: "#F8ECFF",
    fontSize: 12,
    fontWeight: "700"
  },
  tinderCardTitle: {
    color: "#FFFFFF",
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "800",
    marginTop: 12
  },
  tinderCardMeta: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 14,
    marginTop: 6,
    fontWeight: "600"
  },
  tinderCardBody: {
    color: "rgba(255,255,255,0.84)",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10
  },
  tinderInterestRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14
  },
  tinderInterestChip: {
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)"
  },
  tinderInterestChipText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700"
  },
  tinderActionDock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: "rgba(35,20,44,0.88)",
    shadowColor: "#2A1537",
    shadowOpacity: 0.22,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 14 },
    elevation: 7
  },
  tinderActionButton: {
    width: 68,
    height: 68,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0D0A10"
  },
  tinderNopeButton: {
    borderWidth: 1,
    borderColor: "rgba(255,64,139,0.24)"
  },
  tinderSuperButton: {
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.24)"
  },
  tinderLikeButton: {
    borderWidth: 1,
    borderColor: "rgba(143,216,79,0.24)"
  },
  tinderActionIcon: {
    fontSize: 32,
    fontWeight: "800"
  },
  tinderMessagePill: {
    flex: 1,
    height: 68,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0D0A10",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)"
  },
  tinderMessagePillText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600"
  },
  tinderFeedbackText: {
    textAlign: "center",
    color: theme.colors.primary,
    fontWeight: "700",
    marginTop: 10
  },
  profileExpandInsideCard: {
    overflow: "hidden",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    backgroundColor: "rgba(255,255,255,0.96)",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 18
  },
  expandHandle: {
    alignSelf: "center",
    width: 46,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#DDD1EA",
    marginBottom: 14
  },
  expandCloseButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(243,240,255,0.92)",
    borderWidth: 1,
    borderColor: "rgba(240,216,242,0.94)"
  },
  expandCloseButtonText: {
    color: "#8E809D",
    fontSize: 18,
    fontWeight: "800"
  },
  profileExpandName: {
    color: theme.colors.text,
    fontSize: 26,
    lineHeight: 30,
    fontWeight: "800"
  },
  profileExpandBio: {
    marginTop: 8,
    color: "#695B77",
    fontSize: 15,
    lineHeight: 22
  },
  profileExpandCollege: {
    marginTop: 14,
    color: theme.colors.text,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600"
  },
  profileExpandDegreePill: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(124,58,237,0.08)",
    borderWidth: 1,
    borderColor: "rgba(240,216,242,0.94)"
  },
  profileExpandDegreeText: {
    color: "#6F4DD8",
    fontSize: 14,
    fontWeight: "700"
  },
  profileMetaPills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14,
    marginBottom: 14
  },
  profileMetaPill: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.88)",
    borderWidth: 1,
    borderColor: "rgba(240,216,242,0.96)"
  },
  profileMetaPillText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "700"
  },
  profileExpandInterests: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  cardActionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 24,
    marginBottom: 16,
    paddingHorizontal: 44
  },
  profileExpandInterestChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(124,58,237,0.08)",
    borderWidth: 1,
    borderColor: "rgba(240,216,242,0.96)"
  },
  profileExpandInterestText: {
    color: "#6F4DD8",
    fontSize: 13,
    fontWeight: "700"
  },
  swipeCardImageStage: {
    height: 380,
    justifyContent: "flex-end",
    backgroundColor: "#F7D9EA"
  },
  swipeCardImage: {
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34
  },
  swipeImageGlow: {
    ...StyleSheet.absoluteFillObject
  },
  swipeInfoPanel: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20
  },
  discoverBadgeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12
  },
  softBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(124,58,237,0.12)",
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.12)"
  },
  softBadgeText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "700"
  },
  softBadgeMuted: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(240,93,156,0.08)",
    borderWidth: 1,
    borderColor: "rgba(240,93,156,0.12)"
  },
  softBadgeMutedText: {
    color: "#9D4E7A",
    fontSize: 12,
    fontWeight: "700"
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "800"
  },
  cardMeta: {
    color: "#F3E8FF",
    fontSize: 13,
    marginTop: 6
  },
  swipeCardTitle: {
    color: theme.colors.text,
    fontSize: 31,
    lineHeight: 35,
    fontWeight: "800"
  },
  swipeCardMeta: {
    color: "#7D6A89",
    fontSize: 13,
    marginTop: 6
  },
  swipeCardBody: {
    color: "#5D4E68",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
    marginBottom: 14
  },
  softInterestTag: {
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.76)",
    borderWidth: 1,
    borderColor: "rgba(240,216,242,0.96)"
  },
  softInterestTagText: {
    color: "#6E5A7F",
    fontSize: 12,
    fontWeight: "600"
  },
  swipeActionDeck: {
    marginTop: 18,
    marginBottom: 8,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.56)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.72)"
  },
  swipeActionHint: {
    textAlign: "center",
    color: "#8E809D",
    fontSize: 13,
    fontWeight: "600"
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 18,
    paddingTop: 16
  },
  actionCircle: {
    width: 68,
    height: 68,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.88)",
    shadowColor: "#D76BA3",
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3
  },
  actionCircleText: {
    fontSize: 28,
    fontWeight: "800"
  },
  feedbackText: {
    textAlign: "center",
    color: theme.colors.primary,
    fontWeight: "700",
    marginBottom: 18
  },
  swipeEmptyState: {
    flex: 1,
    minHeight: 620,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 24,
    paddingBottom: 120
  },
  refreshOrb: {
    width: 82,
    height: 82,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "rgba(124,58,237,0.24)",
    backgroundColor: "rgba(124,58,237,0.06)",
    alignItems: "center",
    justifyContent: "center"
  },
  refreshOrbIcon: {
    color: theme.colors.primary,
    fontSize: 32,
    fontWeight: "700"
  },
  refreshOrbLabel: {
    marginTop: 10,
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "700"
  },
  sectionCaption: {
    color: "#8E809D",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 10,
    letterSpacing: 0.8
  },
  swipePreviewCard: {
    marginBottom: 12,
    padding: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(240,216,242,0.92)",
    backgroundColor: "rgba(255,255,255,0.70)",
    flexDirection: "row",
    gap: 12,
    alignItems: "center"
  },
  swipePreviewAvatar: {
    width: 62,
    height: 62,
    borderRadius: 20
  },
  swipePreviewBody: {
    marginTop: 4,
    color: "#8E809D",
    fontSize: 12,
    lineHeight: 18
  },
  segmentRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 18
  },
  listSectionTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
    marginTop: 4
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "#F3F4F6"
  },
  segmentButtonActive: {
    backgroundColor: theme.colors.primary
  },
  segmentText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280"
  },
  segmentTextActive: {
    color: "#fff"
  },
  matchCard: {
    width: "48%",
    height: 220,
    borderRadius: 24,
    overflow: "hidden"
  },
  matchImage: {
    width: "100%",
    height: "100%"
  },
  matchOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 14
  },
  matchName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800"
  },
  matchMajor: {
    color: "#DDD6FE",
    fontSize: 13
  },
  searchInput: {
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
    color: theme.colors.text
  },
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6"
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26
  },
  unreadBubble: {
    marginTop: 6,
    minWidth: 22,
    height: 22,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary
  },
  unreadText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700"
  },
  messageMetaRow: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10
  },
  messageStatusText: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 11,
    fontWeight: "700"
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: TOP_SAFE_INSET + 10,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: theme.colors.surface
  },
  chatProfileTrigger: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  messageBubble: {
    maxWidth: "78%",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: theme.colors.primary
  },
  theirMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#fff"
  },
  messageText: {
    color: theme.colors.text,
    fontSize: 14,
    lineHeight: 20
  },
  messageTime: {
    marginTop: 6,
    color: theme.colors.muted,
    fontSize: 11
  },
  quickReplyRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 12
  },
  composerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 22,
    paddingTop: 10,
    backgroundColor: theme.colors.surface
  },
  composerInput: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 14,
    color: theme.colors.text
  },
  sendButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: theme.colors.primary
  },
  cardBodyDark: {
    color: "#374151",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 14
  },
  actionMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    marginTop: 14
  },
  feedAction: {
    paddingVertical: 4
  },
  feedActionActive: {
    color: theme.colors.secondary
  },
  linkText: {
    color: theme.colors.muted,
    fontSize: 13,
    fontWeight: "600"
  },
  smallActionButton: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999
  },
  smallActionText: {
    color: "#FFFFFF",
    fontWeight: "700"
  },
  groupEmoji: {
    fontSize: 26
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16
  },
  photoTile: {
    width: "31%",
    aspectRatio: 1,
    borderRadius: 18
  },
  scoreText: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "800",
    marginTop: 8
  },
  statValue: {
    color: theme.colors.primary,
    fontSize: 28,
    fontWeight: "800",
    marginTop: 6
  },
  bottomTabs: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.58)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.78)",
    shadowColor: "#D76BA3",
    shadowOpacity: 0.12,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    gap: 3,
    paddingVertical: 7,
    borderRadius: 16
  },
  tabIcon: {
    fontSize: 18,
    opacity: 0.55
  },
  tabLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "600"
  },
  tabLabelActive: {
    color: theme.colors.primary
  },
  bottomTabBadge: {
    position: "absolute",
    top: 8,
    right: 22,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.danger
  },
  bottomTabBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800"
  },
  tabItemActive: {
    backgroundColor: "rgba(255,255,255,0.44)",
    borderWidth: 1,
    borderColor: "rgba(240,93,156,0.12)"
  },
  feedSheet: {
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    padding: 20,
    maxHeight: "64%"
  },
  feedSheetLarge: {
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    padding: 20,
    maxHeight: "84%"
  },
  featurePopup: {
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    padding: 22,
    width: "100%",
    maxWidth: 360,
    alignSelf: "center"
  },
  chatMenuSheet: {
    marginTop: 90,
    marginLeft: "auto",
    width: 220,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(240,216,242,0.9)"
  },
  chatMenuItem: {
    paddingHorizontal: 18,
    paddingVertical: 14
  },
  chatMenuText: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "700"
  },
  profileModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10
  },
  profileModalCloseButton: {
    width: 52,
    height: 52,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6EEFF",
    borderWidth: 1,
    borderColor: "rgba(240,216,242,0.94)",
    flexShrink: 0
  },
  profileModalCloseButtonText: {
    color: "#8E809D",
    fontSize: 24,
    fontWeight: "700"
  },
  chatProfileHero: {
    width: "100%",
    height: 280,
    borderRadius: 24
  },
  feedSheetActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 14
  },
  reportActionRow: {
    flexDirection: "row",
    gap: 14,
    marginTop: 18
  },
  reportActionButton: {
    flex: 1,
    minHeight: 60,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center"
  },
  reportActionButtonSecondary: {
    backgroundColor: "#F6EEFF"
  },
  reportActionButtonPrimary: {
    backgroundColor: theme.colors.primary
  },
  reportActionTextSecondary: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "700"
  },
  reportActionTextPrimary: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700"
  },
  feedModalRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 10
  },
  commentThread: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F0FF"
  },
  commentMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 6
  },
  glassAttachButton: {
    minHeight: 44,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(124,58,237,0.08)",
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.18)"
  },
  glassAttachText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "700"
  },
  composerImagePreview: {
    width: "100%",
    height: 180,
    borderRadius: 20,
    marginTop: 12
  },
  feedImage: {
    width: "100%",
    height: 220,
    borderRadius: 20,
    marginTop: 14
  },
  replyLink: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: "700"
  }
});
