import { NUMBER_CHAR, OPERATOR_CHAR, PARENTHESIS_CHAR } from './constant';

export enum TOKEN_TYPE {
    leftParenthesis = 'leftParenthesis', // '('
    rightParenthesis = 'rightParenthesis', // ')'
    plus = 'plus', // '+'
    minus = 'minus', // '-'
    asterrisk = 'asterrisk', // '*'
    slah = 'slah', // '/'
    number = 'number', // '0'~'9'
    illegal = 'illegal', // illegal
    eof = 'endOfFile', // end of file
}

const CHAR_2_TOKEN_TYPE_MAP: Record<string, TOKEN_TYPE> = {
    [OPERATOR_CHAR.plus]: TOKEN_TYPE.plus,
    [OPERATOR_CHAR.minus]: TOKEN_TYPE.minus,
    [OPERATOR_CHAR.asterrisk]: TOKEN_TYPE.asterrisk,
    [OPERATOR_CHAR.slah]: TOKEN_TYPE.slah,
    [PARENTHESIS_CHAR.left]: TOKEN_TYPE.leftParenthesis,
    [PARENTHESIS_CHAR.right]: TOKEN_TYPE.rightParenthesis,
    // '0'-'9': TOKEN_TYPE.number
};
Object.values(NUMBER_CHAR).forEach(v => CHAR_2_TOKEN_TYPE_MAP[`${v}`] = TOKEN_TYPE.number);
/**
 * get char's tokenType
 * @param char 
 * @returns 
 */
export const char2tokenType = (char: string) => CHAR_2_TOKEN_TYPE_MAP[char] || TOKEN_TYPE.illegal;

/**
 * format a token array to string
 * @param tokens 
 * @returns 
 */
export const tokensFormatter = (tokens: Token[]) => (`[\n${tokens.map(tk => `  ${tk}`).join(',\n')}\n]`);


interface TokenCtrOpts {
    type: TOKEN_TYPE;
    start: number; // start position of token's content
    end: number; // end position of token's content
    value: string; // token's content, such as '123', '+', '/'
    next?: Token; // next token
}

/**
 * Token class
 */
export class Token {
    type: TOKEN_TYPE;
    start: number; // start position of token's content
    end: number; // end position of token's content
    value: string; // token's content, such as '123', '+', '/'
    next?: Token; // next token

    /**
     * constructor
     * @param options 
     * const t = new Token({ type, value });
     */
    constructor(options: Partial<TokenCtrOpts> = {}) {
        const { type, start, end, value, next } = options;
        this.type = type || TOKEN_TYPE.illegal;
        this.start = start || 0;
        this.end = end || 0;
        this.value = value || 'unknown';
        this.next = next instanceof Token ? next : undefined;
    }

    public toString() {
        const { type, start, end, value } = this;
        return `{value: ${value}, type: ${type}, start: ${start}, end: ${end}}`;
    }

    public toJSON() {
        return this.toString();
    }
}