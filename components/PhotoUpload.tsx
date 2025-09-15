
import React, { useRef } from 'react';
import { CameraIcon, UserIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

interface PhotoUploadProps {
  photo: string | null;
  setPhoto: (photo: string | null) => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ photo, setPhoto }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="text-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg"
      />
      <div className="w-32 h-40 mx-auto border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50 cursor-pointer" onClick={handleClick}>
        {photo ? (
          <img src={photo} alt="Applicant" className="w-full h-full object-cover rounded-md" />
        ) : (
          <div className="text-gray-400 text-center">
            <UserIcon className="h-16 w-16 mx-auto"/>
            <p className="text-xs mt-1">Pas Foto 3 x 4</p>
          </div>
        )}
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mandiri-blue"
      >
        <CameraIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
        Upload Foto
      </motion.button>
    </div>
  );
};

export default PhotoUpload;
