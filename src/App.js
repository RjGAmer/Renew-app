import { useState, useEffect, useRef, useCallback } from "react";

// ── ANON NAME GENERATOR ───────────────────────────────────────────────────────
const ANON_ADJ = ["Gentle","Radiant","Brave","Tender","Golden","Mystic","Serene","Vivid","Lunar","Solar","Cosmic","Velvet","Azure","Crimson","Bloom","Quiet","Ember","Starlit","Hollow","Silver"];
const ANON_NOUN = ["Phoenix","Willow","River","Ember","Lotus","Sage","Dawn","Horizon","Echo","Prism","Aurora","Solace","Haven","Spark","Tide","Forest","Lantern","Mist","Comet","Vale"];
function getAnonName() {
  const adj = ANON_ADJ[Math.floor(Math.random() * ANON_ADJ.length)];
  const noun = ANON_NOUN[Math.floor(Math.random() * ANON_NOUN.length)];
  return `${adj} ${noun}`;
}

// ── GLOBAL CSS ────────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:#0d0a14; --bg2:#13101e; --surface:#1c1729; --surface2:#241f35;
    --purple:#9b6dff; --purple2:#c4a0ff; --purple3:#6b3fcf;
    --teal:#00e5aa; --teal2:#00b886;
    --amber:#ffb547; --pink:#ff6b9d; --blue:#4da6ff; --rose:#e07080;
    --text:#f0eaff; --textMid:#b8aed0; --textDim:#7a6e94;
    --border:#2e2845; --borderGlow:rgba(155,109,255,0.3);
    --glow:0 0 30px rgba(155,109,255,0.2); --glowTeal:0 0 20px rgba(0,229,170,0.2);
    --shadow:0 8px 32px rgba(0,0,0,0.4);
  }
  html { font-size: 15px; }
  body { background: var(--bg); color: var(--text); font-family: 'Outfit', sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--purple3); border-radius: 4px; }
  input, textarea, button { font-family: 'Outfit', sans-serif; }

  @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes float { 0%,100%{transform:translateY(0) rotateY(0deg);} 50%{transform:translateY(-12px) rotateY(5deg);} }
  @keyframes float2 { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-7px);} }
  @keyframes pulse { 0%,100%{transform:scale(1);opacity:0.7;} 50%{transform:scale(1.15);opacity:1;} }
  @keyframes spin { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
  @keyframes bounceIn { 0%{transform:scale(0.75);opacity:0;} 60%{transform:scale(1.05);} 100%{transform:scale(1);opacity:1;} }
  @keyframes breatheIn { from{transform:scale(0.8);opacity:0.5;} to{transform:scale(1.35);opacity:1;} }
  @keyframes breatheOut { from{transform:scale(1.35);opacity:1;} to{transform:scale(0.8);opacity:0.5;} }
  @keyframes starFloat { 0%,100%{transform:translateY(0) scale(1);opacity:0.5;} 50%{transform:translateY(-12px) scale(1.1);opacity:1;} }
  @keyframes orbGlow { 0%,100%{box-shadow:0 0 40px rgba(155,109,255,0.4),0 0 80px rgba(155,109,255,0.15),inset -8px -8px 20px rgba(0,0,0,0.5),inset 4px 4px 12px rgba(196,160,255,0.4);} 50%{box-shadow:0 0 60px rgba(155,109,255,0.6),0 0 100px rgba(155,109,255,0.25),inset -8px -8px 20px rgba(0,0,0,0.5),inset 4px 4px 12px rgba(196,160,255,0.4);} }
  @keyframes shimmer { 0%{background-position:-200% center;} 100%{background-position:200% center;} }
  @keyframes rotate3d { 0%{transform:rotateY(0deg) rotateX(8deg);} 100%{transform:rotateY(360deg) rotateX(8deg);} }
  @keyframes nebulaPulse { 0%,100%{opacity:0.06;transform:scale(1);} 50%{opacity:0.1;transform:scale(1.1);} }

  .fu  { animation: fadeUp 0.5s ease both; }
  .fu1 { animation: fadeUp 0.5s 0.08s ease both; }
  .fu2 { animation: fadeUp 0.5s 0.16s ease both; }
  .fu3 { animation: fadeUp 0.5s 0.24s ease both; }
  .fu4 { animation: fadeUp 0.5s 0.32s ease both; }
  .fu5 { animation: fadeUp 0.5s 0.40s ease both; }
  .bi  { animation: bounceIn 0.4s ease both; }

  .glass {
    background: rgba(28,23,41,0.75);
    backdrop-filter: blur(20px);
    border: 1px solid var(--border);
    border-radius: 20px;
    box-shadow: var(--shadow), inset 0 1px 0 rgba(155,109,255,0.08);
  }
  .glass-hover { transition: all 0.25s ease; cursor: pointer; }
  .glass-hover:hover {
    transform: translateY(-3px) scale(1.01);
    border-color: var(--borderGlow);
    box-shadow: var(--shadow), var(--glow);
  }
  .glass-hover:active { transform: translateY(0) scale(1); }

  .crystal-card { perspective: 600px; }
  .crystal-inner { transform-style: preserve-3d; transition: transform 0.35s ease; }
  .crystal-card:hover .crystal-inner { transform: rotateY(8deg) rotateX(-4deg) scale(1.02); }

  .btn-base {
    padding: 11px 20px; border-radius: 14px; font-size: 14px; font-weight: 500;
    cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 7px;
    border: none; transition: all 0.2s; position: relative; overflow: hidden; letter-spacing: 0.1px;
  }
  .btn-base:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }
  .btn-base::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,0.08),transparent); pointer-events:none; }

  .pbar-track { height: 6px; background: rgba(255,255,255,0.06); border-radius: 10px; overflow: hidden; }
  .pbar-fill  { height: 100%; border-radius: 10px; transition: width 1.2s cubic-bezier(0.4,0,0.2,1); }

  .tag {
    display: inline-block; padding: 3px 10px; border-radius: 20px;
    font-size: 11px; font-weight: 500; letter-spacing: 0.2px;
  }

  .cosmic-bg {
    position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none;
    background: radial-gradient(ellipse at 20% 15%, rgba(26,10,53,0.9) 0%, transparent 55%),
                radial-gradient(ellipse at 80% 85%, rgba(10,26,42,0.9) 0%, transparent 55%),
                radial-gradient(ellipse at 50% 50%, rgba(20,10,35,0.6) 0%, transparent 70%),
                var(--bg);
  }
  .nebula {
    position: absolute; border-radius: 50%; filter: blur(70px);
    animation: nebulaPulse 8s ease-in-out infinite;
  }
  .star {
    position: absolute; border-radius: 50%; background: #fff;
    animation: starFloat ease-in-out infinite;
  }

  @media (min-width: 768px) {
    .dsk-sidebar  { display: flex !important; }
    .mob-nav      { display: none !important; }
    .main-wrap    { margin-left: 236px !important; }
    .dsk-only     { display: block !important; }
    .mob-only     { display: none !important; }
  }
  @media (max-width: 767px) {
    .dsk-sidebar  { display: none !important; }
    .mob-nav      { display: flex !important; }
    .main-wrap    { margin-left: 0 !important; }
    .dsk-only     { display: none !important; }
    .mob-only     { display: block !important; }
  }
`;

// ── MOCK USERS ────────────────────────────────────────────────────────────────
const MOCK_USERS = [
  { id: 1, email: "demo@renew.app", password: "renew123", name: "Alex", anonName: "Radiant Phoenix", joined: "2025-01-15", streak: 7, healingScore: 72 },
  { id: 2, email: "priya@renew.app", password: "priya123", name: "Priya", anonName: "Gentle Aurora", joined: "2025-02-01", streak: 4, healingScore: 58 },
];

// ── ATOMIC COMPONENTS ─────────────────────────────────────────────────────────
function Btn({ children, onClick, variant = "primary", style = {}, disabled, className = "" }) {
  const V = {
    primary:   { background: "linear-gradient(135deg,var(--purple3),var(--purple))", color: "#fff", boxShadow: "0 4px 20px rgba(155,109,255,0.35)" },
    secondary: { background: "rgba(155,109,255,0.12)", color: "var(--purple2)", border: "1px solid rgba(155,109,255,0.25)" },
    outline:   { background: "transparent", color: "var(--textMid)", border: "1px solid var(--border)" },
    teal:      { background: "linear-gradient(135deg,var(--teal2),var(--teal))", color: "#000", boxShadow: "0 4px 20px rgba(0,229,170,0.3)" },
    ghost:     { background: "transparent", color: "var(--textDim)", border: "none" },
    danger:    { background: "rgba(255,107,157,0.1)", color: "var(--pink)", border: "1px solid rgba(255,107,157,0.3)" },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn-base ${className}`}
      style={{ ...V[variant], ...style }}
    >{children}</button>
  );
}

