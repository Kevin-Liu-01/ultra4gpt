/// <reference no-default-lib="true"/>
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

// import pdfjs from "pdfjs-dist";

async function convertFile(file: File, setConvertedFile: any) {
  let result = null;
  switch (file.type) {
    // case "application/pdf":
    //   result = await convertPdfToImage(file, setConvertedFile);
    //   break;
    // case ".doc":
    // case ".docx":
    //   result = await convertDocToText(file);
    //   break;
    case "image/jpg":
    case "image/jpeg":
    case "image/png":
    case "image/gif":
      result = await convertImageToBase64(file, setConvertedFile);
      break;
    default:
      throw new Error("Unsupported file type");
  }
  return { name: file.name, type: file.type, result: result };
}

//convertpdf to image, pdf is passed in as a File object
// async function convertPdfToImage(
//   file: File,
//   setConverted: {
//     (): void;
//     (arg0: { name: string; type: string; result: string }): any;
//   },
// ) {
//   const pdf = await pdfjs.getDocument(file).promise;
//   const page = await pdf.getPage(1);
//   const viewport = page.getViewport({ scale: 1 });
//   const canvas = document.createElement("canvas");
//   const context = canvas.getContext("2d");
//   canvas.height = viewport.height;
//   canvas.width = viewport.width;
//   await page.render({ canvasContext: context, viewport }).promise;
//   await setConverted({
//     name: file.name,
//     type: file.type,
//     result: canvas.toDataURL("image/png"),
//   });
//   return canvas.toDataURL("image/png");
// }

const convertImageToBase64 = async (
  file: File,
  setConverted: {
    (): void;
    (arg0: { name: string; type: string; result: string }): any;
  },
) => {
  var reader = new FileReader();
  reader.onloadend = async function () {
    await setConverted({
      name: file.name,
      type: file.type,
      result: reader.result as string,
    });
  };
  reader.readAsDataURL(file);
};

export default convertFile;
