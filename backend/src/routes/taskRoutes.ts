import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
} from '../controllers/taskController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/', protect, getTasks);
router.post('/', protect, createTask);
router.get('/:id', protect, getTaskById);
router.patch('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);
router.patch('/:id/toggle', protect, toggleTask);

export default router;
