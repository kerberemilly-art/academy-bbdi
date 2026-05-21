import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
      // Build brief chat history
      const history = messages
        .filter((msg) => msg.id !== 'welcome')
        .map((msg) => ({
          role: msg.role,
          content: msg.content
        }));

      const res = await fetch('http://127.0.0.1:8787/api/mentor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: userMessage.content,
          lessonContent,
          history
        })
      });

      const data = await res.json();

      if (data.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            role: 'assistant',
            content: data.response
          }
        ]);
      } else {
        throw new Error(data.error);
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
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            color: '#ffffff',
            border: 'none',
            padding: '0 18px',
            height: '48px',
            borderRadius: '999px',
            cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(139, 92, 246, 0.4)',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            fontWeight: '700',
            fontSize: '0.9rem',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(139, 92, 246, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(139, 92, 246, 0.4)';
          }}
        >
          <Sparkles size={18} />
          <span>Dúvidas? Pergunte à IA</span>
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '380px',
            height: '500px',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            background: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(139, 92, 246, 0.08))',
              borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <Sparkles size={16} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-primary)' }}>Mentor de Estudos</strong>
                <span style={{ display: 'block', fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>IA Online</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(0, 0, 0, 0.04)',
                border: 'none',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0, 0, 0, 0.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0, 0, 0, 0.04)')}
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages list */}
          <div
            style={{
              flex: 1,
              padding: '20px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    padding: '12px 16px',
                    borderRadius: isUser ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                    background: isUser ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(0, 0, 0, 0.04)',
                    color: isUser ? '#ffffff' : 'var(--text-primary)',
                    fontSize: '0.88rem',
                    lineHeight: '1.45',
                    boxShadow: isUser ? '0 4px 15px rgba(139, 92, 246, 0.15)' : 'none',
                  }}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                </div>
              );
            })}
            {loading && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  padding: '12px 16px',
                  borderRadius: '18px 18px 18px 2px',
                  background: 'rgba(0, 0, 0, 0.04)',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.88rem',
                }}
              >
                <Loader2 size={16} className="animate-spin" />
                <span>Mentor está pensando...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input form */}
          <form
            onSubmit={handleSend}
            style={{
              padding: '16px 20px',
              borderTop: '1px solid rgba(0, 0, 0, 0.06)',
              background: 'rgba(255, 255, 255, 0.5)',
              display: 'flex',
              gap: '10px',
            }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tire sua dúvida sobre esta tela..."
              disabled={loading}
              style={{
                flex: 1,
                padding: '0 16px',
                height: '42px',
                borderRadius: '999px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                background: '#ffffff',
                color: 'var(--text-primary)',
                outline: 'none',
                fontSize: '0.88rem',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#8b5cf6')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.1)')}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: inputValue.trim() ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(0,0,0,0.05)',
                color: inputValue.trim() ? '#ffffff' : 'var(--text-secondary)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputValue.trim() ? 'pointer' : 'default',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => {
                if (inputValue.trim()) e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(20px) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default StudyMentor;
