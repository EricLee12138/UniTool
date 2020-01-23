function exportMenu(editor) {
    console.log("Export Menu Bar Extension");

    let refStr = [
        "using UnityEngine;",
        "using UnityEditor;",
        ""
    ];

    let menuItems = menuItemTree.GetItems();
    menuItems.forEach(function (item) {
        let className = item.properties["Class Name"];
        let itemName = item.properties["Item Name"];
        let menuPath = item.properties["Menu Path"];
        let executionFunction = item.properties["Execution Function"];
        let validationFunction = item.properties["Validation Function"];
        let priority = item.properties["Priority"];

        let classPrefix = getClassPrefix(className.value);
        let classSuffix = "}";

        let menuItemStr = getMenuItemStr(menuPath.value, itemName.value, priority.value);

        let menuFunctionPrefix = getMenuFunctionPrefix(itemName.value);
        let menuFunctionStr = executionFunction.value
        let menuFunctionSuffix = "}";

        var menuRegion = [
            menuItemStr,
            menuFunctionPrefix,
            menuFunctionStr,
            menuFunctionSuffix
        ];

        if (validationFunction.bool) {
            let validationMenuItemStr = getValidationMenuItemStr(menuPath.value, itemName.value, priority.value);
            let validationFunctionPrefix = getValidationFunctionPrefix(itemName.value);
            let validationFunctionStr = validationFunction.value;
            let validationFunctionSuffix = "}";

            menuRegion.push(validationMenuItemStr, validationFunctionPrefix, validationFunctionStr, validationFunctionSuffix);
        }

        var menuContent = [
            refStr.join("\n"),
            classPrefix,
            menuRegion.join('\n'),
            classSuffix
        ]

        var menuName = className.value + ".cs";
        var menuBlob = new Blob(
            [js_beautify(
                menuContent.join('\n'), {
                indent_size: 4,
                indent_with_tabs: true,
            })], 
            { type: "text/plain;charset=utf-8" }
        );

        // console.log(js_beautify(
        //     menuContent.join('\n'), {
        //     indent_size: 4,
        //     indent_with_tabs: true,
        // }));

        editor.file(menuName, menuBlob);
    })
}

function getClassPrefix(name) {
    return "public static class " + name + " {";
}

function getMenuItemStr(path, name, priority) {
    return "[MenuItem (\"" + path.join("/") + "/" + name + "\", false, " + priority + ")]"
}

function getMenuFunctionPrefix(name) {
    return "private static void " + name + " () {"
}

function getValidationMenuItemStr(path, name, priority) {
    return "[MenuItem (\"" + path.join("/") + "/" + name + "\", true, " + priority + ")]"
}

function getValidationFunctionPrefix(name) {
    return "private static bool Validate" + name + " () {"
}