import { calculate, parser } from '../index';

describe('compiler:', () => {
    const testcase = [
        '',
        '.1',
        '1+2/3',
        '1+2/3-4*5*(6+.7)',
        '1+2/3-5/(6*2)',
        '1+2/3-5/(6*2)-1+2/3-4*5*(6+.7)',
        '100/2',
    ];
    // parse by string
    testcase.forEach(inp => it(`parse.parseByString('${inp}')`, ()=>expect(() => {parser.parseByString(inp);}).not.toThrowError()));
    
    // calculate
    testcase.forEach(inp => {
        const evalCalcRes = eval(inp) || 0;
        it(`calculate('${inp}') ==> ${evalCalcRes}`, () => expect(calculate(inp)).toEqual(evalCalcRes));
    });
    
});