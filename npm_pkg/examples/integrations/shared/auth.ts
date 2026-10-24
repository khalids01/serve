export async function authorizeRequest(_request: Request): Promise<boolean> {
  // Replace with your application's session and file-management permission check.
  // This example deliberately denies access until connected to your auth system.
  return false;
}
