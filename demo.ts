import { tokenize, untokenize } from './lib/lexer';
import { tokensFormatter } from './lib/token';

const input = '.1 + 2 -3 * 5 / (1-678.123 )';

const tokens = tokenize(input);
console.log(tokensFormatter(tokens));

const input2 = untokenize(tokens);
console.log(input);
console.log(input2)