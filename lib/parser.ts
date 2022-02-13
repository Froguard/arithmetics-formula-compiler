import { debug as debugCreate } from "debug";
import { OPERATOR_CHAR } from "./constant";
import { untokenize } from './lexer';
import { BinaryExpression, Expression, NumberLiteral, Program } from "./node";
import { Token, TOKEN_TYPE } from './token';
import { genSpace } from "./util";

const debug = debugCreate('TEST');

const { leftParenthesis, rightParenthesis, number, plus, minus, asterrisk, slah, illegal, eof } = TOKEN_TYPE;
const SPACE = genSpace(2);
const isOperatorType = (type: TOKEN_TYPE) => [plus, minus, asterrisk, slah].includes(type);

enum PRECEDENCE {
    Min = 0,
    Low = 10,
    Middle = 20,
    High = 30,
    Max = Infinity,
}
function type2precedence(type: TOKEN_TYPE) {
    switch (type) {
        case asterrisk:
        case slah: {
            return PRECEDENCE.High;
        }
        case minus:
        case plus: {
            return PRECEDENCE.Middle;
        }
        case number: {
            return PRECEDENCE.Low;
        }
        case illegal:
        case eof:
        default: {
            return PRECEDENCE.Min;
        }        
    }
}

export function parse(tokens: Token[]): Program {
    const srcCode = untokenize(tokens);

    const scaner = new TokenScanner(tokens);
    const debugInfo = (msg: string, space: string) => `${space}tokens[${scaner.pos}]->${scaner.peek()}, ${msg}`;

    // 解析普通表达式
    function parseExpr(precedence = PRECEDENCE.Min, space = SPACE): Expression {
        const { type, value, start, end } = scaner.peek();
        const newSpace = space + ' ';
        switch (type) {
            case number: {
                debugInfo(`读到数字${value}`, space);
                scaner.scan();
                const left = new NumberLiteral({ value, start, end });
                return parseFactor(left, precedence, newSpace);
            }
            case leftParenthesis: {
                debugInfo('左括号(', space);
                scaner.scan();
                const sunExpr = parseExpr(PRECEDENCE.Min, newSpace);
                const curToken = scaner.peek();
                if (curToken.type === rightParenthesis) {
                    debugInfo('右括号)', space);
                    scaner.scan();
                } else {
                    // warinig it
                    const errMsg = `${space}Unclose parenthesis error: in position ${scaner.peek().start}, ')' was not found!`; 
                    console.error(errMsg);
                    let errDetail = `${space}${srcCode}\n`;
                    errDetail += `${space}${genSpace(start)}^${genSpace(scaner.peek().start - start - 1)}^`;
                    console.warn(errDetail);
                    throw new Error(`Parse error: \n${errMsg}`);
                }
                return parseFactor(sunExpr, precedence, space);
            }
            default: {
                const errMsg = `Invalid token: ${scaner.peek()}`; 
                console.warn(`${errMsg}\n${space}${srcCode}\n${space}${genSpace(start)}^`);
                throw new Error(`Parse error: \n${errMsg}`);
            }
        }
    }

    // 解析复杂表达式
    function parseFactor(left: Expression, precedence = PRECEDENCE.Min, space = SPACE): Expression {
        scaner.peek().type != eof && debugInfo('Parse factor begin: wile-loop-logic', space);

        while (scaner.peek().type != eof) {
            const tmpToken = scaner.peek();
            const { type } = tmpToken;
            const tmpPrecedence = type2precedence(type);
            if (isOperatorType(type) && tmpPrecedence > precedence) {
                const operator = tmpToken.value as OPERATOR_CHAR;
                scaner.scan();
                const right = parseExpr(tmpPrecedence, space + ' ');
                left = new BinaryExpression({ left, operator, right });
            } else {
                break;
            }
        }

        debug(`${space}Parse factor end, return ${left?.toFormula()}`);
        return left;
    }

    scaner.scan();
    const body = [];
    if (scaner.peek().type != eof) {
        body.push(parseExpr());
    } 
    return new Program({ body });
}


export class TokenScanner {
    private tokens: Token[];
    private curToken: Token;
    private readonly END_TOKEN: Token;
    private curPos: number;
    
    constructor(tokens: Token[]) {
        this.tokens = ([] as Token[]).concat(tokens || []);
        this.curPos = - 1;
        this.END_TOKEN = this._calcEndToken();
        this.curToken = this.END_TOKEN;
    }

    private _calcEndToken() {
        const tokens = this.tokens || [];
        const lastToken = tokens.length ? tokens[tokens.length - 1] : null;
        const start = lastToken?.end || 0;
        const end = start + 1;
        return new Token({ type: eof, start, end });
    }

    public scan() {
        if (this.tokens.length) {
            this.curToken = this.tokens.shift() || this.END_TOKEN;
            this.curPos++;
        } else {
            this.curToken = this.END_TOKEN;
        }
    }

    public peek() {
        return this.curToken;
    }

    public get pos() {
        return this.curPos;
    }
}