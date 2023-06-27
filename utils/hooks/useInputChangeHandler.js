import { useCallback } from 'react';

export function useInputChangeHandler(setMyData) {
  return useCallback(
    (event) => {
      const { name, value, files } = event.target;
      setMyData((prevPost) => ({
        ...prevPost,
        [name]: files ? files[0] : value,
      }));
    },
    [setMyData],
  );
}