import { OPERATOR_CHAR } from './constant';
import { BinaryExpression, Node, NODE_TYPE, NumberLiteral, Program } from './node';


const OPERATOR_2_METHOD_NAME = {
    [OPERATOR_CHAR.plus]: 'add',
    [OPERATOR_CHAR.minus]: 'subtract',
    [OPERATOR_CHAR.asterrisk]: 'multiple',
    [OPERATOR_CHAR.slah]: 'divide',
};


function ast2c(astNode: Node): string {
    const { type } = astNode;
    switch (type) {
        case NODE_TYPE.program: {
            const { body = [] } = astNode as Program;
            if (body.length) {
                const root = body[0];
                return ast2c(root);
            } 
            return '';
        }
        case NODE_TYPE.numberLiteral: {
            return (astNode as NumberLiteral).value;
        }
        case NODE_TYPE.binaryExpression: {
            const { left, right, operator } = astNode as BinaryExpression;
            const methodName = OPERATOR_2_METHOD_NAME[operator];
            return `${methodName}(${ast2c(left as Node)}, ${ast2c(right as Node)})`; // as Node 是为了 jest 检查
        }
        default: return `unknown ast node type '${type}'`;
    }
}
// convert ast to c-style code
export const generate2c = (ast: Node) => ast2c(ast);


function ast2lisp(astNode: Node): string {
    const { type } = astNode;
    switch (type) {
        case NODE_TYPE.program: {
            const { body = [] } = astNode as Program;
            if (body.length) {
                const root = body[0];
                return ast2lisp(root);
            } 
            return '';
        }
        case NODE_TYPE.numberLiteral: {
            return (astNode as NumberLiteral).value;
        }
        case NODE_TYPE.binaryExpression: {
            const { left, right, operator } = astNode as BinaryExpression;
            const methodName = OPERATOR_2_METHOD_NAME[operator];
            return `(${methodName} ${ast2lisp(left as Node)} ${ast2lisp(right as Node)})`; // as Node 是为了 jest 检查
        }
        default: return `unknown ast node type '${type}'`;
    }
}
// convert ast to lisp-style code, eg: `1+2/3` => `add 1 (divide 2 3)` whithout first ( & last )
export function generate2lisp(ast: Node) {
    const code = ast2lisp(ast);
    return code.match(/^\((add|subtract|mutilple|divide).+\)$/) ? code.slice(1, -1) : code;
}


function ast2value(astNode: Node): number {
    const { type } = astNode;
    switch (type) {
        case NODE_TYPE.program: {
            const { body = [] } = astNode as Program;
            if (body.length) {
                const root = body[0];
                return ast2value(root);
            }
            return 0;
        }
        case NODE_TYPE.numberLiteral: {
            return parseFloat((astNode as NumberLiteral).value);
        }
        case NODE_TYPE.binaryExpression: {
            const { left, right, operator } = astNode as BinaryExpression;
            const leftVal = ast2value(left as Node); // as Node 是为了 jest 检查
            const rightVal = ast2value(right as Node);
            switch (operator) {
                case OPERATOR_CHAR.plus: {
                    return leftVal + rightVal;
                }
                case OPERATOR_CHAR.minus: {
                    return leftVal - rightVal;
                }
                case OPERATOR_CHAR.asterrisk: {
                    return parseFloat(`${leftVal * rightVal}`);
                }
                case OPERATOR_CHAR.slah: {
                    return parseFloat(`${leftVal / rightVal}`);
                }
                default: return 0;
            }
        }
        default: return 0;
    }
}
export const calculate = (node: Node) => ast2value(node);