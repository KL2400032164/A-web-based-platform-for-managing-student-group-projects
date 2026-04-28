import { Router } from 'express';
import { store } from '../data/store.js';
import { emitProjectChatUpdate } from '../realtime/socket.js';

const router = Router();

router.get('/', (req, res) => {
  const role = req.query.role?.trim();
  const userId = req.query.userId?.trim();
  const projects = store.getProjects({ role, userId });
  return res.json({ projects });
});

router.get('/:projectId', (req, res) => {
  const project = store.getProjectById(req.params.projectId);
  if (!project) {
    return res.status(404).json({ message: 'Project not found.' });
  }
  return res.json({ project });
});

router.post('/', (req, res) => {
  const { title, description, deadline, assignedStudents = [] } = req.body;

  if (!title?.trim() || !description?.trim() || !deadline?.trim()) {
    return res.status(400).json({ message: 'Title, description, and deadline are required.' });
  }

  const project = store.createProject({
    title,
    description,
    deadline,
    assignedStudents: Array.isArray(assignedStudents) ? assignedStudents : []
  });

  return res.status(201).json({ project });
});

router.patch('/:projectId/tasks/:taskId', (req, res) => {
  const { status } = req.body;
  if (!status?.trim()) {
    return res.status(400).json({ message: 'Task status is required.' });
  }

  const result = store.updateTaskStatus({
    projectId: req.params.projectId,
    taskId: req.params.taskId,
    status
  });

  if (result.error) {
    const statusCode = result.error === 'Invalid task status.' ? 400 : 404;
    return res.status(statusCode).json({ message: result.error });
  }

  return res.json({ task: result.task, project: result.project });
});

router.post('/:projectId/tasks', (req, res) => {
  const { title } = req.body;
  if (!title?.trim()) {
    return res.status(400).json({ message: 'Task title is required.' });
  }

  const result = store.addTask({
    projectId: req.params.projectId,
    title
  });

  if (result.error) {
    return res.status(404).json({ message: result.error });
  }

  return res.status(201).json({ task: result.task, project: result.project });
});

router.put('/:projectId/tasks/:taskId', (req, res) => {
  const { title } = req.body;
  if (!title?.trim()) {
    return res.status(400).json({ message: 'Task title is required.' });
  }

  const result = store.renameTask({
    projectId: req.params.projectId,
    taskId: req.params.taskId,
    title
  });

  if (result.error) {
    return res.status(404).json({ message: result.error });
  }

  return res.json({ task: result.task, project: result.project });
});

router.delete('/:projectId/tasks/:taskId', (req, res) => {
  const result = store.deleteTask({
    projectId: req.params.projectId,
    taskId: req.params.taskId
  });

  if (result.error) {
    return res.status(404).json({ message: result.error });
  }

  return res.json({ project: result.project });
});

router.get('/:projectId/chat', (req, res) => {
  const result = store.getChatMessages(req.params.projectId);
  if (result.error) {
    return res.status(404).json({ message: result.error });
  }

  return res.json({ messages: result.messages });
});

router.post('/:projectId/chat', (req, res) => {
  const { sender, role, text } = req.body;
  if (!sender?.trim() || !role?.trim() || !text?.trim()) {
    return res.status(400).json({ message: 'sender, role, and text are required.' });
  }

  const result = store.addChatMessage({
    projectId: req.params.projectId,
    sender,
    role,
    text
  });

  if (result.error) {
    return res.status(404).json({ message: result.error });
  }

  emitProjectChatUpdate(req.params.projectId, result.messages);
  return res.status(201).json({ message: result.message, messages: result.messages });
});

router.delete('/:projectId/chat/:messageId', (req, res) => {
  const result = store.deleteChatMessage({
    projectId: req.params.projectId,
    messageId: req.params.messageId
  });

  if (result.error) {
    return res.status(404).json({ message: result.error });
  }

  emitProjectChatUpdate(req.params.projectId, result.messages);
  return res.json({ messages: result.messages });
});

router.delete('/:projectId/chat', (req, res) => {
  const result = store.clearChat(req.params.projectId);
  if (result.error) {
    return res.status(404).json({ message: result.error });
  }

  emitProjectChatUpdate(req.params.projectId, result.messages);
  return res.json({ messages: result.messages });
});

router.post('/:projectId/submissions', (req, res) => {
  const { studentId, comment, fileName } = req.body;
  if (!studentId?.trim()) {
    return res.status(400).json({ message: 'studentId is required.' });
  }

  const result = store.submitFinalWork({
    projectId: req.params.projectId,
    studentId,
    comment,
    fileName
  });

  if (result.error) {
    const statusCode = result.error === 'Project not found.' ? 404 : 403;
    return res.status(statusCode).json({ message: result.error });
  }

  return res.status(201).json({ submission: result.submission, project: result.project });
});

export default router;
