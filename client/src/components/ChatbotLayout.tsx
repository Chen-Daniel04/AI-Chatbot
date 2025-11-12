import React, { useState, KeyboardEvent, ChangeEvent } from "react";
import axios from "axios";
import chatbotBg from "../assets/chatbotBg.jpg";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Hello 👋! How can I help you today?" },
  ]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3010/api/chat", {
        userMessage: input,
      });

      const botReply =
        res.data.botReply || "Sorry, I didn't understand that.";
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Server error. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  // ---------- Compact Inline Styles ----------
  const styles: Record<string, React.CSSProperties> = {
    container: {
      minHeight: "100vh", 
      backgroundImage: `url(${chatbotBg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      position: "relative",
      padding: "20px",
      margin: 0,
    },
    chatbotBox: {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: 10,
      backgroundColor: "rgba(255, 255, 255, 0.97)",
      borderRadius: "20px",
      padding: "20px",
      width: "100%",
      maxWidth: "400px",
      height: "500px", // Reduced height
      boxShadow: `
        0 15px 35px rgba(0,0,0,0.2),
        0 5px 15px rgba(0,0,0,0.15)
      `,
      display: "flex",
      flexDirection: "column",
      border: "1px solid rgba(255,255,255,0.3)",
    },
    title: {
      fontSize: "18px",
      fontWeight: "700",
      textAlign: "center",
      margin: "0 0 15px 0",
      color: "#1a1a1a",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      paddingBottom: "10px",
      borderBottom: "1px solid rgba(0,120,255,0.1)",
    },
    chatArea: {
      flexGrow: 1,
      overflowY: "auto",
      padding: "12px",
      border: "1px solid rgba(0,0,0,0.08)",
      borderRadius: "12px",
      backgroundColor: "rgba(248, 250, 252, 0.8)",
      marginBottom: "12px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    message: {
      margin: 0,
      maxWidth: "85%",
      padding: "10px 14px",
      borderRadius: "16px",
      lineHeight: "1.4",
      wordWrap: "break-word",
      fontSize: "14px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    },
    userMsg: {
      backgroundColor: "#0078FF",
      color: "#fff",
      alignSelf: "flex-end",
      borderBottomRightRadius: "4px",
      background: "linear-gradient(135deg, #0078FF 0%, #0055CC 100%)",
    },
    botMsg: {
      backgroundColor: "#FFFFFF",
      color: "#333",
      alignSelf: "flex-start",
      borderBottomLeftRadius: "4px",
      border: "1px solid rgba(0,0,0,0.08)",
    },
    inputRow: {
      display: "flex",
      gap: "10px",
      alignItems: "center",
    },
    inputBox: {
      flexGrow: 1,
      padding: "12px 14px",
      border: "1px solid #E2E8F0",
      borderRadius: "10px",
      outline: "none",
      fontSize: "14px",
      backgroundColor: "rgba(255,255,255,0.9)",
      transition: "all 0.2s ease",
    },
    button: {
      backgroundColor: "#0078FF",
      color: "#fff",
      border: "none",
      borderRadius: "10px",
      padding: "12px 16px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "14px",
      transition: "all 0.2s ease",
      minWidth: "60px",
      flexShrink: 0,
    },
    typing: {
      fontStyle: "italic",
      color: "#64748B",
      fontSize: "12px",
      alignSelf: "flex-start",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      margin: 0,
    },
    typingDots: {
      display: "inline-flex",
      gap: "3px",
    },
    typingDot: {
      width: "3px",
      height: "3px",
      borderRadius: "50%",
      backgroundColor: "#64748B",
    },
  };

  return (
    <div style={styles.container}>

      <div style={styles.chatbotBox}>
        <h2 style={styles.title}>💬 Star City Assistant</h2>

        <div style={styles.chatArea} className="chat-area">
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                ...styles.message,
                ...(msg.sender === "user" ? styles.userMsg : styles.botMsg),
              }}
            >
              {msg.text}
            </div>
          ))}
          {loading && (
            <div style={styles.typing}>
              <span>Thinking</span>
              <div style={styles.typingDots}>
                <div style={{ ...styles.typingDot, animation: "bounce 1.4s infinite ease-in-out" }}></div>
                <div style={{ ...styles.typingDot, animation: "bounce 1.4s infinite ease-in-out 0.2s" }}></div>
                <div style={{ ...styles.typingDot, animation: "bounce 1.4s infinite ease-in-out 0.4s" }}></div>
              </div>
            </div>
          )}
        </div>

        <div style={styles.inputRow}>
          <input
            type="text"
            value={input}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setInput(e.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            style={styles.inputBox}
            onFocus={(e) => {
              e.target.style.borderColor = "#0078FF";
              e.target.style.boxShadow = "0 0 0 2px rgba(0,120,255,0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#E2E8F0";
              e.target.style.boxShadow = "none";
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            style={{
              ...styles.button,
              backgroundColor: loading ? "#94A3B8" : "#0078FF",
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = "#0055CC";
                e.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = "#0078FF";
                e.currentTarget.style.transform = "translateY(0)";
              }
            }}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes bounce {
            0%, 80%, 100% { 
              transform: translateY(0);
              opacity: 0.5;
            }
            40% { 
              transform: translateY(-3px);
              opacity: 1;
            }
          }
          
          .chat-area::-webkit-scrollbar {
            width: 4px;
          }
          
          .chat-area::-webkit-scrollbar-track {
            background: transparent;
          }
          
          .chat-area::-webkit-scrollbar-thumb {
            background: rgba(0,120,255,0.3);
            border-radius: 2px;
          }
        `}
      </style>
    </div>
  );
};

export default Chatbot;