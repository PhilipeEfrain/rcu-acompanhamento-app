import { create } from 'zustand';
import {
  BloodAspect,
  BloodPresence,
  BristolType,
  CrisisEvaluation,
  DailyAggregatedSummary,
  DailySymptomEntry,
  MucusPresence,
  OutputType,
  TimePeriod,
  UrgencyLevel,
} from '../domain/health/types';
import { evaluateCrisis, evaluateDailySummary } from '../domain/health/evaluateCrisis';
import { getLocalDateString, isFutureDate, inferTimePeriod } from '../domain/health/dateUtils';
import { symptomRepository } from '../storage/symptomRepository';

const getCurrentTimeString = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const getTodayDateString = () => getLocalDateString();

interface SymptomState {
  selectedDate: string;
  editingEntryId: string | null;
  time: string;
  outputType: OutputType;
  period: TimePeriod;
  bristolType: BristolType;
  bloodPresence: BloodPresence;
  bloodAspect: BloodAspect;
  painLevel: number;
  notes: string;
  isFormOpen: boolean;
  isSaving: boolean;
  activeFeedback: CrisisEvaluation | null;
  showFeedbackModal: boolean;
  dayLogs: DailySymptomEntry[];
  dailySummary: DailyAggregatedSummary | null;

  // Extended clinical biomarkers (Issue #9, #16 & #18)
  stressLevel: number | null;
  hasClots: boolean;
  mucusPresence: MucusPresence;
  urgencyLevel: UrgencyLevel;
  hasFever: boolean;
  hasDizziness: boolean;
  hasExtremeFatigue: boolean;
  hasTachycardia: boolean;

