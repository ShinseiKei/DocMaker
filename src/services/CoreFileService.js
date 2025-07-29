/**
 * 汎用ファイル操作サービス
 * 他の機能でも再利用可能な基本的なファイル操作を提供
 */
define(function (require, exports, module) {
  "use strict";

  var ExtensionUtils = brackets.getModule("utils/ExtensionUtils");
  var FileSystem = brackets.getModule("filesystem/FileSystem");
  var FileUtils = brackets.getModule("file/FileUtils");
  var ProjectManager = brackets.getModule("project/ProjectManager");

  var CoreFileService = {
    /**
     * プロジェクトのルートディレクトリを取得
     * @returns {Directory} プロジェクトルートディレクトリ
     */
    getProjectRoot: function () {
      return ProjectManager.getProjectRoot();
    },

    /**
     * プロジェクトが開かれているかチェック
     * @returns {boolean} プロジェクトが開かれているか
     */
    isProjectOpen: function () {
      return this.getProjectRoot() !== null;
    },

    /**
     * 拡張機能内のファイルを読み込む
     * @param {string} relativePath - 拡張機能ルートからの相対パス
     * @returns {Promise} ファイルの内容
     */
    loadExtensionFile: function (relativePath) {
      console.log("Loading extension file:", relativePath);
      return ExtensionUtils.loadFile(module, relativePath);
    },

    /**
     * ファイルをプロジェクトに作成（汎用版）
     * @param {string} path - ファイルパス（絶対パス）
     * @param {string} content - ファイル内容
     * @param {Object} options - オプション設定
     * @returns {Promise} 作成結果
     */
    createFile: function (path, content, options) {
      var deferred = $.Deferred();
      var file = FileSystem.getFileForPath(path);

      options = options || { encoding: "utf8" };

      console.log("createFile called for:", path);
      console.log("Content type:", typeof content);
      console.log("Content length:", content ? content.length : 0);

      // 内容の検証
      if (content === null || content === undefined) {
        console.error("Content is null or undefined");
        deferred.reject("Content is null or undefined");
        return deferred.promise();
      }

      // UTF-8 BOMを削除（存在する場合）
      if (
        options.encoding === "utf8" &&
        typeof content === "string" &&
        content.charCodeAt(0) === 0xfeff
      ) {
        content = content.slice(1);
        console.log("BOM removed from content");
      }

      file.write(content, options, function (err) {
        if (err) {
          console.error("Failed to create file:", path, err);
          deferred.reject(err);
        } else {
          console.log("File created:", path);
          deferred.resolve(file);
        }
      });

      return deferred.promise();
    },

    /**
     * プロジェクト内にファイルを作成（相対パス版）
     * @param {string} relativePath - プロジェクトルートからの相対パス
     * @param {string} content - ファイル内容
     * @param {Object} options - オプション設定
     * @returns {Promise} 作成結果
     */
    createProjectFile: function (relativePath, content, options) {
      var projectRoot = this.getProjectRoot();
      if (!projectRoot) {
        return $.Deferred().reject("No project is open").promise();
      }

      var fullPath = projectRoot.fullPath + relativePath;
      return this.createFile(fullPath, content, options);
    },

    /**
     * ディレクトリを作成（汎用版）
     * @param {string} path - ディレクトリパス（絶対パス）
     * @returns {Promise} 作成結果
     */
    createDirectory: function (path) {
      var deferred = $.Deferred();
      var directory = FileSystem.getDirectoryForPath(path);

      directory.create(function (err) {
        if (err && err !== "AlreadyExists") {
          console.error("Failed to create directory:", path, err);
          deferred.reject(err);
        } else {
          console.log("Directory created or already exists:", path);
          deferred.resolve(directory);
        }
      });

      return deferred.promise();
    },

    /**
     * プロジェクト内にディレクトリを作成（相対パス版）
     * @param {string} relativePath - プロジェクトルートからの相対パス
     * @returns {Promise} 作成結果
     */
    createProjectDirectory: function (relativePath) {
      var projectRoot = this.getProjectRoot();
      if (!projectRoot) {
        return $.Deferred().reject("No project is open").promise();
      }

      var fullPath = projectRoot.fullPath + relativePath;
      return this.createDirectory(fullPath);
    },

    /**
     * ファイルを読み込む（汎用版）
     * @param {string} path - ファイルパス（絶対パス）
     * @param {Object} options - 読み込みオプション
     * @returns {Promise} ファイル内容
     */
    readFile: function (path, options) {
      var deferred = $.Deferred();
      var file = FileSystem.getFileForPath(path);

      options = options || {};

      file.read(options, function (err, content) {
        if (err) {
          console.error("Failed to read file:", path, err);
          deferred.reject(err);
        } else {
          deferred.resolve(content);
        }
      });

      return deferred.promise();
    },

    /**
     * プロジェクト内のファイルを読み込む（相対パス版）
     * @param {string} relativePath - プロジェクトルートからの相対パス
     * @param {Object} options - 読み込みオプション
     * @returns {Promise} ファイル内容
     */
    readProjectFile: function (relativePath, options) {
      var projectRoot = this.getProjectRoot();
      if (!projectRoot) {
        return $.Deferred().reject("No project is open").promise();
      }

      var fullPath = projectRoot.fullPath + relativePath;
      return this.readFile(fullPath, options);
    },

    /**
     * ディレクトリ内のファイル一覧を取得
     * @param {string} dirPath - ディレクトリパス（絶対パス）
     * @returns {Promise} ファイル一覧
     */
    getFilesInDirectory: function (dirPath) {
      var deferred = $.Deferred();
      var directory = FileSystem.getDirectoryForPath(dirPath);

      directory.getContents(function (err, entries) {
        if (err) {
          console.error("Failed to read directory:", dirPath, err);
          deferred.reject(err);
        } else {
          var files = entries.filter(function (entry) {
            return entry.isFile;
          });
          deferred.resolve(files);
        }
      });

      return deferred.promise();
    },

    /**
     * ファイルが存在するかチェック
     * @param {string} path - ファイルパス（絶対パス）
     * @returns {Promise<boolean>} 存在するか
     */
    fileExists: function (path) {
      var deferred = $.Deferred();
      var file = FileSystem.getFileForPath(path);

      file.exists(function (err, exists) {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(exists);
        }
      });

      return deferred.promise();
    },

    /**
     * ディレクトリが存在するかチェック
     * @param {string} path - ディレクトリパス（絶対パス）
     * @returns {Promise<boolean>} 存在するか
     */
    directoryExists: function (path) {
      var deferred = $.Deferred();
      var directory = FileSystem.getDirectoryForPath(path);

      directory.exists(function (err, exists) {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(exists);
        }
      });

      return deferred.promise();
    },

    /**
     * パスからディレクトリパスを取得
     * @param {string} filePath - ファイルパス
     * @returns {string} ディレクトリパス
     */
    getDirectoryPath: function (filePath) {
      return filePath.substring(0, filePath.lastIndexOf("/"));
    },

    /**
     * パスからファイル名を取得
     * @param {string} filePath - ファイルパス
     * @returns {string} ファイル名
     */
    getFileName: function (filePath) {
      return filePath.substring(filePath.lastIndexOf("/") + 1);
    },

    /**
     * ファイルの拡張子を取得
     * @param {string} filePath - ファイルパス
     * @returns {string} 拡張子（ドット付き）
     */
    getFileExtension: function (filePath) {
      var fileName = this.getFileName(filePath);
      var lastDot = fileName.lastIndexOf(".");
      return lastDot !== -1 ? fileName.substring(lastDot) : "";
    },
  };

  module.exports = CoreFileService;
});
