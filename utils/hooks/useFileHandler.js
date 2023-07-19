import {useState, useRef, useCallback} from 'react';
import {v4 as uuidv4} from "uuid";

export function useFileHandler(setFileData) {
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState('');
  const inputRef = useRef(null);

  const clearFile = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleFileChange = useCallback((file) => {
    if (file) {
      const type = file.type.split('/')[0];
      const extension = file.name.split('.').pop();
      const uniqueName = `${type}-${extension}-${uuidv4()}.${extension}`;
      const data = {
        preview: URL.createObjectURL(file),
        data: file,
        name: uniqueName,
        type: type
      };

      setPreview(data.preview);
      setFileData(data)
      setFileType(type)
    } else {
      setPreview('');
      setFileData(null);
      setFileType('')
      clearFile();
    }
  },
    [preview, setPreview],
  );

  return { preview, fileType, inputRef, handleFileChange };
}
