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
        <CrudShowcase userId={user?.id as string} />
      </div>
    </main>
  );
}

async function CrudShowcase({ userId }: { userId: string }) {
  const posts = await api.post.getLatest({ userId });

  return (
    <div className="w-full max-w-xs">
      <CreatePost />

      <pre>
        <code>{JSON.stringify(posts, null, 2)}</code>
      </pre>
    </div>
  );
}
