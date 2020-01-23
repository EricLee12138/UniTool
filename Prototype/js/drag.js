// Drag events for inspector

var onDragOver = function(event) {
    if (!controlSelection.selection && !componentContainer.selection) return;
    event.preventDefault();

    if (controlSelection.selection) {
        if (event.target.classList.contains("component-container") || 
        event.target.classList.contains("droppable")) {
            event.target.classList.add("drag-over");
        } else if (event.target.classList.contains("component-control") ||
        event.target.classList.contains("included-control") ||
        event.target.classList.contains("component-title")) {
            event.target.parentElement.classList.add("drag-over");
            event.stopPropagation();
        } else {
            event.target.parentElement.parentElement.classList.add("drag-over");
            event.stopPropagation();
        }
    }
}

var onDragOverStop = function() {
    event.stopPropagation();
}

var onDragLeave = function(event) {
    if (!controlSelection.selection && !componentContainer.selection) return;
    event.preventDefault();

    if (controlSelection.selection) {
        if (event.target.classList.contains("component-container") || 
        event.target.classList.contains("droppable")) {
            event.target.classList.remove("drag-over");
        } else if (event.target.classList.contains("component-control") ||
        event.target.classList.contains("included-control") ||
        event.target.classList.contains("component-title")) {
            event.target.parentElement.classList.remove("drag-over");
            event.stopPropagation();
        } else {
            event.target.parentElement.parentElement.classList.remove("drag-over");
            event.stopPropagation();
        }
    }
}

var onDrop = function(event) {
    if (!controlSelection.selection && !componentContainer.selection) return;
    event.preventDefault();

    if (controlSelection.selection) {
        if (event.target.classList.contains("component-container") || 
        event.target.classList.contains("droppable")) {
            event.target.classList.remove("drag-over");
        } else if (event.target.classList.contains("component-control") ||
        event.target.classList.contains("included-control") ||
        event.target.classList.contains("component-title")) {
            event.target.parentElement.classList.remove("drag-over");
            event.stopPropagation();
        } else {
            event.target.parentElement.parentElement.classList.remove("drag-over");
            event.stopPropagation();
        }
    }
}

// Drag events for included control

var onControlDragOver = function(event) {
    event.preventDefault();

    if (event.target.classList.contains("droppable")) {
        event.target.classList.add("drag-over");
    } else if (event.target.classList.contains("included-control")) {
        event.target.parentElement.classList.add("drag-over");
        event.stopPropagation();
    } else {
        event.target.parentElement.parentElement.classList.add("drag-over");
        event.stopPropagation();
    }
}

var onControlDragLeave = function(event) {
    event.preventDefault();

    if (event.target.classList.contains("droppable")) {
        event.target.classList.remove("drag-over");
    } else if (event.target.classList.contains("included-control")) {
        event.target.parentElement.classList.remove("drag-over");
        event.stopPropagation();
    } else {
        event.target.parentElement.parentElement.classList.remove("drag-over");
        event.stopPropagation();
    }
}

var onControlDrop = function(event) {
    event.preventDefault();

    if (event.target.classList.contains("droppable")) {
        event.target.classList.remove("drag-over");
    } else if (event.target.classList.contains("included-control")) {
        event.target.parentElement.classList.remove("drag-over");
        event.stopPropagation();
    } else {
        event.target.parentElement.parentElement.classList.remove("drag-over");
        event.stopPropagation();
    }
}

// Drag events for editor window

var onWindowDragOver = function(event) {
    event.preventDefault();

    if (event.target.classList.contains("editor-window-content") ||
    event.target.classList.contains("editor-window-title")) {
        event.target.classList.add("drag-over");
    } else if (event.target.classList.contains("editor-window-control")) {
        event.target.parentElement.classList.add("drag-over");
    } else {
        event.target.parentElement.parentElement.classList.add("drag-over");
    }
}

var onWindowDragLeave = function(event) {
    event.preventDefault();

    if (event.target.classList.contains("editor-window-content") ||
    event.target.classList.contains("editor-window-title")) {
        event.target.classList.remove("drag-over");
    } else if (event.target.classList.contains("editor-window-control")) {
        event.target.parentElement.classList.remove("drag-over");
        event.stopPropagation();
    } else {
        event.target.parentElement.parentElement.classList.remove("drag-over");
        event.stopPropagation();
    }
}

var onWindowDrop = function(event) {
    event.preventDefault();

    if (event.target.classList.contains("editor-window-content") ||
    event.target.classList.contains("editor-window-title")) {
        event.target.classList.remove("drag-over");
    } else if (event.target.classList.contains("editor-window-control")) {
        event.target.parentElement.classList.remove("drag-over");
        event.stopPropagation();
    } else {
        event.target.parentElement.parentElement.classList.remove("drag-over");
        event.stopPropagation();
    }
}