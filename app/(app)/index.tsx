import { View, Text, StyleSheet } from "react-native";

export default function OverviewScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Overview</Text>
      <Text style={styles.hint}>Your budget dashboard will go here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  placeholder: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
  },
  hint: {
    fontSize: 16,
    color: "#6b7280",
  },
});
