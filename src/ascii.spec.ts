import test from 'ava';

import { digit, letter, lower, space, upper } from './ascii';
import { parse } from './core';
import { concat } from './mess';

test('space', (t) => {
  t.deepEqual(parse(space, ' '), { status: 'ok', result: ' ' });
  t.deepEqual(parse(space, '\t'), { status: 'ok', result: '\t' });
  t.deepEqual(parse(space, 'a'), {
    status: 'failed',
    error: 'char: not found',
  });
  t.pass();
});

test('digit', (t) => {
  t.deepEqual(parse(digit, '0'), { status: 'ok', result: '0' });
  t.deepEqual(parse(digit, '1'), { status: 'ok', result: '1' });
  t.deepEqual(parse(digit, 'a'), {
    status: 'failed',
    error: 'chars: not in range',
  });
  t.deepEqual(parse(digit.many1().map(concat), '1234567890'), {
    status: 'ok',
    result: '1234567890',
  });
  t.pass();
});

test('lower', (t) => {
  t.deepEqual(parse(lower, 'a'), { status: 'ok', result: 'a' });
  t.deepEqual(parse(lower, 'q'), { status: 'ok', result: 'q' });
  t.deepEqual(parse(lower, 'z'), { status: 'ok', result: 'z' });
  t.deepEqual(parse(lower, '1'), {
    status: 'failed',
    error: 'chars: not in range',
  });
  t.deepEqual(parse(lower, 'A'), {
    status: 'failed',
    error: 'chars: not in range',
  });
  t.pass();
});

test('upper', (t) => {
  t.deepEqual(parse(upper, 'A'), { status: 'ok', result: 'A' });
  t.deepEqual(parse(upper, 'J'), { status: 'ok', result: 'J' });
  t.deepEqual(parse(upper, 'Z'), { status: 'ok', result: 'Z' });
  t.deepEqual(parse(upper, '1'), {
    status: 'failed',
    error: 'chars: not in range',
  });
  t.deepEqual(parse(upper, 'a'), {
    status: 'failed',
    error: 'chars: not in range',
  });
  t.pass();
});

test('letter', (t) => {
  t.deepEqual(parse(letter, 'A'), { status: 'ok', result: 'A' });
  t.deepEqual(parse(letter, 'j'), { status: 'ok', result: 'j' });
  t.deepEqual(parse(letter, 'Z'), { status: 'ok', result: 'Z' });
  t.deepEqual(parse(letter, '1'), {
    status: 'failed',
    error: 'chars: not in range',
  });
  t.pass();
});
