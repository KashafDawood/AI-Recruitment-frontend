"use client";

import { useState } from "react";

export default function Dashboard() {
  const [candidateData, setCandidateData] = useState(null);
  const [showData, setShowData] = useState(false);

  const fetchCandidate = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/users/candidate/me`,
      {
        credentials: "include",
      }
    );
    const data = await res.json();
    setCandidateData(data);
  };

  const handleClick = () => {
    fetchCandidate();
    setShowData(true);
  };

  return (
    <>
      <h1>Candidate Dashboard</h1>
      <button onClick={handleClick}>Show Candidate Data</button>
      {showData && candidateData && (
        <div>
          <p>Candidate: {candidateData}</p>
        </div>
      )}
    </>
  );
}
