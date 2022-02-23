import { ParsedUrlQuery } from 'querystring';

export default function getStringValueFromQuery({
  query,
  field,
}: {
  query: ParsedUrlQuery;
  field: string;
}): string | undefined {
  const value = query[field];
  if (value) {
    return Array.isArray(value) ? value[0] : value;
  }
  return undefined;
}

export function getStringValueFromQueryWithDefault({
  query,
  field,
  defaultValue,
}: {
  query: ParsedUrlQuery;
  field: string;
  defaultValue: string;
}): string {
  const value = query[field];
  if (value) {
    return Array.isArray(value) ? value[0] : value;
  }
  return defaultValue;
}
