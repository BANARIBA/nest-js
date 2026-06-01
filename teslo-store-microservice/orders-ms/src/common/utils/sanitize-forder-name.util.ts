export const sanitizeFolderName = (name: string): string => {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '_')
      // eslint-disable-next-line no-useless-escape
      .replace(/[^a-z0-9_\-]/g, '')
  );
};
