function exportEditorWindow(editor) {
    console.log("Export Editor Window Extension");

    let refStr = [
        "using UnityEngine;",
        "using UnityEditor;",
        "using UnityEditor.AnimatedValues;",
        ""
    ];

    ewindows.forEach(function (ewindow) {
        let windowName = ewindow.properties["Window Name"];
        let windowTitle = ewindow.properties["Window Title"];
        let windowType = ewindow.properties["Window Type"];
        let customizedOpen = ewindow.properties["Customized Open"];
        let menuPathToOpen = ewindow.properties["Menu Path To Open"];

        let windowPrefix = getWindowPrefix(windowName.value);
        let windowSuffix = "}";

        var variablesRegion = [];
        var initializatinoRegion = [];
        var redrawRegion = [];

        var openStr = "";

        if (!customizedOpen.value) {
            openStr = getWindowOpenStr(menuPathToOpen.value, windowType.value == "Floating Utility Window", windowTitle.value, windowName.value);
        }

        let onEnablePrefix = "void OnEnable () {";
        let onEnableSuffix = "}";
        initializatinoRegion.push(onEnablePrefix);

        let onWindowGUIPrefix = "private void OnGUI () {"
        let onWindowGUISuffix = "}";
        redrawRegion.push(onWindowGUIPrefix);

        var controls = ewindow.controls;
        controls.forEach(function (control) {
            if (control.folder) return;

            var controlDescription = getWindowControlDescription(control);

            variablesRegion = variablesRegion.concat(controlDescription.varStr);
            initializatinoRegion = initializatinoRegion.concat(controlDescription.iniStr);
            redrawRegion = redrawRegion.concat(controlDescription.redrawStr);
        })

        redrawRegion.push(onWindowGUISuffix);
        initializatinoRegion.push(onEnableSuffix);

        var editorWindowContent = [
            refStr.join('\n'),
            windowPrefix,
            variablesRegion.join('\n'),
            "\n",
            openStr,
            "\n",
            initializatinoRegion.join('\n'),
            "\n",
            redrawRegion.join('\n'),
            windowSuffix
        ];

        var editorWindowName = windowName.value + ".cs";
        var editorWindowBlob = new Blob(
            [js_beautify(
                editorWindowContent.join('\n'), {
                indent_size: 4,
                indent_with_tabs: true,
            })], 
            { type: "text/plain;charset=utf-8" }
        );

        // console.log(js_beautify(
        //     editorWindowContent.join('\n'), {
        //     indent_size: 4,
        //     indent_with_tabs: true,
        // }));

        editor.file(editorWindowName, editorWindowBlob);
    })
}

function getWindowPrefix(name) {
    return "public class " + name + " : EditorWindow {";
}

function getWindowOpenStr(path, utility, title, name) {
    return [
        "[MenuItem(\"" + path + "\")]",
        "static void Open() {",
        "EditorWindow window = GetWindow (typeof (" + name + "), " + utility + ", \"" + title + "\");",
        "window.Show();",
        "}"
    ].join('\n');
}

