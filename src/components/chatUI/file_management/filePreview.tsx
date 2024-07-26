//@ts-nocheck
import { Flex } from "@radix-ui/themes";
import { PaperclipIcon, XIcon, Box, CameraIcon } from "lucide-react";
import Link from "next/link";

export default function FilePreview({
  imageFile,
  file,
  setFile,
}: {
  imageFile: { image: string; name: string };
  file: File | null;
  setFile: any;
}) {
  if (!file && !imageFile.image) return null;

  var fileUrl = "";
  if (file) {
    fileUrl = URL.createObjectURL(file);
  }
  const fileType = file?.type;

  const ImageViewer = () => {
    return imageFile.image ? (
      <img
        src={imageFile.image}
        alt={imageFile.name}
        className="mt-2 h-auto max-w-full rounded-md border-2 border-dashed border-white/40"
      />
    ) : (
      <img
        src={fileUrl}
        alt={file?.name}
        className="mt-2 h-auto max-w-full rounded-md border-2 border-dashed border-white/40"
      />
    );
  };

  return (
    <Flex
      direction="column"
      className="relative ml-auto w-1/2 rounded-lg bg-white/10 p-4 shadow dark:text-white"
    >
      <Box className="absolute right-[-1.5rem] top-7 h-0 w-0 rotate-[-90deg] border-l-[1rem] border-r-[1rem] border-t-[1rem] border-l-transparent border-r-transparent border-t-red-500"></Box>
      <Flex direction="row" align="center" className="mb-2">
        <Flex align="center" className="gap-2">
          {imageFile.image ? <CameraIcon /> : <PaperclipIcon />}{" "}
          {imageFile.image ? imageFile.name : file?.name}
        </Flex>
        {imageFile.image ? (
          <Link href="/" className="ml-auto cursor-pointer">
            <Flex>
              <XIcon />
            </Flex>
          </Link>
        ) : (
          <Flex
            onClick={() => setFile(null)}
            className="ml-auto cursor-pointer"
          >
            <XIcon />
          </Flex>
        )}
      </Flex>
      {(fileType?.startsWith("image/") || imageFile.name) && ImageViewer()}
      {fileType === "application/pdf" && (
        <embed
          src={fileUrl}
          type="application/pdf"
          width="100%"
          height="600px"
        />
      )}
      {/* For other file types, you can add more conditions here */}
    </Flex>
  );
}
