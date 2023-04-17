function convertToElementTreeData(tree, parentPath = '') {
    if (typeof tree === 'string') {
        const path = `${parentPath}\\${tree}`;
        return {
            label: tree,
            path
        };
    } else if (typeof tree === 'object') {
        return {
            label: Object.keys(tree)[0],
            children: tree[Object.keys(tree)[0]].map(child => convertToElementTreeData(child, `${parentPath}\\${Object.keys(tree)[0]}`))
        };
    }
}

function filterElementTreeData(data) {
    if (data.children) {
        data.children = data.children.filter(it => it.label !== '.obsidian'); //过滤掉obsidian的数据
        data.children.forEach(child => filterElementTreeData(child));
    }
    return data;
}


export {
    convertToElementTreeData,
    filterElementTreeData
}