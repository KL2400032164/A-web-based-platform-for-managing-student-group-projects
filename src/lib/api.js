const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const request = async (path, options = {}) => {
  let response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options
    });
  } catch (error) {
    throw new Error('Cannot connect to backend API. Start the server and try again.');
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || payload.msg || 'Request failed.');
  }

  return payload;
};

export const authApi = {
  login: async (body) => {
    const payload = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body)
    });

    if (payload.user) return payload;

    // Compatibility for backend that returns { token, role, name }.
    return {
      ...payload,
      user: {
        id: payload.userId || payload.id || body.email,
        name: payload.name || 'User',
        email: body.email,
        role: payload.role || body.role
      }
    };
  },

  signup: async (body) => {
    const payload = await request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(body)
    });

    if (payload.user) return payload;

    // Compatibility for backend that returns { msg: "User registered" }.
    return {
      ...payload,
      user: {
        id: body.email,
        name: body.name,
        email: body.email,
        role: body.role
      }
    };
  }
};

export const userApi = {
  list: (role) => request(`/users${role ? `?role=${encodeURIComponent(role)}` : ''}`)
};

export const projectApi = {
  list: (user) =>
    request(`/projects?role=${encodeURIComponent(user?.role || '')}&userId=${encodeURIComponent(user?.id || '')}`),

  getById: (projectId) => request(`/projects/${projectId}`),

  create: (body) =>
    request('/projects', {
      method: 'POST',
      body: JSON.stringify(body)
    }),

  updateTaskStatus: ({ projectId, taskId, status }) =>
    request(`/projects/${projectId}/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }),

  addTask: ({ projectId, title }) =>
    request(`/projects/${projectId}/tasks`, {
      method: 'POST',
      body: JSON.stringify({ title })
    }),

  renameTask: ({ projectId, taskId, title }) =>
    request(`/projects/${projectId}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify({ title })
    }),

  deleteTask: ({ projectId, taskId }) =>
    request(`/projects/${projectId}/tasks/${taskId}`, {
      method: 'DELETE'
    }),

  submitFinalWork: ({ projectId, studentId, comment, fileName }) =>
    request(`/projects/${projectId}/submissions`, {
      method: 'POST',
      body: JSON.stringify({ studentId, comment, fileName })
    }),

  getChatMessages: (projectId) => request(`/projects/${projectId}/chat`),

  sendChatMessage: ({ projectId, sender, role, text }) =>
    request(`/projects/${projectId}/chat`, {
      method: 'POST',
      body: JSON.stringify({ sender, role, text })
    }),

  deleteChatMessage: ({ projectId, messageId }) =>
    request(`/projects/${projectId}/chat/${messageId}`, {
      method: 'DELETE'
    }),

  clearChat: ({ projectId }) =>
    request(`/projects/${projectId}/chat`, {
      method: 'DELETE'
    })
};
