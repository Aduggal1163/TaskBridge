import ActivityLog from '../models/ActivityLog.js';
import { sendMail } from './mailer.js';

let ioInstance = null;
export function attachIo(io) {
  ioInstance = io;
}

export async function logActivity({ action, user, project, task, details, notify = [] }) {
  const log = await ActivityLog.create({ action, user, project, task, details });
  if (ioInstance) {
    ioInstance.emit('activity', {
      id: log._id,
      action: log.action,
      details: log.details,
      user,
      project,
      task,
      createdAt: log.createdAt,
    });
  }
  if (notify.length > 0) {
    await Promise.all(
      notify.map((recipient) =>
        sendMail({
          to: recipient.email,
          subject: `[ProjectCollab] ${action}`,
          html: `<p>${action}</p><pre>${JSON.stringify(details || {}, null, 2)}</pre>`,
        })
      )
    );
  }
  return log;
}


