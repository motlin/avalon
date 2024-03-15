module.exports = {
    services: [
      require('volar-service-css').create(),
      require('volar-service-json').create(),
        require('volar-service-html').create({ printWidth: 100 }),
        require('volar-service-prettier').create({
                  languages: ['html', 'css', 'scss', 'typescript', 'javascript'],
                   html: {
                         breakContentsFromTags: true,
                  },
                  useVscodeIndentation: true,
            }),
    ],
};
