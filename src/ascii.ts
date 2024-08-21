import { char, chars } from './basic';
import { concat } from './mess';

export const space = char(' ', '\t', '\f', '\v', '\r', '\n');
export const digit = chars(['0', '9']);
export const lower = chars(['a', 'z']);
export const upper = chars(['A', 'Z']);
export const letter = chars(['A', 'Z'], ['a', 'z']);
export const word = letter.many1().map(concat);
