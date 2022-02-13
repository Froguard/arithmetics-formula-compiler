/**
 * 一些基础理论：
 * 1. 关于 Node：
 *   - AST 节点的数据结构，作为所有节点的父类
 *   - 直接子类：表达式 & 语句
 *     - 表达式 Expression
 *       - 案例： 1 * 2 +3
 *       - 说明： 通常执行一个表达式，都会有一个返回值，如上面表达式返回 5
 *     - 语句 Statement
 *       - 案例： const a = 1;
 *       - 说明： 通常不会伴随返回，但也不绝对，例如特殊的 表达式语句，StatementExpression 就是同事属于”表达式“&”语句“
 *           - 表达式语句 StatementExpression
 *             - 案例： a++; fn();
 *             - 说明： 1.本质上还是作为语句存在；
 *                     2.一般格式为表达式加上分号
 *           - 块 Block
 *             - 案例：{...}
 *             - 说明：本身也是语句，格式为大括号包起来
 * 2. Node节点，除开叶子节点，如”字面量表达式“是具有value的之外，其他最好不要有，即便能够计算出来。因为信息没必要冗余
 * 3. 本案例中比较简单，只出现了 Expression
 */
import { OPERATOR_CHAR } from "./constant";
import { genJsonIgnoreReplace } from "./util";


export enum NODE_TYPE {
    program = 'program',
    numberLiteral = 'numberLiteral',
    binaryExpression = 'binaryExpression',
    unknown = 'unknown',
};


interface NodeCtrOpts {
    type: NODE_TYPE;
    start: number;
    end: number;
}
const ignorePosReplacer = genJsonIgnoreReplace(['start', 'end']);
export abstract class Node {
    type: NODE_TYPE;
    start: number;
    end: number;

    constructor(options: Partial<NodeCtrOpts> = {}) {
        const { type, start, end } = options;
        this.type = type || NODE_TYPE.unknown;
        this.start = start || 0;
        this.end = end || 0;
    }

    public abstract toFormula(): string;

    public toString() {
        return JSON.stringify(this, ignorePosReplacer, 2);
    }
}


interface PrgmCtrOpts {
    body: Expression[];
}
export class Program extends Node {
    readonly type = NODE_TYPE.program;
    body: Expression[] = [];

    constructor(options: Partial<PrgmCtrOpts> = {}) {
        super();
        const { body = [] } = options;
        this.body = body || [];
        delete this.start;
        delete this.end;
    }

    public toFormula(): string {
        return `[\n  ${this.body.map(expr => expr.toFormula()).join('  \n')}\n]`;
    }
}


export abstract class Expression extends Node {
    abstract readonly type: NODE_TYPE;
}


interface NumLitCtrOpts extends Omit<NodeCtrOpts, 'type'> {
    value: string;
}
export class NumberLiteral extends Expression {
    readonly type: NODE_TYPE.numberLiteral;
    readonly raw: string;
    value: string;

    constructor(options: Partial<NumLitCtrOpts> = {}) {
        super();
        const { value } = options;
        const v = value || '';
        this.raw = v;
        this.value = v.startsWith('.') ? `0${v}` : v; // .1 -> 0.1
    }

    public toFormula(): string {
        return this.value;
    }

    public toJSON() {
        const raw = this.raw === this.value ? '' : `, raw: ${this.raw}`;
        return `{type: ${this.type}, value: ${this.value}${raw}}`;
    }
}


interface BinExprCtrOpts extends Omit<NodeCtrOpts, 'type'> {
    left: Expression;
    right: Expression;
    operator: OPERATOR_CHAR;
}
export class BinaryExpression extends Expression {
    readonly type = NODE_TYPE.binaryExpression;
    operator: OPERATOR_CHAR;
    left: Expression | null;
    right: Expression | null;

    constructor(options: Partial<BinExprCtrOpts> = {}) {
        super(options);
        const { left, right, operator } = options;
        this.operator = operator as OPERATOR_CHAR;
        this.left = left || null;
        this.right = right || null;
        // update position
        this.setLeft(left);
        this.setRight(right);
    }

    // setLeft 和 this.left = xxx; 的区别，他会同时设置 start 位置信息； 同理 setRight 会同时设置 end 信息
    public setLeft(left?: Expression | null) {
        this._setSubExpr(left);
    }

    /*
     * 为什么属性 left, right 不采用劫持 get set 的方式实现呢？
     * 如：定义时
     * class A {
     *    private _m: any;
     *    public get m() { return this._m; }
     *    public set m(v: any) { this._m = v; }
     * }
     * 使用时：
     * const a = new A();
     * a.m = 1; // set
     * console.log(a.m); // get
     * 
     * 这样会有一个不好的点，当我们想要序列化输出这个实例信息的时候，打印出来的属性，名称是 ‘_m’ 而非 'm', 这点并不是很友好
     */
    public setRight(right?: Expression | null) {
        this._setSubExpr(right, true);
    }

    private _setSubExpr(expr: unknown, isRight = false) {
        const exprName = isRight ? 'right' : 'left';
        const posName = isRight ? 'end' : 'start';
        if (expr instanceof Expression) {
            this[exprName] = expr;
            this[posName] = expr[posName];
        } else {
            this[exprName] = null;
        }
    }

    public toFormula(): string {
        const { operator, left, right } = this;
        return `(${left?.toFormula()} ${operator} ${right?.toFormula()})`;
    }
}

