// import React, { useEffect, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Dimensions,
//   Alert,
//   Animated,
//   Modal,
//   StatusBar,
// } from "react-native";
// import { LineChart } from "react-native-chart-kit";
// import { COLORS, SPACING, RADIUS } from "../constants/theme";
// import { AuthService, WS_URL, BASE_URL } from "../services/api";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const screenWidth = Dimensions.get("window").width;

// // ─── Calendar ─────────────────────────────────────────────────────────────────
// const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
// const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// function CalendarPicker({
//   visible,
//   selectedDate,
//   onSelect,
//   onClose,
// }: {
//   visible: boolean;
//   selectedDate: Date;
//   onSelect: (d: Date) => void;
//   onClose: () => void;
// }) {
//   const [viewMonth, setViewMonth] = useState(new Date(selectedDate));
//   const year = viewMonth.getFullYear();
//   const month = viewMonth.getMonth();
//   const firstDay = new Date(year, month, 1).getDay();
//   const daysInMonth = new Date(year, month + 1, 0).getDate();
//   const today = new Date();

//   const cells: (number | null)[] = [
//     ...Array(firstDay).fill(null),
//     ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
//   ];
//   while (cells.length % 7 !== 0) cells.push(null);

//   const isSame = (d: number) =>
//     selectedDate.getFullYear() === year &&
//     selectedDate.getMonth() === month &&
//     selectedDate.getDate() === d;

//   const isTodayCell = (d: number) =>
//     today.getFullYear() === year &&
//     today.getMonth() === month &&
//     today.getDate() === d;

//   const isFuture = (d: number) => new Date(year, month, d) > today;

//   return (
//     <Modal visible={visible} transparent animationType="fade">
//       <TouchableOpacity style={cal.backdrop} activeOpacity={1} onPress={onClose}>
//         <TouchableOpacity activeOpacity={1} style={cal.sheet}>
//           {/* Month Nav */}
//           <View style={cal.nav}>
//             <TouchableOpacity onPress={() => setViewMonth(new Date(year, month - 1, 1))} style={cal.navBtn}>
//               <Text style={cal.navArrow}>‹</Text>
//             </TouchableOpacity>
//             <Text style={cal.monthLabel}>{MONTHS[month]} {year}</Text>
//             <TouchableOpacity
//               onPress={() => setViewMonth(new Date(year, month + 1, 1))}
//               style={cal.navBtn}
//               disabled={year === today.getFullYear() && month >= today.getMonth()}
//             >
//               <Text style={[
//                 cal.navArrow,
//                 year === today.getFullYear() && month >= today.getMonth() && { opacity: 0.3 },
//               ]}>›</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Day Headers */}
//           <View style={cal.row}>
//             {DAYS.map((d) => <Text key={d} style={cal.dayHeader}>{d}</Text>)}
//           </View>

//           {/* Date Grid */}
//           {Array.from({ length: cells.length / 7 }).map((_, rowIdx) => (
//             <View key={rowIdx} style={cal.row}>
//               {cells.slice(rowIdx * 7, rowIdx * 7 + 7).map((day, colIdx) => {
//                 if (!day) return <View key={colIdx} style={cal.cell} />;
//                 const future = isFuture(day);
//                 const selected = isSame(day);
//                 const todayCell = isTodayCell(day);
//                 return (
//                   <TouchableOpacity
//                     key={colIdx}
//                     style={[cal.cell, selected && cal.cellSelected, todayCell && !selected && cal.cellToday]}
//                     onPress={() => { if (!future) { onSelect(new Date(year, month, day)); onClose(); } }}
//                     disabled={future}
//                   >
//                     <Text style={[
//                       cal.cellText,
//                       selected && cal.cellTextSelected,
//                       future && cal.cellTextFuture,
//                       todayCell && !selected && cal.cellTextToday,
//                     ]}>{day}</Text>
//                   </TouchableOpacity>
//                 );
//               })}
//             </View>
//           ))}

//           <TouchableOpacity
//             style={cal.todayBtn}
//             onPress={() => { onSelect(new Date()); onClose(); }}
//           >
//             <Text style={cal.todayBtnText}>Jump to Today</Text>
//           </TouchableOpacity>
//         </TouchableOpacity>
//       </TouchableOpacity>
//     </Modal>
//   );
// }

// const cal = StyleSheet.create({
//   backdrop: { flex: 1, backgroundColor: "rgba(15,45,30,0.35)", justifyContent: "center", alignItems: "center" },
//   sheet: {
//     backgroundColor: COLORS.bgCard, borderRadius: RADIUS.xl,
//     padding: SPACING.lg, width: screenWidth - 48,
//     borderWidth: 1, borderColor: COLORS.border,
//     shadowColor: "#000", shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.15, shadowRadius: 24, elevation: 10,
//   },
//   nav: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: SPACING.md },
//   navBtn: { padding: 8 },
//   navArrow: { fontSize: 24, color: COLORS.primary, fontWeight: "700" },
//   monthLabel: { color: COLORS.textPrimary, fontSize: 16, fontWeight: "800" },
//   row: { flexDirection: "row", marginBottom: 4 },
//   dayHeader: { flex: 1, textAlign: "center", color: COLORS.textSecondary, fontSize: 11, fontWeight: "700", paddingVertical: 4 },
//   cell: { flex: 1, height: 36, alignItems: "center", justifyContent: "center", borderRadius: RADIUS.sm },
//   cellSelected: { backgroundColor: COLORS.primary },
//   cellToday: { backgroundColor: COLORS.primaryLight, borderWidth: 1.5, borderColor: COLORS.primaryMid },
//   cellText: { color: COLORS.textPrimary, fontSize: 13, fontWeight: "600" },
//   cellTextSelected: { color: "#fff", fontWeight: "800" },
//   cellTextFuture: { color: COLORS.textMuted },
//   cellTextToday: { color: COLORS.primary, fontWeight: "800" },
//   todayBtn: {
//     marginTop: SPACING.md, alignItems: "center", paddingVertical: 10,
//     borderRadius: RADIUS.md, backgroundColor: COLORS.primaryLight,
//     borderWidth: 1, borderColor: COLORS.primaryMid,
//   },
//   todayBtnText: { color: COLORS.primary, fontWeight: "700", fontSize: 14 },
// });

// // ─── Stat Card ────────────────────────────────────────────────────────────────
// const StatCard = ({
//   label, value, unit, icon, bg, textColor, alert,
// }: {
//   label: string; value: number; unit: string;
//   icon: string; bg: string; textColor: string; alert?: boolean;
// }) => {
//   const pulse = useRef(new Animated.Value(1)).current;
//   useEffect(() => {
//     if (alert) {
//       Animated.loop(
//         Animated.sequence([
//           Animated.timing(pulse, { toValue: 1.03, duration: 700, useNativeDriver: true }),
//           Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
//         ])
//       ).start();
//     } else {
//       pulse.stopAnimation();
//       pulse.setValue(1);
//     }
//   }, [alert]);

