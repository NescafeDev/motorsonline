import { pool } from '../db';

export interface Contact {
  id: number;
  user_id: number;
  phone?: string;
  businessType?: string;
  socialNetwork?: string;
  email?: string;
  address?: string;
  website?: string;
  language?: string | string[];
  country?: string;
  created_at?: string;
  updated_at?: string;
}

export async function createContact(contact: Omit<Contact, 'id'>): Promise<Contact> {
  // Convert language array to comma-separated string if it's an array
  const languageString = Array.isArray(contact.language) 
    ? contact.language.join(',') 
    : contact.language || '';

  const [result]: any = await pool.query(
    `INSERT INTO contacts (
      user_id, phone, businessType, socialNetwork, email, address, website, language, country
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      contact.user_id,
      contact.phone,
      contact.businessType,
      contact.socialNetwork,
      contact.email,
      contact.address,
      contact.website,
      languageString,
      contact.country
    ]
  );
  return { id: result.insertId, ...contact };
}

export async function getContactByUserId(userId: number): Promise<Contact | null> {
  // Get the user's contact info directly by user_id
  const [rows]: any = await pool.query(
    `SELECT * FROM contacts 
     WHERE user_id = ? 
     ORDER BY created_at DESC 
     LIMIT 1`,
    [userId]
  );
  if (rows.length === 0) return null;
  
  const contact = rows[0];
  // Convert language string back to array if it exists
  if (contact.language && typeof contact.language === 'string') {
    contact.language = contact.language.split(',').filter(lang => lang.trim() !== '');
  }
  
  return contact;
}

export async function updateContact(userId: number, contact: Partial<Omit<Contact, 'id' | 'user_id'>>): Promise<boolean> {
  // Convert language array to comma-separated string if it's an array
  const processedContact = { ...contact };
  if (processedContact.language && Array.isArray(processedContact.language)) {
    processedContact.language = processedContact.language.join(',');
  }

  const fields = Object.keys(processedContact).map(key => `${key} = ?`).join(', ');
  const values = Object.values(processedContact);
  if (!fields) return false;
  
  const [result]: any = await pool.query(
    `UPDATE contacts SET ${fields}, updated_at = NOW() WHERE user_id = ?`,
    [...values, userId]
  );
  return result.affectedRows > 0;
}

export async function deleteContact(userId: number): Promise<boolean> {
  const [result]: any = await pool.query('DELETE FROM contacts WHERE user_id = ?', [userId]);
  return result.affectedRows > 0;
}

export async function createOrUpdateContact(contact: Omit<Contact, 'id'>): Promise<Contact> {
  // First, check if a contact already exists for this user
  const existingContact = await getContactByUserId(contact.user_id);
  
  if (existingContact) {
    // Update existing contact
    const success = await updateContact(contact.user_id, contact);
    if (success) {
      // Return the updated contact
      const updatedContact = await getContactByUserId(contact.user_id);
      return updatedContact!;
    }
    throw new Error('Failed to update existing contact');
  } else {
    // Create new contact
    return await createContact(contact);
  }
}
