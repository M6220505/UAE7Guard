import { storage } from "./storage";

let cachedDemoUserId: string | null = null;

const DEMO_USERNAME = "demo-user";

export async function getDemoUserId(): Promise<string> {
  if (cachedDemoUserId) {
    return cachedDemoUserId;
  }

  const demoUser = await storage.getUserByUsername(DEMO_USERNAME);
  
  if (demoUser) {
    cachedDemoUserId = demoUser.id;
    return demoUser.id;
  }

  const newUser = await storage.createUser({
    username: DEMO_USERNAME,
    email: "demo@uae7guard.com",
    password: "demo-password-secure"
  });
  
  cachedDemoUserId = newUser.id;
  return newUser.id;
}

export async function getUserIdForRequest(req: any): Promise<string> {
  if (req.user?.claims?.sub) {
    return req.user.claims.sub;
  }
  
  return await getDemoUserId();
}

export function clearDemoUserCache(): void {
  cachedDemoUserId = null;
}
