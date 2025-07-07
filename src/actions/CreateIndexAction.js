/**
 * Index作成アクション
 */
define(function (require, exports, module) {
  "use strict";

  var BaseAction = require("src/actions/BaseAction");
  var CONSTANTS = require("src/constants");
  //var FileService = require("src/services/FileService");
  var IndexFileService = require("src/services/IndexFileService");
  var ProjectManager = brackets.getModule("project/ProjectManager");
  var Dialogs = brackets.getModule("widgets/Dialogs");
  var DefaultDialogs = brackets.getModule("widgets/DefaultDialogs");

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
    console.log("DocMaker: Creating index...");

    var projectRoot = ProjectManager.getProjectRoot();
    if (!projectRoot) {
      Dialogs.showModalDialog(
        DefaultDialogs.DIALOG_ID_ERROR,
        "エラー",
        "プロジェクトが開かれていません。プロジェクトを開いてから実行してください。"
      );
      return;
    }

    // 確認ダイアログを表示
    var message =
      "defaultフォルダ内のファイルをプロジェクトルートにコピーします。" +
      "既存のファイルは上書きされます。続行しますか？";

    Dialogs.showModalDialog(
      DefaultDialogs.DIALOG_ID_INFO,
      "Index作成の確認",
      message,
      [
        {
          className: Dialogs.DIALOG_BTN_CLASS_PRIMARY,
          id: Dialogs.DIALOG_BTN_OK,
          text: "続行",
        },
        {
          className: Dialogs.DIALOG_BTN_CLASS_NORMAL,
          id: Dialogs.DIALOG_BTN_CANCEL,
          text: "キャンセル",
        },
      ]
    ).done(
      function (buttonId) {
        if (buttonId === Dialogs.DIALOG_BTN_OK) {
          this._copyDefaultFiles();
        }
      }.bind(this)
    );
  };

  /**
   * defaultフォルダからファイルをコピー
   * @private
   */
  CreateIndexAction.prototype._copyDefaultFiles = function () {
    console.log("Copying files from default folder...");

    // プログレスダイアログを表示
    var progressDialog = Dialogs.showModalDialog(
      DefaultDialogs.DIALOG_ID_INFO,
      "処理中",
      "ファイルをコピーしています..."
    );

    //FileService.copyAllFromDefault()
    IndexFileService.copyAllIndexFiles()
      .done(function (results) {
        progressDialog.close();

        var message = "処理が完了しました。\n";

        if (results.success.length > 0) {
          message += "\n成功: " + results.success.length + " ファイル\n";
          message += results.success.join(", ");
        }

        if (results.failed.length > 0) {
          message += "\n\n失敗: " + results.failed.length + " ファイル\n";
          results.failed.forEach(function (failure) {
            message += failure.file + " (" + failure.error + ")\n";
          });
        }

        if (results.renamed && results.renamed.length > 0) {
          message += "\n\nリネーム: " + results.renamed.length + " ファイル\n";
          results.renamed.forEach(function (rename) {
            message += rename.from + " → " + rename.to + "\n";
          });
        }

        if (results.skipped && results.skipped.length > 0) {
          message +=
            "\n\nスキップ（バイナリファイル）: " +
            results.skipped.length +
            " ファイル\n";
          message += "※ 画像やフォントファイルは手動でコピーしてください。\n";
          message += results.skipped.join(", ");
        }

        // 結果メッセージ
        Dialogs.showModalDialog(
          results.failed.length > 0
            ? DefaultDialogs.DIALOG_ID_ERROR
            : DefaultDialogs.DIALOG_ID_INFO,
          "処理結果",
          message
        );

        // プロジェクトツリーを更新
        ProjectManager.refreshFileTree();
      })
      .fail(function (error) {
        progressDialog.close();
        console.error("Failed to copy files:", error);

        // エラーメッセージ
        Dialogs.showModalDialog(
          DefaultDialogs.DIALOG_ID_ERROR,
          "エラー",
          "ファイルのコピー中にエラーが発生しました: " + error
        );
      });
  };

  module.exports = CreateIndexAction;
});