  // Actions
  setSelectedDate: (date: string) => Promise<void>;
  setTime: (time: string) => void;
  setOutputType: (outputType: OutputType) => void;
  setPeriod: (period: TimePeriod) => void;
  setBristolType: (type: BristolType) => void;
  setBloodPresence: (blood: BloodPresence) => void;
  setBloodAspect: (aspect: BloodAspect) => void;
  setPainLevel: (level: number) => void;
  setNotes: (notes: string) => void;
  setStressLevel: (level: number | null) => void;
  setHasClots: (hasClots: boolean) => void;
  setMucusPresence: (mucus: MucusPresence) => void;
  setUrgencyLevel: (urgency: UrgencyLevel) => void;
  setHasFever: (hasFever: boolean) => void;
  setHasDizziness: (hasDizziness: boolean) => void;
  setHasExtremeFatigue: (hasExtremeFatigue: boolean) => void;
  setHasTachycardia: (hasTachycardia: boolean) => void;
  toggleFever: () => void;
  toggleDizziness: () => void;
  toggleExtremeFatigue: () => void;
  toggleTachycardia: () => void;

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

const initialTimeString = getCurrentTimeString();

export const useSymptomStore = create<SymptomState>((set, get) => ({
  selectedDate: getTodayDateString(),
  editingEntryId: null,
  time: initialTimeString,
  outputType: 'feces',
  period: inferTimePeriod(initialTimeString),
  bristolType: 'type_4',
  bloodPresence: 'none',
  bloodAspect: 'none',
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
  hasFever: false,
  hasDizziness: false,
  hasExtremeFatigue: false,
  hasTachycardia: false,

  setSelectedDate: async (date: string) => {
    set({ selectedDate: date });
    await get().loadDateData(date);
  },

  setTime: (time: string) => {
    const period = inferTimePeriod(time);
    set({ time, period });
  },

  setOutputType: (outputType: OutputType) => {
    if (outputType === 'blood_mucus_only') {
      set({
        outputType,
        bloodPresence: 'severe',
        bloodAspect: 'pure_blood',
        mucusPresence: get().mucusPresence === 'none' ? 'mild' : get().mucusPresence,
      });
    } else {
      set({
        outputType,
        bloodPresence: get().bloodPresence === 'severe' && get().bloodAspect === 'pure_blood' ? 'none' : get().bloodPresence,
      });
    }
  },

  setPeriod: (period: TimePeriod) => set({ period }),
  setBristolType: (bristolType: BristolType) => set({ bristolType }),
  setBloodPresence: (bloodPresence: BloodPresence) => set({ bloodPresence }),
  setBloodAspect: (bloodAspect: BloodAspect) => {
    let bloodPresence: BloodPresence = 'none';
    let hasClots = get().hasClots;
    if (bloodAspect === 'traces') bloodPresence = 'traces';
    else if (bloodAspect === 'mixed') bloodPresence = 'moderate';
    else if (bloodAspect === 'pure_blood') bloodPresence = 'severe';
    else if (bloodAspect === 'clots') {
      bloodPresence = 'severe';
      hasClots = true;
    }
    set({ bloodAspect, bloodPresence, hasClots });
  },
  setPainLevel: (painLevel: number) => set({ painLevel }),
  setNotes: (notes: string) => set({ notes }),
  setStressLevel: (stressLevel: number | null) => set({ stressLevel }),
  setHasClots: (hasClots: boolean) => set({ hasClots }),
  setMucusPresence: (mucusPresence: MucusPresence) => set({ mucusPresence }),
  setUrgencyLevel: (urgencyLevel: UrgencyLevel) => set({ urgencyLevel }),
  setHasFever: (hasFever: boolean) => set({ hasFever }),
  setHasDizziness: (hasDizziness: boolean) => set({ hasDizziness }),
  setHasExtremeFatigue: (hasExtremeFatigue: boolean) => set({ hasExtremeFatigue }),
  setHasTachycardia: (hasTachycardia: boolean) => set({ hasTachycardia }),
  toggleFever: () => set((state) => ({ hasFever: !state.hasFever })),
  toggleDizziness: () => set((state) => ({ hasDizziness: !state.hasDizziness })),
  toggleExtremeFatigue: () => set((state) => ({ hasExtremeFatigue: !state.hasExtremeFatigue })),
  toggleTachycardia: () => set((state) => ({ hasTachycardia: !state.hasTachycardia })),

  startNewEntry: (date?: string) => {
    let targetDate = date || get().selectedDate;
    if (isFutureDate(targetDate)) {
      targetDate = getTodayDateString();
    }
    const currentTime = getCurrentTimeString();
    set({
      selectedDate: targetDate,
      editingEntryId: null,
      time: currentTime,
      outputType: 'feces',
      period: inferTimePeriod(currentTime),
      bristolType: 'type_4',
      bloodPresence: 'none',
      bloodAspect: 'none',
      painLevel: 0,
      notes: '',
      stressLevel: null,
      hasClots: false,
      mucusPresence: 'none',
      urgencyLevel: 'normal',
      hasFever: false,
      hasDizziness: false,
      hasExtremeFatigue: false,
      hasTachycardia: false,
      isFormOpen: true,
    });
  },

  startEditEntry: (entry: DailySymptomEntry) => {
    const entryTime = entry.time || getCurrentTimeString();
    set({
      selectedDate: entry.date,
      editingEntryId: entry.id || null,
      time: entryTime,
      outputType: entry.outputType || 'feces',
      period: entry.period || inferTimePeriod(entryTime),
      bristolType: entry.bristolType,
      bloodPresence: entry.bloodPresence,
      bloodAspect: entry.bloodAspect || (entry.hasClots ? 'clots' : entry.bloodPresence === 'severe' ? 'pure_blood' : entry.bloodPresence === 'moderate' ? 'mixed' : entry.bloodPresence === 'traces' ? 'traces' : 'none'),
      painLevel: entry.painLevel,
      notes: entry.notes || '',
      stressLevel: entry.stressLevel !== undefined ? entry.stressLevel : null,
      hasClots: Boolean(entry.hasClots),
      mucusPresence: entry.mucusPresence || 'none',
      urgencyLevel: entry.urgencyLevel || 'normal',
      hasFever: Boolean(entry.hasFever),
      hasDizziness: Boolean(entry.hasDizziness),
      hasExtremeFatigue: Boolean(entry.hasExtremeFatigue),
      hasTachycardia: Boolean(entry.hasTachycardia),
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
      outputType,
      period,
      bristolType,
      bloodPresence,
      bloodAspect,
      painLevel,
      notes,
      stressLevel,
      hasClots,
      mucusPresence,
      urgencyLevel,
      hasFever,
      hasDizziness,
      hasExtremeFatigue,
      hasTachycardia,
    } = get();

    set({ isSaving: true });

    const effectivePeriod = period || inferTimePeriod(time);
    const effectiveBloodPresence = outputType === 'blood_mucus_only' ? 'severe' : bloodPresence;
    const effectiveBloodAspect = outputType === 'blood_mucus_only' ? 'pure_blood' : bloodAspect;
    const effectiveBristol = outputType === 'feces' ? bristolType : 'type_4';

    const feedback = evaluateCrisis({
      bristolType: effectiveBristol,
      bloodPresence: effectiveBloodPresence,
      painLevel,
      outputType,
      period: effectivePeriod,
      bloodAspect: effectiveBloodAspect,
      hasClots,
      mucusPresence,
      urgencyLevel,
      hasFever,
      hasDizziness,
      hasExtremeFatigue,
      hasTachycardia,
    });

    const effectiveDate = isFutureDate(selectedDate) ? getTodayDateString() : selectedDate;

    const entry: DailySymptomEntry = {
      id: editingEntryId || undefined,
      date: effectiveDate,
      time,
      outputType,
      period: effectivePeriod,
      bristolType: effectiveBristol,
      bloodPresence: effectiveBloodPresence,
      bloodAspect: effectiveBloodAspect,
      painLevel,
      notes: notes.trim() || undefined,
      severity: feedback.severity,
      createdAt: Date.now(),
      stressLevel: stressLevel !== null ? stressLevel : undefined,
      hasClots: hasClots || effectiveBloodAspect === 'clots',
      mucusPresence,
      urgencyLevel,
      hasFever,
      hasDizziness,
      hasExtremeFatigue,
      hasTachycardia,
    };

    try {
      await symptomRepository.save(entry);
      await get().loadDateData(effectiveDate);

      set({
        selectedDate: effectiveDate,
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
