"use client";
import React, { useState } from 'react';

function SafetyTalkSubtitleForm() {
  const [formData, setFormData] = useState({
    subtitle: "",
    safety_talk_id: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { subtitle, safety_talk_id } = { 
      ...formData, 
      safety_talk_id: Number(formData.safety_talk_id) 
    };

    if (!subtitle || !safety_talk_id) {
      alert("All fields are required!");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/safety_talk_Subtitle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subtitle, safety_talk_id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit Safety Talk Subtitle");
      }

      alert("Safety Talk Subtitle submitted successfully!");
    } catch (error) {
      console.error("Error submitting Safety Talk Subtitle:", error);
      alert(error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-neutral-500 font-bold text-4xl">Safety Talk Subtitle Form</h1>

      <form
        className="space-y-4 max-w-md p-6 border border-gray-200 rounded-lg shadow dark:border-gray-700"
        onSubmit={handleSubmit}
      >
        <div>
          <label htmlFor="subtitle" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Subtitle:
          </label>
          <input
            type="text"
            id="subtitle"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            placeholder="Enter subtitle"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="safety_talk_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Safety Talk ID:
          </label>
          <input
            type="number"
            id="safety_talk_id"
            name="safety_talk_id"
            value={formData.safety_talk_id}
            onChange={handleChange}
            placeholder="Enter Safety Talk ID"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>

        <button
          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          type="submit"
        >
          Submit Subtitle
        </button>
      </form>
    </div>
  );
}

export default SafetyTalkSubtitleForm;
