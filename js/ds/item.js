var MenuBarItem = function (el, properties) {
    this.type = ItemType.MenuBarItem;
    this.el = el || null;

    this.properties = properties || {
        "Item Type": {
            enable: true,
            editable: false,
            type: PropertyType.Text,
            value: "Menu Bar Item"
        },
        "Class Name": {
            enable: true,
            editable: true,
            type: PropertyType.Text,
            value: ""
        },
        "Item Name": {
            enable: true,
            editable: true,
            type: PropertyType.Text,
            value: ""
        },
        "Menu Path": {
            enable: true,
            editable: true,
            type: PropertyType.Path,
            value: []
        },
        "Execution Function": {
            enable: true,
            editable: true,
            type: PropertyType.Code,
            value: "// Write your execution function code here\n"
        },
        "Validation Function": {
            enable: true,
            editable: true,
            type: PropertyType.BoolCode,
            bool: false,
            value: "// Write your validation function code here\n"
        },
        "Priority": {
            enable: true,
            editable: true,
            type: PropertyType.Int,
            value: 0
        }
    }
}

MenuBarItem.parseFromObj = (obj) => {
    return new MenuBarItem(obj.el, obj.properties);
}

var InspectorControl = function (el, img, preview, folder, properties) {
    this.type = ItemType.InspectorControl;
    this.el = el || null;
    this.img = img || "";
    this.preview = preview || "";

    this.folder = folder || false;
    
    this.properties = properties || {
        "Control Type": {
            enable: true,
            editable: false,
            type: PropertyType.ControlType,
            value: ControlType.Button
        },
        "Control Name": {
            enable: true,
            editable: true,
            type: PropertyType.Text,
            value: ""
        },
        "Execution Function": {
            enable: true,
            editable: true,
            type: PropertyType.Code,
            value: "// Write your execution function code here\n"
        },
        "Binded Variable": {
            enable: true,
            editable: true,
            type: PropertyType.Text,
            value: ""
        },
        "Enum Class": {
            enable: true,
            editable: true,
            type: PropertyType.Text,
            value: ""
        },
        "Included Controls": {
            enable: true,
            editable: true,
            type: PropertyType.Controls,
            value: []
        },
        "Message Type": {
            enable: true,
            editable: true,
            type: PropertyType.Popup,
            popup: [
                "None", "Error", "Warning", "Info"
            ],
            value: "None"
        },
        "Message Content": {
            enable: true,
            editable: true,
            type: PropertyType.Text,
            value: ""
        },
        "Wide Message": {
            enable: true,
            editable: true,
            type: PropertyType.Bool,
            value: false
        },
        "Object Class Type": {
            enable: true,
            editable: true,
            type: PropertyType.Text,
            value: ""
        },
        "Allow Scene Objects": {
            enable: true,
            editable: true,
            type: PropertyType.Bool,
            value: false
        },
        "Slider Type": {
            enable: true,
            editable: true,
            type: PropertyType.Popup,
            popup: [
                "Slider", "IntSlider", "MinMaxSlider"
            ],
            value: "Slider"
        },
        "Slider Bounds": {
            enable: true,
            editable: true,
            type: PropertyType.FloatFloat,
            min: 0.0,
            max: 10.0
        },
        "IntSlider Bounds": {
            enable: true,
            editable: true,
            type: PropertyType.IntInt,
            min: 0,
            max: 10
        },
        "Binded Variables": {
            enable: true,
            editable: true,
            type: PropertyType.TextText,
            min: "",
            max: ""
        },
        "Toggle Type": {
            enable: true,
            editable: true,
            type: PropertyType.Popup,
            popup: [
                "Toggle", "ToggleLeft",
            ],
            value: "Toggle"
        },
        "Vector Type": {
            enable: true,
            editable: true,
            type: PropertyType.Popup,
            popup: [
                "Vector2", "Vector2Int",
                "Vector3", "Vector3Int",
                "Vector4"
            ],
            value: "Vector3"
        },
        "Always Show Horizontal Scrollbar": {
            enable: true,
            editable: true,
            type: PropertyType.Bool,
            value: false
        },
        "Always Show Vertical Scrollbar": {
            enable: true,
            editable: true,
            type: PropertyType.Bool,
            value: false
        }
    }
}

