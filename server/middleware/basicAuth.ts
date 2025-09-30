import { Request, Response, NextFunction } from 'express';

interface BasicAuthCredentials {
  username: string;
  password: string;
}

interface BasicAuthOptions {
  users: { [username: string]: string }; // username -> password mapping
  realm?: string;
  message?: string;
}

/**
 * Basic Authentication Middleware
 * 
 * This middleware implements HTTP Basic Authentication as defined in RFC 7617.
 * It expects credentials to be sent in the Authorization header as:
 * Authorization: Basic <base64-encoded-credentials>
 * 
 * Where credentials are in the format: username:password
 */
export function basicAuth(options: BasicAuthOptions) {
  const { users, realm = 'Protected Area', message = 'Authentication required' } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return sendUnauthorized(res, realm, message);
    }

    try {
      // Extract and decode the base64 credentials
      const base64Credentials = authHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
      const [username, password] = credentials.split(':');

      if (!username || !password) {
        return sendUnauthorized(res, realm, message);
      }

      // Check if user exists and password matches
      if (!users[username] || users[username] !== password) {
        return sendUnauthorized(res, realm, message);
      }

      // Add user info to request object for use in route handlers
      (req as any).user = { username };
      next();
    } catch (error) {
      return sendUnauthorized(res, realm, message);
    }
  };
}

/**
 * Helper function to send 401 Unauthorized response with WWW-Authenticate header
 */
function sendUnauthorized(res: Response, realm: string, message: string) {
  res.set('WWW-Authenticate', `Basic realm="${realm}"`);
  return res.status(401).json({ 
    error: 'Unauthorized', 
    message,
    realm 
  });
}

/**
 * Utility function to generate Basic Auth header value
 * Use this in your client code to generate the Authorization header
 */
export function generateBasicAuthHeader(username: string, password: string): string {
  const credentials = `${username}:${password}`;
  const base64Credentials = Buffer.from(credentials).toString('base64');
  return `Basic ${base64Credentials}`;
}

/**
 * Utility function to parse Basic Auth header
 * Use this to extract credentials from a Basic Auth header
 */
export function parseBasicAuthHeader(authHeader: string): BasicAuthCredentials | null {
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return null;
  }

  try {
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    
    return { username, password };
  } catch (error) {
    return null;
  }
}
