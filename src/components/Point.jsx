"use client";
import React, { useState } from 'react';

function Point() {

    const [formData, setFormData] = useState({
        description: "",
        activity_id: "",
      });
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        const { description, activity_id } = { 
          ...formData, 
          activity_id: Number(formData.activity_id) 
        };
    
        if (!description || !activity_id) {
          alert("All fields are required!");
          return;
        }
    
        try {
          const res = await fetch("http://localhost:3000/api/point", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ description, activity_id }),
          });
    
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Failed to submit Point");
          }
    
          alert("Point submitted successfully!");
        } catch (error) {
          console.error("Error submitting Point:", error);
          alert(error.message);
        }
      };
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-neutral-500 font-bold text-4xl">Point Form</h1>

      <form
        className="space-y-4 max-w-md p-6 border border-gray-200 rounded-lg shadow dark:border-gray-700"
        onSubmit={handleSubmit}
      >
        <div>
          <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Description:
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="activity_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Activity ID:
          </label>
          <input
            type="number"
            id="activity_id"
            name="activity_id"
            value={formData.activity_id}
            onChange={handleChange}
            placeholder="Enter activity ID"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>

        <button
          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          type="submit"
        >
          Submit Point
        </button>
      </form>
    </div>
  )
}

export default Point
