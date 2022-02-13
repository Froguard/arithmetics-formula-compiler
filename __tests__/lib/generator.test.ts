import { generate2c, generate2lisp } from '../../lib/generator';
import { tokenize } from '../../lib/lexer';
import { parse } from '../../lib/parser';

describe('generate', () => {
    const testcases = [
        { input: '1+2/3', c: 'add(1, divide(2, 3))', lisp: 'add 1 (divide 2 3)' },
        { input: '2/3', c: 'divide(2, 3)', lisp: 'divide 2 3' },
        { input: '6-(7*2)', c: 'subtract(6, multiple(7, 2))', lisp: 'subtract 6 (multiple 7 2)' },
    ];
    testcases.forEach(({ input, c, lisp }) => {
        const ast = parse(tokenize(input));
        it(`generate2c for '${input}'`, () => expect(generate2c(ast)).toEqual(c));
        it(`generate2lisp for '${input}'`, () => expect(generate2lisp(ast)).toEqual(lisp));
    });
});