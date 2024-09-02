// api/upload/routes/upload.js

module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/upload-file',
            handler: 'upload.uploadFile',
            config: {
                policies: [],
                middleware: [],
            },
        },
    ],
};
