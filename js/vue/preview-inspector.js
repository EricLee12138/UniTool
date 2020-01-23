var componentContainer = new Vue({
    el: "#inspector",
    data: {
        components: components,
        selection: null
    },
    methods: {
        onDrop: function (event) {
            if (controlSelection.selection) {
                var componentEl = event.target.parentElement;
                if (!componentEl.classList.contains("component-container"))
                    componentEl = componentEl.parentElement;

                components.forEach(function (component) {
                    if (component.el == componentEl) {
                        var selection = controlSelection.selection;
                        var control = new InspectorControl(undefined, selection.image, selection.preview);

                        control.properties["Control Type"].value = selection.type;
                        control.properties["Control Name"].value = selection.name;
                        
                        control.properties["Control Name"].enable = 
                        selection.type != ControlType.Space && selection.type != ControlType.HelpBox;
                        
                        control.properties["Execution Function"].enable = 
                        selection.type == ControlType.Button;
                        
                        control.properties["Binded Variable"].enable = 
                        selection.type != ControlType.Button &&
                        selection.type != ControlType.Space &&
                        selection.type != ControlType.HelpBox &&
                        selection.type != LayoutType.FadeGroup &&
                        selection.type != LayoutType.Horizontal &&
                        selection.type != LayoutType.Vertical &&
                        selection.type != LayoutType.Scroll &&
                        selection.type != LayoutType.ToggleGroup;

                        control.properties["Enum Class"].enable = 
                        selection.type == ControlType.EnumFlags || selection.type == ControlType.EnumPopup;

                        control.properties["Included Controls"].enable = 
                        selection.type == ControlType.Foldout ||
                        selection.type == LayoutType.FadeGroup ||
                        selection.type == LayoutType.Horizontal ||
                        selection.type == LayoutType.Vertical ||
                        selection.type == LayoutType.Scroll ||
                        selection.type == LayoutType.ToggleGroup;

                        control.properties["Message Type"].enable = 
                        control.properties["Message Content"].enable = 
                        control.properties["Wide Message"].enable = 
                        selection.type == ControlType.HelpBox;

                        control.properties["Object Class Type"].enable = 
                        control.properties["Allow Scene Objects"].enable = 
                        selection.type == ControlType.Object;

                        control.properties["Slider Type"].enable = 
                        control.properties["Slider Bounds"].enable = 
                        control.properties["IntSlider Bounds"].enable = 
                        control.properties["Binded Variables"].enable = 
                        selection.type == ControlType.Slider;

                        control.properties["Toggle Type"].enable = 
                        selection.type == ControlType.Toggle;

                        control.properties["Vector Type"].enable = 
                        selection.type == ControlType.Vector;

                        control.properties["Always Show Horizontal Scrollbar"].enable = 
                        control.properties["Always Show Vertical Scrollbar"].enable = 
                        selection.type == LayoutType.Scroll;

                        component.addControl(control);
                        propertyContainer.selectedItem = selectedItem = control;
                    }
                })

                onDrop(event);
                controlSelection.selection = null;
            }
        },

        onLoadParent: function (i) {
            this.$nextTick(function () {
                components[i].setElement(document.getElementById(["component-container", i].join('-')));
            });
        },

        onLoad: function (i, j) {
            this.$nextTick(function () {
                components[i].setControlElement(j, document.getElementById(["control", i, j].join('-')));
            });
        },

        onLoadChild: function (i, j, k) {
            this.$nextTick(function () {
                components[i].controls[j].properties['Included Controls'].value[k].el = document.getElementById(["control-child", j, k].join('-'));
            });
        },

        onDrag: function(event) {
            var controlEl = event.target;
            var componentEl = event.target.parentElement;
            for (var component of components) {
                if (component.el == componentEl) {
                    component.controls.forEach(function (control) {
                        if (control.el == controlEl) {
                            componentContainer.selection = control;
                        }
                    })
                }
            }
        },

        selectItem: function (event) {
            var controlEl = event.target;
            var componentEl;

            if (!event.target.classList.contains("component-control") &&
            !event.target.classList.contains("component-control-child")) {
                controlEl = controlEl.parentElement;
            }

            if (controlEl.classList.contains("component-control-child")) {
                componentEl = controlEl.parentElement.parentElement;
            } else {
                componentEl = controlEl.parentElement;
            }

            for (var component of components) {
                if (component.el.firstElementChild == controlEl) {
                    propertyContainer.selectedItem = selectedItem = component;
                    return;
                }

                if (component.el == componentEl) {
                    component.controls.forEach(function (control) {
                        if (control.el == controlEl) {
                            propertyContainer.selectedItem = selectedItem = control;
                        }
                    })
                }
            }
        },
        
        isLayout: function (control) {
            return control.properties['Control Type'].value == LayoutType.FadeGroup ||
            control.properties['Control Type'].value == LayoutType.Horizontal ||
            control.properties['Control Type'].value == LayoutType.Scroll ||
            control.properties['Control Type'].value == LayoutType.ToggleGroup ||
            control.properties['Control Type'].value == LayoutType.Vertical;
        }
    }
})

var addComopnent = new Vue({
    el: "#add-component",
    methods: {
        addComponent: function (event) {
            var num = components.length + 1;
            var component = new Component("NewComponent" + num);
            components.push(component);

            this.$nextTick(function () {
                component.setElement(document.getElementById("component-container-" + (num - 1)));
            });
        }
    }
});