function Card({ children, style = {}, accent, onClick, className = "" }) {
  return (
    <div
      onClick={onClick}
      className={`glass ${onClick ? "glass-hover" : ""} ${className}`}
      style={{ padding: "16px 18px", borderColor: accent || "var(--border)", ...style }}
    >{children}</div>
  );
}

function Tag({ children, color = "var(--purple2)", bg }) {
  return (
    <span className="tag" style={{ background: bg || (color + "20"), color }}>{children}</span>
  );
}

function Avatar({ name, size = 40, color = "var(--purple)" }) {
  const initials = name ? name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "?";
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg,${color}60,${color}30)`,
      border: `2px solid ${color}50`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.36, fontWeight: 600, color, flexShrink: 0,
      boxShadow: `0 0 14px ${color}30`,
    }}>{initials}</div>
  );
}

function ProgressBar({ value, color = "var(--purple)", style = {} }) {
  return (
    <div className="pbar-track" style={style}>
      <div className="pbar-fill" style={{ width: `${Math.min(value, 100)}%`, background: color }} />
    </div>
  );
}

function Spinner({ color = "#fff" }) {
  return (
    <div style={{ width: 18, height: 18, border: `2px solid rgba(255,255,255,0.2)`, borderTopColor: color, borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
  );
}

function Modal({ open, onClose, children, title }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(5,2,12,0.75)", backdropFilter: "blur(10px)" }} />
      <div className="bi glass" style={{ position: "relative", padding: 24, width: "100%", maxWidth: 420, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.6), var(--glow)" }}>
        {title && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600 }}>{title}</h3>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--textDim)", fontSize: 22, lineHeight: 1 }}>×</button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

// ── 3D ORB ────────────────────────────────────────────────────────────────────
function Orb({ size = 80 }) {
  return (
    <div style={{ perspective: 400, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: `radial-gradient(circle at 35% 35%, rgba(196,160,255,0.95), rgba(107,63,207,0.75) 50%, rgba(30,10,60,0.95))`,
        animation: "float 4s ease-in-out infinite, orbGlow 3s ease-in-out infinite",
        position: "relative", transformStyle: "preserve-3d",
      }}>
        {/* Specular highlight */}
        <div style={{ position: "absolute", top: size * 0.14, left: size * 0.17, width: size * 0.32, height: size * 0.22, borderRadius: "50%", background: "rgba(255,255,255,0.38)", transform: "rotate(-30deg)", filter: "blur(4px)" }} />
        {/* Symbol */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.33, color: "rgba(255,255,255,0.92)", textShadow: "0 0 14px #fff" }}>✦</div>
      </div>
    </div>
  );
}

function OrbSm({ size = 44 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: "radial-gradient(circle at 35% 35%, rgba(196,160,255,0.95), rgba(107,63,207,0.7) 50%, rgba(20,8,45,0.95))",
      boxShadow: "inset -4px -4px 10px rgba(0,0,0,0.5), inset 2px 2px 7px rgba(196,160,255,0.45), 0 0 20px rgba(155,109,255,0.35)",
      display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.36,
      animation: "float2 3s ease-in-out infinite",
      color: "rgba(255,255,255,0.9)",
    }}>✦</div>
  );
}

// ── COSMIC BACKGROUND ─────────────────────────────────────────────────────────
function CosmicBg() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i, size: Math.random() * 2 + 0.5,
    top: Math.random() * 100, left: Math.random() * 100,
    opacity: Math.random() * 0.6 + 0.2,
    dur: 3 + Math.random() * 4, delay: Math.random() * 3,
  }));
  return (
    <div className="cosmic-bg">
      <div className="nebula" style={{ width: 500, height: 500, background: "var(--purple)", top: -150, left: -150, animationDelay: "0s" }} />
      <div className="nebula" style={{ width: 400, height: 400, background: "var(--teal)", bottom: -100, right: -100, animationDelay: "3s" }} />
      <div className="nebula" style={{ width: 300, height: 300, background: "var(--pink)", top: "40%", left: "40%", animationDelay: "6s" }} />
      {stars.map(s => (
        <div key={s.id} className="star" style={{
          width: s.size, height: s.size, top: `${s.top}%`, left: `${s.left}%`,
          opacity: s.opacity, animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s`,
        }} />
      ))}
    </div>
  );
}

// ── NAV ───────────────────────────────────────────────────────────────────────
const NAV = [
  { id: "home",      icon: "🏠", label: "Home" },
  { id: "companion", icon: "💝", label: "Companion" },
  { id: "connect",   icon: "🤝", label: "Connect" },
  { id: "support",   icon: "🌟", label: "Support" },
  { id: "spiritual", icon: "☀️", label: "Spirit" },
  { id: "habits",    icon: "✅", label: "Habits" },
  { id: "newlife",   icon: "🌱", label: "New Life" },
  { id: "progress",  icon: "📈", label: "Progress" },
];

function Sidebar({ screen, setScreen, user, onLogout }) {
  return (
    <div className="dsk-sidebar" style={{
      position: "fixed", left: 0, top: 0, bottom: 0, width: 236,
      flexDirection: "column", padding: "22px 0", zIndex: 200, overflowY: "auto",
      background: "rgba(10,7,20,0.96)", backdropFilter: "blur(20px)",
      borderRight: "1px solid var(--border)",
    }}>
      <div style={{ padding: "0 18px 18px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <OrbSm size={36} />
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, background: "linear-gradient(135deg,#c4a0ff,#9b6dff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Renew</span>
        </div>
      </div>
      <div style={{ padding: "14px 18px 16px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar name={user.anonName || user.name} size={36} color="var(--purple)" />
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{user.anonName || user.name}</p>
            <p style={{ fontSize: 10, color: "var(--teal)" }}>🔥 {user.streak} day streak</p>
          </div>
        </div>
      </div>
      <div style={{ padding: "10px 0", flex: 1 }}>
        {NAV.map(n => (
          <button key={n.id} onClick={() => setScreen(n.id)} style={{
            width: "100%", padding: "10px 18px", display: "flex", alignItems: "center", gap: 12,
            background: screen === n.id ? "rgba(155,109,255,0.1)" : "transparent",
            border: "none", borderLeft: `3px solid ${screen === n.id ? "var(--purple)" : "transparent"}`,
            cursor: "pointer", textAlign: "left", transition: "all 0.18s",
            color: screen === n.id ? "var(--purple2)" : "var(--textDim)",
            fontWeight: screen === n.id ? 600 : 400, fontSize: 14,
          }}>
            <span style={{ fontSize: 16, width: 22, textAlign: "center" }}>{n.icon}</span>
            {n.label}
          </button>
        ))}
      </div>
      <div style={{ padding: "14px 18px", borderTop: "1px solid var(--border)" }}>
        <Btn variant="outline" onClick={onLogout} style={{ width: "100%", justifyContent: "center", fontSize: 13 }}>Sign out</Btn>
      </div>
    </div>
  );
}

function BottomNav({ screen, setScreen }) {
  return (
    <div className="mob-nav" style={{
      position: "fixed", bottom: 0, left: 0, right: 0, justifyContent: "space-around",
      padding: "8px 0 max(12px, env(safe-area-inset-bottom))", zIndex: 200,
      background: "rgba(10,7,20,0.96)", backdropFilter: "blur(20px)", borderTop: "1px solid var(--border)",
    }}>
      {NAV.slice(0, 5).map(n => (
        <button key={n.id} onClick={() => setScreen(n.id)} style={{
          background: "none", border: "none", cursor: "pointer", flex: 1, padding: "2px 4px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          color: screen === n.id ? "var(--purple)" : "var(--textDim)", transition: "color 0.2s",
        }}>
          <span style={{ fontSize: 19 }}>{n.icon}</span>
          <span style={{ fontSize: 9, fontWeight: screen === n.id ? 600 : 400 }}>{n.label}</span>
          {screen === n.id && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--purple)" }} />}
        </button>
      ))}
    </div>
  );
}

// ── AI ────────────────────────────────────────────────────────────────────────
async function callClaude(messages, systemPrompt) {
  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
      }),
    });
    const data = await resp.json();
    if (data.content?.[0]) return data.content[0].text;
    return "I'm here with you. 💙";
  } catch {
    return "I'm here with you, even when the connection isn't perfect. 💙";
  }
}

