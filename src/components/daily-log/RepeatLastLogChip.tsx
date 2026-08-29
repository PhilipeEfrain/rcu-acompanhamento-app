import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Copy } from "lucide-react-native";
import { DailySymptomEntry } from "../../domain/health/types";

interface RepeatLastLogChipProps {
  lastLog: DailySymptomEntry;
  onPress: () => void;
}

export const RepeatLastLogChip: React.FC<RepeatLastLogChipProps> = ({
  lastLog,
  onPress,
}) => {
  const { t } = useTranslation(["dailyLog"]);

  const getSummary = () => {
    if (lastLog.outputType === "blood_mucus_only") {
      return t("dailyLog:repeatModal.chipSummaryBloodOnly", {
        pain: lastLog.painLevel,
      });
    }
    const bristolLabel = t(
      `dailyLog:bristol.${lastLog.bristolType}.label`,
    ).split(":")[0];
    const bloodLabel = t(`dailyLog:blood.${lastLog.bloodPresence}`);
    return t("dailyLog:repeatModal.chipSummary", {
      bristol: bristolLabel,
      blood: bloodLabel,
      pain: lastLog.painLevel,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.chipButton}
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
      >
        <View style={styles.iconCircle}>
          <Copy size={16} color="#7C3AED" />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.titleText}>
            {t("dailyLog:repeatModal.chipTitle", {
              time: lastLog.time || "--:--",
            })}
          </Text>
          <Text style={styles.summaryText}>{getSummary()}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginVertical: 6,
  },
  chipButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F3FF",
    borderWidth: 1.5,
    borderColor: "#DDD6FE",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 12,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#EDE9FE",
  },
  textContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#5B21B6",
    marginBottom: 2,
  },
  summaryText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#7C3AED",
  },
});
