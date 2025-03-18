import { User } from "@/store/userStore";
import React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const OpeningsCard: React.FC<{ user: User | null }> = ({ user }) => {
  return (
    <Card className="dark:bg-gray-900">
      <CardHeader>
        <h2 className="text-xl font-semibold">Current Openings</h2>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg bg-muted p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No open positions</h3>
          <p className="text-sm text-muted-foreground mb-4">
            There are currently no job openings at {user?.company_name}.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
