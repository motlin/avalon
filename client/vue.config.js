const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  "outputDir" : "../server/dist",
  devServer: {
    proxy: 'https://avalon.onl'
  },

  transpileDependencies: [
    'vuetify'
  ]
})
