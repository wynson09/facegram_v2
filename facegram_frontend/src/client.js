import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
    projectId: 'tdbbnrku',
    dataset: 'production',
    apiVersion: '2022-01-12',
    useCdn: true,
    token: 'skqPMhewPVBwFwH53GU5GQdSXNGlEOEjD3EMIMkdHaZIn1z0qZZbkgJlB0n3IKZIKQFuqlJggXRhep6wFL6XMfBDg6nFufgggJvNFlFbBm3CYPVsJScYqAXXS12Gu3WRoi7OrDgcFWRlDWWHG6fsQefoBRB6mZmbK6JqVi7GG3DWTap6mRG7',
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);