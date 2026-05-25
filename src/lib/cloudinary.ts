import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

// Luxury Japandi minimal aesthetic fallback images from Unsplash
const AES_MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80', // Ceramic vase
  'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80', // Oak chair
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80', // Linen sofa
  'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80', // Minimal table
  'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80', // Clay teapot
  'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80', // Ceramic bowls
  'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80', // Japandi light & shadow
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80', // Minimal bedding
];

export async function uploadImage(fileBuffer: Buffer, fileName: string, folder: string = 'japandi_luxury'): Promise<string> {
  // If credentials exist, attempt to upload to Cloudinary using standard REST API (safer & bundle-free)
  if (CLOUD_NAME && API_KEY && API_SECRET) {
    try {
      const timestamp = Math.round(new Date().getTime() / 1000).toString();
      const stringToSign = `folder=${folder}&timestamp=${timestamp}${API_SECRET}`;
      
      // Calculate SHA-1 signature
      const { createHash } = await import('crypto');
      const signature = createHash('sha1').update(stringToSign).digest('hex');

      const formData = new FormData();
      const blob = new Blob([new Uint8Array(fileBuffer)]);
      
      formData.append('file', blob, fileName);
      formData.append('api_key', API_KEY);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      formData.append('folder', folder);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error, falling back to local storage:', error);
    }
  }

  // Dual-mode mock fallback: save the file locally into the public folder so it's fully accessible!
  try {
    const publicDir = join(process.cwd(), 'public');
    const uploadsDir = join(publicDir, 'uploads');
    
    // Ensure directories exist
    if (!existsSync(publicDir)) mkdirSync(publicDir);
    if (!existsSync(uploadsDir)) mkdirSync(uploadsDir);
    
    const uniqueName = `${Date.now()}-${fileName.replace(/\s+/g, '-')}`;
    const filePath = join(uploadsDir, uniqueName);
    
    writeFileSync(filePath, fileBuffer);
    return `/uploads/${uniqueName}`;
  } catch (error) {
    console.error('Local mock upload error, falling back to dynamic aesthetic image:', error);
    // Ultimate fallback to one of our premium Japandi aesthetic images
    const index = Math.floor(Math.random() * AES_MOCK_IMAGES.length);
    return AES_MOCK_IMAGES[index];
  }
}

/**
 * Returns a random beautiful aesthetic placeholder image for category or product seeding.
 */
export function getAestheticPlaceholder(index?: number): string {
  if (index !== undefined && index >= 0 && index < AES_MOCK_IMAGES.length) {
    return AES_MOCK_IMAGES[index];
  }
  return AES_MOCK_IMAGES[Math.floor(Math.random() * AES_MOCK_IMAGES.length)];
}
