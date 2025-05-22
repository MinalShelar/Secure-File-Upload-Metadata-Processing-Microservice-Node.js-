// models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  dialect: 'postgres',
  logging: false,
});

const User = sequelize.define(
  'users',
  {
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  },
  {
    timestamps: false,  // Disable createdAt and updatedAt columns
    tableName: 'users',
  }
);

const File = sequelize.define(
  'files',
  {
    original_filename: { type: DataTypes.STRING, allowNull: false },
    storage_path: { type: DataTypes.TEXT, allowNull: false },
    title: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'uploaded',
      validate: { isIn: [['uploaded', 'processing', 'processed', 'failed']] },
    },
    extracted_data: { type: DataTypes.TEXT },
  },
  {
    timestamps: false,
    tableName: 'files',
  }
);

const Job = sequelize.define(
  'jobs',
  {
    job_type: DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isIn: [['queued', 'processing', 'completed', 'failed']] },
    },
    error_message: DataTypes.TEXT,
    started_at: DataTypes.DATE,
    completed_at: DataTypes.DATE,
  },
  {
    timestamps: false,
    tableName: 'jobs',
  }
);

// Associations
User.hasMany(File, { foreignKey: 'user_id', onDelete: 'CASCADE' });
File.belongsTo(User, { foreignKey: 'user_id' });

File.hasMany(Job, { foreignKey: 'file_id', onDelete: 'CASCADE' });
Job.belongsTo(File, { foreignKey: 'file_id' });

module.exports = { sequelize, User, File, Job };
