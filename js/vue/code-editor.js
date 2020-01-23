var codeMirror = CodeMirror(
    document.getElementById("code-editor"),
    {
        value: "public static class Hello {}",
        mode: "text/x-csharp",
        theme: "eclipse",
        indentUnit: 4,
        indentWithTabs: true,
        lineNumbers: true,
        lineWrapping: true,
        autofocus: true,
    }
);

var codeEditor = new Vue({
    el: "#code-submit",
    data: {
        editor: null,
        target: null
    },
    methods: {
        confirm: function() {
            this.target.value = codeMirror.getValue();
            this.hide();
        },
        discard: function() {
            this.hide();
        },

        hide: function() {
            hideElement(this.editor);
            this.target = null;
        },
        show: function(target) {
            showElement(this.editor);
            this.target = target;
        }
    },
    created: function() {
        this.editor = document.getElementById("code");
    }
})

function hideElement(el) {
    el.classList.add("hidden");
}

function showElement(el) {
    el.classList.remove("hidden");
}