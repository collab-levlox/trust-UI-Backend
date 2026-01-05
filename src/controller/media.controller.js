const { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const r2 = require("../utils/S3Client");
const prisma = require("../../prisma");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const BUCKET = process.env.R2_BUCKET;

const getMediaTypeFromMime = (mime) => {
    if (mime.startsWith("image/")) return "IMAGE";
    if (mime.startsWith("video/")) return "VIDEO";
    if (mime.startsWith("audio/")) return "AUDIO";
    return "DOCUMENT";
};


const uploadMedia = catchAsync(async (req, res) => {


    console.log(req.body.content, 'repff');

    if (!req.file) throw new AppError("No file uploaded", 400);

    const key = `media/${Date.now()}-${req.file.originalname}`;
    let dataOfUpload = null;

    try {
        dataOfUpload = await r2.send(
            new PutObjectCommand({
                Bucket: BUCKET,
                Key: key,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            })
        );
    } catch (err) {
        console.error("Cloudflare R2 upload failed:", err);
        throw new AppError("Cloudflare R2 upload failed", 500);
    }

    const publicBase = process.env.R2_BASE_DEV || null;

    const media = await prisma.media.create({
        data: {
            filename: req.file.originalname,
            mime: req.file.mimetype,
            size: req.file.size,
            r2Key: key,
            PostType: req.body.postType,
            url: publicBase + key,
            content: req.body.content,
            type: getMediaTypeFromMime(req.file.mimetype), //
        },
    });

    res.status(201).json({
        message: "Uploaded to Cloudflare R2",
        data: media,
    });
});

const getMedia = catchAsync(async (req, res) => {

    try {

        const media = await prisma.media.findUnique({
            where: { id: parseInt(req.params.id) },
        });

        if (!media) throw new AppError("Media not found", 404);

        return res.status(200).json({
             ...media
        });

    } catch (error) {
        console.log(error,'err');
    }
});


const getMediaList = catchAsync(async (req, res) => {

    const postType = req.query.postType || req.body?.postType;

    const page = Math.max(1, Number(req.query.page || req.body?.page || 1));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit || req.body?.limit || 20)));
    const skip = (page - 1) * limit;

    const where = {};
    if (postType) where.PostType = postType;


    const [total, data] = await Promise.all([
        prisma.media.count({ where }),
        prisma.media.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
    ]);

    res.status(200).json({
        message: "Media list",
        data,
        meta: { total, page, limit },
    });
});

const deleteMedia = catchAsync(async (req, res) => {
    const id = Number(req.params.id);
    if (!id) throw new AppError("Invalid media id", 400);

    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) throw new AppError("Media not found", 404);

    // attempt to delete from R2
    try {
        await r2.send(
            new DeleteObjectCommand({
                Bucket: BUCKET,
                Key: media.r2Key,
            })
        );
    } catch (err) {
        console.error("Cloudflare R2 delete failed:", err);
        throw new AppError("Failed to delete object from Cloudflare R2", 500);
    }

    // delete DB record
    await prisma.media.delete({ where: { id } });

    res.status(200).json({ message: "Media deleted from database" });
});

const updateMedia = catchAsync(async (req, res) => {
    const id = Number(req.params.id);
    if (!id) throw new AppError("Invalid media id", 400);

    const existing = await prisma.media.findUnique({ where: { id } });
    if (!existing) throw new AppError("Media not found", 404);

    // Allowed updatable fields
    const allowed = ["filename", "PostType", "type", "url", "size", "content"];
    const payload = {};
    for (const key of allowed) {
        if (req.body[key] !== undefined) payload[key] = req.body[key];
    }

    // If content is a string, try parse JSON
    if (payload.content && typeof payload.content === "string") {
        try {
            payload.content = JSON.parse(payload.content);
        } catch (err) {
            throw new AppError("Invalid JSON in content field", 400);
        }
    }

    const updated = await prisma.media.update({ where: { id }, data: payload });
    res.status(200).json({ message: "Media updated", data: updated });
});

module.exports = {
    uploadMedia,
    getMedia,
    getMediaList,
    deleteMedia,
    updateMedia,
}