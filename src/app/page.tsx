import Button from "@/components/ui/Button";
import { db } from "@/lib/db";
import Image from "next/image";

export default async function Home() {
  // await db.set("hello:3", "world");
  return <Button>Hello</Button>;
}
