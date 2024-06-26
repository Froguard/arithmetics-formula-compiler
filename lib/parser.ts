import { debug as debugCreate } from "debug";
import { OPERATOR_CHAR } from "./constant";
import { untokenize } from './lexer';
import { BinaryExpression, Expression, NumberLiteral, Program } from "./node";
import { Token, TOKEN_TYPE } from './token';
import { cyan, genSpace, gray, green, yellow } from "./util";

const debug = debugCreate('TEST');

const { leftParenthesis, rightParenthesis, number, plus, minus, asterrisk, slash, illegal, eof } = TOKEN_TYPE;
const SPACE = genSpace(2);
const SPACE_LINE = `${gray('│')}${SPACE}`;
const isOperatorType = (type: TOKEN_TYPE) => [plus, minus, asterrisk, slash].includes(type);

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
        case slash: {
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

interface ParseFactorOpts {
    left: Expression;
    precedence: PRECEDENCE;
    space: string;
}

export function parse(tokens: Token[]): Program {
    const srcCode = untokenize(tokens);

    const scaner = new TokenScanner(tokens);
    const debugInfo = (msg: string, space: string) => debug(`${space}解析token: ${msg}, tokens[${gray(scaner.pos)}]=${gray(scaner.peek())}`);

    // 解析普通表达式
    function parseExpr(precedence: PRECEDENCE, space = SPACE): Expression {
        const token = scaner.peek();
        const { type, value, start, end } = token;
        const newSpace = space + SPACE_LINE;
        let expr = null;
        switch (type) {
            case number: {
                debugInfo(`读到数字 ${green(value)}`, space);
                scaner.scan();
                const left = new NumberLiteral({ value, start, end });
                expr = parseFactor({left, precedence, space: newSpace});
                break;
            }
            case leftParenthesis: {
                debugInfo(`左括号 ${green('(')}`, space);
                scaner.scan();
                const sunExpr = parseExpr(PRECEDENCE.Min, newSpace);
                const curToken = scaner.peek();
                if (curToken.type === rightParenthesis) {
                    debugInfo(`右括号 ${green(')')}`, space);
                    scaner.scan();
                } else {
                    // warinig it
                    const errMsg = `Unexcepted token: '${token.value} , Unclose parenthesis error in position ${curToken.start}, ')' was not found!`; 
                    const errDetail = `${srcCode}\n${genSpace(start)}^${genSpace(curToken.start - start - 1)}^\n`;
                    console.warn(`${errMsg}\n${errDetail}`);
                    throw new SyntaxError(`Parse error! ${errMsg}`);
                }
                expr = parseFactor({left: sunExpr, precedence, space: newSpace});
                break;
            }
            default: {
                const errMsg = `Unexcepted token: '${token.value}' ${type == rightParenthesis ? ', Unpaired right parenthesis \')\' !' : '!'}`; 
                console.warn(`${errMsg}\n${srcCode}\n${genSpace(start)}^`);
                throw new SyntaxError(`Parse error! ${errMsg}`);
            }
        }
        debug(`${space}解析完成,返回表达式: ${cyan(expr?.toFormula())}`);
        return expr;
    }

    // 解析复杂表达式
    // function parseFactor(left: Expression, precedence = PRECEDENCE.Min, space = SPACE): Expression {
    function parseFactor(options: ParseFactorOpts): Expression {
        const { precedence, space } = options;
        let { left } = options;
        debug(`${space}解析factor开始(wile-loop): ${gray(scaner.peek())}`);
        
        // loop
        while (scaner.peek().type != eof) {
            const tmpToken = scaner.peek();
            const { type } = tmpToken;
            const tmpPrecedence = type2precedence(type);
            const newSpace = space + SPACE_LINE;
            if (isOperatorType(type) && precedence < tmpPrecedence) {
                debug(`${newSpace}解析operator开始: ${yellow(tmpToken.value)} ${gray(tmpToken)}`);
                const operator = tmpToken.value as OPERATOR_CHAR;
                scaner.scan();
                const right = parseExpr(tmpPrecedence, newSpace + SPACE_LINE);
                debug(`${newSpace}解析operator结束: ${gray(tmpToken)}`);
                left = new BinaryExpression({ left, operator, right });
            } else {
                break;
            }
        }
        // 
        debug(`${space}解析factor结束, 返回表达式 ${cyan(left?.toFormula())}`);
        return left;
    }

    scaner.scan();
    const body = [];
    if (scaner.peek().type != eof) {
        body.push(parseExpr(PRECEDENCE.Min));
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