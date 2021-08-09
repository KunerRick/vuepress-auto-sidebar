const fs = require("fs");
const path = require("path");

const { getSidebar } = require("./common");
const sidebar = {
  baseOption: "/",
  getSidebar
};

module.exports = sidebar;
