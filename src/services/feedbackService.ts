import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Platform } from 'react-native';

export type UserType = 'patient' | 'doctor';
export type FeedbackCategory = 'bug' | 'suggestion' | 'clinical' | 'other';

export interface DoctorInfo {
  fullName: string;
  crm: string;
  uf: string;
  specialty?: string;
}

export interface DeviceMetadata {
  appVersion: string;
  platform: string;
  osVersion: string | number;
}

export interface FeedbackReportPayload {
  userType: UserType;
  doctorInfo?: DoctorInfo;
  category: FeedbackCategory;
  message: string;
  contactEmail?: string;
  includeDeviceMeta: boolean;
  deviceMetadata?: DeviceMetadata;
}

export const feedbackService = {
  async submitFeedback(payload: FeedbackReportPayload): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const collectionRef = collection(db, 'feedback_reports');

      const dataToSave = {
        userType: payload.userType,
        category: payload.category,
        message: payload.message.trim(),
        contactEmail: payload.contactEmail ? payload.contactEmail.trim() : null,
        doctorInfo:
          payload.userType === 'doctor' && payload.doctorInfo
            ? {
                fullName: payload.doctorInfo.fullName.trim(),
                crm: payload.doctorInfo.crm.trim(),
                uf: payload.doctorInfo.uf.trim().toUpperCase(),
                specialty: payload.doctorInfo.specialty ? payload.doctorInfo.specialty.trim() : null,
              }
            : null,
        deviceMetadata: payload.includeDeviceMeta
          ? payload.deviceMetadata || {
              appVersion: '1.0.1',
              platform: Platform.OS,
              osVersion: Platform.Version,
            }
          : null,
        status: 'new',
        createdAt: serverTimestamp(),
      };

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: Conexão com Firestore excedeu 8 segundos')), 8000);
      });

      const addDocPromise = addDoc(collectionRef, dataToSave);
      const docRef = await Promise.race([addDocPromise, timeoutPromise]);
      return { success: true, id: docRef.id };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error submitting feedback';
      console.warn('[FeedbackService] Error submitting feedback report:', errorMessage);
      return { success: false, error: errorMessage };
    }
  },
};
