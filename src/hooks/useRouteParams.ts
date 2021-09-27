import { useParams } from 'react-router';

export function useRouteParams<T>(): T {
  const params: any = useParams();

  const result: T = Object.keys(params).reduce((result, key) => {
    result[key] = params[key].match(/^[0-9]+$/)
      ? parseInt(params[key], 10)
      : params[key];
    return result;
  }, {} as any);

  return result;
}
