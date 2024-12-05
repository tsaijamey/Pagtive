import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const CodePreviewSandbox = ({ 
  htmlContent = '', 
  cssContent = '', 
  jsContent = '',
  width = '100%',
  height = '600px'
}) => {
  const iframeRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const updatePreview = () => {
      try {
        const iframe = iframeRef.current;
        if (!iframe) return;

        // Create a safe container document
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        
        // Construct the full HTML content
        const fullContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                /* Reset default styles */
                * { margin: 0; padding: 0; box-sizing: border-box; }
                /* Custom styles */
                ${cssContent}
              </style>
            </head>
            <body>
              ${htmlContent}
              <script>
                // Create a safe scope for JavaScript execution
                (function() {
                  try {
                    ${jsContent}
                  } catch (error) {
                    window.parent.postMessage({
                      type: 'error',
                      message: error.message
                    }, '*');
                  }
                })();
              </script>
            </body>
          </html>
        `;

        // Write the content to the iframe
        doc.open();
        doc.write(fullContent);
        doc.close();

        setError(null);
      } catch (err) {
        setError(err.message);
      }
    };

    // Handle error messages from the iframe
    const handleMessage = (event) => {
      if (event.data.type === 'error') {
        setError(event.data.message);
      }
    };

    window.addEventListener('message', handleMessage);
    updatePreview();

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [htmlContent, cssContent, jsContent]);

  return (
    <div className="w-full space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="relative bg-white border rounded-lg shadow-sm overflow-hidden">
        <iframe
          ref={iframeRef}
          className="w-full bg-white"
          style={{ height }}
          sandbox="allow-scripts allow-same-origin"
          title="Code Preview"
        />
      </div>
    </div>
  );
};

export default CodePreviewSandbox;