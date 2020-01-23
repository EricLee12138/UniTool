var MenuItemNode = function (value, level, parent, children) {
    this.value = value || new MenuBarItem();
    this.level = level || 0;
    this.parent = parent || null;
    this.children = children || [];

    this.SetParent = (parent) => {
        this.parent = parent;
    };

    this.AddChild = (child) => {
        this.children.push(child);
        console.assert(child.parent == this);
    }

    this.AddChildren = (children) => {
        children.forEach((child) => {
            child.SetParent(this)
            this.AddChild(child);
        })
    }

    this.RemoveChild = (child) => {
        let i = this.children.indexOf(child)
        if (i != -1) {
            this.children.splice(i, 1);
            // console.assert(this.children.length == 0 && !this.value instanceof String);
        }
    }

    this.Remove = () => {
        var parent = this.parent;
        var child = this;

        while (!(parent instanceof MenuItemTree)) {
            if (parent.children.length > 1) {
                parent.RemoveChild(child);
                return;
            }

            parent = parent.parent;
            child = child.parent;
        }

        // Should remove the whole tree from the root
        parent.RemoveChild(child);
    }

    this.EmptyChild = () => {
        return this.children.length == 0;
    }

    this.NeedGrow = () => {
        if (!this.EmptyChild())
            return false;

        return this.value.properties["Menu Path"].value.length > this.level;
    }

    this.NeedReduce = () => {
        if (!this.EmptyChild())
            return false;

        return this.value.properties["Menu Path"].value.length < this.level;
    }

    this.NeedModify = () => {
        if (!this.EmptyChild())
            return false;

        var parent = this.parent;
        while (!(parent instanceof MenuItemTree)) {
            if (parent.value != this.value.properties["Menu Path"].value[this.level - 1])
                return true;
            parent = parent.parent;
        }

        // if (this.value != this.value.properties["Item Name"].value)
        //     return true;
        return false;
    }

    this.NeedMerge = () => {
        if (this.EmptyChild())
            return false;

        for (var child1 of this.children) {
            for (var child2 of this.children) {
                if (child1 != child2 && child1.value == child2.value)
                    return [child1, child2];
            }
        }

        return false;
    }

    this.Grow = () => {
        if (this.NeedGrow()) {
            // Grow
            let child = new MenuItemNode(this.value, this.level + 1, this);
            var path = this.value.properties["Menu Path"].value[this.level];

            this.value = path || null;
            this.AddChild(child);
        }

        if (!this.EmptyChild()) {
            // Grow each child
            this.children.forEach((child) => {
                child.Grow();
            })
        }
    }

    this.Reduce = () => {
        while (this.NeedReduce()) {
            // Reduce
            this.level--;
            this.parent.RemoveChild(this);
            if (this.parent.EmptyChild()) {
                this.parent = this.parent.parent;
                this.parent.children = [];
                this.parent.AddChild(this);
            } else {
                this.parent = this.parent.parent;
                this.parent.AddChild(this);
            }
        }

        if (!this.EmptyChild()) {
            // Reduce each child
            this.children.forEach((child) => {
                child.Reduce();
            })
        }
    }

    this.Modify = () => {
        if (this.NeedModify()) {
            // Modify
            var parent = this.parent;
            var level = this.level;

            while (level > 1) {
                var value = this.value.properties["Menu Path"].value[level - 1];
                if (parent.value != value)
                    parent.value = value;

                parent = parent.parent;
                level--;
            }

            if (parent.value != this.value.properties["Menu Path"].value[level - 1]) {
                parent.parent.AddChild(new MenuItemNode(this.value, 0, parent.parent));
                this.Remove();
                parent.parent.Update();
            }
        }

        if (!this.EmptyChild()) {
            // Modify each child
            for (var child of this.children) {
                child.Modify();
            }
        }
    }

    this.Merge = () => {
        var toMerge = this.NeedMerge()
        if (toMerge) {
            // Merge
            var child1 = toMerge[0], child2 = toMerge[1];
            child1.AddChildren(child2.children);
            this.RemoveChild(child2);
        }

        if (!this.EmptyChild()) {
            // Merge each child
            for (var child of this.children) {
                child.Merge();
            }
        }
    }

    this.Find = (item) => {
        if (this.value == item) {
            return this;
        }

        if (!this.EmptyChild()) {
            for (var child of this.children) {
                var node = child.Find(item);
                if (node) return node;
            }
        }
    }

    this.GeneratePathTable = () => {
        if (!(this.value instanceof MenuBarItem)) {
            console.error("Cannot generate path table from a non-MenuBarItem node!");
            return;
        }

        var pathTable = [];
        var parent = this.parent;

        while (!(parent instanceof MenuItemTree)) {
            var paths = [];

            parent.children.forEach((child) => {
                let path = child.value instanceof MenuBarItem ? child.value.properties["Item Name"].value : child.value;
                paths.push(path);
            })
            pathTable.unshift(paths);

            parent = parent.parent;
        }

        var path = this.value.properties["Menu Path"].value;
        var offset = 0;
        for (let i = 0; i < pathTable.length; i++) {
            for (let j = 0; j < offset; j++) {
                pathTable[i].unshift("EMPTY");
            }
            offset = pathTable[i].indexOf(path[i + 1]);
        }
        return pathTable;
    }

    this.GetItems = () => {
        if (this.value instanceof MenuBarItem) {
            return [this.value];
        }

        var items = [];
        for (var child of this.children) {
            items = items.concat(child.GetItems());
        }

        return items;
    }

    this.Print = () => {
        console.log(this.value)

        if (!this.EmptyChild()) {
            this.children.forEach((child) => {
                child.Print();
            })
        }
    }
}