//   return (
//     <Animated.View style={[
//       s.statCard,
//       { backgroundColor: bg, borderColor: alert ? COLORS.danger : COLORS.border },
//       { transform: [{ scale: pulse }] },
//     ]}>
//       <Text style={s.statIcon}>{icon}</Text>
//       <Text style={s.statLabel}>{label}</Text>
//       <View style={s.statValRow}>
//         <Text style={[s.statVal, { color: textColor }]}>{value.toFixed(1)}</Text>
//         <Text style={[s.statUnit, { color: textColor }]}>{unit}</Text>
//       </View>
//       {alert && (
//         <View style={s.alertPill}>
//           <Text style={s.alertPillText}>⚠ HIGH</Text>
//         </View>
//       )}
//     </Animated.View>
//   );
// };

// // ─── Home Screen ──────────────────────────────────────────────────────────────
// export default function HomeScreen({ navigation }: any) {
//   const [temperature, setTemperature] = useState(0);
//   const [humidity, setHumidity] = useState(0);
//   const [soilMoisture, setSoilMoisture] = useState(0);
//   const [tempHistory, setTempHistory] = useState<number[]>([0]);

//   const [wsStatus, setWsStatus] = useState<"connecting" | "live" | "offline">("connecting");
//   const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [calVisible, setCalVisible] = useState(false);
//   const [historicalData, setHistoricalData] = useState<any[]>([]);
//   const [loadingHistory, setLoadingHistory] = useState(false);

//   const isToday = selectedDate.toDateString() === new Date().toDateString();

//   const dotAnim = useRef(new Animated.Value(0.4)).current;
//   useEffect(() => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(dotAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
//         Animated.timing(dotAnim, { toValue: 0.4, duration: 900, useNativeDriver: true }),
//       ])
//     ).start();
//   }, []);

//   // ── Live WebSocket (only when viewing today) ──
//   useEffect(() => {
//     if (!isToday) return;

//     setWsStatus("connecting");
//     const ws = new WebSocket(WS_URL);

//     ws.onopen = () => setWsStatus("live");
//     ws.onclose = () => setWsStatus("offline");
//     ws.onerror = () => setWsStatus("offline");

//     ws.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         const temp = data.temperature ?? 0;
//         setTemperature(temp);
//         setHumidity(data.humidity ?? 0);
//         setSoilMoisture(data.soilMoisture ?? 0);
//         setLastUpdated(new Date());
//         setTempHistory((prev) => [...prev, temp].slice(-12));
//         if (temp > 35) Alert.alert("⚠️ High Temperature!", `${temp}°C detected`);
//       } catch {}
//     };

//     return () => ws.close();
//   }, [isToday]);

//   // ── Fetch historical data for past date ──
//   useEffect(() => {
//     if (isToday) {
//       setHistoricalData([]);
//       return;
//     }
//     const fetchHistory = async () => {
//       setLoadingHistory(true);
//       try {
//         const token = await AsyncStorage.getItem("token");
//         const dateStr = selectedDate.toISOString().split("T")[0];
//         const res = await fetch(`${BASE_URL}/history?date=${dateStr}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const json = await res.json();
//         const records = Array.isArray(json) ? json : [];
//         setHistoricalData(records);

//         if (records.length > 0) {
//           const last = records[records.length - 1];
//           setTemperature(last.temperature ?? 0);
//           setHumidity(last.humidity ?? 0);
//           setSoilMoisture(last.soilMoisture ?? 0);
//           setTempHistory(records.map((d: any) => d.temperature ?? 0).slice(-12));
//         } else {
//           setTemperature(0);
//           setHumidity(0);
//           setSoilMoisture(0);
//           setTempHistory([0]);
//         }
//       } catch {
//         setHistoricalData([]);
//       } finally {
//         setLoadingHistory(false);
//       }
//     };
//     fetchHistory();
//   }, [selectedDate]);

//   const handleLogout = () =>
//     Alert.alert("Logout", "Are you sure you want to sign out?", [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Sign Out", style: "destructive",
//         onPress: async () => { await AuthService.logout(); navigation.replace("Login"); },
//       },
//     ]);

//   const formatDate = (d: Date) =>
//     d.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

//   // Computed stats from real data
//   const avgTemp = tempHistory.length
//     ? tempHistory.reduce((a, b) => a + b, 0) / tempHistory.length
//     : 0;
//   const peakTemp = tempHistory.length ? Math.max(...tempHistory) : 0;
//   const totalReadings = isToday ? tempHistory.length : historicalData.length;

//   const chartData = tempHistory.length > 1 ? tempHistory : [0, 0];
//   const statusColor =
//     wsStatus === "live" ? COLORS.success :
//     wsStatus === "connecting" ? COLORS.warning :
//     COLORS.danger;

//   return (
//     <View style={s.root}>
//       <StatusBar barStyle="dark-content" backgroundColor={COLORS.bgCard} />

//       {/* ── App Bar ── */}
//       <View style={s.appBar}>
//         <View>
//           <Text style={s.appBarTitle}>🌾 SmartFarm</Text>
//           <Text style={s.appBarSub}>Field Monitor</Text>
//         </View>
//         <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
//           <Text style={s.logoutText}>Sign Out</Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

//         {/* ── Date Selector ── */}
//         <TouchableOpacity style={s.datePicker} onPress={() => setCalVisible(true)} activeOpacity={0.8}>
//           <View style={s.dateLeft}>
//             <Text style={s.dateIcon}>📅</Text>
//             <View>
//               <Text style={s.dateLabel}>{isToday ? "Today · Live" : "Viewing Date"}</Text>
//               <Text style={s.dateValue}>{formatDate(selectedDate)}</Text>
//             </View>
//           </View>
//           <View style={s.dateChevron}>
//             <Text style={s.dateChevronText}>▾</Text>
//           </View>
//         </TouchableOpacity>

//         {/* ── Status Row ── */}
//         <View style={s.statusRow}>
//           {isToday ? (
//             <>
//               <Animated.View style={[s.dot, { backgroundColor: statusColor, opacity: dotAnim }]} />
//               <Text style={[s.statusText, { color: statusColor }]}>
//                 {wsStatus === "live" ? "Live Stream" :
//                  wsStatus === "connecting" ? "Connecting…" : "Offline"}
//               </Text>
//               {lastUpdated && (
//                 <Text style={s.statusTime}>
//                   · Last update {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                 </Text>
//               )}
//             </>
//           ) : (
//             <>
//               <Text style={{ fontSize: 12 }}>📋</Text>
//               <Text style={[s.statusText, { color: COLORS.accent }]}>
//                 {loadingHistory ? "Loading records…" : `${historicalData.length} records found`}
//               </Text>
//             </>
//           )}
//         </View>

