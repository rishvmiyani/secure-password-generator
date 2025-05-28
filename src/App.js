import React, { useState, useEffect } from "react";
import { Copy, RefreshCw } from "lucide-react";
import "./styles/cyber-theme.css";

const PASSWORD_TYPES = ["Random", "Memorable", "PIN"];
const PASSWORD_STRENGTHS = ["Easy", "Medium", "Hard", "Extreme"];

const randomChar = (chars) => chars[Math.floor(Math.random() * chars.length)];

const generateRandomPassword = (length, includeNumbers, includeSymbols, name, number) => {
  const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+{}[]|:;<>,.?/";
  let chars = letters;
  if (includeNumbers) chars += numbers;
  if (includeSymbols) chars += symbols;

  const base = name + number;
  let restLength = length - base.length;
  if (restLength < 0) return base.slice(0, length);

  let passwordArr = [];
  for (let i = 0; i < restLength; i++) {
    passwordArr.push(randomChar(chars));
  }
  const insertPos = Math.floor(Math.random() * (passwordArr.length + 1));
  passwordArr.splice(insertPos, 0, base);

  return passwordArr.join("");
};

const generateMemorablePassword = (length, name, number) => {
  const syllables = [
    "ba", "be", "bi", "bo", "bu",
    "la", "le", "li", "lo", "lu",
    "ra", "re", "ri", "ro", "ru",
  ];
  let passwordArr = [];
  let base = name + number;
  let baseLen = base.length;
  let restLength = length - baseLen;
  if (restLength < 0) return base.slice(0, length);

  for (let i = 0; i < restLength; i += 2) {
    passwordArr.push(syllables[Math.floor(Math.random() * syllables.length)]);
  }
  const insertPos = Math.floor(Math.random() * (passwordArr.length + 1));
  passwordArr.splice(insertPos, 0, base);

  return passwordArr.join("").slice(0, length);
};

const generatePIN = (length, number) => {
  const digits = "0123456789";
  let base = number;
  if (base.length > length) return base.slice(0, length);

  let restLength = length - base.length;
  let pinArr = [];
  for (let i = 0; i < restLength; i++) {
    pinArr.push(randomChar(digits));
  }
  const insertPos = Math.floor(Math.random() * (pinArr.length + 1));
  pinArr.splice(insertPos, 0, base);

  return pinArr.join("");
};

export default function App() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [length, setLength] = useState(20);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [passwordType, setPasswordType] = useState("Random");
  const [passwordStrength, setPasswordStrength] = useState("Hard");
  const [generatedPassword, setGeneratedPassword] = useState("");

  useEffect(() => {
    switch (passwordStrength) {
      case "Easy":
        setLength(12);
        break;
      case "Medium":
        setLength(20);
        break;
      case "Hard":
        setLength(30);
        break;
      case "Extreme":
        setLength(40);
        break;
      default:
        setLength(20);
    }
  }, [passwordStrength]);

  const handleGenerate = () => {
    let pwd = "";
    if (passwordType === "Random") {
      pwd = generateRandomPassword(length, includeNumbers, includeSymbols, name, number);
    } else if (passwordType === "Memorable") {
      pwd = generateMemorablePassword(length, name, number);
    } else if (passwordType === "PIN") {
      pwd = generatePIN(length, number);
    }
    setGeneratedPassword(pwd);
  };

  const copyToClipboard = () => {
    if (!generatedPassword) return;
    navigator.clipboard.writeText(generatedPassword);
    alert("Password copied to clipboard!");
  };

  return (
    <div className="app-container" role="main" tabIndex={-1}>
      <h1 className="app-title">Cyber Secure Password Generator 🔐</h1>

      <label htmlFor="nameInput" className="input-label">Name (base for password)</label>
      <input
        id="nameInput"
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value.trim())}
        maxLength={20}
        className="input-field"
        autoComplete="off"
        spellCheck="false"
      />

      <label htmlFor="numberInput" className="input-label">Number (base for password)</label>
      <input
        id="numberInput"
        type="text"
        placeholder="Enter a number"
        value={number}
        onChange={(e) => setNumber(e.target.value.trim())}
        maxLength={20}
        className="input-field"
        autoComplete="off"
        spellCheck="false"
      />

      <div className="selector-group">
        <div className="selector-label">Password Type:</div>
        <div className="button-group">
          {PASSWORD_TYPES.map((type) => (
            <button
              key={type}
              className={passwordType === type ? "btn active" : "btn"}
              onClick={() => setPasswordType(type)}
              aria-pressed={passwordType === type}
              type="button"
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="selector-group">
        <div className="selector-label">Strength:</div>
        <div className="button-group">
          {PASSWORD_STRENGTHS.map((level) => (
            <button
              key={level}
              className={passwordStrength === level ? "btn active" : "btn"}
              onClick={() => setPasswordStrength(level)}
              aria-pressed={passwordStrength === level}
              type="button"
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <label className="input-label">
        Password Length: <span className="length-value">{length}</span>
      </label>
      <input
        type="range"
        min="8"
        max="50"
        value={length}
        onChange={(e) => setLength(Number(e.target.value))}
        className="slider"
        disabled
      />

      <div className="checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={() => setIncludeNumbers(!includeNumbers)}
            disabled={passwordType === "PIN"}
          />
          Include Numbers
        </label>

        <label>
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={() => setIncludeSymbols(!includeSymbols)}
            disabled={passwordType === "PIN"}
          />
          Include Symbols
        </label>
      </div>

      <button className="generate-btn" onClick={handleGenerate} type="button">
        Generate Password
      </button>

      {generatedPassword && (
        <div className="password-output" aria-live="polite">
          <code>{generatedPassword}</code>
          <div className="icon-buttons">
            <button
              className="icon-btn"
              onClick={copyToClipboard}
              title="Copy Password"
              aria-label="Copy Password"
              type="button"
            >
              <Copy size={24} />
            </button>
            <button
              className="icon-btn"
              onClick={handleGenerate}
              title="Refresh Password"
              aria-label="Refresh Password"
              type="button"
            >
              <RefreshCw size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

