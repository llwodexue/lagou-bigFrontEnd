/* enum Day {
  SUNDAY = 1,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY
}
 */
/* enum Day {
  SUNDAY = 'SUNDAY',
  MONDAY = 'MONDAY'
} */

enum Day {
  SUNDAY = 'SUNDAY',
  MONDAY = 2
}

enum FileAccess {
  // 常量成员
  None,
  Read = 1 << 1,
  Write = 1 << 2,
  ReadWrite = Read | Write,
  // 计算成员
  G = '123'.length
}