//         {/* ── Sensor Cards ── */}
//         <View style={s.cardsRow}>
//           <StatCard
//             label="Temp" value={temperature} unit="°C" icon="🌡️"
//             bg={temperature > 35 ? COLORS.dangerLight : COLORS.primaryLight}
//             textColor={temperature > 35 ? COLORS.danger : COLORS.primary}
//             alert={temperature > 35}
//           />
//           <StatCard
//             label="Humidity" value={humidity} unit="%" icon="💧"
//             bg={COLORS.accentLight} textColor={COLORS.accent}
//           />
//           <StatCard
//             label="Soil" value={soilMoisture} unit="%" icon="🪴"
//             bg={COLORS.warningLight} textColor={COLORS.warning}
//           />
//         </View>

//         {/* ── Temperature Chart ── */}
//         <View style={s.chartCard}>
//           <View style={s.chartTop}>
//             <View>
//               <Text style={s.chartTitle}>Temperature Trend</Text>
//               <Text style={s.chartSub}>
//                 {isToday ? "Last 12 live readings" : `Data for ${formatDate(selectedDate)}`}
//               </Text>
//             </View>
//             {isToday && (
//               <View style={s.liveBadge}>
//                 <Animated.View style={[s.liveDot, { opacity: dotAnim }]} />
//                 <Text style={s.liveBadgeText}>LIVE</Text>
//               </View>
//             )}
//           </View>
//           <LineChart
//             data={{
//               labels: chartData.map((_, i) => (i % 3 === 0 ? `${i}` : "")),
//               datasets: [{ data: chartData }],
//             }}
//             width={screenWidth - SPACING.lg * 2 - SPACING.xl * 2}
//             height={170}
//             chartConfig={{
//               backgroundGradientFrom: "#fff",
//               backgroundGradientTo: "#fff",
//               backgroundGradientFromOpacity: 0,
//               backgroundGradientToOpacity: 0,
//               decimalPlaces: 1,
//               color: (opacity = 1) => `rgba(26,122,74,${opacity})`,
//               labelColor: () => COLORS.textSecondary,
//               propsForDots: { r: "4", strokeWidth: "2", stroke: COLORS.primary, fill: "#fff" },
//               propsForBackgroundLines: { stroke: COLORS.border, strokeDasharray: "4" },
//             }}
//             bezier
//             style={{ borderRadius: RADIUS.md, marginLeft: -10 }}
//             withOuterLines={false}
//           />
//         </View>

//         {/* ── Session Summary (real calculated data) ── */}
//         <View style={s.summaryCard}>
//           <Text style={s.summaryTitle}>📈 {isToday ? "Live Session" : "Day"} Summary</Text>
//           <View style={s.summaryRow}>
//             <View style={s.summaryItem}>
//               <Text style={s.summaryLabel}>Peak Temp</Text>
//               <Text style={s.summaryVal}>{peakTemp > 0 ? peakTemp.toFixed(1) : "--"}°C</Text>
//             </View>
//             <View style={s.summaryDivider} />
//             <View style={s.summaryItem}>
//               <Text style={s.summaryLabel}>Avg Temp</Text>
//               <Text style={s.summaryVal}>{avgTemp > 0 ? avgTemp.toFixed(1) : "--"}°C</Text>
//             </View>
//             <View style={s.summaryDivider} />
//             <View style={s.summaryItem}>
//               <Text style={s.summaryLabel}>Readings</Text>
//               <Text style={s.summaryVal}>{totalReadings}</Text>
//             </View>
//           </View>
//         </View>

//         {/* ── Historical Records Table (past dates only) ── */}
//         {!isToday && historicalData.length > 0 && (
//           <View style={s.tableCard}>
//             <Text style={s.tableTitle}>📊 Records — {formatDate(selectedDate)}</Text>
//             {/* Table Header */}
//             <View style={s.tableHeader}>
//               <Text style={[s.tableCell, s.tableCellHead]}>Time</Text>
//               <Text style={[s.tableCell, s.tableCellHead]}>Temp °C</Text>
//               <Text style={[s.tableCell, s.tableCellHead]}>Hum %</Text>
//               <Text style={[s.tableCell, s.tableCellHead]}>Soil %</Text>
//             </View>
//             {/* Table Rows — fixed: using created_at to match Prisma schema */}
//             {historicalData.slice(-10).map((row: any, i: number) => (
//               <View key={i} style={[s.tableRow, i % 2 === 0 && s.tableRowAlt]}>
//                 <Text style={s.tableCell}>
//                   {row.created_at
//                     ? new Date(row.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//                     : "--"}
//                 </Text>
//                 <Text style={[s.tableCell, { color: COLORS.primary, fontWeight: "700" }]}>
//                   {(row.temperature ?? 0).toFixed(1)}
//                 </Text>
//                 <Text style={[s.tableCell, { color: COLORS.accent }]}>
//                   {(row.humidity ?? 0).toFixed(1)}
//                 </Text>
//                 <Text style={[s.tableCell, { color: COLORS.warning }]}>
//                   {(row.soilMoisture ?? 0).toFixed(1)}
//                 </Text>
//               </View>
//             ))}
//           </View>
//         )}

//         {/* ── No Data Empty State ── */}
//         {!isToday && !loadingHistory && historicalData.length === 0 && (
//           <View style={s.emptyCard}>
//             <Text style={s.emptyIcon}>📭</Text>
//             <Text style={s.emptyTitle}>No Records Found</Text>
//             <Text style={s.emptySub}>No sensor data available for{"\n"}{formatDate(selectedDate)}</Text>
//           </View>
//         )}

//       </ScrollView>

//       {/* ── Calendar Modal ── */}
//       <CalendarPicker
//         visible={calVisible}
//         selectedDate={selectedDate}
//         onSelect={setSelectedDate}
//         onClose={() => setCalVisible(false)}
//       />
//     </View>
//   );
// }

// // ─── Styles ───────────────────────────────────────────────────────────────────
// const s = StyleSheet.create({
//   root: { flex: 1, backgroundColor: COLORS.bg },

//   // App Bar
//   appBar: {
//     flexDirection: "row", justifyContent: "space-between", alignItems: "center",
//     backgroundColor: COLORS.bgCard, paddingHorizontal: SPACING.lg,
//     paddingTop: SPACING.lg, paddingBottom: SPACING.md,
//     borderBottomWidth: 1, borderColor: COLORS.border,
//     shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 1, shadowRadius: 8, elevation: 3,
//   },
//   appBarTitle: { color: COLORS.primary, fontSize: 18, fontWeight: "900", letterSpacing: 0.3 },
//   appBarSub: { color: COLORS.textSecondary, fontSize: 11, marginTop: 1 },
//   logoutBtn: {
//     backgroundColor: COLORS.dangerLight, borderWidth: 1, borderColor: "#fca5a5",
//     paddingHorizontal: 14, paddingVertical: 7, borderRadius: RADIUS.full,
//   },
//   logoutText: { color: COLORS.danger, fontWeight: "700", fontSize: 13 },

//   scroll: { flex: 1 },
//   scrollContent: { padding: SPACING.lg, paddingBottom: SPACING.xxl },