function getWindowControlDescription(control) {
    var varStr = [];
    var iniStr = [];
    var redrawStr = [];

    let controlType = control.properties["Control Type"];
    let controlName = control.properties["Control Name"];
    let executionFunction = control.properties["Execution Function"];
    let bindedVariable = control.properties["Binded Variable"];
    let enumClass = control.properties["Enum Class"];
    let includedControls = control.properties["Included Controls"];
    let messageType = control.properties["Message Type"];
    let messageContent = control.properties["Message Content"];
    let wideMessage = control.properties["Wide Message"];
    let objectClassType = control.properties["Object Class Type"];
    let allowSceneObjects = control.properties["Allow Scene Objects"];
    let sliderType = control.properties["Slider Type"];
    let sliderBounds = control.properties["Slider Bounds"];
    let intSliderBounds = control.properties["IntSlider Bounds"];
    let bindedVariables = control.properties["Binded Variables"];
    let toggleType = control.properties["Toggle Type"];
    let vectorType = control.properties["Vector Type"];
    let alwaysShowHorizontal = control.properties["Always Show Horizontal Scrollbar"];
    let alwaysShowVertical = control.properties["Always Show Vertical Scrollbar"];
    let guiStyle = control.properties["GUI Style"];

    switch (controlType.value) {
        case ControlType.Button:
            let buttonStr = getWindowButtonStr(controlName.value, executionFunction.value);
            redrawStr.push(buttonStr);
            break;

        case ControlType.Int:
            let intVar = getWindowIntVar(bindedVariable.value);
            varStr.push(intVar);

            let intStr = getWindowIntStr(bindedVariable.value, controlName.value);
            redrawStr.push(intStr);
            break;

        case ControlType.Text:
            let textVar = getWindowTextVar(bindedVariable.value);
            varStr.push(textVar);

            let textStr = getWindowTextStr(bindedVariable.value, controlName.value);
            redrawStr.push(textStr);
            break;

        case ControlType.Color:
            let colorVar = getWindowColorVar(bindedVariable.value);
            varStr.push(colorVar);

            let colorStr = getWindowColorStr(bindedVariable.value, controlName.value);
            redrawStr.push(colorStr);
            break;

        case ControlType.EnumFlags:
            let enumFlagsVar = getWindowEnumFlagsVar(bindedVariable.value, enumClass.value);
            varStr.push(enumFlagsVar);

            let enumFlagsStr = getWindowEnumFlagsStr(bindedVariable.value, enumClass.value, controlName.value);
            redrawStr.push(enumFlagsStr);
            break;

        case ControlType.EnumPopup:
            let enumPopupVar = getWindowEnumPopupVar(bindedVariable.value, enumClass.value);
            varStr.push(enumPopupVar);

            let enumPopupStr = getWindowEnumPopupStr(bindedVariable.value, enumClass.value, controlName.value);
            redrawStr.push(enumPopupStr);
            break;

        case ControlType.Foldout:
            let foldoutVar = getWindowFoldoutVar(bindedVariable.value);
            varStr.push(foldoutVar);

            let foldoutStr = getWindowFoldoutStr(bindedVariable.value, controlName.value);
            let foldoutPrefix = getWindowFoldoutPrefix(bindedVariable.value);
            let foldoutSuffix = "}";

            redrawStr.push(foldoutStr, foldoutPrefix);
            includedControls.value.forEach(function (ic) {
                var description = getWindowControlDescription(ic);
                varStr = varStr.concat(description.varStr);
                iniStr = iniStr.concat(description.iniStr);
                redrawStr = redrawStr.concat(description.redrawStr);
            })
            redrawStr.push(foldoutSuffix);
            break;

        case ControlType.HelpBox:
            let helpBoxStr = getWindowHelpBoxStr(messageContent.value, messageType.value, wideMessage.value);
            redrawStr.push(helpBoxStr);
            break;

        case ControlType.Object:
            let objectVar = getWindowObjectVar(bindedVariable.value, objectClassType.value);
            varStr.push(objectVar);

            let objectStr = getWindowObjectStr(bindedVariable.value, objectClassType.value, controlName.value, allowSceneObjects.value);
            redrawStr.push(objectStr);
            break;

        case ControlType.Slider:
            let sliderVar = "";
            let sliderStr = "";
            switch (sliderType.value) {
                case "Slider":
                    sliderVar = getWindowSliderVar(bindedVariable.value);
                    varStr.push(sliderVar);

                    sliderStr = getWindowSliderStr(bindedVariable.value, sliderBounds.min, sliderBounds.max, controlName.value);
                    break;
                case "IntSlider":
                    sliderVar = getWindowIntSliderVar(bindedVariable.value);
                    varStr.push(sliderVar);

                    sliderStr = getWindowIntSliderStr(bindedVariable.value, intSliderBounds.min, intSliderBounds.max, controlName.value);
                    break;
                case "MinMaxSlider":
                    sliderVar = getWindowMinMaxSliderVar(bindedVariables.min, bindedVariables.max);
                    varStr.push(sliderVar);

                    sliderStr = getWindowMinMaxSliderStr(bindedVariables.min, bindedVariables.max, sliderBounds.min, sliderBounds.max, controlName.value);
                    break;
            }

            redrawStr.push(sliderStr);
            break;

        case ControlType.Space:
            let spaceStr = "EditorGUILayout.Space ();";
            redrawStr.push(spaceStr);
            break;

        case ControlType.Toggle:
            let toggleVar = getWindowToggleVar(bindedVariable.value);
            varStr.push(toggleVar);

            let toggleStr = getWindowToggleStr(bindedVariable.value, controlName.value, toggleType.value);
            redrawStr.push(toggleStr);
            break;

        case ControlType.Vector:
            let vectorVar = getWindowVectorVar(bindedVariable.value, vectorType.value);
            varStr.push(vectorVar);

            let vectorStr = getWindowVectorStr(bindedVariable.value, controlName.value, vectorType.value);
            redrawStr.push(vectorStr);
            break;

        case LayoutType.FadeGroup:
            let fadeGroupVarStr = "AnimBool _fadeGroupAnimBool;;"
            varStr.push(fadeGroupVarStr);

            let fadeGroupIniStr = "_fadeGroupAnimBool = new AnimBool();"
            iniStr.push(fadeGroupIniStr);

            let fadeGroupPrefix = getWindowFadeGroupPrefix(controlName.value);
            let fadeGroupSuffix = "}\nEditorGUILayout.EndFadeGroup ();\n";

            redrawStr.push(fadeGroupPrefix);
            includedControls.value.forEach(function (ic) {
                var description = getWindowControlDescription(ic);
                varStr = varStr.concat(description.varStr);
                iniStr = iniStr.concat(description.iniStr);
                redrawStr = redrawStr.concat(description.redrawStr);
            })
            redrawStr.push(fadeGroupSuffix);
            break;

        case LayoutType.Horizontal:
            let horizontalPrefix = getHorizontalPrefix(guiStyle.value);
            let horizontalSuffix = "EditorGUILayout.EndHorizontal ();\n";

            redrawStr.push(horizontalPrefix);
            includedControls.value.forEach(function (ic) {
                var description = getWindowControlDescription(ic);
                varStr = varStr.concat(description.varStr);
                iniStr = iniStr.concat(description.iniStr);
                redrawStr = redrawStr.concat(description.redrawStr);
            })
            redrawStr.push(horizontalSuffix);
            break;

        case LayoutType.Vertical:
            let verticalPrefix = getVerticalPrefix(guiStyle.value);
            let verticalSuffix = "EditorGUILayout.EndVertical ();\n";

            redrawStr.push(verticalPrefix);
            includedControls.value.forEach(function (ic) {
                var description = getWindowControlDescription(ic);
                varStr = varStr.concat(description.varStr);
                iniStr = iniStr.concat(description.iniStr);
                redrawStr = redrawStr.concat(description.redrawStr);
            })
            redrawStr.push(verticalSuffix);
            break;

        case LayoutType.Scroll:
            let scrollVarStr = "Vector2 _scrollViewPosition;"
            varStr.push(scrollVarStr);

            let scrollPrefix = getWindowScrollPrefix(alwaysShowHorizontal.value, alwaysShowVertical.value);
            let scrollSuffix = "EditorGUILayout.EndScrollView ();\n";

            redrawStr.push(scrollPrefix);
            includedControls.value.forEach(function (ic) {
                var description = getWindowControlDescription(ic);
                varStr = varStr.concat(description.varStr);
                iniStr = iniStr.concat(description.iniStr);
                redrawStr = redrawStr.concat(description.redrawStr);
            })
            redrawStr.push(scrollSuffix);
            break;

        case LayoutType.ToggleGroup:
            let toggleGroupVarStr = "bool _toggleGroupEnable;"
            varStr.push(toggleGroupVarStr);

            let toggleGroupPrefix = getWindowToggleGroupPrefix(controlName.value);
            let toggleGroupSuffix = "EditorGUILayout.EndToggleGroup ();\n";

            redrawStr.push(toggleGroupPrefix);
            includedControls.value.forEach(function (ic) {
                var description = getWindowControlDescription(ic);
                varStr = varStr.concat(description.varStr);
                iniStr = iniStr.concat(description.iniStr);
                redrawStr = redrawStr.concat(description.redrawStr);
            })
            redrawStr.push(toggleGroupSuffix);
            break;
    }

    return {
        varStr: varStr,
        iniStr: iniStr,
        redrawStr: redrawStr
    }
}

