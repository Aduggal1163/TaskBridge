import { Router } from 'express';
import Team from '../models/Team.js';
import { authenticateJwt, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticateJwt, authorizeRoles('admin', 'project_manager'), async (req, res) => {
  try {
    const team = await Team.create({ name: req.body.name, creator: req.user._id, members: [req.user._id] });
    res.status(201).json(team);
  } catch (err) {
    res.status(400).json({ message: 'Create team failed', error: err.message });
  }
});

router.get('/', authenticateJwt, async (_req, res) => {
  try {
    const teams = await Team.find().populate('creator', 'name email').populate('members', 'name email role');
    res.json(teams);
  } catch (err) {
    console.error('Error fetching teams:', err);
    res.status(500).json({ message: 'Error fetching teams', error: err.message });
  }
});

router.post('/:id/members', authenticateJwt, authorizeRoles('admin', 'project_manager'), async (req, res) => {
  try {
    const { userId } = req.body;
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { members: userId } },
      { new: true }
    ).populate('members', 'name email role');
    res.json(team);
  } catch (err) {
    res.status(400).json({ message: 'Add member failed', error: err.message });
  }
});

export default router;


