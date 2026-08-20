import { create } from 'zustand';
import { Medication, DailyMedicationDoseItem, MedicationFrequency } from '../domain/medications/types';
import { medicationRepository } from '../storage/medicationRepository';

interface MedicationState {
  medications: Medication[];
  dailyItems: DailyMedicationDoseItem[];
  isLoading: boolean;
  isModalOpen: boolean;
  isManagerOpen: boolean;
  editingMedication: Medication | null;

  // Actions
  loadMedications: () => Promise<void>;
  loadDailyItems: (date: string) => Promise<void>;
  toggleTaken: (
    medicationId: string,
    date: string,
    doseIndex?: number,
    scheduledTime?: string
  ) => Promise<void>;
  saveMedication: (data: {
    id?: string;
    name: string;
    dosage: string;
    frequency: MedicationFrequency;
    times?: string[];
    time?: string;
    instructions?: string;
    active?: boolean;
  }) => Promise<void>;
  toggleActive: (id: string, active: boolean) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;

  openNewModal: () => void;
  openEditModal: (medication: Medication) => void;
  closeModal: () => void;
  openManager: () => void;
  closeManager: () => void;
}

export const useMedicationStore = create<MedicationState>((set, get) => ({
  medications: [],
  dailyItems: [],
  isLoading: false,
  isModalOpen: false,
  isManagerOpen: false,
  editingMedication: null,

  loadMedications: async () => {
    set({ isLoading: true });
    try {
      const all = await medicationRepository.getAllMedications();
      set({ medications: all });
    } catch {
      // Fallback securely
    } finally {
      set({ isLoading: false });
    }
  },

  loadDailyItems: async (date: string) => {
    try {
      const items = await medicationRepository.getDailyItems(date);
      set({ dailyItems: items });
    } catch {
      // Fallback securely
    }
  },

  toggleTaken: async (medicationId: string, date: string, doseIndex = 0, scheduledTime?: string) => {
    const { dailyItems } = get();
    const currentItem = dailyItems.find(
      (i) => i.medication.id === medicationId && i.doseIndex === doseIndex
    );
    const newStatus = !currentItem?.isTaken;

    // Optimistic UI update
    set({
      dailyItems: dailyItems.map((i) =>
        i.medication.id === medicationId && i.doseIndex === doseIndex
          ? { ...i, isTaken: newStatus }
          : i
      ),
    });

    try {
      await medicationRepository.toggleMedicationDoseTaken(
        medicationId,
        date,
        doseIndex,
        scheduledTime,
        newStatus
      );
      await get().loadDailyItems(date);
    } catch {
      // Rollback on error
      await get().loadDailyItems(date);
    }
  },

  saveMedication: async (data) => {
    set({ isLoading: true });
    try {
      await medicationRepository.saveMedication({
        id: data.id,
        name: data.name,
        dosage: data.dosage,
        frequency: data.frequency,
        times: data.times || (data.time ? [data.time] : ['08:00']),
        time: data.time || (data.times && data.times[0]) || '08:00',
        instructions: data.instructions,
        active: data.active !== undefined ? data.active : true,
      });

      const today = new Date().toISOString().split('T')[0];
      await get().loadMedications();
      await get().loadDailyItems(today);

      set({ isModalOpen: false, editingMedication: null });
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  toggleActive: async (id: string, active: boolean) => {
    try {
      await medicationRepository.toggleMedicationActive(id, active);
      const today = new Date().toISOString().split('T')[0];
      await get().loadMedications();
      await get().loadDailyItems(today);
    } catch {
      // Fallback
    }
  },

  deleteMedication: async (id: string) => {
    try {
      await medicationRepository.deleteMedication(id);
      const today = new Date().toISOString().split('T')[0];
      await get().loadMedications();
      await get().loadDailyItems(today);
    } catch {
      // Fallback
    }
  },

  openNewModal: () => set({ isModalOpen: true, editingMedication: null }),
  openEditModal: (medication: Medication) => set({ isModalOpen: true, editingMedication: medication }),
  closeModal: () => set({ isModalOpen: false, editingMedication: null }),
  openManager: () => set({ isManagerOpen: true }),
  closeManager: () => set({ isManagerOpen: false }),
}));