//   // Date Picker button
//   datePicker: {
//     backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg,
//     borderWidth: 1.5, borderColor: COLORS.primaryMid,
//     flexDirection: "row", alignItems: "center", justifyContent: "space-between",
//     paddingHorizontal: SPACING.md, paddingVertical: SPACING.md,
//     marginBottom: SPACING.md,
//     shadowColor: COLORS.primaryGlow, shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 1, shadowRadius: 8, elevation: 2,
//   },
//   dateLeft: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
//   dateIcon: { fontSize: 24 },
//   dateLabel: { color: COLORS.textSecondary, fontSize: 11, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
//   dateValue: { color: COLORS.textPrimary, fontSize: 15, fontWeight: "800", marginTop: 2 },
//   dateChevron: {
//     width: 30, height: 30, borderRadius: RADIUS.full,
//     backgroundColor: COLORS.primaryLight, alignItems: "center", justifyContent: "center",
//   },
//   dateChevronText: { color: COLORS.primary, fontSize: 16, fontWeight: "700" },

//   // Status
//   statusRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: SPACING.lg },
//   dot: { width: 8, height: 8, borderRadius: 4 },
//   statusText: { fontSize: 12, fontWeight: "700" },
//   statusTime: { color: COLORS.textMuted, fontSize: 11 },

//   // Sensor Cards
//   cardsRow: { flexDirection: "row", gap: SPACING.sm, marginBottom: SPACING.lg },
//   statCard: {
//     flex: 1, borderRadius: RADIUS.lg, padding: SPACING.md,
//     borderWidth: 1, alignItems: "flex-start", gap: 3,
//   },
//   statIcon: { fontSize: 20, marginBottom: 2 },
//   statLabel: { color: COLORS.textSecondary, fontSize: 10, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.4 },
//   statValRow: { flexDirection: "row", alignItems: "flex-end", gap: 1 },
//   statVal: { fontSize: 22, fontWeight: "900" },
//   statUnit: { fontSize: 12, fontWeight: "700", marginBottom: 2 },
//   alertPill: {
//     backgroundColor: COLORS.danger, borderRadius: RADIUS.full,
//     paddingHorizontal: 7, paddingVertical: 2, marginTop: 2,
//   },
//   alertPillText: { color: "#fff", fontSize: 9, fontWeight: "800" },

//   // Chart
//   chartCard: {
//     backgroundColor: COLORS.bgCard, borderRadius: RADIUS.xl,
//     padding: SPACING.xl, borderWidth: 1, borderColor: COLORS.border,
//     marginBottom: SPACING.lg, overflow: "hidden",
//     shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 1, shadowRadius: 12, elevation: 3,
//   },
//   chartTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: SPACING.md },
//   chartTitle: { color: COLORS.textPrimary, fontSize: 16, fontWeight: "800" },
//   chartSub: { color: COLORS.textSecondary, fontSize: 11, marginTop: 2 },
//   liveBadge: {
//     flexDirection: "row", alignItems: "center", gap: 5,
//     backgroundColor: COLORS.successLight, borderWidth: 1, borderColor: COLORS.primaryMid,
//     paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full,
//   },
//   liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.success },
//   liveBadgeText: { color: COLORS.success, fontSize: 10, fontWeight: "800", letterSpacing: 0.8 },

//   // Summary Card (replaces hardcoded info cards)
//   summaryCard: {
//     backgroundColor: COLORS.bgCard, borderRadius: RADIUS.xl,
//     padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border,
//     marginBottom: SPACING.lg,
//     shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 1, shadowRadius: 10, elevation: 2,
//   },
//   summaryTitle: { color: COLORS.textPrimary, fontSize: 14, fontWeight: "800", marginBottom: SPACING.md },
//   summaryRow: { flexDirection: "row", alignItems: "center" },
//   summaryItem: { flex: 1, alignItems: "center", paddingVertical: 4 },
//   summaryLabel: { color: COLORS.textMuted, fontSize: 10, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.4 },
//   summaryVal: { color: COLORS.primary, fontSize: 22, fontWeight: "900", marginTop: 4 },
//   summaryDivider: { width: 1, height: 44, backgroundColor: COLORS.border },

//   // Historical Table
//   tableCard: {
//     backgroundColor: COLORS.bgCard, borderRadius: RADIUS.xl,
//     borderWidth: 1, borderColor: COLORS.border, overflow: "hidden",
//     marginBottom: SPACING.lg,
//     shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 1, shadowRadius: 10, elevation: 2,
//   },
//   tableTitle: {
//     color: COLORS.textPrimary, fontSize: 14, fontWeight: "800",
//     padding: SPACING.md, borderBottomWidth: 1, borderColor: COLORS.border,
//   },
//   tableHeader: { flexDirection: "row", backgroundColor: COLORS.bgMuted, paddingVertical: 8 },
//   tableRow: { flexDirection: "row", paddingVertical: 11 },
//   tableRowAlt: { backgroundColor: COLORS.bgInput },
//   tableCell: { flex: 1, textAlign: "center", color: COLORS.textSecondary, fontSize: 12, paddingHorizontal: 4 },
//   tableCellHead: { color: COLORS.textPrimary, fontWeight: "700", fontSize: 11 },

//   // Empty State
//   emptyCard: {
//     backgroundColor: COLORS.bgCard, borderRadius: RADIUS.xl,
//     borderWidth: 1, borderColor: COLORS.border,
//     padding: SPACING.xxl, alignItems: "center", marginBottom: SPACING.lg,
//   },
//   emptyIcon: { fontSize: 44, marginBottom: SPACING.md },
//   emptyTitle: { color: COLORS.textPrimary, fontSize: 16, fontWeight: "800" },
//   emptySub: { color: COLORS.textSecondary, fontSize: 13, marginTop: 6, textAlign: "center", lineHeight: 20 },
// });


// import React, { useEffect, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Dimensions,
//   Alert,
//   Animated,
//   StatusBar,
// } from "react-native";

// import { LineChart } from "react-native-chart-kit";

// import { COLORS, SPACING, RADIUS } from "../constants/theme";

// import {
//   AuthService,
//   WS_URL,
// } from "../services/api";

// const screenWidth = Dimensions.get("window").width;

// // ───────────────────────────────────────────────────────────────
// // Stat Card
// // ───────────────────────────────────────────────────────────────

// const StatCard = ({
//   label,
//   value,
//   unit,
//   icon,
//   bg,
//   textColor,
//   alert,
// }: any) => {

//   const pulse = useRef(new Animated.Value(1)).current;

//   useEffect(() => {

//     if (alert) {

//       Animated.loop(
//         Animated.sequence([
//           Animated.timing(pulse, {
//             toValue: 1.03,
//             duration: 700,
//             useNativeDriver: true,
//           }),

//           Animated.timing(pulse, {
//             toValue: 1,
//             duration: 700,
//             useNativeDriver: true,
//           }),
//         ])
//       ).start();

//     } else {

//       pulse.stopAnimation();

//       pulse.setValue(1);
//     }

//   }, [alert]);

//   return (
//     <Animated.View
//       style={[
//         s.statCard,
//         {
//           backgroundColor: bg,
//           borderColor: alert
//             ? COLORS.danger
//             : COLORS.border,
//         },
//         {
//           transform: [{ scale: pulse }],
//         },
//       ]}
//     >
//       <Text style={s.statIcon}>{icon}</Text>

