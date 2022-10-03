export const validateUrl = (url: string) => {

  const urlRegex = /^https?:\/\/.+/;
  return urlRegex.test(url);
};