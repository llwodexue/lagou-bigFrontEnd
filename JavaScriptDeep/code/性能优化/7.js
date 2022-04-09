const username = 'alishi'

/* [
  { type: 'Keyword', value: 'const' },
  { type: 'Identifier', value: 'username' }, // 标识符
  { type: 'Punctuator', value: '=' }, // 标点
  { type: 'String', value: 'alishi' },
] */

/* {
  type: 'Program',
  body: [
    {
      type: 'VariableDeclaration',
      declaration: [
        {
          type: 'VariableDeclarator',
          id: {
            type: 'Identifier',
            name: 'username',
          },
          init: {
            type: 'Literal',
            value: 'alishi',
            raw: 'alishi',
          },
        },
      ],
      kind: 'const',
    },
  ],
  sourceType: 'script',
}
 */

