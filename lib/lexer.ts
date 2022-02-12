import Token, { char2tokenType, TOKEN_TYPE } from "./token";
import { genSpace, isDigit, isDot, isSpace } from './util';

/**
 * tokenize
 * convert a string to token list
 * {string} @param input 
 * @returns {Array<Token>} tokens
 * @description
 *   tokenize 函数特性：
 *   - 不做语法校验，即非法字符输入也会被允许通过。（语法检查应该放在后边的几个阶段，如解析时候）
 *   - 对于每一个被识别出来的token，value的值不做任何修改，如 '.2' 代表 '0.2' 但 token 中存的值只需要是 '.2' 即可
 *   - 忽略空格等字符 whiteSpace
 */
export function tokenize(input: string): Token[] {
    const tokens: Token[] = [];
    const inputLen = input.length;
    if (inputLen) {
        let pos = 0;
        while (pos < inputLen) {
            const char = input.charAt(pos);
            if (isSpace(char)) {
                // skip whiteSpace & increase pos
                pos++;
            } else {
                // 0. find the key info of token (start, end, value, type)
                const start = pos;
                let end = start;
                let type = char2tokenType(char);
                let value = char;
                if (isDigit(char) || isDot(char)) { // '0'-'9','.'
                    let findDot = isDot(char);
                    let tmpNum = '';
                    let tmpChar = char;
                    do {
                        tmpNum += tmpChar;
                        if (!findDot && isDot(tmpChar)) {
                            findDot = true;
                        }
                        // increase pos & update tmp char
                        tmpChar = input.charAt(++pos);
                    } while (pos < inputLen && (isDigit(tmpChar) || (!findDot && isDot(tmpChar))));
                    // update key info of number token
                    type = TOKEN_TYPE.number;
                    value = tmpNum;
                    end = pos;
                // } if (isOperator(char) || isLeftParenthesis(char) || isRightParenthesis(char)) { // '+','-','*','/','(',')'
                //     // increase pos & update end position
                //     end = ++pos;
                } else { // others
                    // increase pos & update end position
                    end = ++pos;
                }
                // 1. create a new token
                const newToken = new Token({ type, value, start, end });
                // 2. link lastToken(the last one of tokens) 's next prop
                const lastToken = tokens.length && tokens[tokens.length - 1];
                if (lastToken) {
                    lastToken.next = newToken;
                }
                // 3. add new token
                tokens.push(newToken);
            }
        }
    }

    return tokens;
}

/**
 * convert a token list to source input string
 * @param {Array<Token>} tokens 
 * @returns {string} input
 *   untokenize 函数特性：
 *   - token 的位置信息要确保对，这样理论上来讲，对于逆操作 untokenize 就可以把一个 token 列表反向转换会一个输入内容
 *     - 当然，并不会完全一样，比如，对于 whiteSpace 的暂缓，untokenize 可以简单粗暴都转换为空格字符即可，因为在本案例中，并不会影响其含义
 *     - untokenize
 */
export function untokenize(tokens: Token[]): string {
    let input = '';
    let pos = 0;
    for (const { value, start, end } of tokens ) {
        if (start > pos) {
            input += genSpace(start - pos);
        }
        input += value;
        pos = end;
    }
    return input;
}