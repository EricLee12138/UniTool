var selectedItem;

var propertyContainer = new Vue({
    el: "#property",
    data: {
        selectedItem: selectedItem,
    },
    methods: {
        checkPropertyType: function (property, type) {
            return property.type == type;
        },
        onChange: function (event) {
            var ele = event.target;
            var attrib = ele.getAttribute("property");

            UpdateAttributeValues(attrib, ele);
        },
        onKeyDown: function (event) {
            if (event.keyCode == 13) event.target.blur();
        },
        onDrop: function (event, value) {
            onControlDrop(event);

            if (selectedItem == componentContainer.selection) {
                alert(selectedItem.properties["Control Name"].value + " cannot include itself!");
                return;
            } else if (selectedItem.properties["Included Controls"].value.includes(componentContainer.selection)) {
                alert("The control \"" + componentContainer.selection.properties["Control Name"].value + "\" is already included!");
                return;
            } else if (componentContainer.selection.properties["Control Type"].value == LayoutType.FadeGroup ||
            componentContainer.selection.properties["Control Type"].value == LayoutType.Horizontal ||
            componentContainer.selection.properties["Control Type"].value == LayoutType.Scroll ||
            componentContainer.selection.properties["Control Type"].value == LayoutType.ToggleGroup ||
            componentContainer.selection.properties["Control Type"].value == LayoutType.Vertical ||
            componentContainer.selection.properties["Control Type"].value == ControlType.Foldout) {
                alert("Nested structure is not supported yet!");
                return;
            } else if (selectedItem instanceof InspectorControl && componentContainer.selection instanceof EditorWindowControl) {
                alert("[" + selectedItem.properties["Control Name"].value + "] from an inspector cannot include [" + componentContainer.selection.properties["Control Name"].value + "] from an editor window!");
                return;
            } else if (selectedItem instanceof EditorWindowControl && componentContainer.selection instanceof InspectorControl) {
                alert("[" + selectedItem.properties["Control Name"].value + "] from an editor window cannot include [" + componentContainer.selection.properties["Control Name"].value + "] from an inspector!");
                return;
            }

            value.value.push(componentContainer.selection);
            componentContainer.selection.folder = true;
            componentContainer.selection = null;
        },
        onEditCode: function (event, code, target) {
            codeEditor.show(target);

            codeMirror.setValue(code);
            codeMirror.refresh();
        },
        onLoad: function () {
            UpdatePropertyDisplay();
        },
        onDelete: function (event) {
            if (selectedItem instanceof MenuBarItem) {
                selectedNode = menuItemTree.Find(selectedItem);
                if (!menuItemTree.Delete(selectedNode)) {
                    selectedItem.properties["Menu Path"].value = [];
                    UpdateMenuView();
                    selectedNode = menuItemTree.Find(selectedItem);
                    menuItemTree.Delete(selectedNode);
                }
                UpdateMenuView();
            } else if (selectedItem instanceof Component) {
                let i = components.indexOf(selectedItem);
                if (i != -1) {
                    components.splice(i, 1);
                }
            } else if (selectedItem instanceof InspectorControl) {
                components.forEach(function (component) {
                    component.removeControl(selectedItem);
                })
                if (selectedItem.folder) {
                    components.forEach(function (component) {
                        component.controls.forEach(function (control) {
                            var includedControls = control.properties["Included Controls"].value;
                            let i = includedControls.indexOf(selectedItem);
                            if (i != -1) {
                                includedControls.splice(i, 1);
                            }
                        })
                    })
                }
            } else if (selectedItem instanceof EWindow) {
                let i = ewindows.indexOf(selectedItem);
                if (i != -1) {
                    ewindows.splice(i, 1);
                }
            } else if (selectedItem instanceof EditorWindowControl) {
                ewindows.forEach(function (ewindow) {
                    ewindow.removeControl(selectedItem);
                })
            }
            propertyContainer.selectedItem = selectedItem = null;
        }
    }
})

function UpdateAttributeValues(attrib, ele) {
    switch (selectedItem.properties[attrib].type) {

        case PropertyType.Text:
            selectedItem.properties[attrib].value = ele.value;
            UpdateMenuView();
            break;

        case PropertyType.Int:
            selectedItem.properties[attrib].value = Math.round(ele.value);
            break;

        case PropertyType.Bool:
            selectedItem.properties[attrib].value = ele.checked;
            break;

        case PropertyType.BoolCode:
            if (ele.type == "checkbox") {
                selectedItem.properties[attrib].bool = ele.checked;
            } else {
                selectedItem.properties[attrib].code = ele.value;
            }
            break;

        case PropertyType.Path:
            selectedItem.properties[attrib].value = ele.value == "" ? [] : ele.value.split("/");
            UpdateMenuView();
            break;

        case PropertyType.Popup:
            selectedItem.properties[attrib].value = selectedItem.properties[attrib].popup[ele.selectedIndex];
            break;

        case PropertyType.FloatFloat:
        case PropertyType.TextText:
            var arg = ele.getAttribute("arg");
            if (arg == 0) {
                selectedItem.properties[attrib].min = ele.value
            } else if (arg == 1) {
                selectedItem.properties[attrib].max = ele.value
            }
            break;

        case PropertyType.IntInt:
            var arg = ele.getAttribute("arg");
            if (arg == 0) {
                selectedItem.properties[attrib].min = Math.round(ele.value)
            } else if (arg == 1) {
                selectedItem.properties[attrib].max = Math.round(ele.value)
            }
            break;

    }
}

function UpdatePropertyDisplay() {
    if (selectedItem instanceof InspectorControl ||
        selectedItem instanceof EditorWindowControl) {
        if (selectedItem.properties["Control Type"].value == ControlType.Slider) {
            selectedItem.properties["Slider Bounds"].enable = selectedItem.properties["Slider Type"].value != "IntSlider";

            selectedItem.properties["IntSlider Bounds"].enable = selectedItem.properties
            ["Slider Type"].value == "IntSlider";

            selectedItem.properties["Binded Variables"].enable = selectedItem.properties["Slider Type"].value == "MinMaxSlider";
            selectedItem.properties["Binded Variable"].enable = selectedItem.properties["Slider Type"].value != "MinMaxSlider";
        }
    } else if (selectedItem instanceof EWindow) {
        selectedItem.properties["Menu Path To Open"].editable = selectedItem.properties["Customized Open"].value == false;
    }
}