module.exports = {
    services: [
        require('volar-service-vetur').create(),
        require('volar-service-prettyhtml').create({ printWidth: 100 }),
        require('volar-service-prettier').create({
                  languages: ['html', 'css', 'scss', 'typescript', 'javascript'],
                   html: {
                         breakContentsFromTags: true,
                  },
                  useVscodeIndentation: true,
            }),
    ],
};
