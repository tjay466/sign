/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import SignageView from "./components/SignageView";
import AdminPanel from "./components/AdminPanel";
import { SignageData } from "./types";

export default function App() {
  const [data, setData] = useState<SignageData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if we're in admin mode via query param
    const params = new URLSearchParams(window.location.search);
    if (params.get("mode") === "admin") {
      setIsAdmin(true);
    }

    fetchData();
    // Poll for updates every 10 seconds if on signage view
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchData();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/signage");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch signage data", err);
    }
  };

  const handleUpdate = async (newData: Partial<SignageData>) => {
    try {
      const res = await fetch("/api/signage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      const updated = await res.json();
      setData(updated);
    } catch (err) {
      console.error("Failed to update signage", err);
    }
  };

  const toggleAdmin = () => {
    const newAdmin = !isAdmin;
    setIsAdmin(newAdmin);
    const url = new URL(window.location.href);
    if (newAdmin) url.searchParams.set('mode', 'admin');
    else url.searchParams.delete('mode');
    window.history.pushState({}, '', url);
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-indigo-300 font-medium">Initializing SignagePro...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {isAdmin ? (
        <AdminPanel data={data} onUpdate={handleUpdate} onClose={toggleAdmin} />
      ) : (
        <SignageView data={data} onOpenSettings={toggleAdmin} />
      )}
    </div>
  );
}

