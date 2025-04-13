import { useEffect } from 'react';

const BrevoWidget = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.innerHTML = `
      (function(d, w, c) {
          w.BrevoConversationsID = '67c367c9f11e3ba99b01643d';
          w[c] = w[c] || function() {
              (w[c].q = w[c].q || []).push(arguments);
          };
          var s = d.createElement('script');
          s.async = true;
          s.src = 'https://conversations-widget.brevo.com/brevo-conversations.js';
          if (d.head) d.head.appendChild(s);
      })(document, window, 'BrevoConversations');
    `;
    document.body.appendChild(script);
  }, []);

  return null; // This component doesn't render anything visible
};

export default BrevoWidget;
