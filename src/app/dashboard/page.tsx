import { db } from "@/lib/db";
import { FC } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
interface Props {}

const page: FC<Props> = async () => {
  const session = await getServerSession(authOptions);
  console.log("session = ", session);

  return <div>{JSON.stringify(session)}</div>;
};

export default page;
