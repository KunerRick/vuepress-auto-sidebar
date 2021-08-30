const path = require("path");
const fs = require("fs");

let sidebar = {}
/**
 * 获取根目录
 */
function getRootDir(relatePath = "docs") {
  return path.resolve(process.cwd() , relatePath);
}

/**
 * 深度优先遍历文件、文件夹并执行回调
 * @param {*} dir
 * @param {*} cb
 * @param {*} level
 * @param {*} parent
 */
function treeWork(dir, cb, level = 0, parent = "") {
  let absPath = path.resolve(getRootDir(), dir);
  if (!fs.statSync(absPath).isDirectory()) {
    return;
  }
  let pathList = fs.readdirSync(absPath).filter(file => {
    return file !== ".vuepress";
  });

  pathList.map(val => {
    absPath = path.resolve(getRootDir(),dir, val);
    let isDir = fs.statSync(absPath).isDirectory();

    let subRelatePath = path.join(parent, val);
    cb({
      parent,
      path: subRelatePath,
      level,
      isDir
    });

    if (isDir) {
      treeWork(absPath, cb, level + 1, subRelatePath);
    }
  });
}

function getTitle(filePath) {
  let tempFile = filePath;
  let title = path.basename(tempFile);
  if (fs.statSync(tempFile).isDirectory()) {
    tempFile = path.resolve(tempFile, "README.md");
  }

  try {
    let content = fs.readFileSync(tempFile).toString();
    let startIndex = content.indexOf("#");
    let endIndex = content.indexOf("\n", startIndex);
    if (startIndex !== -1) {
      if (endIndex !== -1) {
        title = content.slice(startIndex + 1, endIndex - 1);
      } else {
        title = content.slice(startIndex + 1);
      }
    }
  } catch (e) {
  } finally {
    return title;
  }
}

/**
 * 层序遍历文件、文件夹并执行回调
 * @param {*} dir
 * @param {*} cb
 * @param {*} level
 * @param {*} parent
 * @returns
 */
function sequenceTtraversal(dir, cb, level = 0, parent = "") {
  let absPath = path.resolve(getRootDir(), dir);
  if (!fs.statSync(absPath).isDirectory()) {
    return;
  }
  let pathList = fs
    .readdirSync(absPath)
    .filter(file => {
      return file !== ".vuepress";
    })
    .sort((a, b) => {
      // 按首字母ascii码进行排序
      return a.slice(0, 1).charCodeAt() - b.slice(0, 1).charCodeAt();
    });

  // 下一层级遍历
  let nextDirArr = [];
  pathList.map(val => {
    absPath = path.resolve(getRootDir(),dir, val);
    let isDir = fs.statSync(absPath).isDirectory();
    let subRelatePath = path.join(parent, val);
    if (isDir) {
      nextDirArr.push([absPath, cb, level + 1, subRelatePath]);
    }
    cb({
      parent,
      path: subRelatePath,
      level,
      title: getTitle(absPath),
      isDir
    });
  });

  nextDirArr.map(item => {
    sequenceTtraversal(...item);
  });
}

function normalizePath(str) {
  if (!str) return;
  let temp = path.normalize(str);

  temp = temp.replace(/\\/g, "/");
  if (str.indexOf("/") != 0) {
    temp = "/" + temp;
  }

  if (str.indexOf(".md") > -1) {
    temp = temp.slice(0, -3);
  } else {
    if (str.lastIndexOf("/") != str.length - 1) {
      temp += "/";
    }
  }
  return temp;
}

/**
 * 组装侧边栏数据，仅支持v1版本的vuepress
 * @param {*} rootPath
 * @param {*} pathArr
 * @returns
 */
function getSidebar(rootPath = "", pathArr = []) {
  let root;
  if (!rootPath) {
    root = getRoot();
  } else {
    root = path.resolve(process.cwd(), rootPath);
  }

  let sidebarArr = [];

  let tempMap = {};

  let cbFunc = ({ level, parent, path, title, isDir }) => {
    if (level === 0) {
      let tempPath = normalizePath(path);
      if (tempPath.indexOf("README") != -1) {
        return;
      }
      let tempItem = {
        title,
        collapsable: false,
        path: tempPath,
        children: []
      };
      tempMap[tempPath] = tempItem;
      sidebarArr.push(tempItem);
      return;
    }

    if (path.indexOf("README.md") != -1) {
      return;
    }

    let parentPath = normalizePath(parent);
    if (!tempMap[parentPath]) {
      tempMap[parentPath] = {
        title,
        path: parentPath,
        collapsable: false,
        children: []
      };
    }
    let tempPath = normalizePath(path);
    let tempItem = {
      title,
      path: tempPath,
      collapsable: false,
      children: []
    };
    tempMap[tempPath] = tempItem;
    tempMap[parentPath].children.push(tempItem);
  };

  if (pathArr && pathArr.length) {
    pathArr.map(dir => {
      sequenceTtraversal(dir, cbFunc, 0, dir);
    });
  } else {
    sequenceTtraversal(root, cbFunc);
  }
  return sidebarArr;
}

getSidebarItems = function(dir, root, baseOption = "/") {
  return dir.map(e => {
    const childDir = path.resolve(root, e);
    return (sidebaritem = {
      // title: e,
      path: baseOption + e + "/",
      // collapsable: true,
      children: [
        ...fs
          .readdirSync(childDir)
          .filter(file => !file.includes(".md"))
          .map(c => "/" + e + "/" + c + "/")
      ]
    });
  });
};

getRoot = function(base="") {
  tryFindBase();
  let root;

  if (!!sidebar.baseOption) {
    root = path.join(getRootDir(), sidebar.baseOption);
  } else {
    root = getRootDir();
  }
  return root;
};

tryFindBase = function() {
  try {
    let config = path.join(getRootDir(), "/.vuepress/config.js");
    let contents = fs.readFileSync(config, "utf8");
    let base = contents.match(/(?<="?base"?:+\s?").+(?=")/)[0];
    sidebar.baseOption = base;
  } catch (err) {
    console.log("Vuepress-auto-sidebar: Base option not found.");
  }
};

module.exports = {
  getRootDir,
  getSidebar
};