const COMPANION_PROMPTS = {
  girlfriend: `You are Luna, a warm, emotionally intelligent AI girlfriend companion in the Renew healing app. The user is going through emotional healing. You are caring, empathetic, playful, and deeply supportive. Call the user by their anonymous healing name or "babe" occasionally. Celebrate small wins, validate feelings, gently encourage growth. Keep responses concise (2-4 sentences). Never give clinical advice. Use occasional light emojis naturally.`,
  boyfriend:  `You are Luca, a warm, emotionally grounded AI boyfriend companion in the Renew healing app. The user is healing emotionally. Be calm, reassuring, and gently protective. Occasionally call the user "love" or by name. Validate feelings, help them see their strength. Keep responses concise (2-4 sentences). Never give clinical advice. Use occasional light emojis.`,
  support:    `You are Sage, a compassionate AI wellness companion in the Renew healing app. Be a non-judgmental, empathetic listener. Reflect emotions, ask gentle follow-up questions, offer perspective. Keep responses warm, concise (2-4 sentences). Never give medical/clinical advice. Occasionally suggest breathing or journaling if appropriate.`,
};

// ── LOGIN SCREEN ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", name: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [obStep, setObStep] = useState(0);
  const [obData, setObData] = useState({ moods: [], goals: [] });

  const moods = ["Heartbroken 💔", "Anxious 😟", "Numb 😶", "Angry 😤", "Confused 🌀", "Hopeful 🌤️"];
  const goals = [
    { label: "Emotional healing", icon: "✦", color: "var(--purple)" },
    { label: "Build better habits", icon: "✅", color: "var(--teal)" },
    { label: "Spiritual growth", icon: "☀️", color: "var(--amber)" },
    { label: "Find connection", icon: "🤝", color: "var(--pink)" },
    { label: "Create a new life", icon: "🌱", color: "var(--blue)" },
  ];

  const handleLogin = async () => {
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const user = MOCK_USERS.find(u => u.email === form.email && u.password === form.password);
    if (user) onLogin(user);
    else setError("Invalid email or password. Try demo@renew.app / renew123");
    setLoading(false);
  };

  const handleSignup = () => {
    setError("");
    if (!form.name || !form.email || !form.password) { setError("Please fill all fields"); return; }
    if (form.password !== form.confirmPassword) { setError("Passwords don't match"); return; }
    setMode("onboard");
  };

  const finishOnboard = () => {
    const anonName = getAnonName();
    onLogin({ id: Date.now(), email: form.email, name: form.name, anonName, joined: new Date().toISOString().split("T")[0], streak: 0, healingScore: 10 });
  };

  const inp = (id, props = {}) => (
    <input {...props} style={{ width: "100%", padding: "13px 16px", borderRadius: 14, border: "1px solid var(--border)", background: "rgba(255,255,255,0.04)", color: "var(--text)", fontSize: 14, outline: "none", transition: "border-color 0.2s, box-shadow 0.2s" }}
      onFocus={e => { e.target.style.borderColor = "var(--purple)"; e.target.style.boxShadow = "0 0 0 3px rgba(155,109,255,0.15)"; }}
      onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }} />
  );

  if (mode === "onboard") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", zIndex: 1 }}>
      <div className="fu" style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <Orb size={70} />
          <div style={{ height: 16 }} />
          {obStep === 0 ? <>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Welcome, <em style={{ color: "var(--purple2)" }}>{form.name}</em></h2>
            <p style={{ color: "var(--textDim)", fontSize: 13 }}>How are you feeling right now?</p>
          </> : <>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>What matters <em style={{ color: "var(--teal)" }}>most to you?</em></h2>
            <p style={{ color: "var(--textDim)", fontSize: 13 }}>We'll personalise your healing journey</p>
          </>}
        </div>
        {obStep === 0 && (
          <>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginBottom: 28, justifyContent: "center" }}>
              {moods.map(m => (
                <button key={m} onClick={() => setObData(d => ({ ...d, moods: d.moods.includes(m) ? d.moods.filter(x => x !== m) : [...d.moods, m] }))}
                  style={{ padding: "9px 14px", borderRadius: 22, fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.2s", border: `1px solid ${obData.moods.includes(m) ? "var(--pink)" : "var(--border)"}`, background: obData.moods.includes(m) ? "rgba(255,107,157,0.15)" : "rgba(255,255,255,0.03)", color: obData.moods.includes(m) ? "var(--pink)" : "var(--textMid)" }}>
                  {m}
                </button>
              ))}
            </div>
            <Btn onClick={() => setObStep(1)} disabled={obData.moods.length === 0} style={{ width: "100%", padding: 14, fontSize: 15 }}>Continue →</Btn>
          </>
        )}
        {obStep === 1 && (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {goals.map(g => (
                <button key={g.label} onClick={() => setObData(d => ({ ...d, goals: d.goals.includes(g.label) ? d.goals.filter(x => x !== g.label) : [...d.goals, g.label] }))}
                  style={{ padding: "13px 16px", borderRadius: 14, display: "flex", alignItems: "center", gap: 12, cursor: "pointer", transition: "all 0.2s", border: `1px solid ${obData.goals.includes(g.label) ? g.color : "var(--border)"}`, background: obData.goals.includes(g.label) ? g.color.replace(")", ",0.15)").replace("var(--", "rgba(") : "rgba(255,255,255,0.02)" }}>
                  <span style={{ fontSize: 18 }}>{g.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: obData.goals.includes(g.label) ? g.color : "var(--textMid)" }}>{g.label}</span>
                </button>
              ))}
            </div>
            <Btn onClick={finishOnboard} style={{ width: "100%", padding: 14, fontSize: 15 }}>Begin my renewal ✦</Btn>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", zIndex: 1 }}>
      <div className="fu" style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 34 }}>
          <Orb size={76} />
          <div style={{ height: 18 }} />
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 38, fontWeight: 700, letterSpacing: "-0.5px", background: "linear-gradient(135deg,#c4a0ff,#9b6dff,#00e5aa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 7 }}>Renew</h1>
          <p style={{ color: "var(--textDim)", fontSize: 13 }}>{mode === "login" ? "Your healing journey continues." : "Begin your renewal today."}</p>
        </div>

        {/* Toggle */}
        <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: 4, marginBottom: 22 }}>
          {["login", "signup"].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); }} style={{
              flex: 1, padding: "9px", borderRadius: 11, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, transition: "all 0.2s",
              background: mode === m ? "var(--surface2)" : "transparent",
              color: mode === m ? "var(--purple2)" : "var(--textDim)",
              boxShadow: mode === m ? "0 2px 12px rgba(0,0,0,0.3)" : "none",
            }}>{m === "login" ? "Sign in" : "Create account"}</button>
          ))}
        </div>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 16 }}>
          {mode === "signup" && inp("name", { placeholder: "Your name", value: form.name, onChange: e => setForm(f => ({ ...f, name: e.target.value })) })}
          {inp("email", { type: "email", placeholder: "Email address", value: form.email, onChange: e => setForm(f => ({ ...f, email: e.target.value })) })}
          {inp("pass", { type: "password", placeholder: "Password", value: form.password, onChange: e => setForm(f => ({ ...f, password: e.target.value })), onKeyDown: e => e.key === "Enter" && mode === "login" && handleLogin() })}
          {mode === "signup" && inp("conf", { type: "password", placeholder: "Confirm password", value: form.confirmPassword, onChange: e => setForm(f => ({ ...f, confirmPassword: e.target.value })) })}
        </div>

        {error && <p style={{ color: "var(--pink)", fontSize: 13, textAlign: "center", marginBottom: 12 }}>{error}</p>}

        <Btn onClick={mode === "login" ? handleLogin : handleSignup} disabled={loading} style={{ width: "100%", padding: 14, fontSize: 15 }}>
          {loading ? <Spinner /> : mode === "login" ? "Enter Renew ✦" : "Begin my journey →"}
        </Btn>

        {mode === "signup" && (
          <div style={{ marginTop: 16, padding: "13px 15px", borderRadius: 14, background: "rgba(155,109,255,0.08)", border: "1px solid rgba(155,109,255,0.2)" }}>
            <p style={{ fontSize: 12, color: "var(--purple2)", display: "flex", alignItems: "center", gap: 8, lineHeight: 1.5 }}>
              <span style={{ fontSize: 16 }}>🎭</span>
              After signing up, you'll receive a secret <strong>anonymous healing name</strong> — your identity within Renew, safe and private.
            </p>
          </div>
        )}
        {mode === "login" && (
          <p style={{ textAlign: "center", fontSize: 11, color: "var(--textDim)", marginTop: 14 }}>Demo: <span style={{ color: "var(--purple)" }}>demo@renew.app</span> / renew123</p>
        )}
      </div>
    </div>
  );
}

