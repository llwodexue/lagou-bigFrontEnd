const fs = require('fs');
const path = require('path');

const dashedName = name => {
    const replaced = name.replace(/([A-Z])/g, '-$&');
    return replaced[0] === '-' ? replaced.slice(1) : replaced;
};

function generateFile(path, content) {

    const pathList = path.split('/');
    let currentPath = '';

    for (let item of pathList) {
        currentPath = currentPath + '/' + item;

        if (currentPath.indexOf('.vue') > -1) {
            if (fs.existsSync(path)) {
                console.log('文件已存在, 请重新命名');
                process.exit(0);
            } else {
                fs.writeFileSync(currentPath, content, {
                    encoding: 'utf8'
                })
            }
            break;
        }

        if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath);
        }
    }

};

function addPageToJson(pagePath) {
    const jsonPath = `${path.resolve('./')}/src/pages.json`;
    const content = fs.readFileSync(jsonPath, {
        encoding: 'utf-8'
    })
    const parseContent = JSON.parse(content);
    const newContent = JSON.stringify({
        ...parseContent,
        pages: parseContent.pages.concat({
            path: pagePath
        }),
    }, null, 4)
    fs.writeFileSync(jsonPath, newContent, {
        encoding: 'utf-8'
    });
}

module.exports = {
    dashedName,
    generateFile,
    addPageToJson
}