//       <Text style={s.statLabel}>{label}</Text>

//       <View style={s.statValRow}>
//         <Text
//           style={[
//             s.statVal,
//             { color: textColor },
//           ]}
//         >
//           {value.toFixed(1)}
//         </Text>

//         <Text
//           style={[
//             s.statUnit,
//             { color: textColor },
//           ]}
//         >
//           {unit}
//         </Text>
//       </View>

//       {alert && (
//         <View style={s.alertPill}>
//           <Text style={s.alertPillText}>
//             ⚠ HIGH
//           </Text>
//         </View>
//       )}
//     </Animated.View>
//   );
// };

// // ───────────────────────────────────────────────────────────────
// // Home Screen
// // ───────────────────────────────────────────────────────────────

// export default function HomeScreen({ navigation }: any) {

//   const [temperature, setTemperature] =
//     useState(0);

//   const [aiMessage, setAiMessage] =
//     useState("Waiting for AI insights...");

//   const [status, setStatus] =
//     useState("LEARNING");

//   const [trend, setTrend] =
//     useState("STABLE");

//   const [tempHistory, setTempHistory] =
//     useState<number[]>([0]);

//   const [wsStatus, setWsStatus] =
//     useState<"connecting" | "live" | "offline">(
//       "connecting"
//     );

//   const [lastUpdated, setLastUpdated] =
//     useState<Date | null>(null);

//   const dotAnim = useRef(
//     new Animated.Value(0.4)
//   ).current;

//   useEffect(() => {

//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(dotAnim, {
//           toValue: 1,
//           duration: 900,
//           useNativeDriver: true,
//         }),

//         Animated.timing(dotAnim, {
//           toValue: 0.4,
//           duration: 900,
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//   }, []);

//   // ─────────────────────────────────────────────────────────────
//   // WebSocket
//   // ─────────────────────────────────────────────────────────────

//   useEffect(() => {

//     setWsStatus("connecting");

//     const ws = new WebSocket(WS_URL);

//     ws.onopen = () => {
//       setWsStatus("live");
//     };

//     ws.onclose = () => {
//       setWsStatus("offline");
//     };

//     ws.onerror = () => {
//       setWsStatus("offline");
//     };

//     ws.onmessage = (event) => {

//       try {

//         const data = JSON.parse(event.data);

//         const temp =
//           data.temperature ?? 0;

//         setTemperature(temp);

//         setAiMessage(
//           data.ai_message ??
//             "No AI response"
//         );

//         setStatus(
//           data.status ?? "UNKNOWN"
//         );

//         setTrend(
//           data.trend ?? "STABLE"
//         );

//         setLastUpdated(new Date());

//         setTempHistory((prev) =>
//           [...prev, temp].slice(-12)
//         );

//         if (temp > 35) {

//           Alert.alert(
//             "⚠️ High Temperature!",
//             `${temp}°C detected`
//           );
//         }

//       } catch (err) {
//         console.log(err);
//       }
//     };

//     return () => ws.close();

//   }, []);

//   // ─────────────────────────────────────────────────────────────
//   // Logout
//   // ─────────────────────────────────────────────────────────────

//   const handleLogout = () => {

//     Alert.alert(
//       "Logout",
//       "Are you sure you want to sign out?",
//       [
//         {
//           text: "Cancel",
//           style: "cancel",
//         },

//         {
//           text: "Sign Out",
//           style: "destructive",

//           onPress: async () => {
//             await AuthService.logout();

//             navigation.replace("Login");
//           },
//         },
//       ]
//     );
//   };

//   const avgTemp =
//     tempHistory.length
//       ? tempHistory.reduce(
//           (a, b) => a + b,
//           0
//         ) / tempHistory.length
//       : 0;

//   const peakTemp =
//     tempHistory.length
//       ? Math.max(...tempHistory)
//       : 0;

//   const chartData =
//     tempHistory.length > 1
//       ? tempHistory
//       : [0, 0];

//   const statusColor =
//     wsStatus === "live"
//       ? COLORS.success
//       : wsStatus === "connecting"
//       ? COLORS.warning
//       : COLORS.danger;

//   return (

//     <View style={s.root}>

//       <StatusBar
//         barStyle="dark-content"
//         backgroundColor={COLORS.bgCard}
//       />

//       {/* ───────────────────────────────────────── */}
//       {/* App Bar */}
//       {/* ───────────────────────────────────────── */}

//       <View style={s.appBar}>

//         <View>
//           <Text style={s.appBarTitle}>
//             🤖 AI-IoT Monitor
//           </Text>

//           <Text style={s.appBarSub}>
//             Realtime Temperature System
//           </Text>
//         </View>

//         <TouchableOpacity
//           style={s.logoutBtn}
//           onPress={handleLogout}
//         >
//           <Text style={s.logoutText}>
//             Sign Out
//           </Text>
//         </TouchableOpacity>

//       </View>

//       {/* ───────────────────────────────────────── */}
//       {/* Scroll */}
//       {/* ───────────────────────────────────────── */}

//       <ScrollView
//         style={s.scroll}
//         contentContainerStyle={s.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >

//         {/* ───────────────────────────────────── */}
//         {/* Status */}
//         {/* ───────────────────────────────────── */}

//         <View style={s.statusRow}>

//           <Animated.View
//             style={[
//               s.dot,
//               {
//                 backgroundColor: statusColor,
//                 opacity: dotAnim,
//               },
//             ]}
//           />

//           <Text
//             style={[
//               s.statusText,
//               { color: statusColor },
//             ]}
//           >
//             {wsStatus === "live"
//               ? "Live Stream"
//               : wsStatus === "connecting"
//               ? "Connecting..."
//               : "Offline"}
//           </Text>

//           {lastUpdated && (
//             <Text style={s.statusTime}>
//               · Last update{" "}
//               {lastUpdated.toLocaleTimeString()}
//             </Text>
//           )}

//         </View>

//         {/* ───────────────────────────────────── */}
//         {/* Temperature Card */}
//         {/* ───────────────────────────────────── */}

//         <View style={s.cardsRow}>

//           <StatCard
//             label="Temperature"
//             value={temperature}
//             unit="°C"
//             icon="🌡️"
//             bg={
//               temperature > 35
//                 ? COLORS.dangerLight
//                 : COLORS.primaryLight
//             }
//             textColor={
//               temperature > 35
//                 ? COLORS.danger
//                 : COLORS.primary
//             }
//             alert={temperature > 35}
//           />

//         </View>

//         {/* ───────────────────────────────────── */}
//         {/* AI Insight Card */}
//         {/* ───────────────────────────────────── */}

//         <View style={s.aiCard}>

//           <View style={s.aiHeader}>

//             <Text style={s.aiIcon}>
//               🤖
//             </Text>

//             <Text style={s.aiTitle}>
//               AI Monitoring Insight
//             </Text>

//           </View>

