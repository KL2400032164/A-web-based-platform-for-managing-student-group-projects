import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { projectApi } from '../lib/api';

const formatTime = (timestamp) =>
  new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(timestamp));

const ChatBox = ({ projectId, title = 'Team Chat' }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!projectId) return undefined;

    const socket = io('/', {
      transports: ['websocket', 'polling']
    });

    const loadMessages = async () => {
      try {
        const { messages: chatMessages } = await projectApi.getChatMessages(projectId);
        setMessages(chatMessages);
        setError('');
      } catch (requestError) {
        setError(requestError.message);
      }
    };

    loadMessages();
    socket.emit('join_project', { projectId });

    const onChatUpdated = (payload) => {
      if (payload.projectId !== projectId) return;
      setMessages(payload.messages || []);
    };

    socket.on('project_chat_updated', onChatUpdated);

    return () => {
      socket.emit('leave_project', { projectId });
      socket.off('project_chat_updated', onChatUpdated);
      socket.disconnect();
    };
  }, [projectId]);

  const canSend = useMemo(() => draft.trim().length > 0 && Boolean(projectId), [draft, projectId]);

  const handleSend = async (event) => {
    event.preventDefault();
    if (!canSend) return;

    try {
      await projectApi.sendChatMessage({
        projectId,
        sender: user?.name || user?.email || 'User',
        role: user?.role || 'student',
        text: draft.trim()
      });
      setDraft('');
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleDelete = async (messageId) => {
    try {
      await projectApi.deleteChatMessage({ projectId, messageId });
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleClear = async () => {
    try {
      await projectApi.clearChat({ projectId });
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <section className="card chat-card">
      <div className="chat-head">
        <h3>{title}</h3>
        <button type="button" className="btn btn-secondary" onClick={handleClear} disabled={!projectId}>
          Clear
        </button>
      </div>
      {error && <p className="error-text">{error}</p>}

      <div className="chat-list">
        {messages.length ? (
          messages.map((message) => {
            const mine = message.sender === (user?.name || user?.email);
            return (
              <article key={message.id} className={`chat-item ${mine ? 'mine' : ''}`}>
                <div className="chat-meta">
                  <strong>{message.sender}</strong>
                  <span>
                    {message.role} · {formatTime(message.createdAt)}
                  </span>
                </div>
                <p>{message.text}</p>
                <button type="button" className="chat-delete" onClick={() => handleDelete(message.id)}>
                  Delete
                </button>
              </article>
            );
          })
        ) : (
          <p className="empty-text">No messages yet. Start the discussion.</p>
        )}
      </div>

      <form onSubmit={handleSend} className="chat-form">
        <input
          type="text"
          placeholder={projectId ? 'Type a message...' : 'Select a project to open chat'}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          disabled={!projectId}
        />
        <button type="submit" className="btn btn-primary" disabled={!canSend}>
          Send
        </button>
      </form>
    </section>
  );
};

export default ChatBox;

