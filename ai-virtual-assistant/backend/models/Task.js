// const mongoose = require('mongoose');

// const TaskSchema = new mongoose.Schema({
//   description: { type: String, required: true }, // Ensure "description" is required
//   completed: { type: Boolean, default: false },
//   category: { type: String, default: 'General' }, // Optional field
//   createdAt: { type: Date, default: Date.now }, // Optional field
// });

// module.exports = mongoose.model('Task', TaskSchema);

const  mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
  task: { type: String, required: true }, // Task description
  reminder: { type: Boolean, default: false } // Reminder flag
});

module.exports = mongoose.model('Task', TaskSchema);
