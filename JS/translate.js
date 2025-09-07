document.addEventListener("DOMContentLoaded", () => {
    const langSelect = document.getElementById("language-select");
    const page = document.body.getAttribute("data-page"); // detect which page we’re on
  
    // Load saved language or default to English
    const savedLang = localStorage.getItem("selectedLanguage") || "en";
    langSelect.value = savedLang;
    loadLanguage(savedLang);
  
    langSelect.addEventListener("change", () => {
      const lang = langSelect.value;
      localStorage.setItem("selectedLanguage", lang); // save user choice
      loadLanguage(lang);
    });
  
    function loadLanguage(lang) {
      //Special handling for chatbot page
      if (page === "chatbot") {
       fetch(`./translations/chatbot_${lang}.json`)
          .then(res => res.json())
          .then(data => {
           window.categories = data.categories;
           window.answers = data.answers;
          
           if (typeof refreshChatUI === "function") {
             refreshChatUI();
            }
        })
        .catch(err => console.error(`Error loading chatbot translations for ${lang}:`, err));
        return;
      }
      fetch(`./translations/${page}.json`)
        .then(res => res.json())
        .then(data => {
          const translations = data[lang];
  
          if (!translations) {
            console.warn(`⚠ No translations found for ${lang} in ${page}.json`);
            return;
          }
  
          Object.keys(translations).forEach(key => {
            if (key.endsWith("_placeholder")) {
              // Handle placeholders
              const id = key.replace("_placeholder", "");
              const element = document.getElementById(id);
              if (element) element.setAttribute("placeholder", translations[key]);
            } else if (key.endsWith("_placeholder")) {
               const id = key.replace("_placeholder", "");
               const element = document.getElementById(id);
               if (element) element.setAttribute("placeholder", translations[key]);
              } else if (key.endsWith("_attr")) {
               // For generic attribute setting like title, aria-label, etc.
               const [id, attr] = key.split("_attr_");
               const element = document.getElementById(id);
               if (element && attr) element.setAttribute(attr, translations[key]);
              } else {
               // Default: innerHTML replacement
               const element = document.getElementById(key);
               if (element) element.innerHTML = translations[key];
              }
          });
        })
        .catch(err => console.error(`Error loading translations for ${page}:`, err));
    }
  });