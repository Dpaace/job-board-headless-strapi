const fs = require('fs');
const path = require('path');

module.exports = {
    async getExtract(ctx, next) {
        ctx.body = "Is this being consoled now";
    },

    async fileUpload(ctx) {
        console.log(ctx.request.body);
        // console.log(ctx.request.files);
        const {files}  = ctx.request.files;
        console.log("Is file being accessed",files)

        if (!files) {
            ctx.throw(400, 'No files uploaded.');
        }

        const uploadDir = path.join(__dirname, '..', 'public/uploads');

        // Ensure the upload directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Process each file
        for (const file of files) {
            const reader = fs.createReadStream(file.path);
            const stream = fs.createWriteStream(path.join(uploadDir, file.name));
            reader.pipe(stream);
        }

        ctx.body = { message: 'Files uploaded successfully!' };
    }
};



