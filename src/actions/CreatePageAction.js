/**
 * ファイル操作
 * Page作成
 * ボタン押下アクション
 */
define(function (require, exports, module) {
  "use strict";

  var BaseAction = require("src/actions/BaseAction");
  var CONSTANTS = require("src/constants");
  var EditorService = require("src/services/EditorService");

  /**
   * CreatePageAction クラス
   * @constructor
   * @extends {BaseAction}
   */
  function CreatePageAction() {
    BaseAction.call(this, "Create Page");
  }

  // BaseActionを継承
  CreatePageAction.prototype = Object.create(BaseAction.prototype);
  CreatePageAction.prototype.constructor = CreatePageAction;

  /**
   * アクションの実行
   * @protected
   */
  CreatePageAction.prototype._performAction = function () {
    console.log("DocMaker: Creating page...");

    alert("Page作成！");
  };

  module.exports = CreatePageAction;
});
