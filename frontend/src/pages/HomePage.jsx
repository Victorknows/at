import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const [chatOpen, setChatOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([
    { from: "bot", text: "Hi! I'm HealthBot. Ask me anything about maternal health." }
  ]);
  const [input, setInput] = React.useState("");
  const [typing, setTyping] = React.useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const lowerInput = input.trim().toLowerCase();
      let botText = "Sorry, I couldn't understand that.";

      if (lowerInput === "hello") {
        botText = "How may I help you?";
      } else if (lowerInput.includes("back") && lowerInput.includes("hurts")) {
        botText = "You should consider visiting a clinic for a check-up.";
      }

      const botReply = { from: "bot", text: botText };
      setMessages((prev) => [...prev, botReply]);
      setTyping(false);
    }, 5000);
  };

  const styles = {
    app: { fontFamily: "'Inter', sans-serif" },
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 2rem",
      backgroundColor: "#fff",
      borderBottom: "1px solid #eee",
      position: "sticky",
      top: 0,
      zIndex: 10,
    },
    navLogo: { fontSize: "1.5rem", fontWeight: "800", color: "#1e3a8a" },
    navMenu: { display: "flex", alignItems: "center", gap: "1.5rem" },
    navLink: {
      color: "#374151",
      textDecoration: "none",
      fontWeight: "500",
    },
    navBtn: {
      padding: "0.5rem 1rem",
      backgroundColor: "#1e3a8a",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    hero: {
      position: "relative",
      height: "100vh",
      backgroundImage: `url('https://i.pinimg.com/736x/7b/04/f9/7b04f9dd449357fdb285de5aeb86d5f4.jpg')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
    },
    heroOverlay: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      zIndex: 1,
    },
    heroContent: {
      position: "relative",
      zIndex: 2,
      color: "white",
    },
    heroTitle: { fontSize: "3rem", fontWeight: "900", marginBottom: "1rem" },
    heroTagline: {
      fontSize: "1.25rem",
      marginBottom: "2rem",
      fontWeight: "400",
    },
    section: { padding: "4rem 2rem", textAlign: "center" },
    sectionTitle: { fontSize: "2rem", marginBottom: "2rem", color: "#1f2937" },
    featuresGrid: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: "2rem",
    },
    featureCard: {
      maxWidth: "300px",
      padding: "2rem",
      backgroundColor: "#f9fafb",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    },
    featureIcon: { fontSize: "2rem", marginBottom: "1rem" },
    cta: {
      backgroundColor: "#1e3a8a",
      color: "white",
      padding: "4rem 2rem",
      textAlign: "center",
    },
    footer: { backgroundColor: "#111827", color: "#fff", padding: "2rem" },
    footerGrid: {
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "2rem",
      marginBottom: "2rem",
    },
    footerSection: { flex: "1", minWidth: "150px" },
    footerBottom: {
      textAlign: "center",
      borderTop: "1px solid #4b5563",
      paddingTop: "1rem",
      fontSize: "0.875rem",
    },
    chatBot: {
      position: "fixed",
      bottom: "1.5rem",
      right: "1.5rem",
      zIndex: 50,
    },
    chatButton: {
      backgroundColor: "#2563eb",
      color: "#fff",
      border: "none",
      borderRadius: "50%",
      width: "60px",
      height: "60px",
      fontSize: "1.5rem",
      cursor: "pointer",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    chatBox: {
      width: "300px",
      height: "400px",
      backgroundColor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      display: "flex",
      flexDirection: "column",
    },
    chatHeader: {
      backgroundColor: "#1e3a8a",
      color: "#fff",
      padding: "0.75rem",
      borderTopLeftRadius: "12px",
      borderTopRightRadius: "12px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    closeBtn: {
      background: "none",
      color: "#fff",
      border: "none",
      fontSize: "1.2rem",
      cursor: "pointer",
    },
    chatMessages: {
      flex: 1,
      padding: "1rem",
      overflowY: "auto",
      backgroundColor: "#f9fafb",
    },
    chatForm: {
      display: "flex",
      borderTop: "1px solid #e5e7eb",
    },
    chatInput: {
      flex: 1,
      padding: "0.75rem",
      border: "none",
      outline: "none",
    },
    chatSend: {
      padding: "0.75rem 1rem",
      backgroundColor: "#2563eb",
      color: "#fff",
      border: "none",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.app}>
      <nav style={styles.navbar}>
        <div style={styles.navLogo}>MumConnect</div>
        <div style={styles.navMenu}>
          <a href="#about" style={styles.navLink}>About</a>
          <a href="#services" style={styles.navLink}>Services</a>
          <a href="#contact" style={styles.navLink}>Contact</a>
          <button style={styles.navBtn}>Get Started</button>
        </div>
      </nav>

      <section style={styles.hero}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>MAMAConnect</h1>
          <p style={styles.heroTagline}>
            Bridging the gap between Mothers, Doctors, and Emergency Services
          </p>
        </div>
      </section>

      <section style={styles.section} id="services">
        <h2 style={styles.sectionTitle}>Comprehensive Maternal Care</h2>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🤱</div>
            <h3>24/7 Support</h3>
            <p>Round-the-clock access to healthcare professionals and emergency services</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>👩‍⚕️</div>
            <h3>Expert Network</h3>
            <p>Connect with specialized maternal health doctors and specialists</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📱</div>
            <h3>Easy Access</h3>
            <p>Simple, intuitive platform designed for mothers and healthcare providers</p>
          </div>
        </div>
      </section>

      <section style={styles.cta} id="contact">
        <h2>Ready to Connect?</h2>
        <p>Join thousands of mothers who trust MumConnect for their healthcare needs</p>
        <button style={styles.navBtn}>Get Started Today</button>
      </section>

      <footer style={styles.footer}>
        <div style={styles.footerGrid}>
          <div style={styles.footerSection}>
            <h3>MAMAConnect</h3>
            <p>Connecting mothers with the care they deserve</p>
          </div>
          <div style={styles.footerSection}>
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#about" style={{ color: "#9ca3af" }}>About</a></li>
              <li><a href="#services" style={{ color: "#9ca3af" }}>Services</a></li>
              <li><a href="#contact" style={{ color: "#9ca3af" }}>Contact</a></li>
            </ul>
          </div>
          <div style={styles.footerSection}>
            <h4>Support</h4>
            <ul>
              <li><a href="#help" style={{ color: "#9ca3af" }}>Help Center</a></li>
              <li><a href="#emergency" style={{ color: "#9ca3af" }}>Emergency</a></li>
              <li><a href="#privacy" style={{ color: "#9ca3af" }}>Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p>&copy; 2025 MAMAConnect. All rights reserved.</p>
        </div>
      </footer>

      {/* Chat Bot */}
      <div style={styles.chatBot}>
        {!chatOpen ? (
          <button style={styles.chatButton} onClick={() => setChatOpen(true)}>💬</button>
        ) : (
          <div style={styles.chatBox}>
            <div style={styles.chatHeader}>
              <span>HealthBot</span>
              <button style={styles.closeBtn} onClick={() => setChatOpen(false)}>×</button>
            </div>
            <div style={styles.chatMessages}>
              {messages.map((msg, i) => (
                <div key={i} style={{ textAlign: msg.from === "user" ? "right" : "left", marginBottom: "0.5rem" }}>
                  <div style={{
                    display: "inline-block",
                    padding: "0.5rem 1rem",
                    borderRadius: "12px",
                    backgroundColor: msg.from === "user" ? "#2563eb" : "#f3f4f6",
                    color: msg.from === "user" ? "#fff" : "#111827"
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div style={{ textAlign: "left", marginBottom: "0.5rem" }}>
                  <div style={{
                    display: "inline-block",
                    padding: "0.5rem 1rem",
                    borderRadius: "12px",
                    backgroundColor: "#f3f4f6",
                    color: "#111827",
                    fontStyle: "italic",
                    opacity: 0.8
                  }}>
                    HealthBot is typing...
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={handleSend} style={styles.chatForm}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about maternal health..."
                style={styles.chatInput}
              />
              <button type="submit" style={styles.chatSend}>Send</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
