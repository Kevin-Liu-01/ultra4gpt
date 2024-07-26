type ConvertedFileType = {
  type: string;
  name: string;
  result: string;
};

export default function whichConvertedFile(
  convertedFile: ConvertedFileType | null,
  imageFile: {
    image: string;
    name: string;
  },
) {
  if (imageFile.image) {
    return {
      type: "image_url",
      image_url: {
        url: imageFile.image,
      },
    };
  }
  switch (convertedFile?.type) {
    case "image/jpg":
    case "image/jpeg":
    case "image/png":
    case "image/gif":
      return {
        type: "image_url",
        image_url: {
          url: convertedFile.result,
        },
      };
    case "application/pdf":
    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return {
        type: "text",
        text: convertedFile.result,
      };
    default:
      return { type: "text", text: "" };
  }
}
