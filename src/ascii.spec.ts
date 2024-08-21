import test from 'ava';

import { space } from './ascii';
import { parse } from './core';

test('space', (t) => {
  t.deepEqual(parse(space, ' '), { status: 'ok', result: ' ' });
  t.deepEqual(parse(space, '\t'), { status: 'ok', result: '\t' });
  t.pass();
});
