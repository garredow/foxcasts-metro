import { useLocation } from 'react-router-dom';

export function useQueryParams<T>(): T {
  const raw = useLocation().search;
  if (!raw) return {} as T;

  const result: T = raw
    .slice(1)
    .split('&')
    .reduce((acc, val) => {
      const [k, v] = val.split('=');
      const decodedValue = decodeURIComponent(v);
      acc[k] = decodedValue.match(/^[0-9]+$/)
        ? parseInt(decodedValue, 10)
        : decodedValue;
      return acc;
    }, {} as any);

  return result;
}