// ── HOME SCREEN ───────────────────────────────────────────────────────────────
function HomeScreen({ user }) {
  const [mood, setMood] = useState(null);
  const moods = [{ e: "😔", l: "Hurting" }, { e: "😐", l: "Okay" }, { e: "🙂", l: "Better" }, { e: "😊", l: "Good" }, { e: "🌟", l: "Thriving" }];
  const moodReplies = ["Sending you a cosmic hug. You're allowed to feel this. 🤍", "One gentle step at a time. You're doing beautifully. ✨", "You're getting better every single day. Keep going! 💪", "That's wonderful! You deserve all the good coming your way. 😊", "You are absolutely thriving! Look how far you've come! 🌟"];
  const tasks = [
    { title: "Morning meditation", dur: "10 min", color: "var(--amber)", icon: "☀️", done: true },
    { title: "Gratitude journaling", dur: "5 min", color: "var(--teal)", icon: "📓", done: true },
    { title: "Connect with someone", dur: "Free", color: "var(--pink)", icon: "💌", done: false },
    { title: "Evening affirmation", dur: "5 min", color: "var(--purple)", icon: "✦", done: false },
  ];
  const h = new Date().getHours();
  const greeting = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  return (
    <div style={{ padding: "26px 18px 100px" }}>
      <div className="fu" style={{ marginBottom: 26, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ color: "var(--textDim)", fontSize: 12, marginBottom: 4 }}>{greeting},</p>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 700, lineHeight: 1.2 }}>
            <span style={{ background: "linear-gradient(135deg,#c4a0ff,#9b6dff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{user.anonName || user.name}</span> 👋<br />
            <em style={{ color: "var(--textMid)", fontSize: 18, fontStyle: "italic" }}>How are you feeling?</em>
          </h1>
        </div>
        <OrbSm size={42} />
      </div>

      {/* Mood picker */}
      <div className="fu1" style={{ display: "flex", gap: 7, marginBottom: 16 }}>
        {moods.map((m, i) => (
          <button key={i} onClick={() => setMood(i)} style={{
            flex: 1, padding: "11px 3px", borderRadius: 14, cursor: "pointer", transition: "all 0.2s",
            background: mood === i ? "rgba(155,109,255,0.15)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${mood === i ? "var(--purple)" : "var(--border)"}`,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            boxShadow: mood === i ? "0 0 0 3px rgba(155,109,255,0.12)" : "none",
          }}>
            <span style={{ fontSize: 20 }}>{m.e}</span>
            <span style={{ fontSize: 9, color: mood === i ? "var(--purple2)" : "var(--textDim)", fontWeight: mood === i ? 600 : 400 }}>{m.l}</span>
          </button>
        ))}
      </div>

      {mood !== null && (
        <div className="fu" style={{ marginBottom: 16, padding: "12px 16px", borderRadius: 14, background: "rgba(155,109,255,0.1)", border: "1px solid rgba(155,109,255,0.25)" }}>
          <p style={{ fontSize: 14, color: "var(--purple2)", fontStyle: "italic" }}>{moodReplies[mood]}</p>
        </div>
      )}

      {/* Stats */}
      <div className="fu2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
        {[
          { l: "Healing", v: `${user.healingScore}%`, c: "var(--purple)", s: "Keep going" },
          { l: "Day streak", v: String(user.streak), c: "var(--amber)", s: "🔥 On fire" },
          { l: "Sessions", v: "12", c: "var(--teal)", s: "This month" },
          { l: "Connections", v: "3", c: "var(--pink)", s: "People met" },
        ].map((s, i) => (
          <div key={i} className="crystal-card glass" style={{ padding: 15 }}>
            <div className="crystal-inner">
              <p style={{ fontSize: 10, color: "var(--textDim)", marginBottom: 4 }}>{s.l}</p>
              <p style={{ fontSize: 30, fontWeight: 700, color: s.c, fontFamily: "'Playfair Display',serif", lineHeight: 1, marginBottom: 3 }}>{s.v}</p>
              <p style={{ fontSize: 10, color: "var(--textDim)" }}>{s.s}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Today's plan */}
      <div className="fu3">
        <p style={{ fontSize: 11, fontWeight: 600, color: "var(--textDim)", marginBottom: 10, letterSpacing: 1, textTransform: "uppercase" }}>Today's plan</p>
        {tasks.map((t, i) => (
          <div key={i} className="glass" style={{ marginBottom: 9, display: "flex", alignItems: "center", gap: 12, padding: "12px 14px" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `rgba(var(--${t.color.replace("var(--", "").replace(")", "")},0.15)`, border: `1px solid ${t.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{t.icon}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: t.done ? "var(--textDim)" : "var(--text)", textDecoration: t.done ? "line-through" : "none" }}>{t.title}</p>
              <p style={{ fontSize: 11, color: "var(--textDim)" }}>{t.dur}</p>
            </div>
            <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${t.done ? "var(--teal)" : "var(--border)"}`, background: t.done ? "var(--teal)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#000" }}>{t.done ? "✓" : ""}</div>
          </div>
        ))}
      </div>

      {/* Affirmation */}
      <div className="fu4" style={{ marginTop: 18, padding: "18px 20px", borderRadius: 18, background: "linear-gradient(135deg,rgba(155,109,255,0.15),rgba(0,229,170,0.1))", border: "1px solid rgba(155,109,255,0.25)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(155,109,255,0.1)", filter: "blur(15px)" }} />
        <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontStyle: "italic", color: "var(--purple2)", lineHeight: 1.65, position: "relative" }}>"You are healing, growing, and becoming. Be endlessly patient with yourself. 🌸"</p>
      </div>
    </div>
  );
}

// ── COMPANION SCREEN ──────────────────────────────────────────────────────────
function CompanionScreen({ user }) {
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  const companions = {
    girlfriend: { name: "Luna", emoji: "🌸", color: "var(--pink)", desc: "Warm, caring AI girlfriend — always here to listen, encourage, and celebrate you.", traits: ["Nurturing", "Playful", "Empathetic"] },
    boyfriend:  { name: "Luca", emoji: "💙", color: "var(--blue)", desc: "Calm, grounding AI boyfriend — your steady rock for hard days and beautiful ones.", traits: ["Grounding", "Protective", "Supportive"] },
  };

  const openChat = (type) => {
    const c = companions[type];
    const greeting = type === "girlfriend"
      ? `Hey ${user.anonName || user.name}! 🌸 I'm Luna, and I'm so glad you're here. How are you feeling today, babe?`
      : `Hey ${user.anonName || user.name}. 💙 I'm Luca. Really glad you reached out. Tell me — what's going on? I'm listening.`;
    setSelected(type);
    setMessages([{ role: "assistant", content: greeting }]);
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim(); setInput("");
    const newMsgs = [...messages, { role: "user", content: userMsg }];
    setMessages(newMsgs); setLoading(true);
    setTimeout(() => chatRef.current?.scrollTo({ top: 99999, behavior: "smooth" }), 50);
    const reply = await callClaude(newMsgs.slice(-10), COMPANION_PROMPTS[selected]);
    setMessages(m => [...m, { role: "assistant", content: reply }]);
    setLoading(false);
    setTimeout(() => chatRef.current?.scrollTo({ top: 99999, behavior: "smooth" }), 80);
  };

  if (selected) {
    const c = companions[selected];
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <div style={{ padding: "14px 18px", background: "rgba(10,7,20,0.96)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--textDim)", fontSize: 20, padding: "0 4px" }}>←</button>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: `rgba(var(--pink-raw,255,107,157),0.15)`, border: `2px solid ${c.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: `0 0 14px ${c.color}30` }}>{c.emoji}</div>
          <div>
            <p style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</p>
            <p style={{ fontSize: 10, color: "var(--teal)" }}>● Online for you</p>
          </div>
        </div>
        <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: 10, background: "rgba(8,5,16,0.6)" }}>
          {messages.map((m, i) => (
            <div key={i} className="fu" style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 8 }}>
              {m.role === "assistant" && <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(255,107,157,0.15)", border: `1px solid ${c.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>{c.emoji}</div>}
              <div style={{ maxWidth: "75%", padding: "10px 14px", fontSize: 14, lineHeight: 1.65, borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: m.role === "user" ? "linear-gradient(135deg,var(--purple3),var(--purple))" : "rgba(28,23,41,0.9)", color: m.role === "user" ? "#fff" : "var(--text)", border: m.role === "user" ? "none" : "1px solid var(--border)", boxShadow: m.role === "user" ? "0 4px 16px rgba(155,109,255,0.3)" : "0 2px 8px rgba(0,0,0,0.4)" }}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(255,107,157,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>{c.emoji}</div>
              <div style={{ padding: "10px 16px", background: "rgba(28,23,41,0.9)", borderRadius: "18px 18px 18px 4px", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", gap: 5 }}>{[0, 1, 2].map(d => <div key={d} style={{ width: 7, height: 7, borderRadius: "50%", background: c.color, animation: `pulse 1.2s ${d * 0.2}s ease-in-out infinite` }} />)}</div>
              </div>
            </div>
          )}
        </div>
        <div style={{ padding: "11px 14px 20px", background: "rgba(10,7,20,0.96)", backdropFilter: "blur(20px)", borderTop: "1px solid var(--border)", display: "flex", gap: 9, flexShrink: 0 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()} placeholder={`Message ${c.name}…`}
            style={{ flex: 1, padding: "10px 16px", borderRadius: 24, border: "1px solid var(--border)", background: "rgba(255,255,255,0.04)", color: "var(--text)", fontSize: 14, outline: "none", transition: "border-color 0.2s" }}
            onFocus={e => e.target.style.borderColor = c.color} onBlur={e => e.target.style.borderColor = "var(--border)"} />
          <button onClick={send} disabled={!input.trim() || loading} style={{ width: 40, height: 40, borderRadius: "50%", border: "none", cursor: "pointer", background: input.trim() && !loading ? c.color : "var(--border)", color: "#000", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", boxShadow: input.trim() ? `0 0 14px ${c.color}50` : "none" }}>↑</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "26px 18px 100px" }}>
      <div className="fu" style={{ marginBottom: 26 }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 700, marginBottom: 8 }}>Your AI <em style={{ color: "var(--pink)" }}>Companion</em></h1>
        <p style={{ color: "var(--textDim)", fontSize: 13, lineHeight: 1.6 }}>Choose someone to talk to — powered by AI, available 24/7, no judgment. 💝</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
        {Object.entries(companions).map(([type, c]) => (
          <div key={type} className="crystal-card glass glass-hover" onClick={() => openChat(type)} style={{ padding: "20px 14px", textAlign: "center" }}>
            <div className="crystal-inner">
              <div style={{ fontSize: 44, marginBottom: 10, animation: "float 3.5s ease-in-out infinite" }}>{c.emoji}</div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 600, color: c.color, marginBottom: 6 }}>{c.name}</h3>
              <p style={{ fontSize: 11, color: "var(--textDim)", lineHeight: 1.5, marginBottom: 12 }}>{c.desc}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center", marginBottom: 14 }}>
                {c.traits.map(t => <Tag key={t} color={c.color}>{t}</Tag>)}
              </div>
              <div style={{ padding: "8px 12px", borderRadius: 10, background: c.color, color: type === "boyfriend" ? "#000" : "#fff", fontSize: 12, fontWeight: 600 }}>Chat with {c.name}</div>
            </div>
          </div>
        ))}
      </div>
      <Card>
        <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 12 }}>💙 What to expect</p>
        {["Complete privacy — conversations just for you", "Available 24/7, no waiting, no judgment", "Advanced AI that truly listens and cares", "Emotional support, not clinical advice"].map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
            <span style={{ color: "var(--teal)", fontSize: 13, marginTop: 1 }}>✓</span>
            <p style={{ fontSize: 13, color: "var(--textMid)", lineHeight: 1.5 }}>{item}</p>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ── SUPPORT SCREEN ────────────────────────────────────────────────────────────
function SupportScreen({ user }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", content: `Hi ${user.anonName || user.name}! I'm Sage, your wellness companion. I'm here to listen — always, and without judgment. How are you feeling right now? 🌿` }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim(); setInput("");
    const newMsgs = [...messages, { role: "user", content: userMsg }];
    setMessages(newMsgs); setLoading(true);
    setTimeout(() => chatRef.current?.scrollTo({ top: 99999, behavior: "smooth" }), 50);
    const reply = await callClaude(newMsgs.slice(-10), COMPANION_PROMPTS.support);
    setMessages(m => [...m, { role: "assistant", content: reply }]);
    setLoading(false);
    setTimeout(() => chatRef.current?.scrollTo({ top: 99999, behavior: "smooth" }), 80);
  };

  if (chatOpen) return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{ padding: "14px 18px", background: "rgba(10,7,20,0.96)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <button onClick={() => setChatOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--textDim)", fontSize: 20 }}>←</button>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(0,229,170,0.15)", border: "2px solid rgba(0,229,170,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🌿</div>
        <div><p style={{ fontWeight: 600, fontSize: 14 }}>Sage — Wellness Companion</p><p style={{ fontSize: 10, color: "var(--teal)" }}>● Here for you</p></div>
      </div>
      <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: 10, background: "rgba(8,5,16,0.6)" }}>
        {messages.map((m, i) => (
          <div key={i} className="fu" style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 8 }}>
            {m.role === "assistant" && <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(0,229,170,0.15)", border: "1px solid rgba(0,229,170,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>🌿</div>}
            <div style={{ maxWidth: "75%", padding: "10px 14px", fontSize: 14, lineHeight: 1.65, borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: m.role === "user" ? "linear-gradient(135deg,var(--teal2),var(--teal))" : "rgba(28,23,41,0.9)", color: m.role === "user" ? "#000" : "var(--text)", border: m.role === "user" ? "none" : "1px solid var(--border)" }}>{m.content}</div>
          </div>
        ))}
        {loading && <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(0,229,170,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🌿</div>
          <div style={{ padding: "10px 16px", background: "rgba(28,23,41,0.9)", borderRadius: "18px 18px 18px 4px", border: "1px solid var(--border)" }}><div style={{ display: "flex", gap: 5 }}>{[0, 1, 2].map(d => <div key={d} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--teal)", animation: `pulse 1.2s ${d * 0.2}s ease-in-out infinite` }} />)}</div></div>
        </div>}
      </div>
      <div style={{ padding: "11px 14px 20px", background: "rgba(10,7,20,0.96)", backdropFilter: "blur(20px)", borderTop: "1px solid var(--border)", display: "flex", gap: 9, flexShrink: 0 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Share how you feel…" style={{ flex: 1, padding: "10px 16px", borderRadius: 24, border: "1px solid var(--border)", background: "rgba(255,255,255,0.04)", color: "var(--text)", fontSize: 14, outline: "none" }} />
        <button onClick={send} style={{ width: 40, height: 40, borderRadius: "50%", border: "none", cursor: "pointer", background: "var(--teal)", color: "#000", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>↑</button>
      </div>
    </div>
  );

  const tools = [
    { icon: "💬", l: "Talk to Sage", s: "AI wellness companion", action: () => setChatOpen(true) },
    { icon: "📓", l: "Guided Journal", s: "Daily reflection prompts", action: null },
    { icon: "🫁", l: "Breathe", s: "Calm in 3 minutes", action: null },
    { icon: "🧘", l: "Therapist match", s: "Real humans ready", action: null },
  ];
  return (
    <div style={{ padding: "26px 18px 100px" }}>
      <div className="fu" style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 700, marginBottom: 8 }}>Your <em style={{ color: "var(--teal)" }}>support</em> toolkit</h1>
        <p style={{ color: "var(--textDim)", fontSize: 13 }}>Every tool here is for you — whenever you need it</p>
      </div>
      <div className="fu1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        {tools.map((t, i) => (
          <button key={i} onClick={t.action || undefined} className="glass glass-hover" style={{ padding: "17px 13px", textAlign: "left", cursor: "pointer", borderRadius: 20 }}>
            <span style={{ fontSize: 26, display: "block", marginBottom: 9 }}>{t.icon}</span>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 3 }}>{t.l}</p>
            <p style={{ fontSize: 11, color: "var(--textDim)" }}>{t.s}</p>
          </button>
        ))}
      </div>
      <Card accent="rgba(255,107,157,0.3)" style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 14 }} className="fu2">
        <span style={{ fontSize: 26 }}>🆘</span>
        <div>
          <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Need immediate help?</p>
          <p style={{ fontSize: 12, color: "var(--textMid)" }}>iCall India: <strong>9152987821</strong></p>
          <p style={{ fontSize: 12, color: "var(--textMid)" }}>Vandrevala: <strong>1860-2662-345</strong></p>
        </div>
      </Card>
    </div>
  );
}

