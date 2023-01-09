// type isSubTying<Child, Par> = Child extends Par ? true : false

// type isXX2 = isSubTying<1, number> // true

// type isYY2 = isSubTying<'string', string> // true

// type isZZ2 = isSubTying<true, boolean> // true

// type ElementTypeOfArray<T> = T extends (infer E)[] ? E : never

// type isNumber = ElementTypeOfArray<number[]> // number

// type isNever = ElementTypeOfArray<number> // never

type ElementTypeOfObj<T> = T extends { name: infer E; id: infer I } ? [E, I] : never

type isArray = ElementTypeOfObj<{ name: 'name'; id: 1; age: 30 }> // ['name', 1]

type isNever = ElementTypeOfObj<number> // never

interface MixedObject {
  animal: {
    type: 'animal' | 'dog' | 'cat'
    age: number
  }
  [name: number]: {
    type: string
    age: number
    nickname: string
  }
  [name: string]: {
    type: string
    age: number
  }
}

type MixedObjectKeys = keyof MixedObject // string | number

let StrA = 'a'
const unions = typeof StrA // "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"
const str: typeof StrA = 'string' // string
type DerivedFromStrA = typeof StrA // string

const a = typeof {}

// type SpecifiedKeys = 'id' | 'name'
// type TargetType = {
//   [key in SpecifiedKeys]: any
// } // { id: any; name: any; }

interface SourceInterface {
  readonly id: number
  name?: string
}

type TargetGenericType<S> = {
  [key in keyof S]: S[key]
}
type TargetInstance = TargetGenericType<SourceInterface> // { readonly id: number; name?: string | undefined }

type TargetGenericTypeAssertiony<S> = {
  [key in keyof S as Exclude<key, 'id'>]: S[key]
}
type TargetGenericTypeAssertionyInstance = TargetGenericTypeAssertiony<SourceInterface>

type ExcludeSpecifiedNumber = Exclude<1 | 2, 1> // 2

type ReturnTypeOfResolved<F extends (...args: any) => any> = F extends (
  ...args: any[]
) => Promise<infer R>
  ? R
  : ReturnType<F>
type isNumber = ReturnTypeOfResolved<() => number> // number

type EqualV1<S, T> = S extends T ? (T extends S ? true : false) : false
type ExampleV11 = EqualV1<1 | (number & {}), number>

type EqualV2<S, T> = [S] extends [T] ? ([T] extends [S] ? true : false) : false

type IsAny<T> = 0 extends 1 & T ? true : false
type EqualV3<S, T> = IsAny<S> extends true
  ? IsAny<T> extends true
    ? true
    : false
  : IsAny<T> extends true
  ? false
  : [S] extends [T]
  ? [T] extends [S]
    ? true
    : false
  : false
type ExampleV31 = EqualV3<1 | (number & {}), number> // true but false got
type ExampleV32 = EqualV3<never, never> // true
type ExampleV34 = EqualV3<any, any> // true
type ExampleV33 = EqualV3<any, number> // false
type ExampleV35 = EqualV3<never, any> // false
