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
