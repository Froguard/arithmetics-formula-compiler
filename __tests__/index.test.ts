import { calculate, parser } from '../index';

describe('compiler:', () => {
    const testcase = [
        '',
        '.1',
        '1+2/3',
        '1+2/3-4*5*(6+.7)',
    ];
    testcase.forEach(inp => {
        // parse by string
        it(`parse.parseByString('${inp}')`, () => expect(() => { parser.parseByString(inp); }).not.toThrowError());

        // calculate
        it(`calculate('${inp}')`, () => expect(calculate(inp)).toEqual(eval(inp || '0')));
    });
});