"use client";
import React, { useState } from "react";

function Well() {

    const [formData, setFormData] = useState({
        name: "",
        date: "",
        observations: "",
        company_id: "",
      });
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        const { name, date, observations, company_id } = {
          ...formData,
          company_id: Number(formData.company_id),
        };
    
        if (!name || !date || !observations || !company_id) {
          alert("All fields are required!");
          return;
        }
    
        try {

          const res = await fetch("http://localhost:3000/api/well", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, date, observations, company_id }),
          });
    
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Failed to submit company data");
          }
    
          alert("Company data submitted successfully!");
        } catch (error) {
          console.error("Error submitting company data:", error);
          alert(error.message);
        }
      };
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };

  return (
     <div className="p-10 space-y-6">
      <h1 className="text-neutral-500 font-bold text-4xl">well Form</h1>

      <form
        className="space-y-4 max-w-md p-6 border border-gray-200 rounded-lg shadow dark:border-gray-700"
        onSubmit={handleSubmit}
      >
        <div>
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Date:
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="observations" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Observations:
          </label>
          <textarea
            id="observations"
            name="observations"
            value={formData.observations}
            onChange={handleChange}
            placeholder="Enter observations"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="company_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Company ID:
          </label>
          <input
            type="number"
            id="company_id"
            name="company_id"
            value={formData.company_id}
            onChange={handleChange}
            placeholder="Enter company ID"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>

        <button
          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          type="submit"
        >
          Submit Well 
        </button>
      </form>
    </div>
  )
}

export default Well
