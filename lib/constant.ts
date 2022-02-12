/**
 * symbol table
 * - operators: + - * /
 * - number: 0-9
 * - parenthesis: ( )
 * - dot: .
 */

export enum OPERATOR_CHAR {
    plus = '+',
    minus = '-',
    asterrisk = '*',
    slah = '/',
}

export enum PARENTHESIS_CHAR {
    left = '(',
    right = ')',
}

export enum NUMBER_CHAR {
    zerp = '0',
    one = '1',
    two = '2',
    three = '3',
    four = '4',
    five = '5',
    six = '6',
    seven = '7',
    eight = '8',
    nine = '9',
}

export const DOT_CHAR = '.';
