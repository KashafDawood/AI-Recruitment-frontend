"use client";

import { getme } from "@/api/auth/getme";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const test = async () => {
    const res = await getme();
    console.log(res);
  };

  return (
    <>
      <h1>Candidate Dashboard</h1>
      <Button onClick={test}>Get user</Button>
    </>
  );
}
