const {defineConfig} = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      customFileProtocol: "./",
      builderOptions: {
        nsis: {
          allowToChangeInstallationDirectory: true,
          oneClick: false,
          installerIcon: "./public/aqtoj-ecvhz-001.ico", //安装logo
          installerHeaderIcon: "./public/aqtoj-ecvhz-001.ico" //安装logo
        },
        win: {
          icon: './public/aqtoj-ecvhz-001.ico' //打包windows版本的logo
        },
        productName: "letmd", //应用的名称
      }
    },
  },
})
