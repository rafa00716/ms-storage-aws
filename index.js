require("dotenv").config();
const express = require("express");
const multer = require("multer");
const authenticate = require("./authenticate.middleware");
const app = express();
const port = Number(process.env.PORT);
const { pipeline } = require("stream");
const { promisify } = require("util");
const streamPipeline = promisify(pipeline);
const path = require("path");

const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} = require("@aws-sdk/client-s3");
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const bucketName = process.env.S3_BUCKET;
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post(
  "/upload/:filename",
  authenticate,
  upload.single("file"),
  async (req, res) => {
    const projectFolder = req.projectFolder;
    const filePath = `${projectFolder}/${req.params.filename}`;
    let filename = req.params?.filename ?? req.file.originalname;

    const metadata = {
      originalName: req.file.originalname,
      filename,
      uploadedAt: new Date().toISOString(),
      size: String(req.file.size),
      mimeType: req.file.mimetype,
      extension: path.extname(req.file.originalname),
    };

    const uploadParams = {
      Bucket: bucketName,
      Key: filePath,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      Metadata: metadata,
    };

    try {
      await s3.send(new PutObjectCommand(uploadParams));
      res.json({ message: "File uploaded successfully", metadata });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

app.get("/download/:filename", authenticate, async (req, res) => {
  const projectFolder = req.projectFolder;
  const filePath = `${projectFolder}/${req.params.filename}`;

  const params = {
    Bucket: bucketName,
    Key: filePath,
  };

  try {
    const { Body, ContentType, Metadata } = await s3.send(
      new GetObjectCommand(params)
    );

    const folders = Metadata.filename.split("/");
    let filename = folders[folders.length - 1];
    if (path.extname(filename) === "") {
      filename = filename + Metadata.extension;
    }

    res.setHeader("Content-Type", ContentType);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    await streamPipeline(Body, res);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/delete/:filename", authenticate, async (req, res) => {
  const projectFolder = req.projectFolder;
  const filePath = `${projectFolder}/${req.params.filename}`;
  const deleteParams = {
    Bucket: bucketName,
    Key: filePath,
  };

  try {
    await s3.send(new DeleteObjectCommand(deleteParams));
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/list", authenticate, async (req, res) => {
  const projectFolder = req.projectFolder;
  const listParams = { Bucket: bucketName, Prefix: projectFolder };

  try {
    const { Contents } = await s3.send(new ListObjectsV2Command(listParams));
    res.json(Contents.map((file) => file.Key));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
