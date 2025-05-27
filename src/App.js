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
  const syllables = ["ba", "be", "bi", "bo", "bu", "la", "le", "li", "lo", "lu", "ra", "re", "ri", "ro", "ru"];
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

  // Adjust length based on strength automatically (optional)
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
    <div className="app-container">
      <h1 className="title">Cyber Secure Password Generator 🔐</h1>

      <div className="input-group">
        <label>Name (base for password)</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value.trim())}
          maxLength={20}
          className="input-field"
        />
      </div>

      <div className="input-group">
        <label>Number (base for password)</label>
        <input
          type="text"
          placeholder="Enter a number"
          value={number}
          onChange={(e) => setNumber(e.target.value.trim())}
          maxLength={20}
          className="input-field"
        />
      </div>

      <div className="password-type-selector">
        {PASSWORD_TYPES.map((type) => (
          <div
            key={type}
            className={`password-type-option ${
              passwordType === type ? "active" : ""
            }`}
            onClick={() => setPasswordType(type)}
          >
            {type}
          </div>
        ))}
      </div>

      <div className="password-strength-selector">
        {PASSWORD_STRENGTHS.map((level) => (
          <div
            key={level}
            className={`password-strength-option ${
              passwordStrength === level ? "active" : ""
            }`}
            onClick={() => setPasswordStrength(level)}
          >
            {level}
          </div>
        ))}
      </div>

      <div className="input-group slider-group">
        <label>Password Length: {length}</label>
        <input
          type="range"
          min="8"
          max="50"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="slider"
        />
      </div>

      <div className="checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={() => setIncludeNumbers(!includeNumbers)}
            disabled={passwordType === "PIN"} // PIN does not use these options
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

      <button className="generate-button" onClick={handleGenerate}>
        Generate Password
      </button>

      {generatedPassword && (
        <div className="output-section">
          <label>Your Secure Password:</label>
          <div className="password-output">
            <code>{generatedPassword}</code>
            <button className="icon-button" onClick={copyToClipboard} title="Copy Password">
              <Copy size={20} />
            </button>
            <button className="icon-button" onClick={handleGenerate} title="Refresh Password">
              <RefreshCw size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}





