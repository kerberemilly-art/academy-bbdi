import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './StudyMentor.css';

const MENTOR_API_URL = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '')}/mentor`
  : '/api/mentor';

const StudyMentor = ({ lessonContent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Olá! Sou o seu **Mentor de Estudos IA da BBDI**. 🤖📖\n\nEstou aqui para te ajudar a tirar qualquer dúvida sobre esta aula em tempo real. O que você gostaria de esclarecer?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userMessage = {
      id: String(Date.now()),
      role: 'user',
      content: inputValue.trim()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const history = messages
        .filter((msg) => msg.id !== 'welcome')
        .map((msg) => ({
          role: msg.role,
          content: msg.content
        }));

      const res = await fetch(MENTOR_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: userMessage.content,
          lessonContent: lessonContent || '',
          history: history.slice(-6)
        })
      });

      const rawResponse = await res.text();
      let data = {};
      try {
        data = rawResponse ? JSON.parse(rawResponse) : {};
      } catch {
        data = { ok: false, error: rawResponse || 'Resposta inválida do servidor.' };
      }

      if (res.ok && data.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            role: 'assistant',
            content: data.response
          }
        ]);
      } else {
        throw new Error(data.error || 'Não foi possível consultar a IA agora.');
      }
    } catch (error) {
      console.error('Mentor fetch error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: 'Ops, tive um probleminha para processar sua mensagem. Por favor, tente novamente!'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="study-mentor-root">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          type="button"
          className="study-mentor-toggle"
          onClick={() => setIsOpen(true)}
        >
          <Sparkles size={18} />
          <span>Dúvidas? Pergunte à IA</span>
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div
          className="glass-panel"
          className="study-mentor-window"
        >
          {/* Header */}
          <div
            className="study-mentor-header"
          >
            <div className="study-mentor-title">
              <div
                className="study-mentor-badge"
              >
                <Sparkles size={16} />
              </div>
              <div className="study-mentor-title-copy">
                <strong>Mentor de Estudos</strong>
                <span>IA Online</span>
              </div>
            </div>
            <button
              type="button"
              className="study-mentor-close"
              onClick={() => setIsOpen(false)}
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages list */}
          <div className="study-mentor-messages">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`study-mentor-bubble ${isUser ? 'is-user' : 'is-assistant'}`}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                </div>
              );
            })}
            {loading && (
              <div className="study-mentor-loading">
                <Loader2 size={16} className="animate-spin" />
                <span>Mentor está pensando...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input form */}
          <form
            onSubmit={handleSend}
            className="study-mentor-form"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tire sua dúvida sobre esta tela..."
              disabled={loading}
              className="study-mentor-input"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="study-mentor-send"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default StudyMentor;
