import { tokenize, untokenize } from "../../lib/lexer";

const testCases = [
    { input: '', tokensLen: 0 },
    { input: '1 / 2.34 * 5', tokensLen: 5 },
    { input: '.1 / 2.34 * 5', tokensLen: 5 },
    { input: 'anc 1 / 2.34 * 5', tokensLen: 8 },
];

describe('tokenize:', () => {
    for (const { input, tokensLen } of testCases) {
        it(`tokenize('${input}')`, () => {
            const tokens = tokenize(input);
            expect(tokens.map(t=>t.value).join('')).toEqual(input.replace(/\s/g, ''));
            expect(tokens.length).toEqual(tokensLen);
        });
    }
});

describe('untokenize:', () => {
    for (const { input } of testCases) {
        it(`untokenize(tokens of '${input}')`, () => {
            const tokens = tokenize(input);
            expect(untokenize(tokens)).toEqual(input);
        });
    }
});