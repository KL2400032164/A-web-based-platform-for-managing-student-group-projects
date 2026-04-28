const users = [
  {
    id: 'u-admin-1',
    name: 'Admin User',
    email: 'admin@gmail.com',
    password: 'admin123',
    role: 'admin',
    demoAccount: true
  },
  {
    id: 'u-student-1',
    name: 'Student One',
    email: 'student@gmail.com',
    password: 'student123',
    role: 'student',
    demoAccount: true
  },
  {
    id: 'u-student-2',
    name: 'Student Two',
    email: 'noah@student.com',
    password: 'student123',
    role: 'student'
  },
  {
    id: 'u-student-3',
    name: 'Student Three',
    email: 'mia@student.com',
    password: 'student123',
    role: 'student'
  }
];

const projects = [
  {
    id: 'p1',
    title: 'AI Attendance Tracker',
    description: 'Build a smart attendance system using face detection and dashboard reporting.',
    deadline: '2026-04-30',
    assignedStudents: ['u-student-1', 'u-student-2'],
    milestones: [
      { id: 'm1', label: 'Research & Planning', completion: 100 },
      { id: 'm2', label: 'Model Training', completion: 70 },
      { id: 'm3', label: 'Integration & Testing', completion: 35 }
    ],
    tasks: [
      { id: 't1', title: 'Collect sample dataset', status: 'Completed' },
      { id: 't2', title: 'Train detection model', status: 'In Progress' },
      { id: 't3', title: 'Connect model with UI', status: 'Pending' }
    ],
    finalSubmissions: [{ id: 'sub-1', studentId: 'u-student-2', comment: 'Initial model report uploaded.' }]
  },
  {
    id: 'p2',
    title: 'Campus Event Portal',
    description: 'Create a portal for publishing, managing, and tracking college events.',
    deadline: '2026-05-18',
    assignedStudents: ['u-student-1', 'u-student-3'],
    milestones: [
      { id: 'm1', label: 'Wireframes', completion: 100 },
      { id: 'm2', label: 'Frontend Development', completion: 80 },
      { id: 'm3', label: 'API Integration', completion: 45 }
    ],
    tasks: [
      { id: 't1', title: 'Design responsive pages', status: 'Completed' },
      { id: 't2', title: 'Build event registration form', status: 'In Progress' },
      { id: 't3', title: 'Add admin moderation panel', status: 'Pending' }
    ],
    finalSubmissions: []
  },
  {
    id: 'p3',
    title: 'Library Management Mobile App',
    description: 'Develop a student app for searching books, issuing, and due-date notifications.',
    deadline: '2026-06-10',
    assignedStudents: ['u-student-2', 'u-student-3'],
    milestones: [
      { id: 'm1', label: 'Feature List Finalization', completion: 100 },
      { id: 'm2', label: 'UI Prototyping', completion: 100 },
      { id: 'm3', label: 'Core Feature Build', completion: 55 }
    ],
    tasks: [
      { id: 't1', title: 'Create search flow screens', status: 'Completed' },
      { id: 't2', title: 'Implement issue/return logic', status: 'Pending' },
      { id: 't3', title: 'Push notification setup', status: 'In Progress' }
    ],
    finalSubmissions: [{ id: 'sub-2', studentId: 'u-student-3', comment: 'UI prototype and architecture doc submitted.' }]
  }
];

const projectChats = Object.fromEntries(projects.map((project) => [project.id, []]));

const taskStatuses = ['Pending', 'In Progress', 'Completed'];

const toPublicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role
});

const computeProjectProgress = (project) => {
  if (!project.tasks.length) return 0;
  const points = { Pending: 0, 'In Progress': 50, Completed: 100 };
  const total = project.tasks.reduce((sum, task) => sum + (points[task.status] || 0), 0);
  return Math.round(total / project.tasks.length);
};

const withProjectView = (project) => {
  const assignedStudentDetails = project.assignedStudents
    .map((studentId) => users.find((user) => user.id === studentId && user.role === 'student'))
    .filter(Boolean)
    .map(toPublicUser);

  return {
    ...project,
    progress: computeProjectProgress(project),
    assignedStudentDetails
  };
};

const createId = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