//           <Text style={s.aiMessage}>
//             {aiMessage}
//           </Text>

//           <View style={s.aiMetaRow}>

//             <View
//               style={[
//                 s.aiBadge,
//                 {
//                   backgroundColor:
//                     status === "ANOMALY"
//                       ? COLORS.dangerLight
//                       : COLORS.successLight,
//                 },
//               ]}
//             >
//               <Text
//                 style={[
//                   s.aiBadgeText,
//                   {
//                     color:
//                       status === "ANOMALY"
//                         ? COLORS.danger
//                         : COLORS.success,
//                   },
//                 ]}
//               >
//                 {status}
//               </Text>
//             </View>

//             <View style={s.aiBadge}>
//               <Text style={s.aiBadgeText}>
//                 {trend}
//               </Text>
//             </View>

//           </View>

//         </View>

//         {/* ───────────────────────────────────── */}
//         {/* Chart */}
//         {/* ───────────────────────────────────── */}

//         <View style={s.chartCard}>

//           <Text style={s.chartTitle}>
//             Temperature Trend
//           </Text>

//           <LineChart
//             data={{
//               labels: chartData.map(
//                 (_, i) =>
//                   i % 3 === 0
//                     ? `${i}`
//                     : ""
//               ),

//               datasets: [
//                 {
//                   data: chartData,
//                 },
//               ],
//             }}

//             width={
//               screenWidth - 50
//             }

//             height={180}

//             chartConfig={{
//               backgroundGradientFrom:
//                 "#fff",

//               backgroundGradientTo:
//                 "#fff",

//               decimalPlaces: 1,

//               color: (
//                 opacity = 1
//               ) =>
//                 `rgba(26,122,74,${opacity})`,

//               labelColor: () =>
//                 COLORS.textSecondary,

//               propsForDots: {
//                 r: "4",
//                 strokeWidth: "2",
//                 stroke:
//                   COLORS.primary,
//                 fill: "#fff",
//               },
//             }}

//             bezier

//             style={{
//               borderRadius:
//                 RADIUS.md,
//               marginTop: 10,
//             }}
//           />

//         </View>

//         {/* ───────────────────────────────────── */}
//         {/* Summary */}
//         {/* ───────────────────────────────────── */}

//         <View style={s.summaryCard}>

//           <Text style={s.summaryTitle}>
//             📈 Live Summary
//           </Text>

//           <View style={s.summaryRow}>

//             <View style={s.summaryItem}>
//               <Text style={s.summaryLabel}>
//                 Peak Temp
//               </Text>

//               <Text style={s.summaryVal}>
//                 {peakTemp.toFixed(1)}°C
//               </Text>
//             </View>

//             <View style={s.summaryDivider} />

//             <View style={s.summaryItem}>
//               <Text style={s.summaryLabel}>
//                 Avg Temp
//               </Text>

//               <Text style={s.summaryVal}>
//                 {avgTemp.toFixed(1)}°C
//               </Text>
//             </View>

//             <View style={s.summaryDivider} />

//             <View style={s.summaryItem}>
//               <Text style={s.summaryLabel}>
//                 Readings
//               </Text>

//               <Text style={s.summaryVal}>
//                 {tempHistory.length}
//               </Text>
//             </View>

//           </View>

//         </View>

//       </ScrollView>

//     </View>
//   );
// }

// // ───────────────────────────────────────────────────────────────
// // Styles
// // ───────────────────────────────────────────────────────────────

// const s = StyleSheet.create({

//   root: {
//     flex: 1,
//     backgroundColor: COLORS.bg,
//   },

//   appBar: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",

//     backgroundColor: COLORS.bgCard,

//     paddingHorizontal: SPACING.lg,
//     paddingTop: SPACING.lg,
//     paddingBottom: SPACING.md,

//     borderBottomWidth: 1,
//     borderColor: COLORS.border,
//   },

//   appBarTitle: {
//     color: COLORS.primary,
//     fontSize: 18,
//     fontWeight: "900",
//   },

//   appBarSub: {
//     color: COLORS.textSecondary,
//     fontSize: 11,
//     marginTop: 2,
//   },

//   logoutBtn: {
//     backgroundColor:
//       COLORS.dangerLight,

//     paddingHorizontal: 14,
//     paddingVertical: 7,

//     borderRadius:
//       RADIUS.full,
//   },

//   logoutText: {
//     color: COLORS.danger,
//     fontWeight: "700",
//   },

//   scroll: {
//     flex: 1,
//   },

//   scrollContent: {
//     padding: SPACING.lg,
//     paddingBottom: SPACING.xxl,
//   },

//   statusRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     marginBottom: SPACING.lg,
//   },

//   dot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//   },

//   statusText: {
//     fontSize: 12,
//     fontWeight: "700",
//   },

//   statusTime: {
//     color: COLORS.textMuted,
//     fontSize: 11,
//   },

//   cardsRow: {
//     marginBottom: SPACING.lg,
//   },

//   statCard: {
//     borderRadius: RADIUS.lg,
//     padding: SPACING.lg,

//     borderWidth: 1,
//   },

//   statIcon: {
//     fontSize: 24,
//     marginBottom: 6,
//   },

//   statLabel: {
//     color: COLORS.textSecondary,
//     fontSize: 11,
//     fontWeight: "700",
//   },

//   statValRow: {
//     flexDirection: "row",
//     alignItems: "flex-end",
//   },

//   statVal: {
//     fontSize: 34,
//     fontWeight: "900",
//   },

//   statUnit: {
//     fontSize: 16,
//     marginBottom: 4,
//     marginLeft: 4,
//   },

//   alertPill: {
//     backgroundColor:
//       COLORS.danger,

//     alignSelf: "flex-start",

//     marginTop: 8,

//     paddingHorizontal: 10,
//     paddingVertical: 4,

//     borderRadius:
//       RADIUS.full,
//   },

//   alertPillText: {
//     color: "#fff",
//     fontSize: 10,
//     fontWeight: "800",
//   },

//   aiCard: {
//     backgroundColor:
//       COLORS.bgCard,

//     borderRadius:
//       RADIUS.xl,

//     padding: SPACING.lg,

//     borderWidth: 1,
//     borderColor: COLORS.border,

//     marginBottom: SPACING.lg,
//   },

//   aiHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: SPACING.md,
//   },

//   aiIcon: {
//     fontSize: 22,
//     marginRight: 8,
//   },

//   aiTitle: {
//     color: COLORS.textPrimary,
//     fontSize: 16,
//     fontWeight: "800",
//   },

//   aiMessage: {
//     color: COLORS.textSecondary,
//     fontSize: 14,
//     lineHeight: 22,
//     marginBottom: SPACING.md,
//   },

//   aiMetaRow: {
//     flexDirection: "row",
//     gap: SPACING.sm,
//   },

//   aiBadge: {
//     backgroundColor:
//       COLORS.bgMuted,

//     paddingHorizontal: 12,
//     paddingVertical: 6,

//     borderRadius:
//       RADIUS.full,
//   },

