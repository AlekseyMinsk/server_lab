const { Schema, model } = require('mongoose');

const Task = new Schema(
  {
    userId: {type: String, required: true},
    taskCore: {type: String, required: true}
  },
  { collection: 'tasks' }
)

module.exports = model('Task', Task);