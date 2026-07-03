export const normalizeString = (str) => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

export const cleanString = (str) => {
  return str.trim().replace(/\s+/g, ' ');
};

export const truncateString = (str, maxLength = 30, suffix = '...') => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - suffix.length) + suffix;
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const toCamelCase = (str) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '')
    .replace(/[^a-zA-Z0-9]/g, '');
};

export const toPascalCase = (str) => {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
};

export const toKebabCase = (str) => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');
};

export const toSnakeCase = (str) => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '');
};

export const removeSpecialCharacters = (str) => {
  return str.replace(/[^a-zA-Z0-9\s]/g, '');
};

export const isEmpty = (str) => {
  return !str || str.trim().length === 0;
};

export const isNumeric = (str) => {
  return !isNaN(str) && !isNaN(parseFloat(str));
};

export const countOccurrences = (str, substring) => {
  return (str.match(new RegExp(substring, 'g')) || []).length;
};

export const replaceMultiple = (str, replacements) => {
  let result = str;
  Object.entries(replacements).forEach(([search, replace]) => {
    result = result.replace(new RegExp(search, 'g'), replace);
  });
  return result;
};

export const reverseString = (str) => {
  return str.split('').reverse().join('');
};

export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};



