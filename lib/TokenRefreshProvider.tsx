"use client";

import useTokenRefresh from "@/api/auth/refreshtoken";

const TokenRefreshProvider = () => {
  useTokenRefresh();
  return null;
};

export default TokenRefreshProvider;
