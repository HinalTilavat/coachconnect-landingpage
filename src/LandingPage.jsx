import React, { useState, useEffect } from "react";
import { db, collection, addDoc, serverTimestamp, query, where, getDocs } from "../firebase";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [windowWidth, setWindowWidth] = useState(null);

  // Handle window resize for responsive design
  useEffect(() => {
    // Set initial width
    setWindowWidth(window.innerWidth);
    
    // Add event listener for resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      // Check if email already exists in the database
      const waitlistRef = collection(db, "waitlist");
      const q = query(waitlistRef, where("email", "==", email.toLowerCase().trim()));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Email already exists
        setError("This email is already on our waitlist. Thank you for your interest!");
        return;
      }
      
      // Add new email to waitlist
      await addDoc(waitlistRef, {
        email: email.toLowerCase().trim(),
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again later.");
    } finally {
      console.log("Email submission processed", email);
    }
  };

  // Determine if we're on mobile
  const isMobile = windowWidth !== null && windowWidth < 768;

  return (
    <div style={styles.page}>
      <header style={styles.hero}>
        <div style={styles.container}>
          <h1 style={isMobile ? {...styles.title, ...styles.titleMobile} : styles.title}>
            Run Your Fitness Coaching Business with Confidence and Ease
          </h1>
          <p style={isMobile ? {...styles.subtitle, ...styles.subtitleMobile} : styles.subtitle}>
            A powerful, all-in-one client management tool built for yoga instructors, fitness trainers, and wellness coaches who want more time coaching and less time on admin.
          </p>
          <a href="#waitlist" style={styles.ctaButton}>
            Join the Waitlist
          </a>
        </div>
      </header>

      <section style={styles.section}>
        <div style={styles.container}>
          <h2 style={isMobile ? {...styles.sectionTitle, ...styles.sectionTitleMobile} : styles.sectionTitle}>
            Is This You?
          </h2>
          <ul style={isMobile ? {...styles.list, ...styles.listMobile} : styles.list}>
            <li>📋 You track sessions and progress in scattered notebooks or spreadsheets</li>
            <li>📱 You rely on WhatsApp or DMs to follow up with clients</li>
            <li>⏱️ You spend hours each week manually scheduling sessions</li>
            <li>📉 You wish you had a better system to retain clients and show their progress</li>
          </ul>
        </div>
      </section>

      <section style={styles.sectionAlt}>
        <div style={styles.container}>
          <h2 style={isMobile ? {...styles.sectionTitle, ...styles.sectionTitleMobile} : styles.sectionTitle}>
            Built for Coaches Who Care
          </h2>
          <ul style={isMobile ? {...styles.list, ...styles.listMobile} : styles.list}>
            <li>✅ Quickly schedule and manage client sessions in one place</li>
            <li>✅ Track goals and progress over time — no more guesswork</li>
            <li>✅ Access all client data from your phone — anytime, anywhere</li>
            <li>✅ Spend more time doing what you love: coaching and transforming lives</li>
          </ul>
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.container}>
          <h2 style={isMobile ? {...styles.sectionTitle, ...styles.sectionTitleMobile} : styles.sectionTitle}>
            Why This Matters
          </h2>
          <p style={isMobile ? {...styles.subtitle, ...styles.subtitleMobile} : styles.subtitle}>
            You didn't become a coach to drown in admin or lose track of clients. 
            Whether you're running solo or scaling up, this tool helps you stay organized, 
            deliver a premium experience, and grow your business with less stress.
          </p>
        </div>
      </section>

      <section id="waitlist" style={styles.waitlist}>
        <div style={styles.container}>
          <h2 style={isMobile ? {...styles.sectionTitle, ...styles.sectionTitleMobile} : styles.sectionTitle}>
            Get Early Access
          </h2>
          <p style={isMobile ? {...styles.subtitle, ...styles.subtitleMobile} : styles.subtitle}>
            We're inviting a limited number of coaches to shape the future of this platform. 
            Join the waitlist — no spam, just updates and early access.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} style={isMobile ? {...styles.form, ...styles.formMobile} : styles.form}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={isMobile ? {...styles.input, ...styles.inputMobile} : styles.input}
              />
              <button type="submit" style={isMobile ? {...styles.button, ...styles.buttonMobile} : styles.button}>
                Join Now
              </button>
            </form>
          ) : (
            <p style={styles.thankYou}>✅ You're on the list! We'll keep you posted.</p>
          )}

          {error && <p style={styles.error}>{error}</p>}
        </div>
      </section>

      <footer style={styles.footer}>
        <div style={styles.container}>
          <p>
            Made with ❤️ for coaches who care about their clients — and their time.
          </p>
          <p>
            Have a question? <a href="mailto:coachconnectofficial@gmail.com" style={styles.link}>Contact us</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'Inter', sans-serif",
    backgroundColor: "#ffffff",
    color: "#1f2937",
    margin: 0,
    padding: 0,
    width: "100%",
    overflowX: "hidden",
  },
  container: {
    maxWidth: "960px",
    margin: "0 auto",
    padding: "0 1.5rem",
    width: "100%",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  hero: {
    backgroundColor: "#f0fdf4",
    padding: "60px 0",
    textAlign: "center",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
    color: "#065f46",
    lineHeight: 1.2,
  },
  titleMobile: {
    fontSize: "1.8rem",
    padding: "0 0.5rem",
  },
  subtitle: {
    fontSize: "1.125rem",
    color: "#4b5563",
    maxWidth: "640px",
    margin: "0 auto 1.5rem",
    lineHeight: 1.6,
  },
  subtitleMobile: {
    fontSize: "1rem",
    padding: "0 0.5rem",
  },
  ctaButton: {
    backgroundColor: "#10b981",
    color: "#ffffff",
    padding: "14px 28px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "1rem",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    display: "inline-block",
    marginTop: "0.5rem",
    transition: "background-color 0.3s ease",
    userSelect: "none",
    cursor: "pointer",
  },
  section: {
    padding: "50px 0",
  },
  sectionAlt: {
    padding: "50px 0",
    backgroundColor: "#f9fafb",
  },
  sectionTitle: {
    fontSize: "1.75rem",
    textAlign: "center",
    marginBottom: "1.5rem",
    color: "#065f46",
    lineHeight: 1.3,
  },
  sectionTitleMobile: {
    fontSize: "1.5rem",
    padding: "0 0.5rem",
  },
  list: {
    listStyle: "none",
    paddingLeft: 0,
    fontSize: "1.1rem",
    lineHeight: 1.8,
    maxWidth: "640px",
    margin: "0 auto",
  },
  listMobile: {
    fontSize: "1rem",
    lineHeight: 1.6,
    padding: "0 0.5rem",
  },
  waitlist: {
    backgroundColor: "#ecfdf5",
    padding: "60px 0",
  },
  form: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    marginTop: "1.5rem",
    width: "100%",
    maxWidth: "500px",
    margin: "1.5rem auto 0",
  },
  formMobile: {
    flexDirection: "column",
    gap: "0.75rem",
  },
  input: {
    width: "100%",
    padding: "14px",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  inputMobile: {
    maxWidth: "100%",
  },
  button: {
    backgroundColor: "#10b981",
    color: "#fff",
    fontSize: "1rem",
    padding: "14px 28px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    whiteSpace: "nowrap",
    transition: "background-color 0.3s ease",
  },
  buttonMobile: {
    width: "100%",
    padding: "12px",
  },
  thankYou: {
    color: "#10b981",
    fontWeight: "bold",
    marginTop: "1rem",
    fontSize: "1.1rem",
  },
  error: {
    color: "#dc2626",
    marginTop: "0.75rem",
    fontSize: "0.9rem",
    textAlign: "center",
    maxWidth: "400px",
    margin: "0.75rem auto 0",
  },
  footer: {
    padding: "40px 0",
    backgroundColor: "#f0fdf4",
    textAlign: "center",
    fontSize: "0.9rem",
    color: "#6b7280",
  },
  link: {
    color: "#10b981",
    textDecoration: "none",
    fontWeight: "500",
  }
};