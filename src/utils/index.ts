export const delay = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

export const isEmpty = (value: unknown): boolean => {
  if (value == null) {
    return true;
  }
  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0;
  }
  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }
  return false;
};

export * from './apiHelpers';
export * from './authValidation';
export * from './authRole';
export * from './mediaPicker';
export * from './vehicleMappers';
