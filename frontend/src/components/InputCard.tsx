import React, { useState } from 'react';

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
}

// InputCard component allows users to add a new release
export const InputCard: React.FC<InputCardProps> = ({ onAdd }) => {
  // State for the input fields
  const [name, setName] = useState('');
  const [link, setLink] = useState('');

  // Handles form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !link) return; // Prevent submission if fields are empty

    const payload = {
      name,
      url: link,
      source: "user",
      status: 'Coming Soon',
    };

    try {
      const response = await fetch(`${apiUrl}/releases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
    setName(''); // Reset form fields
    setLink('');
    }
    catch (error) {
      alert("Failed to add release.");
    }
  };

  // Render the input form
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-theme-accent rounded-2xl p-6 flex flex-col gap-4 shadow-lg max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold text-black mb-4">Add New Release</h2>
      {/* Name input */}
      <label className="text-theme-accent font-semibold" htmlFor="release-name">
        Set Name
      </label>
      <input
        id="release-name"
        type="text"
        placeholder="Set Name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="input border border-theme-accent rounded-lg px-4 py-2 text-theme focus:ring-2 focus:ring-theme-accent transition"
        required
      />

      {/* Link input */}
      <label className="text-theme-accent font-semibold" htmlFor="release-link">
        Link
      </label>
      <input
        id="release-link"
        type="url"
        placeholder="https://example.com"
        value={link}
        onChange={e => setLink(e.target.value)}
        className="input border border-theme-accent rounded-lg px-4 py-2 text-theme focus:ring-2 focus:ring-theme-accent transition"
        required
      />

      {/* Submit button */}
      <button
        type="submit"
        className="btn bg-theme-accent text-theme font-bold rounded-lg py-2 mt-4 hover:bg-theme-accent-dark transition"
      >
        Add Release
      </button>
    </form>
  );
};