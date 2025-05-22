require('dotenv').config();
const { Worker, QueueEvents } = require('bullmq');
const IORedis = require('ioredis');
const { File } = require('./models');
const crypto = require('crypto');

const redisConnection = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest: null,  // Important fix for BullMQ compatibility
});

const fileWorker = new Worker(
  'file-processing',
  async job => {
    const { fileId } = job.data;

    // Update status to processing
    await File.update({ status: 'processing' }, { where: { id: fileId } });

    try {
      const file = await File.findByPk(fileId);
      if (!file) throw new Error('File not found');

      // Simulate file processing: compute SHA256 hash of file content
      const fileBuffer = require('fs').readFileSync(file.storage_path);
      const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Update DB status to processed and save extracted data (hash)
      await File.update(
        { status: 'processed', extracted_data: hash },
        { where: { id: fileId } }
      );

      return { result: 'success', hash };
    } catch (err) {
      // Mark file as failed if error occurs
      await File.update({ status: 'failed' }, { where: { id: fileId } });
      throw err;
    }
  },
  { connection: redisConnection }
);

fileWorker.on('completed', job => {
  console.log(`Job ${job.id} completed successfully`);
});
fileWorker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});
