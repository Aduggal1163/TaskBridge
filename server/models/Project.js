import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);


