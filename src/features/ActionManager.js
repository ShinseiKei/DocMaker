/**
 * アクション管理
 */
define(function (require, exports, module) {
  "use strict";

  var CreateIndexAction = require("src/actions/CreateIndexAction");
  var CreatePageAction = require("src/actions/CreatePageAction");
  var ShowTableDialogAction = require("src/actions/ShowTableDialogAction");

  /**
   * ActionManager クラス
   * @constructor
   */
  function ActionManager() {
    this.actions = {};
    this._initializeActions();
  }

  /**
   * アクションを初期化
   * @private
   */
  ActionManager.prototype._initializeActions = function () {
    // アクションのインスタンスを作成して登録
    this.register("action1", new CreateIndexAction());
    this.register("action2", new CreatePageAction());
    this.register("action_table", new ShowTableDialogAction());
  };

  /**
   * アクションを登録
   * @param {string} key - アクションのキー
   * @param {BaseAction} action - アクションインスタンス
   */
  ActionManager.prototype.register = function (key, action) {
    if (action && typeof action.execute === "function") {
      this.actions[key] = action;
      console.log("Action registered:", key);
    } else {
      console.error("Invalid action for key:", key);
    }
  };

  /**
   * アクションを実行
   * @param {string} key - アクションのキー
   * @returns {boolean} 実行成功の可否
   */
  ActionManager.prototype.execute = function (key) {
    var action = this.actions[key];
    if (action) {
      console.log("Executing action:", key);
      action.execute();
      return true;
    } else {
      console.error("Unknown action:", key);
      return false;
    }
  };

  /**
   * 登録されているアクション名の一覧を取得
   * @returns {string[]} アクション名の配列
   */
  ActionManager.prototype.getActionNames = function () {
    return Object.keys(this.actions);
  };

  // シングルトンインスタンスを作成してエクスポート
  module.exports = new ActionManager();
});
