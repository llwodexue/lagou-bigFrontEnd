interface TestScheme {
    key: any;
    data: any;
    proportion?: number;
}

/**
 * @param testName 当前参与ab测试的字段名称
 * @param schemeList ab测试方案集合
 * 调用方法如下：
 * getTestScheme('recommendHeaderImage', [
 *       {
 *           key: '0',
 *           data: {
 *               autumnSystematic: 'aaaa1',
 *               other: 'aaaa2'
 *           }
 *       },
 *       {
 *           key: '1',
 *           data: {
 *               autumnSystematic: 'bbbbb1',
 *               other: 'bbbb2'
 *           }
 *       },
 *   ]);
 * 其中
 *      key: any. 为每个方案需要存储在localStorage的value值, 需唯一
 *      data: any. 为自定义的与key对应的数据, 类型随意
 *      proportion: number. 为每个方案所占随机的份额, 默认为1; 即如果方案集合中一共有3个方案，其中一个proportion=2, 则占比2/3.
 */
export function getTestScheme(
    testName: string,
    schemeList: TestScheme[]
): TestScheme {
    const averageScheme = schemeList.reduce((pre, current) => {
        if (pre.indexOf(current.key) > -1) {
            throw new Error("TestScheme key should be unique");
        }

        let proportion = current.proportion || 1;

        while (proportion--) {
            pre.push(current.key);
        }
        return pre;
    }, [] as any[]);

    let abKey = uni.getStorageSync(testName);
    if (!abKey) {
        abKey = averageScheme[Math.floor(Math.random() * averageScheme.length)];
        uni.setStorageSync(testName, abKey);
    }
    return schemeList.find(scheme => scheme.key === abKey)!;
}
