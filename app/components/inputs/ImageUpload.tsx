'use client';

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useCallback, useState } from "react";
import { TbPhotoPlus } from 'react-icons/tb'

declare global {
  var cloudinary: any
}

const uploadPreset = "g5mdhl8q";

interface ImageUploadProps {
  onChange: (value: string) => void;
  value: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange, value,
}) => {
  const handleUpload = useCallback((result: any) => {
    onChange(result.info.secure_url);
  }, [onChange]);
  const [hasError, setHasError] = useState(false);

  return (
    <CldUploadWidget onUpload={handleUpload} uploadPreset={uploadPreset} options={{
        maxFiles: 1
      }}
    >
      {({ open }) => {
        return (
          <div onClick={() => open?.()} className="relative cursor-pointer hover:opacity-70 transition border-dashed border-2 p-20 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600">
            <TbPhotoPlus size={50} />
            <div className="font-semibold text-lg">
              Click to upload
            </div>
            {value && (
              <div className="absolute inset-0 w-full h-full">
                <Image fill style={{ objectFit: 'cover' }} src={hasError ? "https://salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled.png" : value} alt="House" onError={() => !hasError && setHasError(true)}/>
              </div>
            )}
          </div>
        ) 
    }}
    </CldUploadWidget>
  );
}

export default ImageUpload;