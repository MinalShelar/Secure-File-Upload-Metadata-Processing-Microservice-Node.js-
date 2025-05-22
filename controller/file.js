const fileService = require('../service/file');

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'File required' });

    const { title, description } = req.body;
    const result = await fileService.uploadFile(req.user.id, req.file, title, description);

    res.status(201).json(result);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getFileStatus = async (req, res) => {
  try {
    const fileId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const file = await fileService.getFileById(req.user.id, fileId, page, limit);
    if (!file) return res.status(404).json({ message: 'File not found or access denied' });

    res.json(file);
  } catch (error) {
    console.error('Get file status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
