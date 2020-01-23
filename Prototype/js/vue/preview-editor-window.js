var editorWindowContainer = new Vue({
    el: "#editor-window",
    data: {
        ewindows: ewindows
    },
    methods: {
        selectItem: function(event) {
            var controlEl = event.target;
            var windowEl;

            if (!event.target.classList.contains("editor-window-title")) {
                if (!event.target.classList.contains("editor-window-control")) {
                    controlEl = controlEl.parentElement;
                }
            }

            windowEl = controlEl.parentElement.parentElement;
            if (controlEl.classList.contains("editor-window-control-child")) {
                windowEl = windowEl.parentElement;
            }

            for (var ewindow of ewindows) {
                if (ewindow.el.querySelector(".editor-window-title") == controlEl) {
                    propertyContainer.selectedItem = selectedItem = ewindow;
                    return;
                }

                if (ewindow.el == windowEl) {
                    ewindow.controls.forEach(function (control) {
                        if (control.el == controlEl) {
                            propertyContainer.selectedItem = selectedItem = control;
                        }
                    })
                }
            }
        },

        onDrop: function(event) {
            if (controlSelection.selection) {
                var windowEl = event.target.parentElement;
                if (!windowEl.classList.contains("editor-window-container")) {
                    windowEl = windowEl.parentElement;
                    if (!windowEl.classList.contains("editor-window-container")) {
                        windowEl = windowEl.parentElement;
                    }
                }

                ewindows.forEach(function (ewindow) {
                    if (ewindow.el == windowEl) {
                        var selection = controlSelection.selection;
                        var control = new EditorWindowControl(undefined, selection.image, selection.preview);

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

                        ewindow.addControl(control);
                        propertyContainer.selectedItem = selectedItem = control;
                    }
                })

                onWindowDrop(event);
                controlSelection.selection = null;
            }
        },

        onLoadParent: function (i) {
            this.$nextTick(function () {
                ewindows[i].setElement(document.getElementById(["editor-window-container", i].join('-')));
            });
        },
        
        onLoad: function (i, j) {
            this.$nextTick(function () {
                ewindows[i].setControlElement(j, document.getElementById(["editor-window-control", i, j].join('-')));
            });
        },

        onLoadChild: function (i, j, k) {
            this.$nextTick(function () {
                ewindows[i].controls[j].properties['Included Controls'].value[k].el = document.getElementById(["editor-window-control-child", j, k].join('-'));
            });
        },

        onDrag: function(event) {
            var controlEl = event.target;
            var windowEl = event.target.parentElement.parentElement;
            for (var ewindow of ewindows) {
                if (ewindow.el == windowEl) {
                    ewindow.controls.forEach(function (control) {
                        if (control.el == controlEl) {
                            componentContainer.selection = control;
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

var addWindow = new Vue({
    el: "#add-window",
    methods: {
        addWindow: function(event) {
            var num = ewindows.length + 1;
            var ewindow = new EWindow("NewWindow" + num);
            ewindows.push(ewindow);

            this.$nextTick(function () {
                ewindow.setElement(document.getElementById("editor-window-container-" + (num - 1)));
            });
        }
    }
})