function getWindowButtonStr(name, func) {
    return [
        "if (GUILayout.Button (\"" + name + "\")) {",
        func,
        "}"
    ].join('\n');
}

function getWindowIntVar(v) {
    return "int " + v + ";";
}

function getWindowIntStr(v, name) {
    return v + " = EditorGUILayout.IntField (\"" + name + "\", " + v + ");";
}

function getWindowTextVar(v) {
    return "string " + v + ";";
}

function getWindowTextStr(v, name) {
    return v + " = EditorGUILayout.TextField (\"" + name + "\", " + v + ");";
}

function getWindowColorVar(v) {
    return "Color " + v + ";";
}

function getWindowColorStr(v, name) {
    return v + " = EditorGUILayout.ColorField (\"" + name + "\", " + v + ");";
}

function getWindowEnumFlagsVar(v, c) {
    return c + " " + v + ";"
}

function getWindowEnumFlagsStr(v, c, name) {
    return v + " = (" + c + ")EditorGUILayout.EnumFlagsField (\"" + name + "\", " + v + ");";
}

function getWindowEnumPopupVar(v, c) {
    return c + " " + v + ";"
}

function getWindowEnumPopupStr(v, c, name) {
    return v + " = (" + c + ")EditorGUILayout.EnumPopup (\"" + name + "\", " + v + ");";
}

