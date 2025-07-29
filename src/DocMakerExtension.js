/**
 * DocMaker拡張機能のメインクラス
 */
define(function (require, exports, module) {
  "use strict";

  var CommandManager = brackets.getModule("command/CommandManager");
  var Menus = brackets.getModule("command/Menus");

  var CONSTANTS = require("src/constants");
  var DocMakerPanel = require("src/panel/PanelManager");

  /**
   * DocMakerExtension クラス
   * @constructor
   */
  function DocMakerExtension() {
    this.panel = DocMakerPanel;
    this.initialized = false;
  }

  /**
   * 拡張機能を初期化
   */
  DocMakerExtension.prototype.initialize = function () {
    if (this.initialized) {
      console.warn("DocMaker: Already initialized");
      return;
    }

    try {
      // コマンドの登録
      CommandManager.register(
        CONSTANTS.EXTENSION_NAME,
        CONSTANTS.COMMAND_ID,
        this._handleCommand.bind(this)
      );
      console.log("DocMaker: Command registered");

      // メニューに追加
      var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
      menu.addMenuItem(CONSTANTS.COMMAND_ID);
      console.log("DocMaker: Menu item added");

      this.initialized = true;
      console.log("DocMaker: Extension initialized successfully");
    } catch (error) {
      console.error("DocMaker: Failed to initialize", error);
    }
  };

  /**
   * コマンドハンドラー
   * @private
   */
  DocMakerExtension.prototype._handleCommand = function () {
    this.panel.toggle();
  };

  /**
   * 拡張機能を無効化
   */
  DocMakerExtension.prototype.disable = function () {
    try {
      // コマンドを無効化
      var command = CommandManager.get(CONSTANTS.COMMAND_ID);
      if (command) {
        command.setEnabled(false);
      }

      // パネルを破棄
      this.panel.destroy();

      this.initialized = false;
      console.log("DocMaker: Extension disabled");
    } catch (error) {
      console.error("DocMaker: Error during disable", error);
    }
  };

  module.exports = DocMakerExtension;
});
