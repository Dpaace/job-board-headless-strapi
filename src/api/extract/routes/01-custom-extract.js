module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/extracts/customExtract',
            handler: '01-custom-extract.getExtract',
            config: {
                auth: false,
            },
        },
        {
            method: 'GET',
            path: '/extracts/health-check',
            handler: 'extract.healthCheck',
            config: {
                auth: false,
            },
        },
        {
            method: 'POST',
            path: '/extracts/upload',
            handler: '01-custom-extract.fileUpload',
            config: {
                auth: false,
            },
        },
    ],
};
