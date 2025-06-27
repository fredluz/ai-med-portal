// Simple logging utility for the application

export function logInfo(module: string, message: string, context?: any): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [INFO] [${module}] ${message}`, context ? context : '');
}

export function logError(module: string, message: string, context?: any): void {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] [ERROR] [${module}] ${message}`, context ? context : '');
}

export function logWarn(module: string, message: string, context?: any): void {
  const timestamp = new Date().toISOString();
  console.warn(`[${timestamp}] [WARN] [${module}] ${message}`, context ? context : '');
}
