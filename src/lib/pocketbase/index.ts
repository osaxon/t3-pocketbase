import PocketBase, { RecordAuthResponse } from "pocketbase";
import type {
  TypedPocketBase,
  UsersRecord,
  UsersResponse,
} from "./pocketbase-types";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export const POCKET_BASE_URL = "http://127.0.0.1:8090";

export class DatabaseClient {
  client: TypedPocketBase;

  constructor() {
    this.client = new PocketBase(POCKET_BASE_URL) as TypedPocketBase;
  }

  async login(
    email: string,
    password: string,
  ): Promise<RecordAuthResponse<UsersRecord>> {
    try {
      const result = await this.client
        .collection("users")
        .authWithPassword<UsersRecord>(email, password);
      if (!result?.token) {
        throw new Error("Invalid email or password");
      }
      return result;
    } catch (err) {
      console.error(err);
      throw new Error("Invalid email or password");
    }
  }

  async register(email: string, password: string) {
    try {
      const result = await this.client
        .collection<UsersResponse>("users")
        .create({
          email,
          password,
          passwordConfirm: password,
        });
      return result;
    } catch (err) {
      console.error(err);
      throw new Error("Invalid email or password");
    }
  }

  async isAuthenticated(cookieStore: ReadonlyRequestCookies) {
    const cookie = cookieStore.get("pb_auth");
    if (!cookie) {
      return false;
    }

    this.client.authStore.loadFromCookie(cookie?.value || "");
    return this.client.authStore.isValid || false;
  }

  async getUser(cookieStore: ReadonlyRequestCookies) {
    const cookie = cookieStore.get("pb_auth");
    if (!cookie) {
      return false;
    }

    this.client.authStore.loadFromCookie(cookie?.value || "");
    return this.client.authStore.model;
  }

  async refreshToken(cookieStore: ReadonlyRequestCookies) {
    const cookie = cookieStore.get("pb_auth");
    if (!cookie) {
      return false;
    }
    await this.client.collection("users").authRefresh();
  }
}

export const db = new DatabaseClient();

export default db;
