// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  Flex,
  Text,
  ScrollArea,
  Select,
  Separator,
  Tooltip,
  Box,
  Grid,
} from "@radix-ui/themes";
import { CornerRightDown, Scan, Undo } from "lucide-react";
export default function Editor({
  image,
  setCropped,
  setImage,
}: {
  image: string;
  setCropped: (state: string) => void;
  setImage: (state: string) => void;
}) {
  const [crop, setCrop] = useState<Crop>({
    aspect: 1, // Specify the aspect ratio you want for cropping
    unit: "px", // You can use "px" or "%" for unit
    // width: 943, // Default width of the crop area
    // height: 707, // Default height of the crop area
  });
  const [croppedImage, setCroppedImage] = useState<string | undefined>();
  const [originalImage, setOriginalImage] = useState(image);

  const revertImage = () => {
    setImage(originalImage);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl); // Set the selected image as the source
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      setCrop({ ...crop, width: file.width, height: file.height }); // Adjust the crop dimensions based on the uploaded image
    }
  };

  const onCropComplete = (croppedCrop: Crop) => {
    // Handle crop completion here, e.g., update the cropped image state
    setCrop(croppedCrop);
    if (image) {
      getCroppedImage(image, croppedCrop, (croppedImg) => {
        setCroppedImage(croppedImg);
        setCropped(croppedImg);
      });
    }
  };

  // Function to get the cropped image
  const getCroppedImage = (
    source: string,
    crop: Crop,
    callback: (croppedImageUrl: string) => void,
  ) => {
    const image = new Image();
    image.src = source;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width!;
      canvas.height = crop.height!;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height,
        );

        canvas.toBlob((blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onload = () => {
              const croppedImageUrl = reader.result as string;
              callback(croppedImageUrl);
            };
            reader.readAsDataURL(blob);
          }
        }, "image/jpeg");
      }
    };
  };

  //link to / with the image in url
  const HandleSave = () => {
    return (
      <Link
        href={{
          pathname: "/",
          query: { image: croppedImage || originalImage },
        }}
        className="bg-primary rounded-xl p-4 text-3xl font-semibold"
      >
        Save Selection
      </Link>
    );
  };

  return (
    <ScrollArea
      type="always"
      scrollbars="vertical"
      className="text-dark sm:h-screen"
    >
      <div className="bg-light p-6 sm:p-12">
        <h2 className="text-dark text-3xl font-extrabold tracking-tight">
          EDITOR
        </h2>
        <Separator />
        <Flex gap="3">
          <Tooltip content="Scan another image">
            <Link href="/camera">
              <button className="border-dark hover:bg-primary font-secondary flex h-full items-center rounded-md border px-2 py-1 duration-150 hover:animate-pulse">
                Scan Again
                <Scan className="ml-1 h-4 w-4" />
              </button>
            </Link>
          </Tooltip>
          <Tooltip content="Upload another image">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="border-dark hover:bg-primary font-secondary hidden items-center rounded-md border px-2 py-1 duration-150 sm:flex"
            />
          </Tooltip>
          <Tooltip content="Revert to original image">
            <button
              className="border-dark hover:bg-primary font-secondary flex items-center rounded-md border px-2 py-1 duration-150 hover:animate-pulse"
              onClick={revertImage}
            >
              Revert
              <Undo className="ml-1 h-4 w-4" />
            </button>
          </Tooltip>
        </Flex>
        <Separator />
        <Text className="flex">
          Crop your image to highlight your food <CornerRightDown />
        </Text>
        <ReactCrop
          className="rounded-md"
          src={image}
          crop={crop}
          onChange={(newCrop) => setCrop(newCrop)}
          onComplete={onCropComplete}
        >
          <img src={image} alt="Original Image" />
        </ReactCrop>
        <HandleSave />
      </div>
      <Flex direction="column" justify="center" align="center" className="">
        {croppedImage && (
          <img
            src={croppedImage}
            className="border-dark my-auto flex rounded-md border border-dashed"
            alt="Cropped Image"
          />
        )}
      </Flex>
    </ScrollArea>
  );
}
