import { db } from "@/lib/db";
import { FC } from "react";

interface Props {}

const page: FC<Props> = async () => {
  await db.set("intro", "my name is darshil");
  return <div>page</div>;
};

export default page;
