var exportAll = new Vue({
    el: "#export-all",
    data: {
        ifExportMenuBar: true,
        ifExportInspector: true,
        ifExportEditorWindow: true
    },
    methods: {
        discard: function() {
            this.hide();
        },
        hide: function() {
            console.log(this.$el);
            hideElement(this.$el);
        },
        show: function() {
            showElement(this.$el);
        },
        exportJSON: function() {
            var jsonName = "editor.json";
            var jsonContent = {
                menuItemTree: menuItemTree,
                components: components,
                ewindows: ewindows
            };

            var jsonBlob = new Blob(
                [js_beautify(
                    CircularJSON.stringify(jsonContent), {
                    indent_size: 4,
                    indent_with_tabs: true,
                })], 
                { type: "text/plain;charset=utf-8" }
            );

            saveAs(jsonBlob, jsonName);
        },
        exportCSharp: function() {
            var zip = new JSZip();
            var editor = zip.folder("Editor");

            if (this.ifExportMenuBar) {
                exportMenu(editor);
            }
            if (this.ifExportInspector) {
                exportInspector(editor);
            }
            if (this.ifExportEditorWindow) {
                exportEditorWindow(editor);
            }

            zip.generateAsync({ type: "blob" })
            .then(function (content) {
                saveAs(content, "Export.zip");
            });
        },
        onChange: function(event, id) {
            var checked = event.target.checked;
            switch (id) {
            case 0:
                this.ifExportMenuBar = checked;
                break;
            case 1:
                this.ifExportInspector = checked;
                break;
            case 2:
                this.ifExportEditorWindow = checked;
                break;
            }
        }
    }
})

function hideElement(el) {
    el.classList.add("hidden");
}

function showElement(el) {
    el.classList.remove("hidden");
}