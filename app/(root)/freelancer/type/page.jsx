"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ServiceCard from "@/components/card/ServiceCard";
import SearchBar from "@/components/searchBar/SearchBar";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function FreelancerPage() {
  const searchParams = useSearchParams();
  const interest = searchParams.get("interest") || "";
  const skills = searchParams.get("skills") || "";

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const decodedInterest = decodeURIComponent(interest);
  const decodedSkills = decodeURIComponent(skills);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let apiUrl = "/api/freelancer/type?";
        if (interest) apiUrl += `interest=${encodeURIComponent(interest)}&`;
        if (skills) apiUrl += `skills=${encodeURIComponent(skills)}&`;
        apiUrl = apiUrl.endsWith("&") ? apiUrl.slice(0, -1) : apiUrl;

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [interest, skills]);

  if (loading) {
    return (
      <div className="min-h-[80vh] w-[100vw]">
        <Box sx={{ display: "flex" }}>
          <div className="pt-80 flex items-center justify-center text-center mx-auto">
            <CircularProgress color="inherit" size="8rem" />
          </div>
        </Box>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] w-[100vw] flex items-center justify-center text-center">
        <p className="text-red-500 text-xl">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-[80vh]">
      <div>
        <SearchBar />
      </div>
      {data.length === 0 ? (
        <p className="text-center text-2xl mt-10 md:text-5xl">
          No Mentor found for {decodedInterest || decodedSkills || "your search criteria"}
        </p>
      ) : (
        <>
          <p className="text-center font-bold text-2xl md:text-5xl my-10">
            Mentor for{" "}
            <span className="text-blue-600">
              {decodedInterest || decodedSkills}
            </span>
          </p>
          <div className="flex flex-wrap gap-8">
            {data.map((freelancer) => (
              <ServiceCard key={freelancer._id} {...freelancer} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] w-[100vw] flex items-center justify-center"><CircularProgress size="4rem" /></div>}>
      <FreelancerPage />
    </Suspense>
  );
}
