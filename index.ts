import { calculate as calculateByAst, generate2c, generate2lisp } from './lib/generator';
import { tokenize, untokenize } from './lib/lexer';
import { parse as parseByTokens } from './lib/parser';

export const lexer = {
    tokenize,
    untokenize
};

const parseByString = (input: string) => parseByTokens(tokenize(input));
export const parser = {
    parseByTokens,
    parseByString,
    parse: parseByString, // alias for parseByString
};

export const generator = {
    generate2c,
    generate2lisp
};

export const convertor = {
    covert2c: (input: string)=> generate2c(parseByString(input)),
    covert2lisp: (input: string) => generate2lisp(parseByString(input)),
};

export function calculate(input: string): number {
    const tokens = tokenize(input);
    const ast = parseByTokens(tokens);
    return calculateByAst(ast);
}
