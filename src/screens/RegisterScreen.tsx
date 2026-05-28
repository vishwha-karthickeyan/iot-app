import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Animated,
  ScrollView,
  StatusBar,
} from "react-native";
import { COLORS, SPACING, RADIUS } from "../constants/theme";
import { AuthService } from "../services/api";

const StrengthBar = ({ password }: { password: string }) => {
  const len = password.length;
  const level = len === 0 ? 0 : len < 6 ? 1 : len < 10 ? 2 : 3;
  const colors = ["", COLORS.danger, COLORS.warning, COLORS.success];
  const labels = ["", "Weak", "Fair", "Strong"];
  return level > 0 ? (
    <View style={str.row}>
      {[1, 2, 3].map((i) => (
        <View key={i} style={[str.bar, { backgroundColor: i <= level ? colors[level] : COLORS.border }]} />
      ))}
      <Text style={[str.label, { color: colors[level] }]}>{labels[level]}</Text>
    </View>
  ) : null;
};

const str = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 8 },
  bar: { width: 30, height: 4, borderRadius: 2 },
  label: { fontSize: 11, fontWeight: "700", marginLeft: 4 },
});

export default function RegisterScreen({ navigation }: any) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () =>
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 55, useNativeDriver: true }),
    ]).start();

  const handleRegister = async () => {
    if (!username.trim() || !password.trim() || !confirm.trim()) {
      shake(); Alert.alert("Missing Fields", "Please fill all fields."); return;
    }
    if (password !== confirm) {
      shake(); Alert.alert("Mismatch", "Passwords do not match."); return;
    }
    if (password.length < 6) {
      shake(); Alert.alert("Weak Password", "Use at least 6 characters."); return;
    }
    setLoading(true);
    try {
      await AuthService.register(username, password);
      Alert.alert("✅ Account Created!", "You can now sign in.", [
        { text: "Go to Login", onPress: () => navigation.replace("Login") },
      ]);
    } catch {
      shake(); Alert.alert("Error", "Username may already be taken.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field: string) => [
    styles.inputWrap,
    focusedField === field && styles.inputWrapFocused,
  ];

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.titleRow}>
            <View style={styles.iconBadge}>
              <Text style={{ fontSize: 26 }}>🌿</Text>
            </View>
            <View>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join SmartFarm today</Text>
            </View>
          </View>
        </View>

        {/* Progress Steps */}
        <View style={styles.steps}>
          {["Profile", "Security", "Done"].map((s, i) => (
            <React.Fragment key={s}>
              <View style={styles.stepItem}>
                <View style={[styles.stepCircle, i < 2 && styles.stepCircleActive]}>
                  <Text style={[styles.stepNum, i < 2 && styles.stepNumActive]}>{i + 1}</Text>
                </View>
                <Text style={[styles.stepLabel, i < 2 && styles.stepLabelActive]}>{s}</Text>
              </View>
              {i < 2 && <View style={[styles.stepBar, i === 0 && styles.stepBarActive]} />}
            </React.Fragment>
          ))}
        </View>

        <Animated.View style={[styles.card, { transform: [{ translateX: shakeAnim }] }]}>

          {/* Username */}
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Username</Text>
            <View style={inputStyle("u")}>
              <Text style={styles.icon}>👤</Text>
              <TextInput
                style={styles.input}
                placeholder="Choose a username"
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize="none"
                value={username}
                onChangeText={setUsername}
                onFocus={() => setFocusedField("u")}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Password</Text>
            <View style={inputStyle("p")}>
              <Text style={styles.icon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry={!showPass}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedField("p")}
                onBlur={() => setFocusedField(null)}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Text style={{ fontSize: 16 }}>{showPass ? "🙈" : "👁️"}</Text>
              </TouchableOpacity>
            </View>
            <StrengthBar password={password} />
          </View>

          {/* Confirm */}
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={[
              inputStyle("c"),
              confirm.length > 0 && confirm !== password && styles.inputWrapError,
            ]}>
              <Text style={styles.icon}>✅</Text>
              <TextInput
                style={styles.input}
                placeholder="Repeat your password"
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry
                value={confirm}
                onChangeText={setConfirm}
                onFocus={() => setFocusedField("c")}
                onBlur={() => setFocusedField(null)}
              />
            </View>
            {confirm.length > 0 && confirm !== password && (
              <Text style={styles.errorText}>⚠ Passwords don't match</Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleRegister}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Create Account →</Text>}
          </TouchableOpacity>

          <Text style={styles.terms}>
            By registering you agree to our{" "}
            <Text style={styles.termsLink}>Terms</Text> &{" "}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </Animated.View>

        <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginLinkText}>
            Already have an account? <Text style={{ color: COLORS.primary, fontWeight: "700" }}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  header: { marginBottom: SPACING.xl },
  backBtn: { marginBottom: SPACING.lg },
  backArrow: { color: COLORS.primary, fontSize: 15, fontWeight: "700" },
  titleRow: { flexDirection: "row", alignItems: "center", gap: SPACING.md },
  iconBadge: {
    width: 56, height: 56, borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1.5, borderColor: COLORS.primaryMid,
    alignItems: "center", justifyContent: "center",
  },
  title: { color: COLORS.textPrimary, fontSize: 24, fontWeight: "800" },
  subtitle: { color: COLORS.textSecondary, fontSize: 13, marginTop: 2 },
  steps: {
    flexDirection: "row", alignItems: "center",
    marginBottom: SPACING.xl, paddingHorizontal: 4,
  },
  stepItem: { alignItems: "center", gap: 4 },
  stepCircle: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: COLORS.bgMuted,
    borderWidth: 1.5, borderColor: COLORS.border,
    alignItems: "center", justifyContent: "center",
  },
  stepCircleActive: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary },
  stepNum: { color: COLORS.textMuted, fontSize: 12, fontWeight: "700" },
  stepNumActive: { color: COLORS.primary },
  stepLabel: { color: COLORS.textMuted, fontSize: 10, fontWeight: "600" },
  stepLabelActive: { color: COLORS.primary },
  stepBar: { flex: 1, height: 2, backgroundColor: COLORS.border, marginHorizontal: 4, marginBottom: 14 },
  stepBarActive: { backgroundColor: COLORS.primaryMid },
  card: {
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.xl,
    padding: SPACING.xl, borderWidth: 1, borderColor: COLORS.border,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1, shadowRadius: 20, elevation: 4, marginBottom: SPACING.lg,
  },
  fieldWrap: { marginBottom: SPACING.md },
  label: {
    color: COLORS.textSecondary, fontSize: 12, fontWeight: "700",
    letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 7,
  },
  inputWrap: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md,
    borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: SPACING.md,
  },
  inputWrapFocused: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  inputWrapError: { borderColor: COLORS.danger, backgroundColor: COLORS.dangerLight },
  icon: { fontSize: 16, marginRight: 8 },
  input: { flex: 1, color: COLORS.textPrimary, paddingVertical: 14, fontSize: 15 },
  errorText: { color: COLORS.danger, fontSize: 11, marginTop: 5 },
  btn: {
    backgroundColor: COLORS.primary, padding: 16, borderRadius: RADIUS.md,
    alignItems: "center", marginTop: SPACING.sm,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 5,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  terms: { color: COLORS.textMuted, fontSize: 11, textAlign: "center", marginTop: SPACING.md, lineHeight: 18 },
  termsLink: { color: COLORS.primary, fontWeight: "600" },
  loginLink: { alignItems: "center", paddingVertical: SPACING.sm },
  loginLinkText: { color: COLORS.textSecondary, fontSize: 14 },
});