var EWindow = function (name, el, controls, properties) {
    this.el = el || null;
    this.controls = controls || [];

    this.properties = properties || {
        "Window Name": {
            enable: true,
            editable: true,
            type: PropertyType.Text,
            value: name || "No Name"
        },
        "Window Title": {
            enable: true,
            editable: true,
            type: PropertyType.Text,
            value: "Window"
        },
        "Window Type": {
            enable: true,
            editable: true,
            type: PropertyType.Popup,
            popup: [
                "Common Window", "Floating Utility Window"
            ],
            value: "Common Window"
        },
        "Customized Open": {
            enable: true,
            editable: true,
            type: PropertyType.Bool,
            value: false,
        },
        "Menu Path To Open": {
            enable: true,
            editable: true,
            type: PropertyType.Text,
            value: "Window/Open",
        }
    };

    this.setElement = (el) => {
        console.assert(el);
        this.el = el;
    }

    this.addControl = (control) => {
        this.controls.push(control);
    }

    this.removeControl = (control) => {
        let i = this.controls.indexOf(control)
        if (i != -1) {
            this.controls.splice(i, 1);
        }
    }

    this.setControlElement = (i, el) => {
        this.controls[i].el = el;
    }

    this.setControlProperty = (i, property, value) => {
        this.controls[i].properties[property].value = value;
    }
}

EWindow.parseFromObj = (obj) => {
    var controls = [];
    var controlsObj = obj.controls;
    
    for (var i = 0; i < controlsObj.length; i++) {
        if (controlsObj[i].folder) {
            controls[i] = EditorWindowControl.parseFromObj(controlsObj[i], controls, controlsObj);
        }
    }

    for (var i = 0; i < controlsObj.length; i++) {
        if (!controlsObj[i].folder) {
            controls[i] = EditorWindowControl.parseFromObj(controlsObj[i], controls, controlsObj);
        }
    }

    return new EWindow(obj.name, obj.el, controls, obj.properties);
}