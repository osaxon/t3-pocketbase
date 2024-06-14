import PocketBase, { type RecordAuthResponse } from "pocketbase";
import type {
  PostsRecord,
  PostsResponse,
  TypedPocketBase,
  UsersRecord,
  UsersResponse,
} from "./pocketbase-types";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { env } from "@/env";

export const POCKET_BASE_URL = env.NEXT_PUBLIC_POCKETBASE_API_URL;

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
      throw new Error("No auth cookie found");
    }

    this.client.authStore.loadFromCookie(cookie?.value || "");

    const model = this.client.authStore.model;
    return model;
  }

  async refreshToken(cookieStore: ReadonlyRequestCookies) {
    const cookie = cookieStore.get("pb_auth");
    if (!cookie) {
      return false;
    }
    await this.client.collection("users").authRefresh();
  }

  async createPost(title: string, ownerId: string) {
    console.log("creating post", title);
    return this.client
      .collection("posts")
      .create<PostsResponse<PostsRecord>>({ title, owner: ownerId });
  }

  async getUsersPosts(userId: string) {
    return this.client
      .collection("posts")
      .getFullList<
        PostsResponse<PostsRecord>
      >({ filter: `owner = "${userId}"`, sort: "-created" });
  }

  async deletePost(postId: string) {
    return this.client.collection("posts").delete(postId);
  }
}

export const db = new DatabaseClient();

export const createServerClient = () => {
  return new DatabaseClient();
};

export default db;
