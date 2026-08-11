import axios, { AxiosInstance } from "axios";

/**
 * Craft API Client
 * Handles authentication and API calls to Craft.io
 */

export interface CraftAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface CraftOAuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  expiresAt: number;
}

export interface CraftCollection {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface CraftDocument {
  id: string;
  title: string;
  collectionId: string;
  createdAt: string;
  updatedAt: string;
  blocks: CraftBlock[];
}

export interface CraftBlock {
  id: string;
  type: string;
  content: unknown;
}

class CraftAPIClient {
  private client: AxiosInstance;
  private token: CraftOAuthToken | null = null;
  private authConfig: CraftAuthConfig;

  constructor(authConfig: CraftAuthConfig) {
    this.authConfig = authConfig;
    this.client = axios.create({
      baseURL: "https://api.craft.io/v2",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Generate OAuth authorization URL
   */
  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.authConfig.clientId,
      redirect_uri: this.authConfig.redirectUri,
      response_type: "code",
      state,
      scope:
        "collections:read collections:write documents:read documents:write",
    });
    return `https://oauth.craft.io/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<CraftOAuthToken> {
    try {
      const response = await axios.post("https://oauth.craft.io/token", {
        grant_type: "authorization_code",
        code,
        client_id: this.authConfig.clientId,
        client_secret: this.authConfig.clientSecret,
        redirect_uri: this.authConfig.redirectUri,
      });

      const token: CraftOAuthToken = {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
        expiresAt: Date.now() + response.data.expires_in * 1000,
      };

      this.token = token;
      this.setAuthHeader(token.accessToken);
      return token;
    } catch (error) {
      console.error("Failed to exchange code for token:", error);
      throw new Error("Failed to authenticate with Craft");
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<CraftOAuthToken> {
    try {
      const response = await axios.post("https://oauth.craft.io/token", {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: this.authConfig.clientId,
        client_secret: this.authConfig.clientSecret,
      });

      const token: CraftOAuthToken = {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token || refreshToken,
        expiresIn: response.data.expires_in,
        expiresAt: Date.now() + response.data.expires_in * 1000,
      };

      this.token = token;
      this.setAuthHeader(token.accessToken);
      return token;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      throw new Error("Failed to refresh Craft authentication");
    }
  }

  /**
   * Set authorization header
   */
  private setAuthHeader(accessToken: string): void {
    this.client.defaults.headers.common["Authorization"] =
      `Bearer ${accessToken}`;
  }

  /**
   * Get all collections
   */
  async getCollections(): Promise<CraftCollection[]> {
    try {
      const response = await this.client.get("/collections");
      return response.data.data || [];
    } catch (error) {
      console.error("Failed to fetch collections:", error);
      throw error;
    }
  }

  /**
   * Create a new collection
   */
  async createCollection(
    name: string,
    description?: string
  ): Promise<CraftCollection> {
    try {
      const response = await this.client.post("/collections", {
        name,
        description,
      });
      return response.data.data;
    } catch (error) {
      console.error("Failed to create collection:", error);
      throw error;
    }
  }

  /**
   * Get documents in a collection
   */
  async getDocuments(collectionId: string): Promise<CraftDocument[]> {
    try {
      const response = await this.client.get(
        `/collections/${collectionId}/documents`
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      throw error;
    }
  }

  /**
   * Create a new document
   */
  async createDocument(
    collectionId: string,
    title: string,
    content?: unknown
  ): Promise<CraftDocument> {
    try {
      const response = await this.client.post(
        `/collections/${collectionId}/documents`,
        {
          title,
          blocks: content ? [{ type: "text", content }] : [],
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Failed to create document:", error);
      throw error;
    }
  }

  /**
   * Update a document
   */
  async updateDocument(
    documentId: string,
    updates: Partial<CraftDocument>
  ): Promise<CraftDocument> {
    try {
      const response = await this.client.patch(
        `/documents/${documentId}`,
        updates
      );
      return response.data.data;
    } catch (error) {
      console.error("Failed to update document:", error);
      throw error;
    }
  }

  /**
   * Delete a document
   */
  async deleteDocument(documentId: string): Promise<void> {
    try {
      await this.client.delete(`/documents/${documentId}`);
    } catch (error) {
      console.error("Failed to delete document:", error);
      throw error;
    }
  }

  /**
   * Get current token
   */
  getToken(): CraftOAuthToken | null {
    return this.token;
  }

  /**
   * Set token (for restoring from storage)
   */
  setToken(token: CraftOAuthToken): void {
    this.token = token;
    this.setAuthHeader(token.accessToken);
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    if (!this.token) return true;
    return Date.now() >= this.token.expiresAt - 60000; // 1 minute buffer
  }
}

export default CraftAPIClient;
