import React, { createContext, useContext, useState } from 'react';
import { FadeLoader } from 'react-spinners';

interface Props {
  loading: boolean;
}

// for controlling loading spinner
const loadingContext = createContext<boolean>(false);
const setLoadingContext = createContext<React.Dispatch<React.SetStateAction<boolean>>>(() => {
});
export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  return (
    <loadingContext.Provider value={loading}>
      <setLoadingContext.Provider value={setLoading}>{children}</setLoadingContext.Provider>
    </loadingContext.Provider>
  );
};
export const useLoading = (): boolean => useContext(loadingContext);
export const useSetLoading = (): React.Dispatch<React.SetStateAction<boolean>> =>
  useContext(setLoadingContext);

const Loader: React.FC<Props> = ({ loading }) => {
  return loading ? (
    <div className="loader">
      <FadeLoader />
    </div>
) : (
  <></>
);
};

export default Loader;
