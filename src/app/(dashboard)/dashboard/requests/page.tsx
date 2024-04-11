import FriendRequests from "@/components/FriendRequests";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC } from "react";

interface friendRequests {}

const page: FC<friendRequests> = async ({}) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  //extract all the id of the friend requests from the redis set

  const friendsRequestIds = (await fetchRedis(
    "smembers",
    `user:${session?.user.id}:incoming_friend_requests`
  )) as string[];

  // now extract all the friend requests from the ids

  const incomingFriendRequests = await Promise.all(
    friendsRequestIds.map(async (senderId) => {
      const sender = (await fetchRedis("get", `user:${senderId}`)) as string;
      const senderParsed = JSON.parse(sender) as User;
      return {
        senderId,
        senderEmail: senderParsed.email,
      };
    })
  );

  return (
    <main className="pt-8 ">
      <h1 className="font-bold text-5xl mb-8">Friend Requests</h1>
      <div className="flex flex-col gap-4">
        <FriendRequests incomingFriendRequests={incomingFriendRequests} sessionId={session.user.id}/>
      </div>
    </main>
  );
};

export default page;
