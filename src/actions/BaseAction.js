/**
 * アクションの基底クラス
 */
define(function (require, exports, module) {
  "use strict";

  /**
   * BaseAction クラス
   * @constructor
   * @param {string} name - アクション名
   */
  function BaseAction(name) {
    this.name = name;
  }

  /**
   * アクションを実行
   */
  BaseAction.prototype.execute = function () {
    console.log("Executing action:", this.name);
    this._performAction();
  };

  /**
   * アクションの実際の処理（サブクラスでオーバーライド）
   * @protected
   */
  BaseAction.prototype._performAction = function () {
    throw new Error("サブクラスでオーバーライドしてください");
  };

  /**
   * アクション名を取得
   * @returns {string} アクション名
   */
  BaseAction.prototype.getName = function () {
    return this.name;
  };

  module.exports = BaseAction;
});
