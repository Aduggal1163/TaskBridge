import { Router } from 'express';
import Task from '../models/Task.js';
import User from '../models/User.js';
import { authenticateJwt, authorizeRoles } from '../middleware/auth.js';
import Project from '../models/Project.js';
import { logActivity } from '../services/activity.js';

const router = Router();

// Only admin and project_manager can create/assign tasks
router.post('/', authenticateJwt, authorizeRoles('admin', 'project_manager'), async (req, res) => {
  try {
    const { title, description, project, assignees } = req.body;

    // Validate assignees belong to the project's team
    const proj = await Project.findById(project).populate('team');
    if (!proj) return res.status(400).json({ message: 'Invalid project' });
    const teamId = proj.team?._id?.toString();
    if (!teamId) return res.status(400).json({ message: 'Project has no team' });

    if (Array.isArray(assignees) && assignees.length > 0) {
      // Load team members to validate
      const projWithMembers = await Project.findById(project).populate({ path: 'team', populate: { path: 'members', select: '_id' } });
      const memberIds = new Set((projWithMembers.team?.members || []).map((m) => m._id.toString()));
      const invalid = assignees.filter((id) => !memberIds.has(id.toString()));
      if (invalid.length) {
        return res.status(400).json({ message: 'One or more assignees are not members of the project team', invalid });
      }
    }
    const task = await Task.create({ title, description, project, assignees });
    const recipients = await User.find({ _id: { $in: assignees || [] } }).select('email');
    await logActivity({
      action: 'task_created',
      user: req.user._id,
      project,
      task: task._id,
      details: { title },
      notify: recipients,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: 'Create task failed', error: err.message });
  }
});

router.get('/', authenticateJwt, async (_req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignees', 'name email')
      .populate({
        path: 'project',
        populate: {
          path: 'team',
          select: 'name'
        }
      });
    
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ message: 'Error fetching tasks', error: err.message });
  }
});

// Tasks assigned to the current user
router.get('/my', authenticateJwt, async (req, res) => {
  try {
    const tasks = await Task.find({ assignees: req.user._id })
      .populate('assignees', 'name email role')
      .populate({
        path: 'project',
        populate: { path: 'team', select: 'name' }
      });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching my tasks', error: err.message });
  }
});

router.patch('/:id/status', authenticateJwt, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    await logActivity({
      action: 'task_status_changed',
      user: req.user._id,
      project: task.project,
      task: task._id,
      details: { status: task.status },
      notify: [],
    });
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: 'Update status failed', error: err.message });
  }
});

export default router;