export const store = {
  getUsers: ({ role } = {}) => {
    if (!role) return users.map(toPublicUser);
    return users.filter((user) => user.role === role).map(toPublicUser);
  },

  signup: ({ name, email, password, role }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const exists = users.some((user) => user.email === normalizedEmail);
    if (exists) {
      return { error: 'Account already exists for this email.' };
    }

    const user = {
      id: createId('u'),
      name: name.trim(),
      email: normalizedEmail,
      password,
      role
    };
    users.push(user);
    return { user: toPublicUser(user) };
  },

  login: ({ email, password, role }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = users.find((entry) => entry.email === normalizedEmail);
    if (!user) return { error: 'Invalid credentials. Create an account first.' };
    if (!user.demoAccount && user.password !== password) return { error: 'Incorrect password.' };
    if (user.role !== role) return { error: `Role mismatch. Select ${user.role} for ${normalizedEmail}.` };
    return { user: toPublicUser(user) };
  },

  getProjects: ({ role, userId } = {}) => {
    if (role === 'student' && userId) {
      return projects.filter((project) => project.assignedStudents.includes(userId)).map(withProjectView);
    }
    return projects.map(withProjectView);
  },

  getProjectById: (projectId) => {
    const project = projects.find((entry) => entry.id === projectId);
    return project ? withProjectView(project) : null;
  },

  createProject: ({ title, description, deadline, assignedStudents }) => {
    const project = {
      id: createId('p'),
      title: title.trim(),
      description: description.trim(),
      deadline,
      assignedStudents,
      milestones: [
        { id: createId('m'), label: 'Kickoff', completion: 0 },
        { id: createId('m'), label: 'Development', completion: 0 },
        { id: createId('m'), label: 'Final Review', completion: 0 }
      ],
      tasks: [
        { id: createId('t'), title: 'Requirement Analysis', status: 'Pending' },
        { id: createId('t'), title: 'Core Implementation', status: 'Pending' },
        { id: createId('t'), title: 'Testing', status: 'Pending' }
      ],
      finalSubmissions: []
    };

    projects.unshift(project);
    return withProjectView(project);
  },

  updateTaskStatus: ({ projectId, taskId, status }) => {
    if (!taskStatuses.includes(status)) return { error: 'Invalid task status.' };

    const project = projects.find((entry) => entry.id === projectId);
    if (!project) return { error: 'Project not found.' };

    const task = project.tasks.find((entry) => entry.id === taskId);
    if (!task) return { error: 'Task not found.' };

    task.status = status;
    return { project: withProjectView(project), task };
  },

  addTask: ({ projectId, title }) => {
    const project = projects.find((entry) => entry.id === projectId);
    if (!project) return { error: 'Project not found.' };

    const task = {
      id: createId('t'),
      title: title.trim(),
      status: 'Pending'
    };

    project.tasks.push(task);
    return { project: withProjectView(project), task };
  },

  renameTask: ({ projectId, taskId, title }) => {
    const project = projects.find((entry) => entry.id === projectId);
    if (!project) return { error: 'Project not found.' };

    const task = project.tasks.find((entry) => entry.id === taskId);
    if (!task) return { error: 'Task not found.' };

    task.title = title.trim();
    return { project: withProjectView(project), task };
  },

  deleteTask: ({ projectId, taskId }) => {
    const project = projects.find((entry) => entry.id === projectId);
    if (!project) return { error: 'Project not found.' };

    const beforeCount = project.tasks.length;
    project.tasks = project.tasks.filter((entry) => entry.id !== taskId);
    if (project.tasks.length === beforeCount) return { error: 'Task not found.' };

    return { project: withProjectView(project) };
  },

  getChatMessages: (projectId) => {
    const project = projects.find((entry) => entry.id === projectId);
    if (!project) return { error: 'Project not found.' };
    return { messages: [...(projectChats[projectId] || [])] };
  },

  addChatMessage: ({ projectId, sender, role, text }) => {
    const project = projects.find((entry) => entry.id === projectId);
    if (!project) return { error: 'Project not found.' };

    if (!projectChats[projectId]) {
      projectChats[projectId] = [];
    }

    const message = {
      id: createId('msg'),
      sender: sender.trim(),
      role: role.trim(),
      text: text.trim(),
      createdAt: new Date().toISOString()
    };

    projectChats[projectId].push(message);
    return { message, messages: [...projectChats[projectId]] };
  },

  deleteChatMessage: ({ projectId, messageId }) => {
    const project = projects.find((entry) => entry.id === projectId);
    if (!project) return { error: 'Project not found.' };

    const messages = projectChats[projectId] || [];
    const before = messages.length;
    projectChats[projectId] = messages.filter((entry) => entry.id !== messageId);
    if (projectChats[projectId].length === before) return { error: 'Message not found.' };

    return { messages: [...projectChats[projectId]] };
  },

  clearChat: (projectId) => {
    const project = projects.find((entry) => entry.id === projectId);
    if (!project) return { error: 'Project not found.' };

    projectChats[projectId] = [];
    return { messages: [] };
  },

  submitFinalWork: ({ projectId, studentId, comment, fileName }) => {
    const project = projects.find((entry) => entry.id === projectId);
    if (!project) return { error: 'Project not found.' };

    const hasAccess = project.assignedStudents.includes(studentId);
    if (!hasAccess) return { error: 'Student is not assigned to this project.' };

    const submission = {
      id: createId('sub'),
      studentId,
      comment: comment?.trim() || '',
      fileName: fileName?.trim() || null,
      createdAt: new Date().toISOString()
    };

    project.finalSubmissions.push(submission);
    return { submission, project: withProjectView(project) };
  }
};
