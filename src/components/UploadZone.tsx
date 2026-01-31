import React, { useCallback } from 'react';
import { UploadCloud, FileType } from 'lucide-react';

interface UploadZoneProps {
  title: string;
  accept: string;
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
  color?: string;
}

export function UploadZone({ title, accept, onFilesSelected, multiple = false, color = "blue" }: UploadZoneProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
    }
  };

  const borderColor = color === 'blue' ? 'border-blue-300 hover:border-blue-500 bg-blue-50' : 'border-purple-300 hover:border-purple-500 bg-purple-50';
  const iconColor = color === 'blue' ? 'text-blue-500' : 'text-purple-500';

  return (
    <div className={`border-2 border-dashed ${borderColor} rounded-xl p-8 flex flex-col items-center justify-center text-center transition cursor-pointer relative`}>
      <input 
        type="file" 
        accept={accept} 
        multiple={multiple} 
        onChange={handleChange} 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <UploadCloud className={`w-12 h-12 mb-4 ${iconColor}`} />
      <h3 className="font-semibold text-lg text-gray-700">{title}</h3>
      <p className="text-sm text-gray-500 mt-2">
        {multiple ? "Drag & drop multiple files" : "Drag & drop your file"} or click to browse
      </p>
      <div className="mt-4 flex gap-2">
         <span className="text-xs px-2 py-1 bg-white rounded border border-gray-200 text-gray-500 font-mono">
            {accept.replace(/\./g, '').toUpperCase()}
         </span>
      </div>
    </div>
  );
}
