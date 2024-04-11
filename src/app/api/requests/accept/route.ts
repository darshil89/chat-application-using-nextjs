import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id: idToAdd } = z
      .object({
        id: z.string(),
      })
      .parse(body);

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    //check if both are already friends
    const isAlreadyFriend = await fetchRedis(
      "sismember",
      `user:${session?.user.id}:friends`,
      idToAdd
    );

    if (isAlreadyFriend) {
      return new Response("Already friends", { status: 400 });
    }

    //if the user friend request is already there in friend requests
    const hasFriendRequest = await fetchRedis(
      "sismember",
      `user:${session?.user.id}:incoming_friend_requests`,
      idToAdd
    );

    if (!hasFriendRequest) {
      return new Response("No friend Request", { status: 400 });
    }

    await db.sadd(`user:${session.user.id}:friends`, idToAdd);

    await db.sadd(`user:${idToAdd}:friends`, session.user.id);

    await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd);

    return new Response("ok", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid Request Payload", { status: 400 });
    }
    console.log(error);
    return new Response("Invalid Request from accept", { status: 400 });
  }
}
