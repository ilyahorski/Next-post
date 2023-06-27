import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export function useImageDropzone({handleFileChange}) {
  const onDrop = useCallback((acceptedFiles) => {
    handleFileChange(acceptedFiles[0]);
  }, [handleFileChange]);

  const { getRootProps, open, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/jpg': [],
      'image/png': [],
      'image/gif': []
    },
    onDrop,
    noClick: true,
    maxFiles: 1,
  });

  return { getRootProps, open, isDragActive };
}
