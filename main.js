/**
 * DocMaker拡張機能 - エントリーポイント
 */
define(function (require, exports, module) {
  "use strict";

  console.log("DocMaker: Loading extension...");

  var DocMakerExtension = require("src/DocMakerExtension");

  // 拡張機能のインスタンスを作成
  var docMaker = new DocMakerExtension();

  // 拡張機能を初期化
  docMaker.initialize();

  // エクスポート（デバッグやテスト用）
  exports.docMaker = docMaker;
});
