import { db } from "@/lib/db";
import { FC } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
interface Props {}

const page: FC<Props> = async () => {
  const session = await getServerSession(authOptions);
  console.log("session = ", session);

  return  <div className="max-w-xs rounded overflow-hidden shadow-lg bg-white">
  <img className="w-32 h-32 rounded-full mx-auto mt-4" src={session?.user?.image || ""} alt="Profile" />
  <div className="px-6 py-4">
    <div className="font-bold text-xl mb-2">{session?.user.name}</div>
    <p className="text-gray-700 text-base">{session?.user.email}</p>
  </div>
</div>
};

export default page;