MenuItemNode.parseFromObj = (obj, parent) => {
    var value;
    if (obj.value instanceof Object) {
        value = MenuBarItem.parseFromObj(obj.value);
    } else {
        value = obj.value;
    }

    var self = new MenuItemNode(value, obj.level, parent);

    var children = [];
    var childrenObj = obj.children;

    childrenObj.forEach(function (obj) {
        children.push(MenuItemNode.parseFromObj(obj, self));
    })

    self.children = children;

    return self;
}

var MenuItemTree = function (children) {
    this.children = children || [];

    this.AddChild = (child) => {
        this.children.push(child);
    }

    this.RemoveChild = (child) => {
        let i = this.children.indexOf(child)
        if (i != -1) {
            this.children.splice(i, 1);
        }
    }

    this.GetRoots = () => {
        var roots = [];
        for (var child of this.children) {
            let name = child.value instanceof MenuBarItem ? child.value.properties["Item Name"].value : child.value;
            roots.push(name);
        }

        return roots;
    }

    this.GetItems = () => {
        var items = [];
        for (var child of this.children) {
            items = items.concat(child.GetItems());
        }

        return items;
    }

    this.Update = () => {
        this.children.forEach((child) => {
            child.Grow();
            child.Reduce();
            child.Modify();
            child.Merge();
        })
        while (this.Merge());
        this.children.forEach((child) => {
            child.Grow();
            child.Reduce();
            child.Modify();
            child.Merge();
        })
    }

    this.Merge = () => {
        for (var child1 of this.children) {
            for (var child2 of this.children) {
                if (child1 != child2 && child1.value == child2.value) {
                    child1.AddChildren(child2.children);
                    this.RemoveChild(child2);
                    return true;
                }
            }
        }
        return false;
    }

    this.Print = () => {
        this.children.forEach((child) => {
            child.Print();
        })
    }

    this.Find = (item) => {
        for (var child of this.children) {
            var node = child.Find(item);
            if (node) return node;
        }

        return null;
    }

    this.Delete = (node) => {
        for (var child of this.children) {
            if (node == child) {
                this.RemoveChild(child);
                return true;
            }
        }

        return false;
    }

    this.SetChildElement = (i, element) => {
        var child = this.children[i];
        if (child.EmptyChild()) {
            child.value.el = element;
        }
    }
}

MenuItemTree.parseFromObj = (obj) => {
    var self = new MenuItemTree();
    var children = [];
    var childrenObj = obj.children;

    childrenObj.forEach(function (obj) {
        children.push(MenuItemNode.parseFromObj(obj, self));
    })

    self.children = children;
    return self;
}