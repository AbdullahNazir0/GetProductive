import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { Task } from '../models/task.model.js'

const createTask = asyncHandler(async (req, res) => {
  const { title, description, deadline, priority } = req.body
  const id = req.userId

  if (title.trim() == '') {
    throw new ApiError(400, 'Title is required')
  }

  try {
    const createdTask = await Task.create({
      title,
      description,
      deadline,
      priority,
      userId: req.userId
    })
  } catch(error) {
    console.log(error)
  }
  // if (!createdTask) {
  //   throw new ApiError(500, 'Failed to create task')
  // }

  res.status(201).json(new ApiResponse(201, 'createdTask', 'Task created successfully'))
})

const getTasks = asyncHandler(async (req, res) => {
  const id = req.userId

  const tasks = await Task.find({ userId: id })
  if (!tasks) {
    throw new ApiError(404, 'Tasks not found')
  }

  res.status(200).json(new ApiResponse(200, tasks, 'Tasks retrieved successfully'))
})

const getTaskById = asyncHandler(async (req, res) => {
  const id = req.params.id

  const task = await Task.findById(id)
  if (!task) {
    throw new ApiError(404, 'Task not found')
  }

  res.status(200).json(new ApiResponse(200, task, 'Task retrieved successfully'))
})

const updateTask = asyncHandler(async (req, res) => {
  const id = req.params.id

  const task = await Task.findById(id)
  if (!task) {
    throw new ApiError(404, 'Task not found')
  }

  const { title, description, deadline, priority, isDone } = req.body

  if (title.trim() === '') {
    throw new ApiError(400, 'Title is required')
  }

  const updatedTask = await Task.findByIdAndUpdate(id, {
    title,
    description,
    deadline,
    priority,
    isDone
  }, { new: true })
  if (!updatedTask) {
    throw new ApiError(500, 'Failed to update task')
  }

  res.status(200).json(new ApiResponse(200, updatedTask, 'Task updated successfully'))
})

const deleteTask = asyncHandler(async (req, res) => {
  const id = req.params.id

  const task = await Task.findById(id)
  if (!task) {
    throw new ApiError(404, 'Task not found')
  }

  const deletedTask = await Task.findByIdAndDelete(id)
  if (!deletedTask) {
    throw new ApiError(500, 'Failed to delete task')
  }

  res.status(200).json(new ApiResponse(200, task, 'Task deleted successfully'))
})

export {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
}
