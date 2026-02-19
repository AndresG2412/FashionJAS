// Lista de emails de administradores
const ADMIN_EMAILS = [
  'cgaviria930@gmail.com',
  // Agrega más emails aquí si necesitas
];

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}