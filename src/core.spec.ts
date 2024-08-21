import test from 'ava';

import { failure, parse, Parser, success } from './core';
import { concat } from './mess';

const dot: Parser<string> = new Parser((context) => {
  if (context.more() && context.text.startsWith('.', context.position)) {
    context.position += 1;
    return success('.');
  } else {
    return failure('not a dot');
  }
});

const dash: Parser<string> = new Parser((context) => {
  if (context.more() && context.text.startsWith('-', context.position)) {
    context.position += 1;
    return success('-');
  } else {
    return failure('not a dash');
  }
});

test('one dot', (t) => {
  t.deepEqual(parse(dot, ''), { status: 'failed', error: 'not a dot' });
  t.deepEqual(parse(dot, '.'), { status: 'ok', result: '.' });
  t.pass();
});

test('one dot opt', (t) => {
  const p = dot.opt().map(concat);
  t.deepEqual(parse(p, ''), { status: 'ok', result: '' });
  t.deepEqual(parse(p, '.'), {
    status: 'ok',
    result: '.',
  });
  t.deepEqual(parse(p, '...'), {
    status: 'failed',
    error: 'parse: trailing characters',
  });
  t.pass();
});

test('one dot many0', (t) => {
  const p = dot.many0().map(concat);
  t.deepEqual(parse(p, ''), { status: 'ok', result: '' });
  t.deepEqual(parse(p, '.'), {
    status: 'ok',
    result: '.',
  });
  t.deepEqual(parse(p, '...'), {
    status: 'ok',
    result: '...',
  });
  t.pass();
});

test('one dot many1', (t) => {
  const p = dot.many1().map(concat);
  t.deepEqual(parse(p, ''), { status: 'failed', error: 'not a dot' });
  t.deepEqual(parse(p, '.'), {
    status: 'ok',
    result: '.',
  });
  t.deepEqual(parse(p, '...'), {
    status: 'ok',
    result: '...',
  });
  t.pass();
});

test('dot dash', (t) => {
  t.deepEqual(parse(dot.then(dash).map(concat), ''), {
    status: 'failed',
    error: 'not a dot',
  });
  t.deepEqual(parse(dot.then(dash).map(concat), '.'), {
    status: 'failed',
    error: 'not a dash',
  });
  t.deepEqual(parse(dot.then(dash).map(concat), '.-'), {
    status: 'ok',
    result: '.-',
  });
  t.deepEqual(parse(dot.or(dash), '.'), {
    status: 'ok',
    result: '.',
  });
  t.deepEqual(parse(dot.or(dash), '-'), {
    status: 'ok',
    result: '-',
  });
  t.deepEqual(parse(dot.or(dash), '*'), {
    status: 'failed',
    error: 'not a dash',
  });
  t.pass();
});
