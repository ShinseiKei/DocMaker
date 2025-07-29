/**
 * パネル管理
 */
define(function (require, exports, module) {
  "use strict";

  var PanelManager = brackets.getModule("view/PanelManager");
  var ExtensionUtils = brackets.getModule("utils/ExtensionUtils");
  var CONSTANTS = require("../constants");
  var TemplateManager = require("../services/TemplateManager");
  var ActionManager = require("../features/ActionManager");

  var DocMakerPanel = {
    panel: null,
    isVisible: false,

    /**
     * パネルの表示/非表示を切り替え
     */
    toggle: function () {
      console.log("DocMaker: Toggle panel called");

      if (this.isVisible) {
        this.hide();
      } else {
        if (!this.panel) {
          this.create();
        } else {
          this.show();
        }
      }

      this.isVisible = !this.isVisible;
    },

    /**
     * パネルを表示
     */
    show: function () {
      if (this.panel) {
        this.panel.show();
        console.log("DocMaker: Panel shown");
      }
    },

    /**
     * パネルを非表示
     */
    hide: function () {
      if (this.panel) {
        this.panel.hide();
        console.log("DocMaker: Panel hidden");
      }
    },

    /**
     * パネルを作成
     */
    create: function () {
      var self = this;
      console.log("DocMaker: Loading panel.html...");

      ExtensionUtils.loadFile(module, "../../panel.html")
        .done(function (panelHTML) {
          console.log("DocMaker: panel.html loaded successfully");

          self.panel = PanelManager.createBottomPanel(
            CONSTANTS.PANEL_ID,
            $(panelHTML),
            100
          );

          self.attachEventHandlers();
          self.show();
          console.log("DocMaker: Panel created and shown");
        })
        .fail(function (error) {
          console.error("DocMaker: Failed to load panel.html", error);
          alert(CONSTANTS.MESSAGES.PANEL_LOAD_ERROR);
        });
    },

    /**
     * イベントハンドラーを設定
     */
    attachEventHandlers: function () {
      var $panel = $("#DocMaker-panel");

      // 既存のハンドラーを削除（重複防止）
      $panel.off("click", ".custom-button");

      // 新しいハンドラーを設定
      $panel.on("click", ".custom-button", function () {
        var $button = $(this);
        var type = $button.data("type");

        console.log("Button clicked - Type:", type);

        if (type === "template") {
          var filePath = $button.data("file");
          if (filePath) {
            TemplateManager.loadAndInsert(filePath);
          }
        } else if (type === "action") {
          var actionName = $button.data("action");
          if (actionName) {
            ActionManager.execute(actionName);
          }
        }
      });
    },

    /**
     * パネルを破棄
     */
    destroy: function () {
      if (this.panel) {
        $("#DocMaker-panel").off("click", ".custom-button");
        this.panel.hide();
        this.panel.$panel.remove();
        this.panel = null;
        this.isVisible = false;
        console.log("DocMaker: Panel destroyed");
      }
    },
  };

  module.exports = DocMakerPanel;
});
