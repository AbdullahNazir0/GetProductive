import mongoose from 'mongoose'

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2
  },
  description: {
    type: String
  },
  isDone: {
    type: Boolean,
    default: false
  },
  deadline: {
    type: Date,
    default: null
  },
  priority: {
    type: Number,
    default: 0
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true })

export const Task = mongoose.model('Task', TaskSchema)
