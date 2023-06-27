import {useState, useRef, useCallback} from 'react';

export function useFileHandler() {
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  const clearFile = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleFileChange = useCallback(
    (file) => {
    let maxSize = 7000000; // 7MB

    if (file && file.size > maxSize) {
      alert("File is too large, please pick a file smaller than or equal 7MB.");
      return;
    }

    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview('');
      clearFile();
    }
  },
    [preview, setPreview],
  );

  return { preview, inputRef, handleFileChange };
}
