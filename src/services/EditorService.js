/**
 * エディター操作サービス
 */
define(function (require, exports, module) {
  "use strict";

  var EditorManager = brackets.getModule("editor/EditorManager");
  var CONSTANTS = require("../constants");

  var EditorService = {
    /**
     * カーソル位置にテキストを挿入
     * @param {string} content - 挿入するコンテンツ
     * @returns {boolean} 挿入成功の可否
     */
    insertAtCursor: function (content) {
      var editor = EditorManager.getActiveEditor();
      if (!editor) {
        console.warn(CONSTANTS.MESSAGES.NO_ACTIVE_EDITOR);
        return false;
      }

      var codeMirror = editor._codeMirror;
      var doc = codeMirror.getDoc();
      var cursor = doc.getCursor();
      doc.replaceRange(content, cursor);
      return true;
    },

    /**
     * 現在の選択範囲を取得
     * @returns {string} 選択されているテキスト
     */
    getSelection: function () {
      var editor = EditorManager.getActiveEditor();
      if (!editor) {
        return "";
      }

      var codeMirror = editor._codeMirror;
      return codeMirror.getSelection();
    },

    /**
     * カーソル位置を取得
     * @returns {{line: number, ch: number}|null} カーソル位置
     */
    getCursorPosition: function () {
      var editor = EditorManager.getActiveEditor();
      if (!editor) {
        return null;
      }

      var codeMirror = editor._codeMirror;
      return codeMirror.getCursor();
    },
  };

  module.exports = EditorService;
});
