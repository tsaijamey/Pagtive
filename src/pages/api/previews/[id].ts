// pages/api/previews/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

// Define the structure of preview data
interface PreviewData {
  html: string;
  css: string;
  javascript: string;
  metadata?: {
    title?: string;
    description?: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;

  try {
    // In production, you might want to fetch this from a database
    // For development, we'll read from the filesystem
    const previewDir = path.join(process.cwd(), 'previews', id as string);
    
    // Read the files
    const [html, css, js, meta] = await Promise.all([
      fs.readFile(path.join(previewDir, 'index.html'), 'utf-8').catch(() => ''),
      fs.readFile(path.join(previewDir, 'styles.css'), 'utf-8').catch(() => ''),
      fs.readFile(path.join(previewDir, 'script.js'), 'utf-8').catch(() => ''),
      fs.readFile(path.join(previewDir, 'metadata.json'), 'utf-8').catch(() => '{}'),
    ]);

    const previewData: PreviewData = {
      html,
      css,
      javascript: js,
      metadata: JSON.parse(meta),
    };

    res.status(200).json(previewData);
  } catch (error) {
    console.error('Preview loading error:', error);
    res.status(500).json({ message: 'Failed to load preview' });
  }
}