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
      var html = "<table>\n";

      // ヘッダー行
      if (includeHeader) {
        html += "<thead>\n";
        html += "<tr>\n";

        for (var j = 0; j < cols; j++) {
          html += "<th>ヘッダー" + (j + 1) + "</th>\n";
        }

        html += "</tr>\n</thead>\n";
      }

      // データ行
      html += "<tbody>\n";

      // ヘッダー行がある場合は、データ行数を1つ減らす
      var dataRows = includeHeader ? rows - 1 : rows;

      for (var i = 0; i < dataRows; i++) {
        html += "<tr>\n";

        for (var j = 0; j < cols; j++) {
          html += "<td>セル" + (i + 1) + "-" + (j + 1) + "</td>\n";
        }

        html += "</tr>\n";
      }

      html += "</tbody>\n</table>\n<br>\n";

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
        '      <input type="checkbox" id="table-header" checked> ヘッダー行を含む',
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
          // ダイアログのDOMコンテキスト内で要素を取得
          self.handleCreateTableWithDialog(dialog);
        }
      });
    },

    /**
     * ダイアログの要素から値を取得してテーブルを作成
     */
    handleCreateTableWithDialog: function (dialog) {
      var limits = CONSTANTS.TABLE_LIMITS;

      // ダイアログのDOM要素を取得
      var $dialog = dialog.getElement();

      // ダイアログ内の要素を取得
      var rows =
        parseInt($dialog.find("#table-rows").val()) || limits.DEFAULT_ROWS;
      var cols =
        parseInt($dialog.find("#table-cols").val()) || limits.DEFAULT_COLS;
      var includeHeader = $dialog.find("#table-header").is(":checked");

      // 入力値の検証
      rows = Math.max(limits.MIN_ROWS, Math.min(limits.MAX_ROWS, rows));
      cols = Math.max(limits.MIN_COLS, Math.min(limits.MAX_COLS, cols));

      var tableHTML = this.generateHTML(rows, cols, includeHeader);
      EditorService.insertAtCursor(tableHTML);
    },
  };

  module.exports = TableFeature;
});
