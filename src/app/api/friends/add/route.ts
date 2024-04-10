import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { addFriendValidate } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email: emailToAdd } = addFriendValidate.parse(body);

    const idToAdd = (await fetchRedis("get", `user:email:${emailToAdd}`)) as string;

    const session = await getServerSession(authOptions);

    //if the person you are trying to add is not found in the database, return a 404
    if (!idToAdd) {
      return new Response("User not found", { status: 404 });
    }

    //if you are not logged in, return a 401
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    //if the person you are trying to add is yourself, return a 400
    if (idToAdd === session.user.id) {
      return new Response("You can't add yourself as a friend", {
        status: 400,
      });
    }

    //check if the user is already added in friend requests
    const isAlreadyAdded = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id
    )) as 0 | 1;

    if (isAlreadyAdded) {
      return new Response("Already added this user", { status: 400 });
    }

    //check if the user is already friends

    const isAlreadyfriends = (await fetchRedis(
      "sismember",
      `user:${session.user.id}:incoming_friend_requests`,
      idToAdd
    )) as 0 | 1;

    if (isAlreadyfriends) {
      return new Response("Alreay friends with this user", { status: 400 });
    }

    //add the friend request
    // this line tells that the person i wanted to add will be added to their incoming friend requests
    db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);

    return new Response("Friend request sent", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }

    return new Response("Invalid request", { status: 400 });
  }
}
