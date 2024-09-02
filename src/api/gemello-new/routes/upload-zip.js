module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/gemello-news/upload-zip',
        handler: 'upload-zip.uploadAndExtract',
        config: {
          auth: false, // Adjust this according to your authentication needs
          policies: [],
        },
      },
    ],
  };
