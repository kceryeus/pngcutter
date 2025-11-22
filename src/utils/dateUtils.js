export const formatDateDDMMYYYY = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

export const formatDateYYYYMMDD = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateMMDDYYYY = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${month}-${day}-${year}`;
};

const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const formatDateLong = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} de ${month} de ${year}`;
};

export const formatDateWithTime = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  const dateStr = formatDateDDMMYYYY(d);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${dateStr} ${hours}:${minutes}:${seconds}`;
};

export const hoje = new Date();

export const hojeFomatada = (format = 'DD-MM-AAAA') => {
  const d = hoje;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('AAAA', year)
    .replace('YYYY', year);
};

export const isValidDate = (dateString) => {
  const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
  const match = dateString.match(regex);
  if (!match) return false;
  
  const [, day, month, year] = match;
  const date = new Date(year, month - 1, day);
  return date.getDate() == day && date.getMonth() == month - 1 && date.getFullYear() == year;
};

export const isValidDateObject = (date) => {
  return date instanceof Date && !isNaN(date);
};

export const convertDateFormat = (dateString, fromFormat, toFormat) => {
  if (!isValidDate(dateString)) return null;
  
  const [day, month, year] = dateString.split('-');
  const date = new Date(year, month - 1, day);
  
  return toFormat
    .replace('DD', String(date.getDate()).padStart(2, '0'))
    .replace('MM', String(date.getMonth() + 1).padStart(2, '0'))
    .replace('AAAA', date.getFullYear())
    .replace('YYYY', date.getFullYear());
};


