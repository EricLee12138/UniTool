var controlSelection = new Vue({
    el: "#control",
    data: {
        controls: [
            {
                type: ControlType.Button,
                name: "Button",
                image: "images/control/Button.png",
                preview: "images/preview/Button.png",
                intro: "Make single press button. The user clicks them and something happens immediately."
            },
            {
                type: ControlType.Int,
                name: "Int",
                image: "images/control/Int.png",
                preview: "images/preview/Int.png",
                intro: "Make a text field for entering integers."
            },
            {
                type: ControlType.Text,
                name: "Text",
                image: "images/control/Text.png",
                preview: "images/preview/Text.png",
                intro: "Make a text field."
            },
            {
                type: ControlType.Color,
                name: "Color",
                image: "images/control/Color.png",
                preview: "images/preview/Color.png",
                intro: "Make a field for selecting a Color."
            },
            {
                type: ControlType.EnumFlags,
                name: "EnumFlags",
                image: "images/control/EnumFlags.png",
                preview: "images/preview/EnumFlags.png",
                intro: "Displays a menu with an option for every value of the enum type when clicked."
            },
            {
                type: ControlType.EnumPopup,
                name: "EnumPopup",
                image: "images/control/EnumPopup.png",
                preview: "images/preview/EnumPopup.png",
                intro: "Make an enum popup selection field."
            },
            {
                type: ControlType.Foldout,
                name: "Foldout",
                image: "images/control/Foldout.png",
                preview: "images/preview/Foldout.png",
                intro: "Make a label with a foldout arrow to the left of it."
            },
            {
                type: ControlType.HelpBox,
                name: "HelpBox",
                image: "images/control/HelpBox.png",
                preview: "images/preview/HelpBox.png",
                intro: "Make a help box with a message to the user."
            },
            {
                type: ControlType.Object,
                name: "Object",
                image: "images/control/Object.png",
                preview: "images/preview/Object.png",
                intro: "Make a field to receive any object type."
            },
            {
                type: ControlType.Slider,
                name: "Slider",
                image: "images/control/Slider.png",
                preview: "images/preview/Slider.png",
                intro: "Make a slider the user can drag to change a value between a min and a max."
            },
            {
                type: ControlType.Space,
                name: "Space",
                image: "images/control/Space.png",
                preview: "images/preview/Space.png",
                intro: "Make a small space between the previous control and the following."
            },
            {
                type: ControlType.Toggle,
                name: "Toggle",
                image: "images/control/Toggle.png",
                preview: "images/preview/Toggle.png",
                intro: "Make a toggle."
            },
            {
                type: ControlType.Vector,
                name: "Vector",
                image: "images/control/Vector.png",
                preview: "images/preview/Vector.png",
                intro: "Make a field for vector."
            },
        ],
        layouts: [
            {
                type: LayoutType.FadeGroup,
                name: "FadeGroup",
                image: "images/control/FadeGroup.png",
                preview: "images/preview/FadeGroup.png",
                intro: "Make a group that can be be hidden/shown and the transition will be animated."
            },
            {
                type: LayoutType.Horizontal,
                name: "HorizontalLayout",
                image: "images/control/Horizontal.png",
                preview: "images/preview/Horizontal.png",
                intro: "Make a horizontal group."
            },
            {
                type: LayoutType.Vertical,
                name: "VerticalLayout",
                image: "images/control/Vertical.png",
                preview: "images/preview/Vertical.png",
                intro: "Make a vertical group."
            },
            {
                type: LayoutType.Scroll,
                name: "ScrollView",
                image: "images/control/Scroll.png",
                preview: "images/preview/Scroll.png",
                intro: "Make an automatically laid out scrollview."
            },
            {
                type: LayoutType.ToggleGroup,
                name: "ToggleGroup",
                image: "images/control/ToggleGroup.png",
                preview: "images/preview/ToggleGroup.png",
                intro: "Make a vertical group with a toggle to enable or disable all the controls within at once."
            },
        ],
        selection: null,
        tool: 0
    },
    methods: {
        onDrag: function (event, i, item) {
            // controlSelection.selection = controlSelection.controls[i];
            controlSelection.selection = item;
        },
        onChangeTool: function (event) {
            this.tool = event.target.value;
        }
    }
})
