/**
 * テンプレート管理サービス
 */
define(function (require, exports, module) {
  "use strict";

  var ExtensionUtils = brackets.getModule("utils/ExtensionUtils");
  var CONSTANTS = require("../constants");
  var EditorService = require("./EditorService");

  var TemplateManager = {
    /**
     * テンプレートを読み込んで挿入
     * @param {string} filePath - テンプレートファイルのパス
     * @returns {Promise} 処理の結果
     */
    loadAndInsert: function (filePath) {
      console.log("Loading template:", filePath);

      return ExtensionUtils.loadFile(module, "../../" + filePath)
        .done(function (content) {
          if (EditorService.insertAtCursor(content)) {
            console.log("Template inserted:", filePath);
          }
        })
        .fail(function (error) {
          console.error("Failed to load template:", filePath, error);
          alert(CONSTANTS.MESSAGES.TEMPLATE_LOAD_ERROR + ": " + filePath);
        });
    },

    /**
     * 複数のテンプレートを連続で適用
     * @param {string[]} filePaths - テンプレートファイルのパス配列
     * @returns {Promise} 処理の結果
     */
    loadMultiple: function (filePaths) {
      var promises = filePaths.map(function (path) {
        return this.loadAndInsert(path);
      }, this);

      return $.when.apply($, promises);
    },
  };

  module.exports = TemplateManager;
});
