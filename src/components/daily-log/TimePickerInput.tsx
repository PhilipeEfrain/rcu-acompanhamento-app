import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Clock, RotateCcw } from 'lucide-react-native';

interface TimePickerInputProps {
  time: string; // HH:mm
  onChangeTime: (time: string) => void;
}

export const TimePickerInput: React.FC<TimePickerInputProps> = ({ time, onChangeTime }) => {
  const { t } = useTranslation('dailyLog');

  const formatAndValidateTime = (text: string) => {
    // Keep only numbers
    const digits = text.replace(/\D/g, '').slice(0, 4);

    if (digits.length === 0) {
      onChangeTime('');
      return;
    }

    if (digits.length === 1) {
      const firstDigit = parseInt(digits[0], 10);
      if (firstDigit > 2) {
        // If user types e.g. 8 -> format as 08:
        onChangeTime(`0${firstDigit}:`);
      } else {
        onChangeTime(digits);
      }
      return;
    }

    if (digits.length === 2) {
      let hours = parseInt(digits.slice(0, 2), 10);
      if (hours > 23) hours = 23;
      const hoursStr = String(hours).padStart(2, '0');
      onChangeTime(`${hoursStr}:`);
      return;
    }

    if (digits.length === 3) {
      let hours = parseInt(digits.slice(0, 2), 10);
      if (hours > 23) hours = 23;
      const hoursStr = String(hours).padStart(2, '0');

      let minDigit = parseInt(digits[2], 10);
      if (minDigit > 5) minDigit = 5;

      onChangeTime(`${hoursStr}:${minDigit}`);
      return;
    }

    if (digits.length === 4) {
      let hours = parseInt(digits.slice(0, 2), 10);
      if (hours > 23) hours = 23;
      const hoursStr = String(hours).padStart(2, '0');

      let minutes = parseInt(digits.slice(2, 4), 10);
      if (minutes > 59) minutes = 59;
      const minutesStr = String(minutes).padStart(2, '0');

      onChangeTime(`${hoursStr}:${minutesStr}`);
      return;
    }
  };

  const handleSetCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    onChangeTime(`${hours}:${minutes}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Clock size={16} color="#8E63B8" />
        <Text style={styles.title}>{t('timePicker')}</Text>
      </View>

      <View style={styles.inputRow}>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            value={time}
            onChangeText={formatAndValidateTime}
            placeholder="00:00"
            placeholderTextColor="#A0AEC0"
            maxLength={5}
            keyboardType="number-pad"
            returnKeyType="done"
          />
        </View>

        <TouchableOpacity
          style={styles.nowButton}
          onPress={handleSetCurrentTime}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={t('now')}
        >
          <RotateCcw size={13} color="#8E63B8" />
          <Text style={styles.nowButtonText}>{t('now')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D3142',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inputBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#EDF2F7',
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    width: 120,
    shadowColor: '#8E63B8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  input: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2D3142',
    textAlign: 'center',
    width: '100%',
    letterSpacing: 1,
  },
  nowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5FF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E9D8FD',
  },
  nowButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8E63B8',
  },
});
