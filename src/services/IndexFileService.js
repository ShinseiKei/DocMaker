/**
 * Index機能専用ファイル操作サービス
 * テンプレートのコピーとリネーム機能を提供
 */
define(function (require, exports, module) {
  "use strict";

  var CoreFileService = require("src/services/CoreFileService");
  var CONSTANTS = require("src/constants");

  var IndexFileService = {
    /**
     * ファイルが.js.tempかどうかをチェック
     * @param {string} path - ファイルパス
     * @returns {boolean} .js.tempファイルかどうか
     */
    isJsTempFile: function (path) {
      return path.endsWith(".js.temp");
    },

    /**
     * .js.tempファイルのパスを.jsに変換
     * @param {string} path - ファイルパス
     * @returns {string} 変換後のパス
     */
    convertTempPath: function (path) {
      if (this.isJsTempFile(path)) {
        return path.replace(/\.js\.temp$/, ".js");
      }
      return path;
    },

    /**
     * テンプレートファイルからプロジェクトにコピー
     * @param {string} templatePath - テンプレートフォルダ内の相対パス
     * @param {string} destPath - プロジェクト内の相対パス
     * @returns {Promise} コピー結果
     */
    copyTemplateFile: function (templatePath, destPath) {
      var self = this;

      if (!CoreFileService.isProjectOpen()) {
        return $.Deferred().reject("No project is open").promise();
      }

      // .js.tempファイルの場合、コピー先のパスを.jsに変換
      var actualDestPath = this.convertTempPath(destPath);
      var projectRoot = CoreFileService.getProjectRoot();
      var fullDestPath = projectRoot.fullPath + actualDestPath;
      var destDir = CoreFileService.getDirectoryPath(fullDestPath);

      console.log("Copying template file:");
      console.log("  From:", templatePath);
      console.log("  To:", actualDestPath);

      if (this.isJsTempFile(templatePath)) {
        console.log("  Note: .js.temp file will be saved as .js");
      }

      // テンプレートファイルを読み込む
      return CoreFileService.loadExtensionFile(
        "../../templates/" + templatePath
      )
        .then(function (content) {
          console.log("Template loaded successfully. Size:", content.length);

          // 必要に応じてディレクトリを作成
          if (destDir !== projectRoot.fullPath.slice(0, -1)) {
            return CoreFileService.createDirectory(destDir).then(function () {
              return content;
            });
          }
          return content;
        })
        .then(function (content) {
          // ファイルを作成
          return CoreFileService.createFile(fullDestPath, content);
        })
        .then(function (file) {
          // 成功時の結果を返す
          return {
            success: true,
            originalPath: destPath,
            actualPath: actualDestPath,
            renamed: self.isJsTempFile(templatePath),
          };
        })
        .fail(function (error) {
          console.error("Failed to copy template file:", templatePath, error);
          throw error;
        });
    },

    /**
     * Index用のファイルリストを取得
     * @returns {Array} コピーするファイルのリスト
     */
    getIndexFileList: function () {
      return [
        // HTMLファイル
        { source: "index/front-page.html", dest: "front-page.html" },
        { source: "index/index.html", dest: "index.html" },

        // CSSファイル
        {
          source: "index/css/bootstrap-icons.css",
          dest: "css/bootstrap-icons.css",
        },
        { source: "index/css/bootstrap.css", dest: "css/bootstrap.css" },
        {
          source: "index/css/bootstrap.min.css",
          dest: "css/bootstrap.min.css",
        },
        { source: "index/css/doc.css", dest: "css/doc.css" },

        // フォントファイル
        {
          source: "index/css/fonts/bootstrap-icons.woff",
          dest: "css/fonts/bootstrap-icons.woff",
        },
        {
          source: "index/css/fonts/bootstrap-icons.woff2",
          dest: "css/fonts/bootstrap-icons.woff2",
        },

        // 画像ファイル
        {
          source: "index/images/front-page.webp",
          dest: "images/front-page.webp",
        },
        {
          source: "index/images/Common/DownKey.webp",
          dest: "images/Common/DownKey.webp",
        },
        {
          source: "index/images/Common/hint.webp",
          dest: "images/Common/hint.webp",
        },
        {
          source: "index/images/Common/HomeScreenLeftArrow.webp",
          dest: "images/Common/HomeScreenLeftArrow.webp",
        },
        {
          source: "index/images/Common/HomeScreenRightArrow.webp",
          dest: "images/Common/HomeScreenRightArrow.webp",
        },
        {
          source: "index/images/Common/PrintButton.webp",
          dest: "images/Common/PrintButton.webp",
        },
        {
          source: "index/images/Common/RecyclablePlastic.webp",
          dest: "images/Common/RecyclablePlastic.webp",
        },
        {
          source: "index/images/Common/selectButton.webp",
          dest: "images/Common/selectButton.webp",
        },
        {
          source: "index/images/Common/UpDownKey.webp",
          dest: "images/Common/UpDownKey.webp",
        },
        {
          source: "index/images/Common/warning.webp",
          dest: "images/Common/warning.webp",
        },

        // JavaScriptファイル（.js.tempとして保存）
        {
          source: "index/js/bootstrap.bundle.min.js.temp",
          dest: "js/bootstrap.bundle.min.js.temp",
        },
        {
          source: "index/js/doc_script.js.temp",
          dest: "js/doc_script.js.temp",
        },
      ];
    },

    /**
     * 全てのIndexファイルをコピー
     * @returns {Promise} コピー結果
     */
    copyAllIndexFiles: function () {
      var self = this;
      var filesToCopy = this.getIndexFileList();

      // 結果を格納するオブジェクト
      var results = {
        success: [],
        failed: [],
        renamed: [],
      };

      // 順次処理を行う
      var deferred = $.Deferred();
      var index = 0;

      function copyNext() {
        if (index >= filesToCopy.length) {
          // 全てのファイル処理が完了
          deferred.resolve(results);
          return;
        }

        var fileInfo = filesToCopy[index];
        index++;

        self
          .copyTemplateFile(fileInfo.source, fileInfo.dest)
          .done(function (result) {
            results.success.push(result.actualPath);

            if (result.renamed) {
              results.renamed.push({
                from: result.originalPath,
                to: result.actualPath,
              });
            }

            copyNext();
          })
          .fail(function (error) {
            results.failed.push({
              file: fileInfo.dest,
              error: error,
            });
            copyNext();
          });
      }

      copyNext();
      return deferred.promise();
    },

    /**
     * 特定のテンプレートセットをコピー
     * @param {string} templateSetName - テンプレートセット名
     * @returns {Promise} コピー結果
     */
    copyTemplateSet: function (templateSetName) {
      // 将来的に他のテンプレートセットに対応
      if (templateSetName === "index") {
        return this.copyAllIndexFiles();
      } else {
        return $.Deferred()
          .reject("Unknown template set: " + templateSetName)
          .promise();
      }
    },
  };

  module.exports = IndexFileService;
});
