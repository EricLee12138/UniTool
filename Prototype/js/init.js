// For Menubar Extension
var selectedNode;
var menuItemTree = new MenuItemTree();

// For Inspector Extension
var components = [];

// For Editor Window Extension
var ewindows = [];

var test;

window.onload = function() {
    importFrom(localStorage)
}

window.onkeydown = function(event) {
    if (event.metaKey && event.keyCode == 83){
        saveToLocal();
		return false;
    }
    
    // if (event.metaKey && event.keyCode == 67){
    //     localStorage.clear();
	// 	return false;
	// }
}

function saveToLocal() {
    localStorage.setItem("menuItemTree", CircularJSON.stringify(menuItemTree))
    localStorage.setItem("components", CircularJSON.stringify(components))
    localStorage.setItem("ewindows", CircularJSON.stringify(ewindows))
}

function importFrom(obj) {
    components.length = 0;
    ewindows.length = 0;

    var menuItemTreeJSON = obj.menuItemTree;
    if (menuItemTreeJSON) {
        var menuItemTreeObj = CircularJSON.parse(menuItemTreeJSON);
        menuItemTree = MenuItemTree.parseFromObj(menuItemTreeObj);
        itemContainer.roots = menuItemTree.GetRoots();
    }

    var componentsJSON = obj.components;
    if (componentsJSON) {
        var componentsObj = CircularJSON.parse(componentsJSON);
        componentsObj.forEach(function (obj) {
            components.push(Component.parseFromObj(obj))
        })
    }

    var ewindowsJSON = obj.ewindows;
    if (ewindowsJSON) {
        var ewindowsObj = CircularJSON.parse(ewindowsJSON);
        ewindowsObj.forEach(function (obj) {
            ewindows.push(EWindow.parseFromObj(obj))
        })
    }
}