function getWindowFoldoutVar(v) {
    return "bool " + v + ";";
}

function getWindowFoldoutStr(v, name) {
    return v + " = EditorGUILayout.Foldout (" + v + ", \"" + name + "\");";
}

function getWindowFoldoutPrefix(v) {
    return "if (" + v + ") {";
}

function getWindowHelpBoxStr(message, type, wide) {
    return "EditorGUILayout.HelpBox (\"" + message + "\", MessageType." + type + ", " + wide + ");";
}

function getWindowObjectVar(v, c) {
    return c + " " + v + ";"
}

function getWindowObjectStr(v, c, name, allowSceneObjects) {
    return v + " = (" + c + ")EditorGUILayout.ObjectField (\"" + name + "\", " + v + ", typeof (" + c + "), " + allowSceneObjects + ");"
}

function getWindowToggleVar(v) {
    return "bool " + v + ";";
}

function getWindowToggleStr(v, name, type) {
    return v + " = EditorGUILayout." + type + " (\"" + name + "\", " + v + ");";
}

function getWindowVectorVar(v, c) {
    return c + " " + v + ";"
}

function getWindowVectorStr(v, name, type) {
    return v + " = EditorGUILayout." + type + "Field (\"" + name + "\", " + v + ");";
}

function getWindowSliderVar(v) {
    return "float " + v + ";";
}

function getWindowSliderStr(v, min, max, name) {
    return v + " = EditorGUILayout.Slider (\"" + name + "\", " + v + ", (float)" + min + ", (float)" + max + ");";
}

function getWindowIntSliderVar(v) {
    return "int " + v + ";";
}

function getWindowIntSliderStr(v, min, max, name) {
    return v + " = EditorGUILayout.IntSlider (\"" + name + "\", " + v + ", " + min + ", " + max + ");";
}

function getWindowMinMaxSliderVar(v1, v2) {
    return [
        "float " + v1 + ";",
        "float " + v2 + ";",
    ].join('\n');
}

function getWindowMinMaxSliderStr(v1, v2, min, max, name) {
    return "EditorGUILayout.MinMaxSlider (\"" + name + "\", ref " + v1 + ", ref " + v2 + ", (float)" + min + ", (float)" + max + ");";
}

function getWindowFadeGroupPrefix(name) {
    return [
        "_fadeGroupAnimBool.target = EditorGUILayout.Toggle (\"" + name + "\", _fadeGroupAnimBool.target);",
        "if (EditorGUILayout.BeginFadeGroup (_fadeGroupAnimBool.faded)) {"
    ].join('\n');
}

function getWindowScrollPrefix(horizontal, vertical) {
    return "_scrollViewPosition = EditorGUILayout.BeginScrollView (_scrollViewPosition, " + horizontal + ", " + vertical + ");";
}

function getWindowToggleGroupPrefix(name) {
    return "_toggleGroupEnable = EditorGUILayout.BeginToggleGroup (\"" + name + "\", _toggleGroupViewPosition);"
}

function getHorizontalPrefix(style) {
    return "EditorGUILayout.BeginHorizontal (\"" + style + "\");";
}

function getVerticalPrefix(style) {
    return "EditorGUILayout.BeginVertical (\"" + style + "\");";
}