InspectorControl.parseFromObj = (obj, controls, controlsObj) => {
    if (!obj.folder) {
        var includedControls = [];

        var includedControlsObj = obj.properties["Included Controls"].value;
        includedControlsObj.forEach(function (obj) {
            for (var i = 0; i < controlsObj.length; i++) {
                if (controlsObj[i] == obj) {
                    includedControls.push(controls[i]);
                }
            }
        })

        obj.properties["Included Controls"].value = includedControls;
    }

    return new InspectorControl(obj.el, obj.img, obj.preview, obj.folder, obj.properties);
}

var EditorWindowControl = function (el, img, preview, folder, properties) {
    this.type = ItemType.EditorWindowControl;
    this.el = el || null;
    this.img = img || "";
    this.preview = preview || "";

    this.folder = folder || false;

    this.properties = properties || {
        "Control Type": {
            enable: true,
            editable: false,
            type: PropertyType.ControlType,
            value: ControlType.Button
        },
        "Control Name": {
            enable: true,
            editable: true,
            type: PropertyType.Text,
            value: ""
        },
        "Execution Function": {
            enable: true,
            editable: true,
            type: PropertyType.Code,
            value: "// Write your execution function code here\n"
        },
        "Binded Variable": {
            enable: true,
            editable: true,
            type: PropertyType.Text,
            value: ""
        },
        "Enum Class": {
            enable: true,
            editable: true,
            type: PropertyType.Text,
            value: ""
        },
        "Included Controls": {
            enable: true,
            editable: true,
            type: PropertyType.Controls,
            value: []
        },
        "Message Type": {
            enable: true,
            editable: true,
            type: PropertyType.Popup,
            popup: [
                "None", "Error", "Warning", "Info"
            ],
            value: "None"
        },
        "Message Content": {
            enable: true,
            editable: true,
            type: PropertyType.Text,
            value: ""
        },
        "Wide Message": {
            enable: true,
            editable: true,
            type: PropertyType.Bool,
            value: false
        },
        "Object Class Type": {
            enable: true,
            editable: true,
            type: PropertyType.Text,
            value: ""
        },
        "Allow Scene Objects": {
            enable: true,
            editable: true,
            type: PropertyType.Bool,
            value: false
        },
        "Slider Type": {
            enable: true,
            editable: true,
            type: PropertyType.Popup,
            popup: [
                "Slider", "IntSlider", "MinMaxSlider"
            ],
            value: "Slider"
        },
        "Slider Bounds": {
            enable: true,
            editable: true,
            type: PropertyType.FloatFloat,
            min: 0.0,
            max: 10.0
        },
        "IntSlider Bounds": {
            enable: true,
            editable: true,
            type: PropertyType.IntInt,
            min: 0,
            max: 10
        },
        "Binded Variables": {
            enable: true,
            editable: true,
            type: PropertyType.TextText,
            min: "",
            max: ""
        },
        "Toggle Type": {
            enable: true,
            editable: true,
            type: PropertyType.Popup,
            popup: [
                "Toggle", "ToggleLeft",
            ],
            value: "Toggle"
        },
        "Vector Type": {
            enable: true,
            editable: true,
            type: PropertyType.Popup,
            popup: [
                "Vector2", "Vector2Int",
                "Vector3", "Vector3Int",
                "Vector4"
            ],
            value: "Vector3"
        },
        "Always Show Horizontal Scrollbar": {
            enable: true,
            editable: true,
            type: PropertyType.Bool,
            value: false
        },
        "Always Show Vertical Scrollbar": {
            enable: true,
            editable: true,
            type: PropertyType.Bool,
            value: false
        },
        "GUI Style": {
            enable: true,
            editable: true,
            type: PropertyType.Popup,
            popup: [
                "Box", "Label",
                "Button", "HelpBox"
            ],
            value: "Label"
        }
    }
}

EditorWindowControl.parseFromObj = (obj, controls, controlsObj) => {
    if (!obj.folder) {
        var includedControls = [];

        var includedControlsObj = obj.properties["Included Controls"].value;
        includedControlsObj.forEach(function (obj) {
            for (var i = 0; i < controlsObj.length; i++) {
                if (controlsObj[i] == obj) {
                    includedControls.push(controls[i]);
                }
            }
        })

        obj.properties["Included Controls"].value = includedControls;
    }

    return new EditorWindowControl(obj.el, obj.img, obj.preview, obj.folder, obj.properties);
}