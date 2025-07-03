/**
 * テーブル作成機能
 */
define(function (require, exports, module) {
  "use strict";

  var Dialogs = brackets.getModule("widgets/Dialogs");
  var CONSTANTS = require("../constants");
  var EditorService = require("../services/EditorService");

  var TableFeature = {
    /**
     * テーブルHTMLを生成
     * @param {number} rows - 行数
     * @param {number} cols - 列数
     * @param {boolean} includeHeader - ヘッダー行を含むか
     * @returns {string} テーブルHTML
     */
    generateHTML: function (rows, cols, includeHeader) {
      var html =
        '<table border="1" style="border-collapse: collapse; width: 100%;">\n';

      for (var i = 0; i < rows; i++) {
        html += "  <tr>\n";
        for (var j = 0; j < cols; j++) {
          if (i === 0 && includeHeader) {
            html +=
              '    <th style="padding: 8px; background-color: #f0f0f0;">ヘッダー' +
              (j + 1) +
              "</th>\n";
          } else {
            html +=
              '    <td style="padding: 8px;">セル' +
              (i + 1) +
              "-" +
              (j + 1) +
              "</td>\n";
          }
        }
        html += "  </tr>\n";
      }

      html += "</table>\n";
      return html;
    },

    /**
     * テーブル作成ダイアログを表示
     */
    showDialog: function () {
      var self = this;
      var limits = CONSTANTS.TABLE_LIMITS;
      var dialogHTML = [
        '<div class="table-dialog">',
        '  <div class="form-group">',
        '    <label for="table-rows">行数:</label>',
        '    <input type="number" id="table-rows" min="' +
          limits.MIN_ROWS +
          '" max="' +
          limits.MAX_ROWS +
          '" value="' +
          limits.DEFAULT_ROWS +
          '">',
        "  </div>",
        '  <div class="form-group">',
        '    <label for="table-cols">列数:</label>',
        '    <input type="number" id="table-cols" min="' +
          limits.MIN_COLS +
          '" max="' +
          limits.MAX_COLS +
          '" value="' +
          limits.DEFAULT_COLS +
          '">',
        "  </div>",
        '  <div class="form-group">',
        "    <label>",
        '      <input type="checkbox" id="table-header"> ヘッダー行を含む',
        "    </label>",
        "  </div>",
        "</div>",
      ].join("\n");

      var dialog = Dialogs.showModalDialog(
        "table-dialog",
        "テーブル作成",
        dialogHTML,
        [
          {
            className: Dialogs.DIALOG_BTN_CLASS_PRIMARY,
            id: Dialogs.DIALOG_BTN_OK,
            text: "作成",
          },
          {
            className: Dialogs.DIALOG_BTN_CLASS_NORMAL,
            id: Dialogs.DIALOG_BTN_CANCEL,
            text: "キャンセル",
          },
        ]
      );

      dialog.done(function (buttonId) {
        if (buttonId === Dialogs.DIALOG_BTN_OK) {
          self.handleCreateTable();
        }
      });
    },

    /**
     * テーブル作成処理
     */
    handleCreateTable: function () {
      var limits = CONSTANTS.TABLE_LIMITS;
      var rows = parseInt($("#table-rows").val()) || limits.DEFAULT_ROWS;
      var cols = parseInt($("#table-cols").val()) || limits.DEFAULT_COLS;
      var includeHeader = $("#table-header").is(":checked");

      // 入力値の検証
      rows = Math.max(limits.MIN_ROWS, Math.min(limits.MAX_ROWS, rows));
      cols = Math.max(limits.MIN_COLS, Math.min(limits.MAX_COLS, cols));

      var tableHTML = this.generateHTML(rows, cols, includeHeader);
      EditorService.insertAtCursor(tableHTML);
    },

    /**
     * 数値を有効な範囲内に制限
     * @param {number} value - 入力値
     * @param {number} min - 最小値
     * @param {number} max - 最大値
     * @param {number} defaultValue - デフォルト値
     * @returns {number} 制限された値
     */
    clamp: function (value, min, max, defaultValue) {
      var num = parseInt(value) || defaultValue;
      return Math.max(min, Math.min(max, num));
    },
  };

  module.exports = TableFeature;
});
