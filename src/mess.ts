export type Mess<T> = T | Mess<T>[];

export function concat(m: Mess<string>): string {
  return flatten(m).join('');
}

export function flatten<T>(m: Mess<T>): T[] {
  const parts: T[] = [];
  flattenInner(m, parts);
  return parts;
}

function flattenInner<T>(m: Mess<T>, parts: T[]) {
  if (Array.isArray(m)) {
    for (const x of m) {
      flattenInner(x, parts);
    }
  } else {
    parts.push(m);
  }
}
