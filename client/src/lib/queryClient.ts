import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Utiliser l'URL de l'API distante en production
  const apiUrl = import.meta.env.VITE_API_URL || '';
  const fullUrl = url.startsWith('/api') ? `${apiUrl}${url}` : url;
  
  console.log(`[API Request] ${method} ${fullUrl}`);
  
  try {
    const res = await fetch(fullUrl, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
      // Important pour Netlify Functions: Ces options permettent de s'assurer que
      // les cookies sont correctement envoyés et reçus
      mode: 'cors',
      cache: 'no-cache',
    });

    if (!res.ok) {
      console.error(`[API Error] ${method} ${url} - Status: ${res.status}`);
      const errorText = await res.text();
      console.error(`[API Error] Response: ${errorText}`);
      throw new Error(`${res.status}: ${errorText || res.statusText}`);
    }
    
    console.log(`[API Success] ${method} ${url} - Status: ${res.status}`);
    return res;
  } catch (error) {
    console.error(`[API Exception] ${method} ${url}:`, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Utiliser l'URL de l'API distante en production
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const url = queryKey[0] as string;
    const fullUrl = url.startsWith('/api') ? `${apiUrl}${url}` : url;
    
    console.log(`[API Query] GET ${fullUrl}`);
    
    try {
      const res = await fetch(fullUrl, {
        credentials: "include",
        // Important pour Netlify Functions: Ces options permettent de s'assurer que
        // les cookies sont correctement envoyés et reçus
        mode: 'cors',
        cache: 'no-cache',
      });
      
      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        console.log(`[API Query] GET ${url} - Auth requis (401), retourne null`);
        return null;
      }
      
      if (!res.ok) {
        console.error(`[API Query Error] GET ${url} - Status: ${res.status}`);
        const errorText = await res.text();
        console.error(`[API Query Error] Response: ${errorText}`);
        throw new Error(`${res.status}: ${errorText || res.statusText}`);
      }
      
      const data = await res.json();
      console.log(`[API Query Success] GET ${url} - Status: ${res.status}`);
      return data;
    } catch (error) {
      console.error(`[API Query Exception] GET ${url}:`, error);
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
