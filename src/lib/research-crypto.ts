export interface Envelope { version: number; kdf: string; iterations: number; cipher: string; salt: string; iv: string; data: string }
function bytes(value: string): Uint8Array<ArrayBuffer> {
  return Uint8Array.from(atob(value), c => c.charCodeAt(0));
}
export async function decryptEnvelope(envelope: Envelope, password: string): Promise<ArrayBuffer> {
  if (envelope.version !== 1 || envelope.kdf !== 'PBKDF2-SHA256' || envelope.cipher !== 'AES-256-GCM' || envelope.iterations !== 600000) throw new Error('Format de chiffrement non pris en charge.');
  const salt = bytes(envelope.salt), iv = bytes(envelope.iv);
  if (salt.length !== 16 || iv.length !== 12) throw new Error('Enveloppe invalide.');
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey({name:'PBKDF2', salt, iterations:envelope.iterations, hash:'SHA-256'}, material, {name:'AES-GCM', length:256}, false, ['decrypt']);
  return crypto.subtle.decrypt({name:'AES-GCM', iv}, key, bytes(envelope.data));
}