//   aiBadgeText: {
//     color: COLORS.textPrimary,
//     fontSize: 11,
//     fontWeight: "800",
//   },

//   chartCard: {
//     backgroundColor:
//       COLORS.bgCard,

//     borderRadius:
//       RADIUS.xl,

//     padding: SPACING.lg,

//     borderWidth: 1,
//     borderColor: COLORS.border,

//     marginBottom: SPACING.lg,
//   },

//   chartTitle: {
//     color: COLORS.textPrimary,
//     fontSize: 16,
//     fontWeight: "800",
//     marginBottom: SPACING.md,
//   },

//   summaryCard: {
//     backgroundColor:
//       COLORS.bgCard,

//     borderRadius:
//       RADIUS.xl,

//     padding: SPACING.lg,

//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },

//   summaryTitle: {
//     color: COLORS.textPrimary,
//     fontSize: 14,
//     fontWeight: "800",
//     marginBottom: SPACING.md,
//   },

//   summaryRow: {
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   summaryItem: {
//     flex: 1,
//     alignItems: "center",
//   },

//   summaryLabel: {
//     color: COLORS.textMuted,
//     fontSize: 10,
//     fontWeight: "700",
//   },

//   summaryVal: {
//     color: COLORS.primary,
//     fontSize: 22,
//     fontWeight: "900",
//     marginTop: 4,
//   },

//   summaryDivider: {
//     width: 1,
//     height: 40,
//     backgroundColor:
//       COLORS.border,
//   },
// });

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  Animated,
  StatusBar,
} from "react-native";

import { LineChart } from "react-native-chart-kit";

import { COLORS, SPACING, RADIUS } from "../constants/theme";

import {
  AuthService,
  WS_URL,
} from "../services/api";

const screenWidth = Dimensions.get("window").width;

// ───────────────────────────────────────────────────────────────
// Stat Card
// ───────────────────────────────────────────────────────────────

const StatCard = ({
  label,
  value,
  unit,
  icon,
  bg,
  textColor,
  alert,
}: any) => {

  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {

    if (alert) {

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.03,
            duration: 700,
            useNativeDriver: true,
          }),

          Animated.timing(pulse, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      ).start();

    } else {

      pulse.stopAnimation();

      pulse.setValue(1);
    }

  }, [alert]);

  return (
    <Animated.View
      style={[
        s.statCard,
        {
          backgroundColor: bg,
          borderColor: alert
            ? COLORS.danger
            : COLORS.border,
        },
        {
          transform: [{ scale: pulse }],
        },
      ]}
    >
      <Text style={s.statIcon}>{icon}</Text>

      <Text style={s.statLabel}>{label}</Text>

      <View style={s.statValRow}>
        <Text
          style={[
            s.statVal,
            { color: textColor },
          ]}
        >
          {value.toFixed(1)}
        </Text>

        <Text
          style={[
            s.statUnit,
            { color: textColor },
          ]}
        >
          {unit}
        </Text>
      </View>

      {alert && (
        <View style={s.alertPill}>
          <Text style={s.alertPillText}>
            ⚠ HIGH
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

// ───────────────────────────────────────────────────────────────
// Home Screen
// ───────────────────────────────────────────────────────────────

export default function HomeScreen({ navigation }: any) {

  const [temperature, setTemperature] =
    useState(0);

  const [aiMessage, setAiMessage] =
    useState("Waiting for AI insights...");

  const [status, setStatus] =
    useState("LEARNING");

  const [trend, setTrend] =
    useState("STABLE");

  const [tempHistory, setTempHistory] =
    useState<number[]>([0]);

  const [wsStatus, setWsStatus] =
    useState<"connecting" | "live" | "offline">(
      "connecting"
    );

  const [lastUpdated, setLastUpdated] =
    useState<Date | null>(null);

  const dotAnim = useRef(
    new Animated.Value(0.4)
  ).current;

  useEffect(() => {

    Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),

        Animated.timing(dotAnim, {
          toValue: 0.4,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();

  }, []);

  // ─────────────────────────────────────────────────────────────
  // WebSocket
  // ─────────────────────────────────────────────────────────────

  useEffect(() => {

    setWsStatus("connecting");

    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      setWsStatus("live");
    };

    ws.onclose = () => {
      setWsStatus("offline");
    };

    ws.onerror = () => {
      setWsStatus("offline");
    };

    ws.onmessage = (event) => {

      try {

        const data = JSON.parse(event.data);

        const temp =
          data.temperature ?? 0;

        setTemperature(temp);

        setAiMessage(
          data.ai_message ??
          "No AI response"
        );

        setStatus(
          data.status ?? "UNKNOWN"
        );

        setTrend(
          data.trend ?? "STABLE"
        );

        setLastUpdated(new Date());

        setTempHistory((prev) =>
          [...prev, temp].slice(-12)
        );

        if (temp > 35) {

          Alert.alert(
            "⚠️ High Temperature!",
            `${temp}°C detected`
          );
        }

      } catch (err) {
        console.log(err);
      }
    };

    return () => ws.close();

  }, []);

  // ─────────────────────────────────────────────────────────────
  // Logout
  // ─────────────────────────────────────────────────────────────

  const handleLogout = () => {

    Alert.alert(
      "Logout",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },

        {
          text: "Sign Out",
          style: "destructive",

          onPress: async () => {
            await AuthService.logout();

            navigation.replace("Login");
          },
        },
      ]
    );
  };

  const avgTemp =
    tempHistory.length
      ? tempHistory.reduce(
        (a, b) => a + b,
        0
      ) / tempHistory.length
      : 0;

  const peakTemp =
    tempHistory.length
      ? Math.max(...tempHistory)
      : 0;

  const chartData =
    tempHistory.length > 1
      ? tempHistory
      : [0, 0];

  const statusColor =
    wsStatus === "live"
      ? COLORS.success
      : wsStatus === "connecting"
        ? COLORS.warning
        : COLORS.danger;

  return (

    <View style={s.root}>

      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.bgCard}
      />

      {/* ───────────────────────────────────────── */}
      {/* App Bar */}
      {/* ───────────────────────────────────────── */}

      <View style={s.appBar}>

        <View>
          <Text style={s.appBarTitle}>
            🤖 AI-IoT Monitor
          </Text>

          <Text style={s.appBarSub}>
            Realtime Temperature System
          </Text>
        </View>

        <TouchableOpacity
          style={s.logoutBtn}
          onPress={handleLogout}
        >
          <Text style={s.logoutText}>
            Sign Out
          </Text>
        </TouchableOpacity>

      </View>

      {/* ───────────────────────────────────────── */}
      {/* Scroll */}
      {/* ───────────────────────────────────────── */}

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ───────────────────────────────────── */}
        {/* Status */}
        {/* ───────────────────────────────────── */}

        <View style={s.statusRow}>

          <Animated.View
            style={[
              s.dot,
              {
                backgroundColor: statusColor,
                opacity: dotAnim,
              },
            ]}
          />

          <Text
            style={[
              s.statusText,
              { color: statusColor },
            ]}
          >
            {wsStatus === "live"
              ? "Live Stream"
              : wsStatus === "connecting"
                ? "Connecting..."
                : "Offline"}
          </Text>

          {lastUpdated && (
            <Text style={s.statusTime}>
              · Last update{" "}
              {lastUpdated.toLocaleTimeString()}
            </Text>
          )}

        </View>

        {/* ───────────────────────────────────── */}
        {/* Temperature Card */}
        {/* ───────────────────────────────────── */}

        <View style={s.cardsRow}>

          <StatCard
            label="Temperature"
            value={temperature}
            unit="°C"
            icon="🌡️"
            bg={
              temperature > 35
                ? COLORS.dangerLight
                : COLORS.primaryLight
            }
            textColor={
              temperature > 35
                ? COLORS.danger
                : COLORS.primary
            }
            alert={temperature > 35}
          />

        </View>

        {/* ───────────────────────────────────── */}
        {/* AI Insight Card */}
        {/* ───────────────────────────────────── */}

        <View style={s.aiCard}>

          <View style={s.aiHeader}>

            <Text style={s.aiIcon}>
              🤖
            </Text>

            <Text style={s.aiTitle}>
              AI Monitoring Insight
            </Text>

          </View>

          <Text style={s.aiMessage}>
            {aiMessage}
          </Text>

          <View style={s.aiMetaRow}>

            <View
              style={[
                s.aiBadge,
                {
                  backgroundColor:
                    status === "ANOMALY"
                      ? COLORS.dangerLight
                      : COLORS.successLight,
                },
              ]}
            >
              <Text
                style={[
                  s.aiBadgeText,
                  {
                    color:
                      status === "ANOMALY"
                        ? COLORS.danger
                        : COLORS.success,
                  },
                ]}
              >
                {status}
              </Text>
            </View>

            <View style={s.aiBadge}>
              <Text style={s.aiBadgeText}>
                {trend}
              </Text>
            </View>

          </View>

        </View>

        {/* ───────────────────────────────────── */}
        {/* Chart */}
        {/* ───────────────────────────────────── */}

        <View style={s.chartCard}>

          <Text style={s.chartTitle}>
            Temperature Trend
          </Text>

          <LineChart
            data={{
              labels: chartData.map(
                (_, i) =>
                  i % 3 === 0
                    ? `${i}`
                    : ""
              ),

              datasets: [
                {
                  data: chartData,
                },
              ],
            }}

            width={
              screenWidth - 50
            }

            height={180}

            chartConfig={{
              backgroundGradientFrom:
                "#fff",

              backgroundGradientTo:
                "#fff",

              decimalPlaces: 1,

              color: (
                opacity = 1
              ) =>
                `rgba(26,122,74,${opacity})`,

              labelColor: () =>
                COLORS.textSecondary,

              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke:
                  COLORS.primary,
                fill: "#fff",
              },
            }}

            bezier

            style={{
              borderRadius:
                RADIUS.md,
              marginTop: 10,
            }}
          />

        </View>

        {/* ───────────────────────────────────── */}
        {/* Summary */}
        {/* ───────────────────────────────────── */}

        <View style={s.summaryCard}>

          <Text style={s.summaryTitle}>
            📈 Live Summary
          </Text>

          <View style={s.summaryRow}>

            <View style={s.summaryItem}>
              <Text style={s.summaryLabel}>
                Peak Temp
              </Text>

              <Text style={s.summaryVal}>
                {peakTemp.toFixed(1)}°C
              </Text>
            </View>

            <View style={s.summaryDivider} />

            <View style={s.summaryItem}>
              <Text style={s.summaryLabel}>
                Avg Temp
              </Text>

              <Text style={s.summaryVal}>
                {avgTemp.toFixed(1)}°C
              </Text>
            </View>

            <View style={s.summaryDivider} />

            <View style={s.summaryItem}>
              <Text style={s.summaryLabel}>
                Readings
              </Text>

              <Text style={s.summaryVal}>
                {tempHistory.length}
              </Text>
            </View>

          </View>

        </View>

      </ScrollView>

    </View>
  );
}

