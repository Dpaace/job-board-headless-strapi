// module.exports = () => ({});

// module.exports = ({ env }) => ({
//     upload: {
//         config: {
//             providerOptions: {
//                 sizeLimit: 1024 * 1024 * 1024 
//             }
//         }
//     }
// });

module.exports = ({ env }) => ({
    upload: {
        config: {
            providerOptions: {
                localServer: {
                    maxage: 300000
                },
            },
            sizeLimit: 1024 * 1024 * 1024
        },
    },
});



