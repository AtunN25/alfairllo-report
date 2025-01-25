"use client";
import React, { useState } from "react";

function Reception() {
    const [formData, setFormData] = useState({
        from: '',
        to: '',
        well_id: 1,
      });
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        const { from, to, well_id } = formData;
    
        if (!from || !to || !well_id) {
          alert('All fields are required!');
          return;
        }
    
        try {
          const res = await fetch('http://localhost:3000/api/reception', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });
    
          if (!res.ok) throw new Error('Failed to submit data');
          alert('Data submitted successfully!');
        } catch (error) {
          console.error('Error submitting data:', error);
        }
      };
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
  return (
    <div className="p-10 space-y-6">
    <h1 className="text-neutral-500 font-bold text-4xl">Reception Form</h1>

    <form
      className="space-y-4 max-w-md p-6 border border-gray-200 rounded-lg shadow dark:border-gray-700"
      onSubmit={handleSubmit}
    >
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900">
          From:
        </label>
        <input
          type="number"
          name="from"
          value={formData.from}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900">
          To:
        </label>
        <input
          type="number"
          name="to"
          value={formData.to}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900">
          Well ID:
        </label>
        <input
          type="number"
          name="well_id"
          value={formData.well_id}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>

      <button
        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        type="submit"
      >
        Submit Reception
      </button>
    </form>
  </div>

  )
}

export default Reception
