import { calculate } from './index';
import { tokenize, untokenize } from './lib/lexer';
import { parse } from './lib/parser';
import { tokensFormatter } from './lib/token';


const input = '.1 + 2 -3 * 5 / (1-678.123 )';

const tokens = tokenize(input);
console.log(tokensFormatter(tokens));

const input2 = untokenize(tokens);
console.log('source:    ', input);
console.log('untokenize:', input2)

const ast = parse(tokens);
console.log(ast.toString());
console.log(ast.toFormula());

console.log('\n\n----------\n\n');
const input3 = '1+2/3';
console.log(calculate(input3)); // 1.6666666666666665