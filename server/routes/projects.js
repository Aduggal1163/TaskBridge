import { Router } from 'express';
import Project from '../models/Project.js';
import { authenticateJwt, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticateJwt, authorizeRoles('admin', 'project_manager'), async (req, res) => {
  try {
    const project = await Project.create({
      name: req.body.name,
      description: req.body.description,
      team: req.body.team
    });

    // Populate the team before sending response
    await project.populate('team');

    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: 'Create project failed', error: err.message });
  }
});

router.get('/', authenticateJwt, async (_req, res) => {
  const projects = await Project.find().populate({
    path: 'team',
    populate: { path: 'members', select: 'name email role' }
  });
  res.json(projects);
});

export default router;