// ── CONNECT SCREEN ────────────────────────────────────────────────────────────
function ConnectScreen() {
  const [liked, setLiked] = useState({});
  const [filter, setFilter] = useState("All");
  const [msgModal, setMsgModal] = useState(null);
  const [msgInput, setMsgInput] = useState("");
  const people = [
    { name: "Aria S.", age: 26, stage: "Same stage", tags: ["3 months out", "Music lover"], color: "var(--purple)", bio: "Healing through art and long walks. Looking for someone to talk to without judgment. 🎨", online: true },
    { name: "Reva M.", age: 29, stage: "Survivor", tags: ["1 year healed", "Yoga"], color: "var(--teal)", bio: "Came out stronger. Happy to guide anyone starting this journey. ✨", online: false },
    { name: "Kai J.", age: 24, stage: "Mentor", tags: ["Coach", "Mindfulness"], color: "var(--amber)", bio: "Certified breakup recovery coach. Here to support your path to healing. 💪", online: true },
    { name: "Sam D.", age: 31, stage: "Same stage", tags: ["2 months out", "Fitness"], color: "var(--blue)", bio: "Rebuilding through running and journaling. Looking for accountability partners. 🏃", online: true },
  ];
  const filters = ["All", "Same stage", "Survivors", "Mentors"];
  const filtered = filter === "All" ? people : people.filter(p => p.stage === filter || (filter === "Survivors" && p.stage === "Survivor") || (filter === "Mentors" && p.stage === "Mentor"));
  return (
    <div style={{ padding: "26px 18px 100px" }}>
      <div className="fu" style={{ marginBottom: 22 }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 700, marginBottom: 8 }}>You are not <em style={{ color: "var(--pink)" }}>alone</em></h1>
        <p style={{ color: "var(--textDim)", fontSize: 13 }}>Connect with people who truly understand your journey</p>
      </div>
      <div className="fu1" style={{ display: "flex", gap: 7, marginBottom: 18, flexWrap: "wrap" }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "7px 13px", borderRadius: 20, fontSize: 12, cursor: "pointer", transition: "all 0.2s", fontWeight: 500, border: `1px solid ${filter === f ? "var(--purple)" : "var(--border)"}`, background: filter === f ? "rgba(155,109,255,0.15)" : "rgba(255,255,255,0.03)", color: filter === f ? "var(--purple2)" : "var(--textDim)" }}>{f}</button>
        ))}
      </div>
      {filtered.map((p, i) => (
        <Card key={i} className="fu" style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
            <div style={{ position: "relative" }}>
              <Avatar name={p.name} size={46} color={p.color} />
              {p.online && <div style={{ position: "absolute", bottom: 1, right: 1, width: 11, height: 11, borderRadius: "50%", background: "var(--teal)", border: "2px solid var(--bg)" }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{p.name}, {p.age}</p>
                <Tag color={p.color}>{p.stage}</Tag>
              </div>
              <p style={{ fontSize: 12, color: "var(--textMid)", marginBottom: 8, lineHeight: 1.5 }}>{p.bio}</p>
              <div style={{ display: "flex", gap: 5, marginBottom: 10, flexWrap: "wrap" }}>
                {p.tags.map(t => <Tag key={t} color="var(--textDim)" bg="rgba(255,255,255,0.04)">{t}</Tag>)}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn variant={liked[i] ? "danger" : "outline"} onClick={() => setLiked(l => ({ ...l, [i]: !l[i] }))} style={{ flex: 1, justifyContent: "center", fontSize: 12 }}>{liked[i] ? "♡ Connected" : "♡ Connect"}</Btn>
                <Btn variant="outline" onClick={() => setMsgModal(p)} style={{ flex: 1, justifyContent: "center", fontSize: 12 }}>💬 Message</Btn>
              </div>
            </div>
          </div>
        </Card>
      ))}
      <Modal open={!!msgModal} onClose={() => { setMsgModal(null); setMsgInput(""); }} title={`Message ${msgModal?.name}`}>
        <p style={{ color: "var(--textDim)", fontSize: 13, marginBottom: 14 }}>Send a kind, thoughtful message to start your connection.</p>
        <textarea value={msgInput} onChange={e => setMsgInput(e.target.value)} placeholder="Share something kind…" rows={4} style={{ width: "100%", padding: "11px", borderRadius: 12, border: "1px solid var(--border)", background: "rgba(255,255,255,0.04)", color: "var(--text)", fontSize: 14, outline: "none", resize: "none" }} />
        <Btn onClick={() => { setMsgModal(null); setMsgInput(""); }} style={{ width: "100%", marginTop: 12, justifyContent: "center" }} disabled={!msgInput.trim()}>Send message 💌</Btn>
      </Modal>
    </div>
  );
}

