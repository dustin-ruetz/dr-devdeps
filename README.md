# dr-devdeps

This repository is an installable package that provides standardized dependencies and configurations for other JavaScript/TypeScript projects to consume.

- This project bootstraps and dogfoods its own configuration files by 1) using `tsc` to compile the src/\*.ts files to the lib/\*.js directory, and 2) pointing all config paths to the compiled lib/\*.js files.
- It depends on the `consuming-repo` using the following folder/file structure:

```
// Created using the `Shinotatwu-DS.file-tree-generator` extension for Visual Studio Code.
📂 consuming-repo
┣ 📂 node_modules
┃ ┗ 📂 dr-devdeps
┃ ┃ ┗ 📂 lib
┃ ┃ ┃ ┗ 📄 *.config.js
┃ ┃ ┗ 📄 tsconfig.json
┗ 📄 package.json
┗ 📄 tsconfig.json
```
