export const students = [
  { id: 's1', name: 'Student One', email: 'student@gmail.com' },
  { id: 's2', name: 'Student Two', email: 'noah@student.com' },
  { id: 's3', name: 'Student Three', email: 'mia@student.com' }
];

export const projects = [
  {
    id: 'p1',
    title: 'AI Attendance Tracker',
    description: 'Build a smart attendance system using face detection and dashboard reporting.',
    deadline: '2026-04-30',
    assignedStudents: ['s1', 's2'],
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
    finalSubmissions: [
      { studentId: 's2', comment: 'Initial model report uploaded.' }
    ]
  },
  {
    id: 'p2',
    title: 'Campus Event Portal',
    description: 'Create a portal for publishing, managing, and tracking college events.',
    deadline: '2026-05-18',
    assignedStudents: ['s1', 's3'],
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
    assignedStudents: ['s2', 's3'],
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
    finalSubmissions: [
      { studentId: 's3', comment: 'UI prototype and architecture doc submitted.' }
    ]
  }
];

export const getProjectProgress = (project) => {
  if (!project.tasks?.length) return 0;
  const points = { Pending: 0, 'In Progress': 50, Completed: 100 };
  const total = project.tasks.reduce((sum, task) => sum + (points[task.status] || 0), 0);
  return Math.round(total / project.tasks.length);
};
