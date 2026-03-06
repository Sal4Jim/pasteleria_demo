import { useEffect, useRef } from "react";

export function N8nChatWidget() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Add required CSS
    const link = document.createElement("link");
    link.href = "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Add module script
    const script = document.createElement("script");
    script.type = "module";
    script.innerHTML = `
      import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';

      createChat({
        webhookUrl: 'https://empleandon8n.onrender.com/webhook/ddaefe12-c7f0-4135-bc4e-5bd8f4cd8931/chat',
        initialMessages: [
          '¡Hola! Soy El pastelero que todo lo sabe y tu asistente virtual. ¿En qué puedo ayudarte hoy?'
        ],
        theme: {
          color: '#8b5cf6' // Purple color to stand out, matching pastry aesthetics if any, or a good primary color
        },
        i18n: {
          en: {
            title: 'El Pastelero que todo lo sabe',
            subtitle: 'Asistente Virtual',
            getStarted: 'Nueva conversación',
            inputPlaceholder: 'Escribe tu pregunta...',
          }
        }
      });
    `;
    document.body.appendChild(script);

    return () => {
      // Basic cleanup
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      
      initialized.current = false;
    };
  }, []);

  return null;
}
