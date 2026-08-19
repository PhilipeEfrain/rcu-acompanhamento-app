import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FileText } from 'lucide-react-native';

interface NotesInputProps {
  notes: string;
  onChangeNotes: (text: string) => void;
}

export const NotesInput: React.FC<NotesInputProps> = ({ notes, onChangeNotes }) => {
  const { t } = useTranslation('dailyLog');

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <FileText size={16} color="#64748B" />
        <Text style={styles.sectionTitle}>{t('notes.title')}</Text>
      </View>

      <TextInput
        value={notes}
        onChangeText={onChangeNotes}
        placeholder={t('notes.placeholder')}
        placeholderTextColor="#94A3B8"
        multiline
        numberOfLines={3}
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    paddingHorizontal: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1E293B',
    minHeight: 80,
    textAlignVertical: 'top',
  },
});
