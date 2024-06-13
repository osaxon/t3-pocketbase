import { CreatePost } from "@/app/_components/create-post";
import db from "@/lib/pocketbase";
import { api } from "@/trpc/server";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = cookies();
  const user = await db.getUser(cookieStore);

  return (
    <main className="">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-xl">Welcome {user?.email}</h1>
        <CrudShowcase />
      </div>
    </main>
  );
}

async function CrudShowcase() {
  const latestPost = await api.post.getLatest();

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <p className="truncate">The most recent post: {latestPost.title}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost />
    </div>
  );
}
