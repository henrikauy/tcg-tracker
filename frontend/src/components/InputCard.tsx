import React, { useState } from "react";

const apiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || "http://127.0.0.1:8000";

// TypeScript interface describing the shape of a new release object
export interface NewRelease {
  name: string;
  link: string;
  status: string;
}

// Props interface for the InputCard component
interface InputCardProps {
  onAdd: (release: NewRelease) => void;
  accessToken: string;
}

// InputCard component allows users to add a new release
export const InputCard: React.FC<InputCardProps> = ({ onAdd, accessToken }) => {
  // State for the input fields
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  // Handles form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !link || !accessToken) return; // Prevent submission if fields are empty

    const payload = {
      name,
      url: link,
      source: "user",
      status: "Coming Soon",
      image: "",
    };

    try {
      const response = await fetch(`${apiUrl}/releases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("Error adding release: " + errorData.detail);
        return;
      }

      const data = await response.json();

      // Call the onAdd callback with the new release data
      onAdd({
        name: data.name,
        link: data.url,
        status: data.status,
      });
      setName(""); // Reset form fields
      setLink("");
    } catch (error) {
      alert("Failed to add release.");
    }
  };

  // Render the input form
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 flex flex-col gap-1 shadow-lg max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold text-zinc-100">Add New Release</h2>
      {/* Name input */}
      <label className="text-zinc-400 font-semibold" htmlFor="release-name">
        Set Name
      </label>
      <input
        id="release-name"
        type="text"
        placeholder="Set Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border border-zinc-700 rounded-lg px-4 py-1 text-zinc-400 focus:ring-2 focus:ring-indigo-400 transition"
        required
      />

      {/* Link input */}
      <label className="text-zinc-400" htmlFor="release-link">
        Link
      </label>
      <input
        id="release-link"
        type="url"
        placeholder="https://example.com"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        className="border border-zinc-700 rounded-lg px-4 py-1 text-zinc-100 focus:ring-2 focus:ring-indigo-400 transition"
        required
      />

      {/* Submit button */}
      <button
        type="submit"
        className="bg-zinc-800 text-zinc-400 font-bold rounded-lg py-2 mt-4 border-1 border-zinc-700 hover:bg-indigo-400 transition"
        disabled={!accessToken}
      >
        Add Release
      </button>
    </form>
  );
};
