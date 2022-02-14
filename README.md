# arithmetics-formula-compiler

> A arithmetics-formula compiler, convert to c or lisp style code

> eg: lisp:  `( 1 + 2 ) / 3` ==>  `divide (add 1  2) 3`

> eg: c: `( 1 + 2 ) / 3` ==>  `divide(add(1, 2), 3)`

> warning: It is just a demo, dont use it in your production project

## dev

#### prepare

```bash
yarn
# or npm install
```

#### demo

```bash
yarn dev
```

#### test

```bash
yarn test
yarn test:cover
```

- [/coverage/lcov-report/index.html](/coverage/lcov-report/index.html)

```js
 PASS  tests/index.test.ts
 PASS  tests/lib/node.test.ts
 PASS  tests/lib/util.test.ts
 PASS  tests/lib/lexer.test.ts
 PASS  tests/lib/generator.test.ts
 PASS  tests/lib/token.test.ts
 PASS  tests/lib/parser.test.ts
-----------------------------------|---------|----------|---------|---------|-------------------
File                               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------------------------------|---------|----------|---------|---------|-------------------
All files                          |   95.15 |    84.55 |   98.03 |   94.73 |                   
 simple-basic-formula-compiler     |   92.59 |    77.77 |     100 |   92.59 |                   
  index.ts                         |   92.59 |    77.77 |     100 |   92.59 | 49-52             
 simple-basic-formula-compiler/lib |    95.5 |    85.03 |   97.87 |   95.05 |                   
  constant.ts                      |     100 |      100 |     100 |     100 |                   
  generator.ts                     |      92 |       70 |     100 |   91.66 | 34,68             
  lexer.ts                         |     100 |       96 |     100 |     100 | 20                
  node.ts                          |    97.5 |    91.89 |    92.3 |   97.43 | 209               
  parser.ts                        |   89.65 |    67.85 |     100 |   89.28 | 36,84-86,91-92    
  token.ts                         |     100 |    93.75 |     100 |     100 | 75                
  util.ts                          |     100 |    81.81 |     100 |     100 | 3,47              
-----------------------------------|---------|----------|---------|---------|-------------------
Test Suites: 7 passed, 7 total
Tests:       75 passed, 75 total
```

<br/>

---

<br/>

## Note

#### General process of compilation operation

```js
/*
 *             input
 *   ___________↓____________               ________________________
 *  |         lexer          | <---------> |                        |
 *   -----------↓------------              |                        |
 *            tokens                       |                        |
 *   ___________↓____________              |                        | 
 *  |         parser         | <---------> |                        |
 *   -----------↓------------              |                        |
 *         ast(primary)                    |                        |
 *   ___________↓____________              |                        |
 *  |    semantic checker    | <---------> |                        |
 *   ------------↓-----------              |                        |
 *          ast(fixed)                     |     symbol table       |
 *   ___________↓____________              |                        |
 *  | Intermediate generator | <---------> |                        |
 *   -----------↓------------              |                        |
 *       code(Intermediate)                |                        |
 *   ___________↓____________              |                        |
 *  |        optimizer       | <---------> |                        |
 *   -----------↓------------              |                        |
 *        code(optimized)                  |                        |
 *   ___________↓____________              |                        |
 *  |        generator       | <---------> |                        |
 *   -----------↓------------               ------------------------
 *             code
 */ 
```

#### syntax description

> 描述语法一般可以采用 [BNF表达式](https://zh.wikipedia.org/zh-hans/%E5%B7%B4%E7%A7%91%E6%96%AF%E8%8C%83%E5%BC%8F)

> 更多查看 [./BNF.md](BNF.md)。本文档中的BNF并非严格语法，只是表意的伪代码

1. 语法节点类型分析：

> 节点指：一个独立的都具有值意义的存在

> eg: 本案例中，节点的意义在于，计算能够返回一个数值结果

```js
数字节点表达式, 加法运算表达式, 减法运算表达式, 乘法运算表达式, 除法运算表达式, 括号运算表达式
```

> 括号表达式其实体现的是一种优先级关系，所以可以进一步简化一下：

```js
数字节点表达式, 加减运算表达式, 乘除运算表达式
```

2. 优先级分析：
- 求值优先级为3个档：`数字|括号` > `乘|除` > `加|减`
- 同级别运算，遵循"`向左结合律`"：加减结合律，乘除结合律


3. 文法描述

> 根据3挡优先级描述如下：

```js
Digit: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'

NumLtr: 
    Digit+           // 整数
    Digit*'.'Digit+  // 小数

FactorExpr: 
    '(' AddExpr ')'                // 这里有括号
    NumLtr 

MultiExpr: 
    MultiExpr '*'|'/' FactorExpr   // 这里有左递归
    FactorExpr 
    
AddExpr: 
    AddExpr '+'|'-' MultiExpr      // 这里有左递归
    MultiExpr 
```

> - 为方便处理，同结合律方向一样，将优先级高的表达式放左边

> - 上面的图例，包含了左递归，实际的应用中，我们应该尽可能的消除左递归这样的定义形式，以便能够方便后续的处理

`几条原则`:

- 文法中的节点，应该是最简洁的形式。定义时，`允许递归`

- 文法中的节点，必须是能够"一个独立的且有意义存在"
  - eg：单独的符号（+-*/%）没办法独立的作为一个Node存在
  - eg：数字可以独立的作为一个Node存在

- 文法定义时，不应该出现有歧义


`特别注意`：

> 为方便后续处理，文法定义中，节点的定义，应该`尽可能消除左递归`，如何消除左递归，这里篇幅有限不在赘述，方便理解，先不消除左递归

> 当然，不消除并不能算作错误，能正确无误的描述清楚文法就ok，本demo只为讲清楚原理，为降低难度，这个细节暂时未设计

> 感兴趣可以看看下面是消除左递归之后的定义

```js
Factor:
    NumLtr
    '(' AddExpr ')'

MultiExpr:
    Factor   ( '*'|'/' Factor )*

AddExpr:
    Factor   ( '+'|'-' Factor )*

```

> 较为精准且全面的语法描述，请翻阅 ecma 手册 [ECMA-262.pdf](https://www.ecma-international.org/wp-content/uploads/ECMA-262_12th_edition_june_2021.pdf), 搜索 `MultiplicativeExpression` 或 `AdditiveExpression` 便可以看到



## others

- https://astexplorer.net/



