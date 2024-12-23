define(function (require, exports, module) {
    "use strict";

    var CommandManager = brackets.getModule("command/CommandManager");
    var Menus = brackets.getModule("command/Menus");
    var EditorManager = brackets.getModule("editor/EditorManager");
    var PanelManager = brackets.getModule("view/PanelManager");
    var ExtensionUtils = brackets.getModule("utils/ExtensionUtils");

    var panel;
    var isPanelVisible = false;

    // action
    var actions = {
        action1: function () { console.log("DocMaker Index作成"); },
        action2: function () { console.log("DocMaker Page作成"); }
    };

    function handleTogglePanel() {
        if (isPanelVisible) {
            panel.hide();
        } else {
            if (!panel) {
                // import html panel
                ExtensionUtils.loadFile(module, "panel.html").done(function(panelHTML) {
                    panel = PanelManager.createBottomPanel("DocMaker.panel", $(panelHTML), 100);

                    // click 
                    $("#DocMaker-panel").on("click", ".custom-button", function () {
                        var type = $(this).data("type");
                        if (type === "template") {
                            // insert template
                            var filePath = $(this).data("file");
                            ExtensionUtils.loadFile(module, filePath).done(function(content) {
                                var editor = EditorManager.getActiveEditor();
                                if (editor) {
                                    var codeMirror = editor._codeMirror;
                                    var doc = codeMirror.getDoc();
                                    var cursor = doc.getCursor();
                                    doc.replaceRange(content, cursor);
                                }
                            }).fail(function() {
                                console.error("file import error：" + filePath);
                            });
                        } else if (type === "action") {
                            // action process
                            var actionName = $(this).data("action");
                            var action = actions[actionName];
                            if (action) {
                                action();
                            } else {
                                console.error("undefine action：" + actionName);
                            }
                        }
                    });

                    panel.show();
                }).fail(function() {
                    console.error("can't import panel file");
                });
            } else {
                panel.show();
            }
        }
        isPanelVisible = !isPanelVisible;
    }

    var DOCMAKER_COMMAND_ID = "DocMaker.togglePanel";
    CommandManager.register("DocMaker", DOCMAKER_COMMAND_ID, handleTogglePanel);

    var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
    menu.addMenuItem(DOCMAKER_COMMAND_ID);
});