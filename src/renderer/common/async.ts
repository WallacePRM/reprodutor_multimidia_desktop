export const delay = (() => {

  let timer: any = 0;
  return (callback: any, ms: number) => {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();

export const validateUrl = (url: string) => {

  const urlRegex = /^https?:\/\/.+/;
  return urlRegex.test(url);
};