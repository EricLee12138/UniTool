var addItem = new Vue({
    el: "#add-item",
    methods: {
        addItem: function () {
            var newItem = new MenuBarItem();
            var id = menuItemTree.GetRoots().length + 1;
            newItem.properties["Class Name"].value = "NewMenuClass" + id;
            newItem.properties["Item Name"].value = "NewMenuItem" + id;

            propertyContainer.selectedItem = selectedItem = newItem;

            let menuItemNode = new MenuItemNode(newItem, 0, menuItemTree);
            menuItemTree.AddChild(menuItemNode);

            UpdateMenuView();
        }
    }
});

var itemContainer = new Vue({
    el: "#item-container",
    data: {
        menuTable: [],
        emptyFlags: [],
        roots: []
    },
    methods: {
        selectItem: function (event) {
            this.$nextTick(function () {
                var menuItems = menuItemTree.GetItems();
                for (var item of menuItems) {
                    if (item.el == event.target &&
                        item.properties["Item Name"].value == event.target.innerHTML) {
                        propertyContainer.selectedItem = selectedItem = item;
                        UpdateMenuView();
                        // return;
                    }
                }

                var path = event.target.innerHTML;
                var pathNum = parseInt(event.target.id.split('-')[1]);
                if (isNaN(pathNum)) pathNum = -1;

                menuItems.forEach(function (item) {
                    if (item.properties["Menu Path"].value[pathNum + 1] == path) {
                        propertyContainer.selectedItem = selectedItem = item;
                        UpdateMenuView();
                        return;
                    }
                });

                UpdateMenuView();
            });
        },
        onLoad: function (i) {
            this.$nextTick(function() {
                menuItemTree.SetChildElement(i, document.getElementById("menu-item-" + i));
            });
        },
        onLoadChild: function (i, j, name) {
            this.$nextTick(function () {
                menuItems = menuItemTree.GetItems();
                menuItems.forEach(function (item) {
                    for (let k = i; k > 0; k--) {
                        if (itemContainer.menuTable[k - 1][itemContainer.emptyFlags[k]] != item.properties["Menu Path"].value[k]) return;
                    }
                    if (item.properties["Item Name"].value == name) {
                        item.el = document.getElementById("child-" + i + '-' + j);
                    }
                });
            });
        }
    }
})

function UpdateMenuView() {
    if (!(selectedItem instanceof MenuBarItem)) {
        return;
    }

    menuItemTree.Update();

    selectedNode = menuItemTree.Find(selectedItem);
    if (selectedNode) itemContainer.menuTable = selectedNode.GeneratePathTable();
    itemContainer.emptyFlags = [];
    itemContainer.roots = menuItemTree.GetRoots();
    for (let i = 0; i < itemContainer.menuTable.length; i++) {
        var flag = 0;
        while (itemContainer.menuTable[i][flag] == "EMPTY") flag++;
        itemContainer.emptyFlags[i] = flag;
    }
}