import { create } from 'zustand';
import { BloodPresence, BristolType, CrisisEvaluation, DailySymptomEntry } from '../domain/health/types';
import { evaluateCrisis } from '../domain/health/evaluateCrisis';
import { symptomRepository } from '../storage/symptomRepository';

interface SymptomState {
  selectedDate: string;
  bristolType: BristolType;
  bloodPresence: BloodPresence;
  painLevel: number;
  notes: string;
  isSaving: boolean;
  activeFeedback: CrisisEvaluation | null;
  showFeedbackModal: boolean;
  recentLogs: DailySymptomEntry[];

  // Actions
  setSelectedDate: (date: string) => void;
  setBristolType: (type: BristolType) => void;
  setBloodPresence: (blood: BloodPresence) => void;
  setPainLevel: (level: number) => void;
  setNotes: (notes: string) => void;
  resetForm: () => void;
  closeFeedbackModal: () => void;
  loadRecentLogs: () => Promise<void>;
  loadLogForDate: (date: string) => Promise<void>;
  submitDailyLog: () => Promise<CrisisEvaluation>;
}

const getTodayDateString = () => new Date().toISOString().split('T')[0];

export const useSymptomStore = create<SymptomState>((set, get) => ({
  selectedDate: getTodayDateString(),
  bristolType: 'type_4',
  bloodPresence: 'none',
  painLevel: 0,
  notes: '',
  isSaving: false,
  activeFeedback: null,
  showFeedbackModal: false,
  recentLogs: [],

  setSelectedDate: (date: string) => {
    set({ selectedDate: date });
    get().loadLogForDate(date);
  },

  setBristolType: (bristolType: BristolType) => set({ bristolType }),
  setBloodPresence: (bloodPresence: BloodPresence) => set({ bloodPresence }),
  setPainLevel: (painLevel: number) => set({ painLevel }),
  setNotes: (notes: string) => set({ notes }),

  resetForm: () =>
    set({
      bristolType: 'type_4',
      bloodPresence: 'none',
      painLevel: 0,
      notes: '',
      activeFeedback: null,
      showFeedbackModal: false,
    }),

  closeFeedbackModal: () => set({ showFeedbackModal: false }),

  loadRecentLogs: async () => {
    try {
      const logs = await symptomRepository.getRecentLogs(30);
      set({ recentLogs: logs });
    } catch {
      // Offline fallback / error safety without sensitive leak
    }
  },

  loadLogForDate: async (date: string) => {
    try {
      const existing = await symptomRepository.getLogByDate(date);
      if (existing) {
        set({
          bristolType: existing.bristolType,
          bloodPresence: existing.bloodPresence,
          painLevel: existing.painLevel,
          notes: existing.notes || '',
        });
      } else {
        set({
          bristolType: 'type_4',
          bloodPresence: 'none',
          painLevel: 0,
          notes: '',
        });
      }
    } catch {
      // Error handled safely
    }
  },

  submitDailyLog: async () => {
    const { selectedDate, bristolType, bloodPresence, painLevel, notes } = get();

    set({ isSaving: true });

    const feedback = evaluateCrisis({
      bristolType,
      bloodPresence,
      painLevel,
    });

    const entry: DailySymptomEntry = {
      date: selectedDate,
      bristolType,
      bloodPresence,
      painLevel,
      notes: notes.trim() || undefined,
      severity: feedback.severity,
      createdAt: Date.now(),
    };

    try {
      await symptomRepository.save(entry);
      await get().loadRecentLogs();

      set({
        isSaving: false,
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
