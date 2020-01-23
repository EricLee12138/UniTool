function exportInspector(editor) {
    console.log("Export Inspector Extension");

    let refStr = [
        "using UnityEngine;",
        "using UnityEditor;",
        "using UnityEditor.AnimatedValues;",
        ""
    ];

    components.forEach(function (component) {
        let componentName = component.properties["Component Name"];

        let customEditorAttributeStr = getCustomEditorAttributeStr(componentName.value);
        let editorPrefix = getEditorPrefix(componentName.value);
        let editorSuffix = "}";

        var variablesRegion = [];
        var initializatinoRegion = [];
        var redrawRegion = [];

        let targetVarStr = getTargetVarStr(componentName.value);
        variablesRegion.push(targetVarStr);

        let onEnablePrefix = "void OnEnable () {";
        let onEnableSuffix = "}";
        let targetIniStr = getTargetIniStr(componentName.value);
        initializatinoRegion.push(onEnablePrefix, targetIniStr);

        let onInspectorGUIPrefix = "public override void OnInspectorGUI () {"
        let onInspectorGUISuffix = "}";
        redrawRegion.push(onInspectorGUIPrefix);

        var controls = component.controls;
        controls.forEach(function (control) {
            if (control.folder) return;

            var controlDescription = getControlDescription(control);

            variablesRegion = variablesRegion.concat(controlDescription.varStr);
            initializatinoRegion = initializatinoRegion.concat(controlDescription.iniStr);
            redrawRegion = redrawRegion.concat(controlDescription.redrawStr);
        })

        redrawRegion.push(onInspectorGUISuffix);
        initializatinoRegion.push(onEnableSuffix);

        var inspectorContent = [
            refStr.join('\n'),
            customEditorAttributeStr,
            editorPrefix,
            variablesRegion.join('\n'),
            "\n",
            initializatinoRegion.join('\n'),
            "\n",
            redrawRegion.join('\n'),
            editorSuffix
        ];

        var inspectorName = componentName.value + ".cs";
        var inspectorBlob = new Blob(
            [js_beautify(
                inspectorContent.join('\n'), {
                    indent_size: 4,
                    indent_with_tabs: true,
                })],
            { type: "text/plain;charset=utf-8" }
        );

        // console.log(js_beautify(
        //     inspectorContent.join('\n'), {
        //     indent_size: 4,
        //     indent_with_tabs: true,
        // }));

        editor.file(inspectorName, inspectorBlob);
    })
}

function getCustomEditorAttributeStr(name) {
    return "[CustomEditor (typeof (" + name + "))]";
}

function getEditorPrefix(name) {
    return "public class " + name + "Inspector : Editor {";
}

function getTargetVarStr(name) {
    return name + " _target;";
}

function getTargetIniStr(name) {
    return "_target = (" + name + ")target;"
}

