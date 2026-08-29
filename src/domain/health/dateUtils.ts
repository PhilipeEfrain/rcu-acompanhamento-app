import { TimePeriod } from './types';

/**
 * Retorna a data no formato YYYY-MM-DD considerando o fuso horário local do dispositivo.
 * Evita o bug de deslocamento de fuso (ex: UTC-3 à noite gerando D+1).
 */
export const getLocalDateString = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Retorna se a data especificada (YYYY-MM-DD) é estritamente futura em relação à data local de hoje.
 */
export const isFutureDate = (dateString: string): boolean => {
  const today = getLocalDateString();
  return dateString > today;
};

/**
 * Infere o período do dia (manhã/acordar, tarde, noite) a partir do horário informado (HH:mm)
 * ou do horário atual. Elimina a necessidade de seleção manual redundante.
 */
export const inferTimePeriod = (timeString?: string): TimePeriod => {
  let hour = new Date().getHours();
  if (timeString && timeString.includes(':')) {
    const parsedHour = parseInt(timeString.split(':')[0], 10);
    if (!isNaN(parsedHour)) {
      hour = parsedHour;
    }
  }
  if (hour >= 5 && hour < 12) return 'waking_morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  return 'night';
};
