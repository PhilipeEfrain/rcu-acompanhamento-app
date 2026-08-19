import { create } from 'zustand';
import { BloodPresence, BristolType, CrisisEvaluation, DailyAggregatedSummary, DailySymptomEntry, MucusPresence, UrgencyLevel } from '../domain/health/types';
import { evaluateCrisis, evaluateDailySummary } from '../domain/health/evaluateCrisis';
import { symptomRepository } from '../storage/symptomRepository';

const getCurrentTimeString = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const getTodayDateString = () => new Date().toISOString().split('T')[0];

interface SymptomState {
  selectedDate: string;
  editingEntryId: string | null;
  time: string;
  bristolType: BristolType;
  bloodPresence: BloodPresence;
  painLevel: number;
  notes: string;
  isFormOpen: boolean;
  isSaving: boolean;
  activeFeedback: CrisisEvaluation | null;
  showFeedbackModal: boolean;
  dayLogs: DailySymptomEntry[];
  dailySummary: DailyAggregatedSummary | null;

  // Extended clinical biomarkers (Issue #9)
  stressLevel: number | null;
  hasClots: boolean;
  mucusPresence: MucusPresence;
  urgencyLevel: UrgencyLevel;

  // Actions
  setSelectedDate: (date: string) => Promise<void>;
  setTime: (time: string) => void;
  setBristolType: (type: BristolType) => void;
  setBloodPresence: (blood: BloodPresence) => void;
  setPainLevel: (level: number) => void;
  setNotes: (notes: string) => void;
  setStressLevel: (level: number | null) => void;
  setHasClots: (hasClots: boolean) => void;
  setMucusPresence: (mucus: MucusPresence) => void;
  setUrgencyLevel: (urgency: UrgencyLevel) => void;

  startNewEntry: (date?: string) => void;
  startEditEntry: (entry: DailySymptomEntry) => void;
  cancelForm: () => void;
  deleteEntry: (id: string) => Promise<void>;
  loadDateData: (date: string) => Promise<void>;
  loadRecentLogs: () => Promise<void>;
  resetToToday: () => Promise<void>;
  closeFeedbackModal: () => void;
  submitDailyLog: () => Promise<CrisisEvaluation>;
}

export const useSymptomStore = create<SymptomState>((set, get) => ({
  selectedDate: getTodayDateString(),
  editingEntryId: null,
  time: getCurrentTimeString(),
  bristolType: 'type_4',
  bloodPresence: 'none',
  painLevel: 0,
  notes: '',
  isFormOpen: false,
  isSaving: false,
  activeFeedback: null,
  showFeedbackModal: false,
  dayLogs: [],
  dailySummary: null,

  // Extended biomarkers defaults
  stressLevel: null,
  hasClots: false,
  mucusPresence: 'none',
  urgencyLevel: 'normal',

  setSelectedDate: async (date: string) => {
    set({ selectedDate: date });
    await get().loadDateData(date);
  },

  setTime: (time: string) => set({ time }),
  setBristolType: (bristolType: BristolType) => set({ bristolType }),
  setBloodPresence: (bloodPresence: BloodPresence) => set({ bloodPresence }),
  setPainLevel: (painLevel: number) => set({ painLevel }),
  setNotes: (notes: string) => set({ notes }),
  setStressLevel: (stressLevel: number | null) => set({ stressLevel }),
  setHasClots: (hasClots: boolean) => set({ hasClots }),
  setMucusPresence: (mucusPresence: MucusPresence) => set({ mucusPresence }),
  setUrgencyLevel: (urgencyLevel: UrgencyLevel) => set({ urgencyLevel }),

  startNewEntry: (date?: string) => {
    const targetDate = date || get().selectedDate;
    set({
      selectedDate: targetDate,
      editingEntryId: null,
      time: getCurrentTimeString(),
      bristolType: 'type_4',
      bloodPresence: 'none',
      painLevel: 0,
      notes: '',
      stressLevel: null,
      hasClots: false,
      mucusPresence: 'none',
      urgencyLevel: 'normal',
      isFormOpen: true,
    });
  },

  startEditEntry: (entry: DailySymptomEntry) => {
    set({
      selectedDate: entry.date,
      editingEntryId: entry.id || null,
      time: entry.time || getCurrentTimeString(),
      bristolType: entry.bristolType,
      bloodPresence: entry.bloodPresence,
      painLevel: entry.painLevel,
      notes: entry.notes || '',
      stressLevel: entry.stressLevel ?? null,
      hasClots: Boolean(entry.hasClots),
      mucusPresence: entry.mucusPresence || 'none',
      urgencyLevel: entry.urgencyLevel || 'normal',
      isFormOpen: true,
    });
  },

  cancelForm: () => {
    set({
      isFormOpen: false,
      editingEntryId: null,
    });
  },

  deleteEntry: async (id: string) => {
    try {
      await symptomRepository.deleteLog(id);
      await get().loadDateData(get().selectedDate);
    } catch {
      // Handle securely
    }
  },

  loadDateData: async (date: string) => {
    try {
      const logs = await symptomRepository.getLogsForDate(date);
      const summary = evaluateDailySummary(date, logs);
      set({
        dayLogs: logs,
        dailySummary: summary,
      });
    } catch {
      // Secure fallback
    }
  },

  loadRecentLogs: async () => {
    await get().loadDateData(get().selectedDate);
  },

  resetToToday: async () => {
    const today = getTodayDateString();
    set({
      selectedDate: today,
      isFormOpen: false,
      editingEntryId: null,
    });
    await get().loadDateData(today);
  },

  closeFeedbackModal: () => set({ showFeedbackModal: false }),

  submitDailyLog: async () => {
    const {
      selectedDate,
      editingEntryId,
      time,
      bristolType,
      bloodPresence,
      painLevel,
      notes,
      stressLevel,
      hasClots,
      mucusPresence,
      urgencyLevel,
    } = get();

    set({ isSaving: true });

    const feedback = evaluateCrisis({
      bristolType,
      bloodPresence,
      painLevel,
      hasClots,
      mucusPresence,
      urgencyLevel,
    });

    const entry: DailySymptomEntry = {
      id: editingEntryId || undefined,
      date: selectedDate,
      time,
      bristolType,
      bloodPresence,
      painLevel,
      notes: notes.trim() || undefined,
      severity: feedback.severity,
      createdAt: Date.now(),
      stressLevel: stressLevel !== null ? stressLevel : undefined,
      hasClots,
      mucusPresence,
      urgencyLevel,
    };

    try {
      await symptomRepository.save(entry);
      await get().loadDateData(selectedDate);

      set({
        isSaving: false,
        isFormOpen: false,
        editingEntryId: null,
        activeFeedback: feedback,
        showFeedbackModal: true,
      });

      return feedback;
    } catch (error) {
      set({ isSaving: false });
      throw error;
    }
  },
}));
