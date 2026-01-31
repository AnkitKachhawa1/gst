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
    <div className={`border-2 border-dashed ${borderColor} rounded-lg p-4 flex flex-col items-center justify-center text-center transition cursor-pointer relative`}>
      <input 
        type="file" 
        accept={accept} 
        multiple={multiple} 
        onChange={handleChange} 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <UploadCloud className={`w-8 h-8 mb-2 ${iconColor}`} />
      <h3 className="font-semibold text-sm text-gray-700">{title}</h3>
      <p className="text-[10px] text-gray-400 mt-1">
        {multiple ? "Drag & drop multiple files" : "Drag & drop your file"}
      </p>
      <div className="mt-2 flex gap-2">
         <span className="text-[9px] px-1.5 py-0.5 bg-white rounded border border-gray-100 text-gray-400 font-mono">
            {accept.replace(/\./g, '').toUpperCase()}
         </span>
      </div>
    </div>
  );
}
