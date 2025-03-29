"use client";

import { getme } from "@/api/auth/getme";
import { Button } from "@/components/ui/button";
import { useUserWithLoading } from "@/hooks/useUser";
import ProfileCompletionAlert from "@/components/custom/ProfileCompletionAlert";

export default function Dashboard() {
  const { user, isLoading } = useUserWithLoading();

  const test = async () => {
    const res = await getme();
    console.log(res);
  };

  return (
    <>
      {!isLoading && <ProfileCompletionAlert user={user} className="mb-6" />}

      <h1>Candidate Dashboard</h1>
      <Button onClick={test}>Get user</Button>
    </>
  );
}
