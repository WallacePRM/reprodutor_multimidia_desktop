export const fileToDataUrl = (file: Blob) => {

    return new Promise((resolve, reject) => {

      const reader = new FileReader();
      reader.onload = (e: any) => {

        resolve(e.target.result);
      }

      reader.readAsDataURL(file);
    });
};
