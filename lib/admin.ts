// Obtenemos la cadena del .env y la dividimos por comas
// Usamos el operador de coalescencia nula (?? '') para evitar errores si la variable no existe
const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? '')
  .split(',')
  .map(email => email.trim().toLowerCase());

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}