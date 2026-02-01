'use server';

import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/env';

// 1. Create a "Write" Client
// We create a fresh client here so we can inject the secret token safely
const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // We want fresh data immediately
  token: process.env.SANITY_API_TOKEN, // <--- The Secret Key
});

export async function submitApplication(formData: any) {
  try {
    // 2. Prepare the Document
    const doc = {
      _type: 'affiliate',
      name: formData.name,
      email: formData.email,
      // Create a slug from the name (simple version)
      slug: {
        _type: 'slug',
        current: formData.name.toLowerCase().replace(/\s+/g, '-').slice(0, 96),
      },
      category: formData.category,
      socialReach: formData.socialReach,
      status: 'pending', // Default to "Pending Review"
    };

    // 3. Send to Sanity
    await writeClient.create(doc);

    return { success: true };
  } catch (error) {
    console.error('Sanity Write Error:', error);
    return { success: false, error: 'Failed to submit application' };
  }
}