// ── SPIRITUAL SCREEN ──────────────────────────────────────────────────────────
function SpiritualScreen() {
  const [breathActive, setBreathActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState("inhale");
  const [affIdx, setAffIdx] = useState(0);
  const timerRef = useRef(null);

  const affirmations = ["I am healing at my own pace. 🌸", "I choose myself every single day. ✨", "My heart is stronger than I know. 💪", "I deserve love that stays. 💝", "Every ending is a new beginning. 🌅", "I am worthy. I am enough. I am healing. 🌿"];

  useEffect(() => {
    if (!breathActive) return;
    const phases = ["inhale", "hold", "exhale", "rest"];
    const durations = { inhale: 4000, hold: 4000, exhale: 6000, rest: 2000 };
    timerRef.current = setTimeout(() => {
      setBreathPhase(p => phases[(phases.indexOf(p) + 1) % 4]);
    }, durations[breathPhase]);
    return () => clearTimeout(timerRef.current);
  }, [breathActive, breathPhase]);

  const phaseInfo = { inhale: { label: "Breathe in…", color: "var(--purple)" }, hold: { label: "Hold gently…", color: "var(--amber)" }, exhale: { label: "Breathe out…", color: "var(--teal)" }, rest: { label: "Rest…", color: "var(--textDim)" } };
  const ph = phaseInfo[breathPhase];

  return (
    <div style={{ padding: "26px 18px 100px" }}>
      <div className="fu" style={{ marginBottom: 22 }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 700, marginBottom: 8 }}>Find your <em style={{ color: "var(--amber)" }}>inner peace</em></h1>
        <p style={{ color: "var(--textDim)", fontSize: 13 }}>Practices for your soul's gentle healing</p>
      </div>

      {/* Breathwork */}
      <Card accent="rgba(255,181,71,0.3)" className="fu1" style={{ marginBottom: 14, textAlign: "center" }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: "var(--amber)", letterSpacing: 1, marginBottom: 18, textTransform: "uppercase" }}>Breathwork — 4·4·6·2</p>
        {breathActive ? (
          <>
            <div style={{ width: 110, height: 110, borderRadius: "50%", margin: "0 auto 18px", background: `${ph.color}15`, border: `3px solid ${ph.color}`, display: "flex", alignItems: "center", justifyContent: "center", animation: `${breathPhase === "inhale" ? "breatheIn 4s ease" : breathPhase === "exhale" ? "breatheOut 6s ease" : "none"}`, boxShadow: `0 0 30px ${ph.color}30`, transition: "border-color 1s ease, background 1s ease" }}>
              <span style={{ fontSize: 12, color: ph.color, fontWeight: 600, padding: "0 10px", lineHeight: 1.3, textAlign: "center" }}>{ph.label}</span>
            </div>
            <Btn variant="outline" onClick={() => { setBreathActive(false); setBreathPhase("inhale"); clearTimeout(timerRef.current); }} style={{ margin: "0 auto" }}>Stop</Btn>
          </>
        ) : (
          <>
            <p style={{ color: "var(--textDim)", fontSize: 13, marginBottom: 14 }}>In 4 · Hold 4 · Out 6 · Rest 2</p>
            <Btn variant="outline" onClick={() => setBreathActive(true)} style={{ margin: "0 auto", borderColor: "var(--amber)", color: "var(--amber)" }}>Begin ☀️</Btn>
          </>
        )}
      </Card>

      {/* Affirmations */}
      <Card accent="rgba(155,109,255,0.3)" className="fu2" style={{ marginBottom: 14 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: "var(--purple2)", letterSpacing: 1, marginBottom: 14, textTransform: "uppercase" }}>Daily affirmation</p>
        <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontStyle: "italic", color: "var(--purple2)", lineHeight: 1.6, marginBottom: 16 }}>"{affirmations[affIdx]}"</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 5 }}>{affirmations.map((_, i) => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i === affIdx ? "var(--purple)" : "var(--border)", transition: "background 0.2s" }} />)}</div>
          <Btn variant="secondary" onClick={() => setAffIdx(i => (i + 1) % affirmations.length)} style={{ padding: "6px 13px", fontSize: 12 }}>Next ↻</Btn>
        </div>
      </Card>

      {/* Practices */}
      <p style={{ fontSize: 11, fontWeight: 600, color: "var(--textDim)", marginBottom: 10, letterSpacing: 1, textTransform: "uppercase" }}>Explore practices</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
        {[["🧘", "Meditation"], ["✨", "Manifestation"], ["🙏", "Gratitude"], ["💝", "Self-love ritual"], ["🎵", "Healing sounds"], ["🌙", "Sleep ritual"]].map(([icon, label], i) => (
          <Card key={i} className="glass-hover" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 13px", cursor: "pointer" }}>
            <span style={{ fontSize: 20 }}>{icon}</span>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── HABITS SCREEN ─────────────────────────────────────────────────────────────
function HabitsScreen() {
  const [habits, setHabits] = useState([
    { name: "Morning walk", done: [true, true, true, false, false, false, false], color: "var(--teal)", icon: "🚶", streak: 3 },
    { name: "No social media", done: [true, true, false, true, false, false, false], color: "var(--purple)", icon: "📵", streak: 2 },
    { name: "Read 20 pages", done: [false, true, true, true, false, false, false], color: "var(--amber)", icon: "📖", streak: 3 },
    { name: "Meditate", done: [true, false, true, false, false, false, false], color: "var(--pink)", icon: "🧘", streak: 1 },
    { name: "Cold shower", done: [false, false, false, false, false, false, false], color: "var(--blue)", icon: "🚿", streak: 0 },
  ]);
  const [addModal, setAddModal] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: "", icon: "⭐" });
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = 3;

  const toggle = (hi, di) => {
    if (di > today) return;
    setHabits(h => h.map((hb, i) => i !== hi ? hb : { ...hb, done: hb.done.map((d, j) => j === di ? !d : d) }));
  };

  return (
    <div style={{ padding: "26px 18px 100px" }}>
      <div className="fu" style={{ marginBottom: 22, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 700, marginBottom: 6 }}>Build a <em style={{ color: "var(--teal)" }}>better you</em></h1>
          <p style={{ color: "var(--textDim)", fontSize: 13 }}>Small habits create big transformations</p>
        </div>
        <Btn variant="secondary" onClick={() => setAddModal(true)} style={{ padding: "8px 13px", fontSize: 12, flexShrink: 0 }}>+ Add</Btn>
      </div>
      <div className="fu1" style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        {[{ l: "Done today", v: `${habits.filter(h => h.done[today]).length}/${habits.length}`, c: "var(--teal)" }, { l: "Best streak", v: `${Math.max(...habits.map(h => h.streak))}d 🔥`, c: "var(--amber)" }].map((s, i) => (
          <Card key={i} style={{ flex: 1, padding: 13 }}>
            <p style={{ fontSize: 10, color: "var(--textDim)", marginBottom: 3 }}>{s.l}</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: s.c }}>{s.v}</p>
          </Card>
        ))}
      </div>
      <div className="fu2" style={{ display: "flex", justifyContent: "flex-end", gap: 5, marginBottom: 4, paddingRight: 1 }}>
        {days.map((d, i) => <div key={i} style={{ width: 28, textAlign: "center", fontSize: 9, color: i === today ? "var(--purple2)" : "var(--textDim)", fontWeight: i === today ? 600 : 400 }}>{d}</div>)}
      </div>
      {habits.map((h, hi) => (
        <Card key={hi} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 10 }}>
            <span style={{ fontSize: 20 }}>{h.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 500, fontSize: 13 }}>{h.name}</p>
              <p style={{ fontSize: 10, color: h.color }}>🔥 {h.streak} day streak</p>
            </div>
            <Tag color={h.color}>{h.done.filter(Boolean).length}/7</Tag>
          </div>
          <div style={{ display: "flex", gap: 5, justifyContent: "flex-end" }}>
            {h.done.map((d, di) => (
              <button key={di} onClick={() => toggle(hi, di)} style={{ width: 28, height: 28, borderRadius: 6, background: d ? `${h.color}22` : "rgba(255,255,255,0.03)", border: `1px solid ${d ? h.color : "var(--border)"}`, cursor: di <= today ? "pointer" : "default", opacity: di > today ? 0.3 : 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: h.color, transition: "all 0.2s" }}>{d ? "✓" : ""}</button>
            ))}
          </div>
        </Card>
      ))}
      <Modal open={addModal} onClose={() => setAddModal(false)} title="New habit">
        <input value={newHabit.name} onChange={e => setNewHabit(n => ({ ...n, name: e.target.value }))} placeholder="Habit name (e.g., Drink more water)"
          style={{ width: "100%", padding: "11px 14px", borderRadius: 12, border: "1px solid var(--border)", background: "rgba(255,255,255,0.04)", color: "var(--text)", fontSize: 14, outline: "none", marginBottom: 12 }} />
        <div style={{ display: "flex", gap: 7, marginBottom: 16, flexWrap: "wrap" }}>
          {["⭐", "🏃", "📖", "💧", "🧘", "🎨", "🌿", "💪"].map(icon => (
            <button key={icon} onClick={() => setNewHabit(n => ({ ...n, icon }))} style={{ width: 40, height: 40, borderRadius: 10, border: `1px solid ${newHabit.icon === icon ? "var(--purple)" : "var(--border)"}`, background: newHabit.icon === icon ? "rgba(155,109,255,0.15)" : "rgba(255,255,255,0.03)", cursor: "pointer", fontSize: 20 }}>{icon}</button>
          ))}
        </div>
        <Btn onClick={() => { if (!newHabit.name) return; setHabits(h => [...h, { ...newHabit, color: "var(--purple)", done: Array(7).fill(false), streak: 0 }]); setAddModal(false); setNewHabit({ name: "", icon: "⭐" }); }} disabled={!newHabit.name} style={{ width: "100%", justifyContent: "center" }}>Add habit ✓</Btn>
      </Modal>
    </div>
  );
}

