/**
 * Index作成アクション
 */
define(function (require, exports, module) {
  "use strict";

  var BaseAction = require("src/actions/BaseAction");

  /**
   * CreateIndexAction クラス
   * @constructor
   * @extends {BaseAction}
   */
  function CreateIndexAction() {
    BaseAction.call(this, "Create Index");
  }

  // BaseActionを継承
  CreateIndexAction.prototype = Object.create(BaseAction.prototype);
  CreateIndexAction.prototype.constructor = CreateIndexAction;

  /**
   * アクションの実行
   * @protected
   */
  CreateIndexAction.prototype._performAction = function () {
    alert("Index作成！");
  };

  module.exports = CreateIndexAction;
});