function getControlDescription(control) {
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

    switch (controlType.value) {
        case ControlType.Button:
            let buttonStr = getButtonStr(controlName.value, executionFunction.value);
            redrawStr.push(buttonStr);
            break;

        case ControlType.Int:
            let intStr = getIntStr(bindedVariable.value, controlName.value);
            redrawStr.push(intStr);
            break;

        case ControlType.Text:
            let textStr = getTextStr(bindedVariable.value, controlName.value);
            redrawStr.push(textStr);
            break;

        case ControlType.Color:
            let colorStr = getColorStr(bindedVariable.value, controlName.value);
            redrawStr.push(colorStr);
            break;

        case ControlType.EnumFlags:
            let enumFlagsStr = getEnumFlagsStr(bindedVariable.value, enumClass.value, controlName.value);
            redrawStr.push(enumFlagsStr);
            break;

        case ControlType.EnumPopup:
            let enumPopupStr = getEnumPopupStr(bindedVariable.value, enumClass.value, controlName.value);
            redrawStr.push(enumPopupStr);
            break;

        case ControlType.Foldout:
            let foldoutStr = getFoldoutStr(bindedVariable.value, controlName.value);
            let foldoutPrefix = getFoldoutPrefix(bindedVariable.value);
            let foldoutSuffix = "}";

            redrawStr.push(foldoutStr, foldoutPrefix);
            includedControls.value.forEach(function (ic) {
                var description = getControlDescription(ic);
                varStr = varStr.concat(description.varStr);
                iniStr = iniStr.concat(description.iniStr);
                redrawStr = redrawStr.concat(description.redrawStr);
            })
            redrawStr.push(foldoutSuffix);
            break;

        case ControlType.HelpBox:
            let helpBoxStr = getHelpBoxStr(messageContent.value, messageType.value, wideMessage.value);
            redrawStr.push(helpBoxStr);
            break;

        case ControlType.Object:
            let objectStr = getObjectStr(bindedVariable.value, objectClassType.value, controlName.value, allowSceneObjects.value);
            redrawStr.push(objectStr);
            break;

        case ControlType.Slider:
            let sliderStr = "";
            switch (sliderType.value) {
                case "Slider":
                    sliderStr = getSliderStr(bindedVariable.value, sliderBounds.min, sliderBounds.max, controlName.value);
                    break;
                case "IntSlider":
                    sliderStr = getIntSliderStr(bindedVariable.value, intSliderBounds.min, intSliderBounds.max, controlName.value);
                    break;
                case "MinMaxSlider":
                    let sliderVarStr = getSliderVarStr(bindedVariables.min, bindedVariables.max);
                    varStr.push(sliderVarStr);

                    let sliderIniStr = getSliderIniStr(bindedVariables.min, bindedVariables.max);
                    iniStr.push(sliderIniStr);

                    sliderStr = getMinMaxSliderStr(bindedVariables.min, bindedVariables.max, sliderBounds.min, sliderBounds.max, controlName.value);
                    break;
            }

            redrawStr.push(sliderStr);
            break;

        case ControlType.Space:
            let spaceStr = "EditorGUILayout.Space ();";
            redrawStr.push(spaceStr);
            break;

        case ControlType.Toggle:
            let toggleStr = getToggleStr(bindedVariable.value, controlName.value, toggleType.value);
            redrawStr.push(toggleStr);
            break;

        case ControlType.Vector:
            let vectorStr = getVectorStr(bindedVariable.value, controlName.value, vectorType.value);
            redrawStr.push(vectorStr);
            break;

        case LayoutType.FadeGroup:
            let fadeGroupVarStr = "AnimBool _fadeGroupAnimBool;"
            varStr.push(fadeGroupVarStr);

            let fadeGroupIniStr = "_fadeGroupAnimBool = new AnimBool();"
            iniStr.push(fadeGroupIniStr);

            let fadeGroupPrefix = getFadeGroupPrefix(controlName.value);
            let fadeGroupSuffix = "}\nEditorGUILayout.EndFadeGroup ();\n";

            redrawStr.push(fadeGroupPrefix);
            includedControls.value.forEach(function (ic) {
                var description = getControlDescription(ic);
                varStr = varStr.concat(description.varStr);
                iniStr = iniStr.concat(description.iniStr);
                redrawStr = redrawStr.concat(description.redrawStr);
            })
            redrawStr.push(fadeGroupSuffix);
            break;

        case LayoutType.Horizontal:
            let horizontalPrefix = "EditorGUILayout.BeginHorizontal ();";
            let horizontalSuffix = "EditorGUILayout.EndHorizontal ();\n";

            redrawStr.push(horizontalPrefix);
            includedControls.value.forEach(function (ic) {
                var description = getControlDescription(ic);
                varStr = varStr.concat(description.varStr);
                iniStr = iniStr.concat(description.iniStr);
                redrawStr = redrawStr.concat(description.redrawStr);
            })
            redrawStr.push(horizontalSuffix);
            break;

        case LayoutType.Vertical:
            let verticalPrefix = "EditorGUILayout.BeginVertical ();";
            let verticalSuffix = "EditorGUILayout.EndVertical ();\n";

            redrawStr.push(verticalPrefix);
            includedControls.value.forEach(function (ic) {
                var description = getControlDescription(ic);
                varStr = varStr.concat(description.varStr);
                iniStr = iniStr.concat(description.iniStr);
                redrawStr = redrawStr.concat(description.redrawStr);
            })
            redrawStr.push(verticalSuffix);
            break;

        case LayoutType.Scroll:
            let scrollVarStr = "Vector2 _scrollViewPosition;"
            varStr.push(scrollVarStr);

            let scrollPrefix = getScrollPrefix(alwaysShowHorizontal.value, alwaysShowVertical.value);
            let scrollSuffix = "EditorGUILayout.EndScrollView ();\n";

            redrawStr.push(scrollPrefix);
            includedControls.value.forEach(function (ic) {
                var description = getControlDescription(ic);
                varStr = varStr.concat(description.varStr);
                iniStr = iniStr.concat(description.iniStr);
                redrawStr = redrawStr.concat(description.redrawStr);
            })
            redrawStr.push(scrollSuffix);
            break;

        case LayoutType.ToggleGroup:
            let toggleGroupVarStr = "bool _toggleGroupEnable;"
            varStr.push(toggleGroupVarStr);

            let toggleGroupPrefix = getToggleGroupPrefix(controlName.value);
            let toggleGroupSuffix = "EditorGUILayout.EndToggleGroup ();\n";

            redrawStr.push(toggleGroupPrefix);
            includedControls.value.forEach(function (ic) {
                var description = getControlDescription(ic);
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

function getButtonStr(name, func) {
    return [
        "if (GUILayout.Button (\"" + name + "\")) {",
        func,
        "}"
    ].join('\n');
}

function getIntStr(v, name) {
    return "_target." + v + " = EditorGUILayout.IntField (\"" + name + "\", _target." + v + ");";
}

function getTextStr(v, name) {
    return "_target." + v + " = EditorGUILayout.TextField (\"" + name + "\", _target." + v + ");";
}

function getColorStr(v, name) {
    return "_target." + v + " = EditorGUILayout.ColorField (\"" + name + "\", _target." + v + ");";
}

function getEnumFlagsStr(v, c, name) {
    return "_target." + v + " = (" + c + ")EditorGUILayout.EnumFlagsField (\"" + name + "\", _target." + v + ");";
}

function getEnumPopupStr(v, c, name) {
    return "_target." + v + " = (" + c + ")EditorGUILayout.EnumPopup (\"" + name + "\", _target." + v + ");";
}

function getFoldoutStr(v, name) {
    return v + " = EditorGUILayout.Foldout (" + v + ", \"" + name + "\");";
}

function getFoldoutPrefix(v) {
    return "if (" + v + ") {";
}

function getHelpBoxStr(message, type, wide) {
    return "EditorGUILayout.HelpBox (\"" + message + "\", MessageType." + type + ", " + wide + ");";
}

function getObjectStr(v, c, name, allowSceneObjects) {
    return "_target." + v + " = (" + c + ")EditorGUILayout.ObjectField (\"" + name + "\", _target." + v + ", typeof (" + c + "), " + allowSceneObjects + ");"
}

function getToggleStr(v, name, type) {
    return "_target." + v + " = EditorGUILayout." + type + " (\"" + name + "\", _target." + v + ");";
}

function getVectorStr(v, name, type) {
    return "_target." + v + " = EditorGUILayout." + type + "Field (\"" + name + "\", _target." + v + ");";
}

function getSliderStr(v, min, max, name) {
    return "_target." + v + " = EditorGUILayout.Slider (\"" + name + "\", _target." + v + ", (float)" + min + ", (float)" + max + ");";
}

function getIntSliderStr(v, min, max, name) {
    return "_target." + v + " = EditorGUILayout.IntSlider (\"" + name + "\", _target." + v + ", " + min + ", " + max + ");";
}

function getMinMaxSliderStr(v1, v2, min, max, name) {
    return "EditorGUILayout.MinMaxSlider (\"" + name + "\", ref _" + v1 + ", ref _" + v2 + ", (float)" + min + ", (float)" + max + ");";
}

function getSliderVarStr(v1, v2) {
    return [
        "float _" + v1 + ";",
        "float _" + v2 + ";",
    ].join('\n');
}

function getSliderIniStr(v1, v2) {
    return [
        "_" + v1 + " = _target." + v1 + ";",
        "_" + v2 + " = _target." + v2 + ";",
    ].join('\n');
}

function getFadeGroupPrefix(name) {
    return [
        "_fadeGroupAnimBool.target = EditorGUILayout.Toggle (\"" + name + "\", _fadeGroupAnimBool.target);",
        "if (EditorGUILayout.BeginFadeGroup (_fadeGroupAnimBool.faded)) {"
    ].join('\n');
}

function getScrollPrefix(horizontal, vertical) {
    return "_scrollViewPosition = EditorGUILayout.BeginScrollView (_scrollViewPosition, " + horizontal + ", " + vertical + ");";
}

function getToggleGroupPrefix(name) {
    return "_toggleGroupEnable = EditorGUILayout.BeginToggleGroup (\"" + name + "\", _toggleGroupEnable);"
}