import { useState, useCallback } from "react";

const useAsyncError = () => {
  // eslint-disable-next-line
  const [_, setError] = useState();
  return useCallback(
    (e) => {
      setError(() => {
        throw e;
      });
    },
    [setError]
  );
};

export default useAsyncError;
