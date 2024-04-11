import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { FC } from "react";

interface friendRequests {}

const FriendRequests: FC<friendRequests> = async ({}) => {
  const session = await getServerSession(authOptions);

  return <div>Friends</div>;
};

export default FriendRequests;
