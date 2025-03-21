export const dateStringFormatter = (date: Date): string => {
  return date.toISOString().replace('.000', '');
};
