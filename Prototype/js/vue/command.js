var commander = new Vue({
    el: "nav",
    data: {
        selectedItem: selectedItem,
    },
    methods: {
        exportAll: function () {
            exportAll.show();
        },

        saveFile: function () {
            saveToLocal();
        },
        
        importFile: function (event) {
            var fileReader = new FileReader();
            fileReader.readAsText(event.target.files[0], "UTF-8");
            fileReader.onload = function(evt){
                var fileString = evt.target.result;
                console.log("-- JSON File Imported --\n", fileString);

                if (confirm("JSON file has been uploaded. Do you want to import the file into the project?")) {
                    var obj = CircularJSON.parse(fileString);
                    obj = {
                        menuItemTree: CircularJSON.stringify(obj.menuItemTree),
                        components: CircularJSON.stringify(obj.components),
                        ewindows: CircularJSON.stringify(obj.ewindows)
                    }
                    
                    importFrom(obj);
                    // console.log(CircularJSON.parse(fileString));
                    // test = obj;
                }
            }
        }
    }
})