// ── NEW LIFE SCREEN ───────────────────────────────────────────────────────────
function NewLifeScreen() {
  const [visionItems, setVisionItems] = useState([
    { label: "Travel solo ✈️", color: "var(--teal)" },
    { label: "Start journaling 📓", color: "var(--purple)" },
    { label: "Get fit 💪", color: "var(--amber)" },
    { label: "Learn to cook 🍳", color: "var(--pink)" },
  ]);
  const [addVision, setAddVision] = useState(false);
  const [visionInput, setVisionInput] = useState("");

  const areas = [
    { l: "Career", p: 40, c: "var(--blue)", i: "💼", g: "Land a new role" },
    { l: "Health", p: 65, c: "var(--teal)", i: "🌿", g: "Exercise 4x/week" },
    { l: "Hobbies", p: 30, c: "var(--amber)", i: "🎨", g: "Learn guitar" },
    { l: "Social", p: 55, c: "var(--pink)", i: "☀️", g: "Make 2 new friends" },
    { l: "Finance", p: 20, c: "var(--purple)", i: "💫", g: "Save smart" },
    { l: "Learning", p: 75, c: "var(--blue)", i: "📚", g: "Read 12 books" },
  ];
  const colors = ["var(--teal)", "var(--purple)", "var(--amber)", "var(--pink)", "var(--blue)"];

  return (
    <div style={{ padding: "26px 18px 100px" }}>
      <div className="fu" style={{ marginBottom: 22 }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 700, marginBottom: 8 }}>Build your <em style={{ color: "var(--blue)" }}>new life</em></h1>
        <p style={{ color: "var(--textDim)", fontSize: 13 }}>This chapter is entirely yours to write 🌱</p>
      </div>
      <p style={{ fontSize: 11, fontWeight: 600, color: "var(--textDim)", marginBottom: 10, letterSpacing: 1, textTransform: "uppercase" }}>Life areas</p>
      <div className="fu1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
        {areas.map((a, i) => (
          <div key={i} className="crystal-card glass" style={{ padding: 14 }}>
            <div className="crystal-inner">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                <span style={{ fontSize: 20 }}>{a.i}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: a.c }}>{a.p}%</span>
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{a.l}</p>
              <p style={{ fontSize: 10, color: "var(--textDim)", marginBottom: 8 }}>{a.g}</p>
              <ProgressBar value={a.p} color={a.c} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: "var(--textDim)", letterSpacing: 1, textTransform: "uppercase" }}>Vision board</p>
        <Btn variant="secondary" onClick={() => setAddVision(true)} style={{ padding: "6px 11px", fontSize: 11 }}>+ Add dream</Btn>
      </div>
      <Card className="fu2">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {visionItems.map((v, i) => (
            <div key={i} style={{ height: 68, borderRadius: 12, background: `${v.color}12`, border: `1px solid ${v.color}30`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}>
              <p style={{ fontSize: 12, fontWeight: 500, color: v.color, textAlign: "center", padding: "0 8px" }}>{v.label}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11, color: "var(--textDim)", marginTop: 10, textAlign: "center" }}>Your dreams, visualised 🌟</p>
      </Card>
      <Modal open={addVision} onClose={() => setAddVision(false)} title="Add a dream">
        <input value={visionInput} onChange={e => setVisionInput(e.target.value)} placeholder="Your dream (e.g., Move to a new city 🏙️)"
          style={{ width: "100%", padding: "11px 14px", borderRadius: 12, border: "1px solid var(--border)", background: "rgba(255,255,255,0.04)", color: "var(--text)", fontSize: 14, outline: "none", marginBottom: 14 }} />
        <Btn onClick={() => { if (!visionInput.trim()) return; setVisionItems(v => [...v, { label: visionInput, color: colors[v.length % colors.length] }]); setVisionInput(""); setAddVision(false); }} disabled={!visionInput.trim()} style={{ width: "100%", justifyContent: "center" }}>Add to vision board ✨</Btn>
      </Modal>
    </div>
  );
}

