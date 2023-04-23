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
    } else {
        let end = data.label.lastIndexOf(".");
        data.label  = data.label.slice(0, end);
    }
    return data;
}

//日期工具
function DateUtils() {
    /**
     * 返回字符串 "yyyy-MM-dd HH:mm:ss"的日期字符串
     * @param date
     * @returns {string}
     * @constructor
     */
    function Date2Str(date) {
        const now = new Date(date);
        return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    }

    return{
        Date2Str,
    }

}





export {
    convertToElementTreeData,
    filterElementTreeData,
    DateUtils
}