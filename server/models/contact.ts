import { pool } from '../db';

export interface Contact {
  id: number;
  car_id: number;
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
      car_id, phone, businessType, socialNetwork, email, address, website, language, country
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      contact.car_id,
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

export async function getContactByCarId(carId: number): Promise<Contact | null> {
  const [rows]: any = await pool.query(
    'SELECT * FROM contacts WHERE car_id = ?',
    [carId]
  );
  if (rows.length === 0) return null;
  
  const contact = rows[0];
  // Convert language string back to array if it exists
  if (contact.language && typeof contact.language === 'string') {
    contact.language = contact.language.split(',').filter(lang => lang.trim() !== '');
  }
  
  return contact;
}

export async function updateContact(carId: number, contact: Partial<Omit<Contact, 'id' | 'car_id'>>): Promise<boolean> {
  // Convert language array to comma-separated string if it's an array
  const processedContact = { ...contact };
  if (processedContact.language && Array.isArray(processedContact.language)) {
    processedContact.language = processedContact.language.join(',');
  }

  const fields = Object.keys(processedContact).map(key => `${key} = ?`).join(', ');
  const values = Object.values(processedContact);
  if (!fields) return false;
  
  const [result]: any = await pool.query(
    `UPDATE contacts SET ${fields}, updated_at = NOW() WHERE car_id = ?`,
    [...values, carId]
  );
  return result.affectedRows > 0;
}

export async function deleteContact(carId: number): Promise<boolean> {
  const [result]: any = await pool.query('DELETE FROM contacts WHERE car_id = ?', [carId]);
  return result.affectedRows > 0;
}
