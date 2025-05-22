const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authenticateToken } = require('../middlewares/authMiddle');
const fileController = require('../controller/file');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.post('/upload', authenticateToken, upload.single('file'), fileController.uploadFile);
router.get('/files/:id', authenticateToken, fileController.getFileStatus);

module.exports = router;
