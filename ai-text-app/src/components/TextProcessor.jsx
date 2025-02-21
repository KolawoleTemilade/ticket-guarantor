import { useState } from "react";

const TextProcessor = () => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");

  const handleSend = async () => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { type: "user", text }]);
    setLoading(true);

    try {
      const detectedLang = await detectLanguage(text);
      setLanguage(detectedLang);

      setMessages((prev) => [
        ...prev,
        { type: "bot", text: `Detected Language: ${detectedLang}` },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "Error detecting language." },
      ]);
    }

    setLoading(false);
    setText("");
  };

  // const detectLanguage = async (text) => {
  //   if (!window.navigator.ai?.getTextLanguageDetector) {
  //     console.error("Chrome AI APIs are not supported.");
  //     return "Unknown";
  //   }
  //   try {
  //     const ai = window.navigator.ai.getTextLanguageDetector();
  //     const result = await ai.detect(text);
  //     return result.language;
  //   } catch (error) {
  //     console.error("Language detection failed:", error);
  //     return "Error detecting language";
  //   }
  // };
  const detectLanguage = async (text) => {
    if (!window.navigator.ai?.getTextLanguageDetector) {
      console.error("Chrome AI API is NOT supported in this browser.");
      return "Unknown";
    }
    try {
      const ai = window.navigator.ai.getTextLanguageDetector();
      const result = await ai.detect(text);
      console.log("Detected language:", result.language);
      return result.language;
    } catch (error) {
      console.error("Language detection error:", error);
      return "Error detecting language";
    }
  };
  

  const summarizeText = async (text) => {
    if (!window.navigator.ai?.getTextSummarizer) return;
    try {
      const ai = window.navigator.ai.getTextSummarizer();
      const result = await ai.summarize(text);
      setMessages((prev) =>
        prev.map((msg, index) =>
          index === prev.length - 1 ? { ...msg, translation: result.translation } : msg
        )
      );
      
    } catch (error) {
      console.error("Summarization failed:", error);
    }
  };

  const translateText = async (text, targetLang) => {
    if (!window.navigator.ai?.getTextTranslator) return;
    try {
      const ai = window.navigator.ai.getTextTranslator();
      const result = await ai.translate(text, targetLang);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.text === text ? { ...msg, translation: result.translation } : msg
        )
      );
    } catch (error) {
      console.error("Translation failed:", error);
    }
  };

  return (
    <div className="container">
      <div className="message-output">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`msg ${msg.type === "user" ? "user-msg" : "bot-msg"}`}
          >
            <p>{msg.text}</p>

            {msg.type === "bot" && msg.text.length > 150 && language === "en" && (
              <button
                onClick={() => summarizeText(msg.text)}
                className="text-summary"
              >
                Summarize
              </button>
            )}

            {msg.summary && <p className="summary">Summary: {msg.summary}</p>}

            {/** ✅ Only show translation options for bot messages **/}
            {msg.type === "bot" && (
              <div className="translate-container">
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="select-lang"
                >
                  <option value="en">English</option>
                  <option value="pt">Portuguese</option>
                  <option value="es">Spanish</option>
                  <option value="ru">Russian</option>
                  <option value="tr">Turkish</option>
                  <option value="fr">French</option>
                </select>
                <button
                  onClick={() => translateText(msg.text, selectedLang)}
                  className="translate-text"
                >
                  Translate
                </button>
              </div>
            )}

            {msg.translation && (
              <p className="translation">
                Translated ({selectedLang}): {msg.translation}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="input-field">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button onClick={handleSend} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
};

export default TextProcessor;
