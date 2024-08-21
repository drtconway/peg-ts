export type Range = [string, string] | [number, number];

export function simplify(r: Range): [number, number] {
  const r0 = typeof r[0] == 'string' ? r[0].charCodeAt(0) : r[0];
  const r1 = typeof r[1] == 'string' ? r[1].charCodeAt(0) : r[1];
  return [r0, r1];
}

export function tuple<T, U>(x0: T, x1: U): [T, U] {
  return [x0, x1];
}

export function first<T, U>(xs: [T, U]): T {
  return xs[0];
}

export function second<T, U>(xs: [T, U]): U {
  return xs[1];
}
