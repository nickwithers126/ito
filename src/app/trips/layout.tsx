import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import { UserMenu } from "@/components/user-menu";
import Link from "next/link";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const user = await supabase.auth.getUser();
  const user_fullname = user.data.user?.user_metadata.full_name;
  const user_avatar_url = user.data.user?.user_metadata.avatar_url;

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex justify-between p-4">
        <Link href="/trips" className="flex items-center gap-2">
          <Image src="/ito_logo.png" alt="ito logo" width={48} height={48} />
          <p className="text-2xl font-semibold tracking-tight">ito</p>
        </Link>
        <div>
          <UserMenu avatarUrl={user_avatar_url} name={user_fullname} />
        </div>
      </header>
      {children}
    </div>
  );
}
