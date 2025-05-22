const { File } = require('../models');
const { Queue } = require('bullmq');
const IORedis = require('ioredis');

const redisConnection = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

const fileQueue = new Queue('file-processing', { connection: redisConnection });

exports.uploadFile = async (userId, file, title, description) => {
  const newFile = await File.create({
    user_id: userId,
    original_filename: file.originalname,
    storage_path: file.path,
    title,
    description,
    status: 'uploaded',
  });

  await fileQueue.add('process-file', { fileId: newFile.id });

  return { fileId: newFile.id, status: 'uploaded' };
};

exports.getFileById = async (userId, fileId, page, limit) => {
  const offset = (page - 1) * limit;

  const file = await File.findOne({ where: { id: fileId, user_id: userId } });
  if (!file) return null;

  // Find and count total for pagination
  const { count, rows } = await File.findAndCountAll({
    where: { user_id: userId },
    limit,
    offset,
    order: [['id', 'DESC']],
    attributes: [
      'id',
      'original_filename',
      'title',
      'description',
      'status',
      'extracted_data',
    ],
  });

  return {
    totalFiles: count,
    data : rows
  };
};
