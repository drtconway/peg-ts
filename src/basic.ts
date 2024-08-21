import { failure, Parser, success } from './core';
import { first, Range, second, simplify } from './utils';

export function lit(s: string): Parser<string> {
  return new Parser((context) => {
    if (!context.more()) {
      return failure('lit: unexpected eof');
    }
    if (context.text.startsWith(s, context.position)) {
      context.position += s.length;
      return success(s);
    } else {
      return failure('lit: no match');
    }
  });
}

export function char(...cs: string[]): Parser<string> {
  return new Parser((context) => {
    if (!context.more()) {
      return failure('lit: unexpected eof');
    }
    const c = context.text.charAt(context.position);
    if (cs.find((x) => x == c)) {
      context.position += 1;
      return success(c);
    } else {
      return failure('char: not found');
    }
  });
}

export function chars(...ranges: Range[]): Parser<string> {
  const rs: [number, number][] = [];
  ranges.forEach((r) => {
    rs.push(simplify(r));
  });
  return new Parser((context) => {
    if (!context.more()) {
      return failure('lit: unexpected eof');
    }
    const c = context.text.codePointAt(context.position) || 0;
    for (const r of rs) {
      if (r[0] <= c && c <= r[1]) {
        context.position += 1;
        return success(String.fromCodePoint(c));
      }
    }
    return failure('chars: not in range');
  });
}

export function around<T>(lhs: string, p: Parser<T>, rhs: string): Parser<T> {
  return lit(lhs).then(p).map(second).then(lit(rhs)).map(first);
}

export function parens<T>(p: Parser<T>): Parser<T> {
  return around('(', p, ')');
}

export function brackets<T>(p: Parser<T>): Parser<T> {
  return around('[', p, ']');
}

export function braces<T>(p: Parser<T>): Parser<T> {
  return around('{', p, '}');
}
