import {useState, useEffect, useCallback} from 'react';

export function useBoolean(initial = false) {
  const [value, setValue] = useState(initial);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  const toggle = useCallback(() => setValue(prev => !prev), []);

  return {value, setTrue, setFalse, toggle, setValue};
}

export function useMount(callback: () => void | (() => void)) {
  useEffect(() => {
    return callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export {useAuthBootstrap} from './useAuthBootstrap';
export {useSmartFocusFetch} from './useSmartFocusFetch';
