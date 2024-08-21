export type Optional<T> = [] | [T];

export class Context {
  text: string;
  position: number;

  constructor(text: string) {
    this.text = text;
    this.position = 0;
  }

  more(): boolean {
    return this.position < this.text.length;
  }

  save(): Context {
    return { ...this };
  }

  restore(saved: Context) {
    this.position = saved.position;
  }
}

export type Result<T> =
  | { status: 'ok'; result: T }
  | { status: 'failed'; error: string };

export function success<T>(value: T): Result<T> {
  return { status: 'ok', result: value };
}

export function failure<T>(message: string): Result<T> {
  return { status: 'failed', error: message };
}

export type ParsingFunction<T> = (context: Context) => Result<T>;

export class Parser<T> {
  parser: ParsingFunction<T>;

  constructor(parser: ParsingFunction<T>) {
    this.parser = parser;
  }

  map<U>(f: (x: T) => U): Parser<U> {
    const p = this.parser;
    return new Parser((context) => {
      const res = p(context);
      if (res.status == 'ok') {
        return success(f(res.result));
      } else {
        return failure(res.error);
      }
    });
  }

  then<U>(other: Parser<U>): Parser<[T, U]> {
    const p = this.parser;
    const q = other.parser;
    return new Parser((context) => {
      const saved = context.save();
      const pRes = p(context);
      if (pRes.status == 'ok') {
        const qRes = q(context);
        if (qRes.status == 'ok') {
          return success([pRes.result, qRes.result]);
        } else {
          context.restore(saved);
          return failure(qRes.error);
        }
      } else {
        return failure(pRes.error);
      }
    });
  }

  or(other: Parser<T>): Parser<T> {
    const p = this.parser;
    const q = other.parser;
    return new Parser((context) => {
      const res = p(context);
      if (res.status == 'ok') {
        return res;
      } else {
        return q(context);
      }
    });
  }

  opt(): Parser<Optional<T>> {
    return new Parser(_opt(this.parser));
  }

  many0(): Parser<T[]> {
    return new Parser(_many0(this.parser));
  }

  many1(): Parser<T[]> {
    return new Parser(_many1(this.parser));
  }
}

export function parse<T>(p: Parser<T>, text: string): Result<T> {
  const context = new Context(text);
  const res = p.parser(context);
  if (res.status == 'ok') {
    if (!context.more()) {
      return res;
    } else {
      return failure('parse: trailing characters');
    }
  } else {
    return res;
  }
}

function _opt<T>(p: ParsingFunction<T>): ParsingFunction<Optional<T>> {
  return (context) => {
    const res = p(context);
    if (res.status == 'ok') {
      return success([res.result]);
    } else {
      return success([]);
    }
  };
}

function _many0<T>(p: ParsingFunction<T>): ParsingFunction<T[]> {
  return (context) => {
    const results: T[] = [];
    for (;;) {
      const res = p(context);
      if (res.status == 'ok') {
        results.push(res.result);
      } else {
        break;
      }
    }
    return success(results);
  };
}

function _many1<T>(p: ParsingFunction<T>): ParsingFunction<T[]> {
  return (context) => {
    const results: T[] = [];

    const res = p(context);
    if (res.status == 'ok') {
      results.push(res.result);
    } else {
      return failure(res.error);
    }

    for (;;) {
      const res = p(context);
      if (res.status == 'ok') {
        results.push(res.result);
      } else {
        break;
      }
    }
    return success(results);
  };
}
