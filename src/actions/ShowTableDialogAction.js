/**
 * テーブルダイアログ表示アクション
 */
define(function (require, exports, module) {
  "use strict";

  var BaseAction = require("src/actions/BaseAction");
  var TableFeature = require("src/features/TableFeature");

  /**
   * ShowTableDialogAction クラス
   * @constructor
   * @extends {BaseAction}
   */
  function ShowTableDialogAction() {
    BaseAction.call(this, "Show Table Dialog");
  }

  // BaseActionを継承
  ShowTableDialogAction.prototype = Object.create(BaseAction.prototype);
  ShowTableDialogAction.prototype.constructor = ShowTableDialogAction;

  /**
   * アクションの実行
   * @protected
   */
  ShowTableDialogAction.prototype._performAction = function () {
    TableFeature.showDialog();
  };

  module.exports = ShowTableDialogAction;
});
