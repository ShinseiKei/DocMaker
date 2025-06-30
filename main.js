define(function (require, exports, module) {
  "use strict";

  // モジュールの読み込み
  var CommandManager = brackets.getModule("command/CommandManager");
  var Menus = brackets.getModule("command/Menus");
  var EditorManager = brackets.getModule("editor/EditorManager");
  var PanelManager = brackets.getModule("view/PanelManager");
  var ExtensionUtils = brackets.getModule("utils/ExtensionUtils");

  var panel;
  var isPanelVisible = false;

  // action
  var actions = {
    action1: function () {
      console.log("DocMaker Index作成");
    },
    action2: function () {
      console.log("DocMaker Page作成");
    },
  };

  function handleTogglePanel() {
    if (isPanelVisible) {
      // パネルを非表示にする
      panel.hide();
    } else {
      if (!panel) {
        // 初回のみHTMLパネルを読み込んで生成
        createAndShowPanel();
      } else {
        // パネルを表示にする
        panel.show();
      }
    } // end if

    // パネルの表示状態をトグル
    isPanelVisible = !isPanelVisible;
  } // end handleTogglePanel

  function createAndShowPanel() {
    ExtensionUtils.loadFile(module, "panel.html")
      .done(function (panelHTML) {
        panel = PanelManager.createBottomPanel(
          "DocMaker.panel",
          $(panelHTML),
          100
        );

        // パネル内のボタンにクリックイベントを設定
        $("#DocMaker-panel").on("click", ".custom-button", function () {
          var type = $(this).data("type");

          if (type === "template") {
            // テンプレート挿入処理
            var filePath = $(this).data("file");
            ExtensionUtils.loadFile(module, filePath)
              .done(function (content) {
                var editor = EditorManager.getActiveEditor();
                if (editor) {
                  var codeMirror = editor._codeMirror;
                  var doc = codeMirror.getDoc();
                  var cursor = doc.getCursor();
                  doc.replaceRange(content, cursor);
                }
              })
              .fail(function () {
                console.error("file import error：" + filePath);
              });
          } else if (type === "action") {
            // アクション実行処理
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
      })
      .fail(function () {
        console.error("can't import panel file");
      });
  }

  var DOCMAKER_COMMAND_ID = "DocMaker.togglePanel";
  CommandManager.register("DocMaker", DOCMAKER_COMMAND_ID, handleTogglePanel);

  // メニュー（表示メニュー）にコマンドを追加
  var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
  menu.addMenuItem(DOCMAKER_COMMAND_ID);
});
