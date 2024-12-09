// pages/preview/[id].tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import CodePreviewSandbox from '@/components/CodePreviewSandbox';

interface PreviewData {
  html: string;
  css: string;
  javascript: string;
  metadata?: {
    title?: string;
    description?: string;
  };
}

export default function PreviewPage() {
  const router = useRouter();
  const { id } = router.query;
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreviewData = async () => {
      if (!id) return;

      try {
        // Fetch preview data from your API
        const response = await fetch(`/api/previews/${id}`);
        if (!response.ok) {
          throw new Error('Failed to load preview data');
        }

        const data = await response.json();
        setPreviewData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPreviewData();
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!previewData) {
    return (
      <div className="flex items-center justify-center min-h-screen">No preview data found</div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {previewData.metadata?.title && (
        <h1 className="text-2xl font-bold mb-4">{previewData.metadata.title}</h1>
      )}
      {previewData.metadata?.description && (
        <p className="text-gray-600 mb-6">{previewData.metadata.description}</p>
      )}

      <CodePreviewSandbox
        htmlContent={previewData.html}
        cssContent={previewData.css}
        jsContent={previewData.javascript}
        height="85vh"
      />
    </div>
  );
}