// ───────────────────────────────────────────────────────────────
// Styles
// ───────────────────────────────────────────────────────────────

const s = StyleSheet.create({

  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  appBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    backgroundColor: COLORS.bgCard,

    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,

    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },

  appBarTitle: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "900",
  },

  appBarSub: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },

  logoutBtn: {
    backgroundColor:
      COLORS.dangerLight,

    paddingHorizontal: 14,
    paddingVertical: 7,

    borderRadius:
      RADIUS.full,
  },

  logoutText: {
    color: COLORS.danger,
    fontWeight: "700",
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: SPACING.lg,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },

  statusTime: {
    color: COLORS.textMuted,
    fontSize: 11,
  },

  cardsRow: {
    marginBottom: SPACING.lg,
  },

  statCard: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,

    borderWidth: 1,
  },

  statIcon: {
    fontSize: 24,
    marginBottom: 6,
  },

  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: "700",
  },

  statValRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },

  statVal: {
    fontSize: 34,
    fontWeight: "900",
  },

  statUnit: {
    fontSize: 16,
    marginBottom: 4,
    marginLeft: 4,
  },

  alertPill: {
    backgroundColor:
      COLORS.danger,

    alignSelf: "flex-start",

    marginTop: 8,

    paddingHorizontal: 10,
    paddingVertical: 4,

    borderRadius:
      RADIUS.full,
  },

  alertPillText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
  },

  aiCard: {
    backgroundColor:
      COLORS.bgCard,

    borderRadius:
      RADIUS.xl,

    padding: SPACING.lg,

    borderWidth: 1,
    borderColor: COLORS.border,

    marginBottom: SPACING.lg,
  },

  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },

  aiIcon: {
    fontSize: 22,
    marginRight: 8,
  },

  aiTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "800",
  },

  aiMessage: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },

  aiMetaRow: {
    flexDirection: "row",
    gap: SPACING.sm,
  },

  aiBadge: {
    backgroundColor:
      COLORS.bgMuted,

    paddingHorizontal: 12,
    paddingVertical: 6,

    borderRadius:
      RADIUS.full,
  },

  aiBadgeText: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontWeight: "800",
  },

  chartCard: {
    backgroundColor:
      COLORS.bgCard,

    borderRadius:
      RADIUS.xl,

    padding: SPACING.lg,

    borderWidth: 1,
    borderColor: COLORS.border,

    marginBottom: SPACING.lg,
  },

  chartTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: SPACING.md,
  },

  summaryCard: {
    backgroundColor:
      COLORS.bgCard,

    borderRadius:
      RADIUS.xl,

    padding: SPACING.lg,

    borderWidth: 1,
    borderColor: COLORS.border,
  },

  summaryTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: SPACING.md,
  },

  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  summaryItem: {
    flex: 1,
    alignItems: "center",
  },

  summaryLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: "700",
  },

  summaryVal: {
    color: COLORS.primary,
    fontSize: 22,
    fontWeight: "900",
    marginTop: 4,
  },

  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor:
      COLORS.border,
  },
});