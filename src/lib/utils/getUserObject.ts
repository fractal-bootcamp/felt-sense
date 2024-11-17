import { getSession } from "@workos-inc/authkit-nextjs";
import { User } from "@/types";

export const getUserObject: () => Promise<User> = async () => {
  const session = await getSession();
  const user = session?.user;
  return user;
};