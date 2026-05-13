const STORAGE_KEY = 'cinema_admin_credentials';
const DEFAULT_CREDENTIALS = { username: 'Terrence', password: 'admin123' };

interface Credentials {
  username: string;
  password: string;
}

function readCredentials(): Credentials {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // corrupted data, reset to default
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CREDENTIALS));
  return { ...DEFAULT_CREDENTIALS };
}

function writeCredentials(creds: Credentials): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(creds));
}

export function getCredentials(): Credentials {
  return readCredentials();
}

export function validateCredentials(username: string, password: string): boolean {
  const creds = readCredentials();
  return creds.username === username && creds.password === password;
}

export function updateUsername(currentPassword: string, newUsername: string): { success: boolean; error?: string } {
  const creds = readCredentials();
  if (creds.password !== currentPassword) {
    return { success: false, error: '当前密码不正确' };
  }
  if (!newUsername.trim()) {
    return { success: false, error: '新用户名不能为空' };
  }
  if (newUsername.trim() === creds.username) {
    return { success: false, error: '新用户名与当前用户名相同' };
  }
  writeCredentials({ username: newUsername.trim(), password: creds.password });
  return { success: true };
}

export function updatePassword(currentPassword: string, newPassword: string): { success: boolean; error?: string } {
  const creds = readCredentials();
  if (creds.password !== currentPassword) {
    return { success: false, error: '当前密码不正确' };
  }
  if (!newPassword) {
    return { success: false, error: '新密码不能为空' };
  }
  writeCredentials({ username: creds.username, password: newPassword });
  return { success: true };
}
