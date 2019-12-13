// TODO use this magic after TS3.5.1

// import { AbTestsName } from './ab-tests.type';
// import { abTestsConfig } from './config'; // It has to be TS(export const config = {})
//
// const json = {...abTestsConfig} as const;
// type testNames = keyof typeof json.tests;
// type testsType = typeof json.tests;
//
// type TestConfWithKey<TestName extends string, T> = {
// 	[K in keyof T]: T[K]
// };
//
// type TestTable = TestConfWithKey<'__testName', testsType>;
//
// type Unionize<T> = T[keyof T];
//
// type MyTests = Unionize<TestTable>;
//
// export function getTestConfig<ActionName extends keyof TestTable>(key: ActionName): TestTable[ActionName] {
// 	return json.tests[key];
// }
