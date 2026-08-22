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

const categoryLabels: Record<FeedbackCategory, string> = {
  bug: '🐛 Bug / Falha Técnica',
  suggestion: '💡 Sugestão de Funcionalidade',
  clinical: '🩺 Inconsistência Clínica / Parecer Médico',
  other: '💬 Outro Assunto',
};

async function sendEmailNotification(payload: FeedbackReportPayload): Promise<void> {
  const apiKey = process.env.EXPO_PUBLIC_RESEND_API_KEY;
  if (!apiKey) return;

  const targetEmail = process.env.EXPO_PUBLIC_FEEDBACK_TARGET_EMAIL || 'figueiredogonzalez@live.com';
  const isDoctor = payload.userType === 'doctor';

  const doctorHtml =
    isDoctor && payload.doctorInfo
      ? `<div style="background-color:#F5F3FF; border:1px solid #DDD6FE; padding:14px; border-radius:10px; margin-bottom:16px;">
          <h3 style="margin-top:0; color:#6D28D9; font-size:14px;">🩺 Identificação Profissional (Médico / Especialista)</h3>
          <p style="margin:4px 0;"><strong>Nome:</strong> ${payload.doctorInfo.fullName}</p>
          <p style="margin:4px 0;"><strong>CRM:</strong> ${payload.doctorInfo.crm}/${payload.doctorInfo.uf}</p>
          <p style="margin:4px 0;"><strong>Especialidade:</strong> ${payload.doctorInfo.specialty || 'Não informada'}</p>
         </div>`
      : `<div style="background-color:#F8FAFC; border:1px solid #E2E8F0; padding:10px; border-radius:8px; margin-bottom:16px;">
          <p style="margin:0; color:#475569;"><strong>👤 Perfil:</strong> Paciente / Usuário do App</p>
         </div>`;

  const subject = `[RCU App] [${isDoctor ? `Médico CRM ${payload.doctorInfo?.crm}/${payload.doctorInfo?.uf}` : 'Paciente'}] ${categoryLabels[payload.category] || payload.category}`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width:600px; margin:0 auto; padding:24px; color:#1E293B; line-height:1.6; border:1px solid #E2E8F0; border-radius:16px; background-color:#FFFFFF;">
      <h2 style="color:#7B61FF; border-bottom:2px solid #EDE9FE; padding-bottom:12px; margin-top:0;">Novo Relato Recebido no RCU Acompanhamento</h2>
      
      ${doctorHtml}
      
      <p style="font-size:14px; margin-bottom:6px;"><strong>📌 Categoria:</strong> ${categoryLabels[payload.category] || payload.category}</p>
      
      <div style="background-color:#FAF5FF; border-left:4px solid #7B61FF; padding:14px; border-radius:6px; margin:16px 0;">
        <p style="margin:0; font-size:15px; color:#1E293B; white-space:pre-wrap;">${payload.message}</p>
      </div>

      <p style="font-size:13px; color:#64748B;">
        <strong>✉️ E-mail para retorno:</strong> ${payload.contactEmail || 'Não informado'}
      </p>

      ${
        payload.includeDeviceMeta
          ? `<p style="font-size:11px; color:#94A3B8; margin-top:20px; border-top:1px solid #E2E8F0; padding-top:12px;">
              📱 <strong>Diagnóstico:</strong> ${payload.deviceMetadata?.platform || Platform.OS} (OS: ${payload.deviceMetadata?.osVersion || Platform.Version}) • App v${payload.deviceMetadata?.appVersion || '1.0.1'}
            </p>`
          : ''
      }
    </div>
  `;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'RCU Acompanhamento <onboarding@resend.dev>',
        to: [targetEmail],
        subject,
        html,
      }),
    });
  } catch (err) {
    console.warn('[FeedbackService] Error sending email notification via Resend:', err);
  }
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

      // Dispara e-mail assíncrono via Resend sem bloquear a UI
      sendEmailNotification(payload).catch(() => {});

      return { success: true, id: docRef.id };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error submitting feedback';
      console.warn('[FeedbackService] Error submitting feedback report:', errorMessage);
      return { success: false, error: errorMessage };
    }
  },
};
