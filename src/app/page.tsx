"use client";
import { useEffect, useState } from "react";

async function fetchWeatherData() {
  const apiPath = "/api/weather";
  const response = await fetch(window.location.origin + apiPath, {
    method: "GET",
    headers: {
      "Content-Type": "text/plain",
    },
  });
  return response.body ?? null;
}

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchWeatherData().then((data) => setData(data || null));
  }, []);

  return (
    <div>
      <h1>Welcome to our App</h1>
      {data && <div>{JSON.stringify(data)}</div>}
    </div>
  );
}
