// src/api/gemello-news/routes/extract-zip.js

module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/gemello-news/extract-zip',
        handler: 'extract-zip.extract',
        config: {
          auth: false, // Change according to your authentication needs
        },
      },
    ],
  };
  