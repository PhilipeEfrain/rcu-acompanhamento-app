import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Sparkles, X, CheckCircle2, Edit3 } from "lucide-react-native";
import { DailySymptomEntry } from "../../domain/health/types";

interface RepeatLogModalProps {
  visible: boolean;
  lastLog: DailySymptomEntry | null;
  currentTime: string;
  isSaving?: boolean;
  onClose: () => void;
  onSaveDirectly: () => void;
  onContinueEditing: () => void;
}

export const RepeatLogModal: React.FC<RepeatLogModalProps> = ({
  visible,
  lastLog,
  currentTime,
  isSaving = false,
  onClose,
  onSaveDirectly,
  onContinueEditing,
}) => {
  const { t } = useTranslation(["dailyLog", "common"]);

  if (!lastLog) return null;

  const isBloodOnly = lastLog.outputType === "blood_mucus_only";
  const bristolLabel = t(`dailyLog:bristol.${lastLog.bristolType}.label`);
  const bloodLabel = t(`dailyLog:blood.${lastLog.bloodPresence}`);
  const outputLabel = isBloodOnly
    ? t("dailyLog:outputType.blood_mucus_only")
    : t("dailyLog:outputType.feces");

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.iconCircle}>
                  <Sparkles size={20} color="#7C3AED" />
                </View>
                <View style={styles.headerText}>
                  <Text style={styles.title}>
                    {t("dailyLog:repeatModal.title")}
                  </Text>
                  <Text style={styles.subtitle}>
                    {t("dailyLog:repeatModal.subtitle", { currentTime })}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeButton}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                >
                  <X size={18} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Summary of Copied Data */}
              <View style={styles.summaryContainer}>
                <Text style={styles.summaryHeader}>
                  {t("dailyLog:repeatModal.previousTimeLabel", {
                    time: lastLog.time || "--:--",
                  })}
                </Text>

                <View style={styles.summaryRow}>
                  <Text style={styles.label}>
                    {t("dailyLog:repeatModal.outputLabel")}
                  </Text>
                  <Text style={styles.value}>{outputLabel}</Text>
                </View>

                {!isBloodOnly && (
                  <>
                    <View style={styles.summaryRow}>
                      <Text style={styles.label}>
                        {t("dailyLog:repeatModal.bristolLabel")}
                      </Text>
                      <Text style={styles.value}>{bristolLabel}</Text>
                    </View>

                    <View style={styles.summaryRow}>
                      <Text style={styles.label}>
                        {t("dailyLog:repeatModal.bloodLabel")}
                      </Text>
                      <Text style={styles.value}>{bloodLabel}</Text>
                    </View>
                  </>
                )}

                <View style={styles.summaryRow}>
                  <Text style={styles.label}>
                    {t("dailyLog:repeatModal.painLabel")}
                  </Text>
                  <Text style={styles.value}>
                    {t("dailyLog:pain.score_label", {
                      score: lastLog.painLevel,
                    })}
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionsContainer}>
                {/* Primary Action: Save Now (< 2s) */}
                <TouchableOpacity
                  style={[styles.saveButton, isSaving && styles.disabledButton]}
                  onPress={onSaveDirectly}
                  disabled={isSaving}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                >
                  {isSaving ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <View style={styles.buttonInner}>
                      <CheckCircle2 size={18} color="#FFFFFF" />
                      <Text style={styles.saveButtonText}>
                        {t("dailyLog:repeatModal.saveNow")}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>

                {/* Secondary Action: Continue Editing */}
                <TouchableOpacity
                  style={styles.continueButton}
                  onPress={onContinueEditing}
                  disabled={isSaving}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                >
                  <Edit3 size={16} color="#7C3AED" />
                  <Text style={styles.continueButtonText}>
                    {t("dailyLog:repeatModal.continueEditing")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 22,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F3FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  subtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  closeButton: {
    padding: 6,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
  },
  summaryContainer: {
    backgroundColor: "#F8F9FE",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
    gap: 8,
  },
  summaryHeader: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  value: {
    fontSize: 12,
    color: "#1E293B",
    fontWeight: "700",
    flexShrink: 1,
    textAlign: "right",
    marginLeft: 8,
  },
  actionsContainer: {
    gap: 10,
  },
  saveButton: {
    backgroundColor: "#7C3AED",
    height: 52,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAF5FF",
    height: 46,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#E9D8FD",
    gap: 6,
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7C3AED",
  },
});
