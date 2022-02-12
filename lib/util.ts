import { DOT_CHAR, OPERATOR_CHAR, PARENTHESIS_CHAR } from "./constant";

export const isString = (s: unknown) => typeof s === 'string' || s instanceof String;

export const isChar = (c: string) => c.length == 1;

export const isDigit = (c: string) => isChar(c) && !!c.match(/\d/); // '0'-'9'

export const isSpace = (c: string) => isChar(c) && !!c.match(/\s/); // white space

export const isDot = (c: string) => c === DOT_CHAR;

export const isLeftParenthesis = (c: string) => c === PARENTHESIS_CHAR.left; // '('

export const isRightParenthesis = (c: string) => c === PARENTHESIS_CHAR.right; // ')'

const operators = Object.values(OPERATOR_CHAR);
export const isOperator = (c: string) => isChar(c) && operators.includes(c as OPERATOR_CHAR); // a;; operators

/**
 * generate white space by setted length n
 * @param n 
 * @returns 
 */
export function genSpace(n: number): string {
    let s = '';
    while(n--) { s += ' '; }
    return s;
}

type JsonStringifyReplacer<T = unknown> = (k: string, v: T) => T | undefined;
/**
 * generate a replace function by ignore keys
 * @param ignoreKeys 
 * @returns 
 * const obj = { a: 1, b: 2, c: 3, m: 4, n: 5 };
 * cons replacer = genJsonIgnoreReplace(['a', 'b', 'c']);
 * JSON.stringify(obj, replacer); // { 'm': '4', 'n': '5' }, ignore the keys: a,b,c
 */
export function genJsonIgnoreReplace(ignoreKeys: string[] = []): JsonStringifyReplacer {
    return (k:string, v: unknown) => (ignoreKeys.includes(k) ? undefined : v);
}
