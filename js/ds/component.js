var Component = function (name, el, controls, properties) {
    this.el = el || null;
    this.controls = controls || [];

    this.properties = properties || {
        "Component Name": {
            enable: true,
            editable: true,
            type: PropertyType.Text,
            value: name || "No Name"
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

Component.parseFromObj = (obj) => {
    var controls = [];
    var controlsObj = obj.controls;
    
    for (var i = 0; i < controlsObj.length; i++) {
        if (controlsObj[i].folder) {
            controls[i] = InspectorControl.parseFromObj(controlsObj[i], controls, controlsObj);
        }
    }

    for (var i = 0; i < controlsObj.length; i++) {
        if (!controlsObj[i].folder) {
            controls[i] = InspectorControl.parseFromObj(controlsObj[i], controls, controlsObj);
        }
    }

    return new Component(obj.name, obj.el, controls, obj.properties);
}