// ── PROGRESS SCREEN ───────────────────────────────────────────────────────────
function ProgressScreen({ user }) {
  const weeks = [30, 38, 45, 52, 58, 67, user.healingScore];
  const badges = [
    { l: "First step", i: "🌱", d: "Joined Renew", c: "var(--teal)", e: true },
    { l: "Week warrior", i: "🔥", d: "7-day streak", c: "var(--amber)", e: user.streak >= 7 },
    { l: "Open heart", i: "💬", d: "First connection", c: "var(--pink)", e: true },
    { l: "Meditator", i: "🧘", d: "10 sessions", c: "var(--purple)", e: false },
    { l: "Habit hero", i: "✅", d: "All habits 2wks", c: "var(--blue)", e: false },
    { l: "Renewed", i: "✦", d: "30 day journey", c: "var(--amber)", e: false },
  ];
  return (
    <div style={{ padding: "26px 18px 100px" }}>
      <div className="fu" style={{ marginBottom: 22 }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 700, marginBottom: 8 }}>Your <em style={{ color: "var(--purple2)" }}>healing</em> journey</h1>
        <p style={{ color: "var(--textDim)", fontSize: 13 }}>Every day forward is a victory worth celebrating 🎉</p>
      </div>

      {/* Anonymous identity reveal */}
      <Card accent="rgba(155,109,255,0.3)" className="fu1" style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 13, background: "rgba(155,109,255,0.06)" }}>
        <span style={{ fontSize: 26, animation: "float 3s ease-in-out infinite" }}>🎭</span>
        <div>
          <p style={{ fontSize: 10, color: "var(--textDim)", marginBottom: 3 }}>Your healing identity</p>
          <p style={{ fontSize: 17, fontWeight: 600, color: "var(--purple2)", fontFamily: "'Playfair Display',serif" }}>{user.anonName || "Anonymous"}</p>
          <p style={{ fontSize: 11, color: "var(--textDim)" }}>Your private name within Renew</p>
        </div>
      </Card>

      {/* Chart */}
      <Card className="fu2" style={{ marginBottom: 18 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: "var(--textDim)", letterSpacing: 1, marginBottom: 16, textTransform: "uppercase" }}>7-week healing score</p>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80, marginBottom: 10 }}>
          {weeks.map((v, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: "100%", height: `${(v / 100) * 72}px`, borderRadius: "6px 6px 0 0", background: i === weeks.length - 1 ? "linear-gradient(180deg,#c4a0ff,#9b6dff)" : "rgba(155,109,255,0.2)", transition: "height 1.2s ease", boxShadow: i === weeks.length - 1 ? "0 0 14px rgba(155,109,255,0.4)" : "none" }} />
              <span style={{ fontSize: 9, color: "var(--textDim)" }}>W{i + 1}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: 12, color: "var(--textDim)" }}>Started 30% · Now {user.healingScore}%</p>
          <Tag color="var(--purple2)">+{user.healingScore - 30}% growth 📈</Tag>
        </div>
      </Card>

      {/* Badges */}
      <p style={{ fontSize: 11, fontWeight: 600, color: "var(--textDim)", marginBottom: 10, letterSpacing: 1, textTransform: "uppercase" }}>Milestones & badges</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 9, marginBottom: 20 }}>
        {badges.map((b, i) => (
          <Card key={i} accent={b.e ? `${b.c}40` : "var(--border)"} style={{ textAlign: "center", padding: "13px 7px", opacity: b.e ? 1 : 0.4 }}>
            <span style={{ fontSize: 24, display: "block", marginBottom: 6, filter: b.e ? "none" : "grayscale(1)", animation: b.e ? "pulse 3s ease-in-out infinite" : "none" }}>{b.i}</span>
            <p style={{ fontSize: 10, fontWeight: 600, color: b.e ? b.c : "var(--textDim)", marginBottom: 2 }}>{b.l}</p>
            <p style={{ fontSize: 9, color: "var(--textDim)" }}>{b.d}</p>
          </Card>
        ))}
      </div>
      <Card accent="rgba(155,109,255,0.25)" style={{ background: "rgba(155,109,255,0.06)" }}>
        <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontStyle: "italic", color: "var(--purple2)", lineHeight: 1.65, marginBottom: 8 }}>"You've come so far. The version of you at the beginning of this journey would be so proud of where you stand today."</p>
        <p style={{ fontSize: 11, color: "var(--textDim)" }}>— Renew Companion 🌸</p>
      </Card>
    </div>
  );
}

// ── APP ROOT ───────────────────────────────────────────────────────────────────
export default function RenewApp() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("home");

  const handleLogin = useCallback((u) => { setUser(u); setScreen("home"); }, []);
  const handleLogout = useCallback(() => { setUser(null); setScreen("home"); }, []);

  const screens = {
    home:      user && <HomeScreen user={user} />,
    companion: user && <CompanionScreen user={user} />,
    connect:   <ConnectScreen />,
    support:   user && <SupportScreen user={user} />,
    spiritual: <SpiritualScreen />,
    habits:    <HabitsScreen />,
    newlife:   <NewLifeScreen />,
    progress:  user && <ProgressScreen user={user} />,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <style>{GLOBAL_CSS}</style>
      <CosmicBg />
      {!user ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
          <Sidebar screen={screen} setScreen={setScreen} user={user} onLogout={handleLogout} />
          <div className="main-wrap" style={{ minHeight: "100vh", marginLeft: 0 }}>
            <div style={{ maxWidth: 600, margin: "0 auto" }}>
              {screens[screen] || <HomeScreen user={user} />}
            </div>
          </div>
          <BottomNav screen={screen} setScreen={setScreen} />
        </div>
      )}
    </div>
  );
}