export type AuthUser = {
  id: number;
  email: string;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
  user: AuthUser;
};

export async function registerUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Failed to register");
  }

  return response.json() as Promise<AuthResponse>;
}

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Failed to login");
  }

  return response.json() as Promise<AuthResponse>;
}

export async function fetchMe(token: string) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }

  return response.json() as Promise<AuthUser>;
}