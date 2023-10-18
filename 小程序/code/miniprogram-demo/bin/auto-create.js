const path = require('path');
const {
    dashedName,
    generateFile,
    addPageToJson
} = require('./utils')
const {
    PageTemplate,
    ComponentTemplate
} = require('./template');

const rootPath = path.resolve('./');
const pagesPath = `${rootPath}/src/pages`;
const componentsPath = `${rootPath}/src/components`;


const type = process.argv[2];
const name = process.argv[3];

const lowerDashedName = dashedName(name).toLocaleLowerCase();


switch (type) {
    case 'page': {
        // pages/test-page/index.vue
        // export default class TestPage
        const path = `${pagesPath}/${lowerDashedName}/index.vue`;
        const content = PageTemplate(name);
        generateFile(path, content);
        addPageToJson(`pages/${lowerDashedName}/index`);
        break;
    }
    case 'component': {
        // components/test-component.vue
        // export default class TestComponent

        const path = `${componentsPath}/${lowerDashedName}/${lowerDashedName}.vue`;
        const content = ComponentTemplate(name);
        generateFile(path, content);
        break;
    }
}

console.log(`创建${type}-${name}成功`);
process.exit(0);