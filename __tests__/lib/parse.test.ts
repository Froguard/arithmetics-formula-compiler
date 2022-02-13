import { OPERATOR_CHAR } from '../../lib/constant';
import { tokenize } from '../../lib/lexer';
import { BinaryExpression, NumberLiteral, Program } from '../../lib/node';
import { parse } from '../../lib/parser';
import { Token } from '../../lib/token';

// tokens
const tokens: Token[] = [
    new Token({ value: '1' }),
    new Token({ value: '+' }),
    new Token({ value: '2' }),
    new Token({ value: '/' }),
    new Token({ value: '3' }),
];

// ast
const numLitr1 = new NumberLiteral({ value: '1' });
const numLitr2 = new NumberLiteral({ value: '2' });
const numLitr3 = new NumberLiteral({ value: '3' });
const operator1 = OPERATOR_CHAR.plus; // +
const operator2 = OPERATOR_CHAR.slash; // /
const binExpr1 = new BinaryExpression({ left: numLitr1, operator: operator1 }); // 1+?
const binExpr2 = new BinaryExpression({ left: numLitr2, operator: operator2, right: numLitr3 }); // 2/3
binExpr1.setRight(binExpr2);
const program = new Program({ body: [ binExpr1 ] });

describe('parse:', () => {
    it('parse(\'1+2/3\')', () => expect(parse(tokens)).toEqual(program));
    
    const invalidInputs = [
        '1+2/3+(1',
        '1+2/3+)1'
    ];
    invalidInputs.forEach(inp => it(`parse('${inp}') ===> throw error`, () => {
        const tokens2 = tokenize(inp);
        expect(() => { 
            parse(tokens2);
        }).toThrowError();
    }));
});