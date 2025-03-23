import { Router } from 'express'
import {
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
  resetPassword,
  deleteUser
} from '../controllers/user.controllers.js'

const router = Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').post(logoutUser)
router.route('/:id/update').post(updateUser)
router.route('/:id/reset-password').post(resetPassword)
router.route('/:id/delete').post(deleteUser)

export default router
