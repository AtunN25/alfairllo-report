"use client";
import React, { useState } from 'react';

function SafetyTalk() {

    const [formData, setFormData] = useState({
        speaker: "",
        time: "",
        report_id: "",
      });
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        const { speaker, time, report_id } = { 
          ...formData, 
          report_id: Number(formData.report_id) 
        };
    
        if (!speaker || !time || !report_id) {
          alert("All fields are required!");
          return;
        }
    
        try {
            console.log(JSON.stringify({ speaker, time, report_id }))
          const res = await fetch("http://localhost:3000/api/safety_talk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ speaker, time, report_id }),
          });
    
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Failed to submit Safety Talk");
          }
    
          alert("Safety Talk submitted successfully!");
        } catch (error) {
          console.error("Error submitting Safety Talk:", error);
          alert(error.message);
        }
      };
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };

  return (
     <div className="p-10 space-y-6">
      <h1 className="text-neutral-500 font-bold text-4xl">Safety Talk Form</h1>

      <form
        className="space-y-4 max-w-md p-6 border border-gray-200 rounded-lg shadow dark:border-gray-700"
        onSubmit={handleSubmit}
      >
        <div>
          <label htmlFor="speaker" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Speaker:
          </label>
          <input
            type="text"
            id="speaker"
            name="speaker"
            value={formData.speaker}
            onChange={handleChange}
            placeholder="Enter speaker's name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="time" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Time:
          </label>
          <input
            type="text"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            placeholder="Enter time details"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="report_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Report ID:
          </label>
          <input
            type="number"
            id="report_id"
            name="report_id"
            value={formData.report_id}
            onChange={handleChange}
            placeholder="Enter report ID"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>

        <button
          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          type="submit"
        >
          Submit Safety Talk
        </button>
      </form>
    </div>
  )
}

export default SafetyTalk
