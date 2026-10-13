const KEY = 'parte_listo_company';

export interface Company {
  name: string;
  phone: string;
}

export const loadCompany = (): Company => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { name: '', phone: '', ...JSON.parse(raw) };
  } catch {
    /* sin datos guardados */
  }
  return { name: '', phone: '' };
};

export const saveCompany = (company: Company) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(company));
  } catch {
    /* almacenamiento lleno o bloqueado */
  }
};

// Teléfono español → formato wa.me (34XXXXXXXXX). Devuelve '' si no es válido.
export const whatsappNumber = (phone?: string): string => {
  const digits = (phone || '').replace(/\D/g, '');
  if (digits.length === 9) return `34${digits}`;
  if (digits.length >= 11) return digits;
  return '';
};
