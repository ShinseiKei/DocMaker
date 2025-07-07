/**
 * DocMaker拡張機能の定数定義
 */
define(function (require, exports, module) {
  "use strict";

  module.exports = {
    COMMAND_ID: "DocMaker.togglePanel",
    PANEL_ID: "DocMaker.panel",
    EXTENSION_NAME: "DocMaker",

    TABLE_LIMITS: {
      MIN_ROWS: 1,
      MAX_ROWS: 20,
      MIN_COLS: 1,
      MAX_COLS: 10,
      DEFAULT_ROWS: 3,
      DEFAULT_COLS: 3,
    },

    MESSAGES: {
      NO_ACTIVE_EDITOR: "アクティブなエディターが見つかりません",
      TEMPLATE_LOAD_ERROR: "テンプレートファイルの読み込みに失敗しました",
      PANEL_LOAD_ERROR: "panel.htmlの読み込みに失敗しました",
      INDEX_CREATING: "Indexファイルを作成しています",
      PAGE_CREATING: "Pageファイルを作成しています",
      NO_PROJECT_OPEN: "プロジェクトが開かれていません",
      CONFIRM_INDEX_CREATION:
        "defaultフォルダ内のファイルをプロジェクトルートにコピーします。既存のファイルは上書きされます。続行しますか？",
    },
  };
});
