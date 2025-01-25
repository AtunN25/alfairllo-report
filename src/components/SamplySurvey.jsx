"use client";
import React, { useState } from "react";

function SamplySurvey() {
    const [formData, setFormData] = useState({
        date: "",
        from: "",
        to: "",
        unsampled_meters: "",
        well_id: "",
      });
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        const payload = {
          date: formData.date,
          from: parseFloat(formData.from),
          to: parseFloat(formData.to),
          unsampled_meters: parseFloat(formData.unsampled_meters),
          well_id: Number(formData.well_id),
        };
    
        if (!payload.date || isNaN(payload.from) || isNaN(payload.to) || isNaN(payload.unsampled_meters) || isNaN(payload.well_id)) {
          alert("Todos los campos son obligatorios y deben ser válidos.");
          return;
        }
    
        try {
          const res = await fetch("http://localhost:3000/api/samply_surverys", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
    
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Error al enviar los datos.");
          }
    
          alert("Datos enviados correctamente.");
          setFormData({ date: "", from: "", to: "", unsampled_meters: "", well_id: "" });
        } catch (error) {
          console.error("Error:", error);
          alert(error.message);
        }
      };

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-neutral-500 font-bold text-4xl">Samply Survey Form</h1>

      <form
        className="space-y-4 max-w-md p-6 border border-gray-200 rounded-lg shadow dark:border-gray-700"
        onSubmit={handleSubmit}
      >
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
          <label htmlFor="from" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            From:
          </label>
          <input
            type="number"
            step="0.1"
            id="from"
            name="from"
            value={formData.from}
            onChange={handleChange}
            placeholder="Enter from value"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="to" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            To:
          </label>
          <input
            type="number"
            step="0.1"
            id="to"
            name="to"
            value={formData.to}
            onChange={handleChange}
            placeholder="Enter to value"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="unsampled_meters" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Unsampled Meters:
          </label>
          <input
            type="number"
            step="0.1"
            id="unsampled_meters"
            name="unsampled_meters"
            value={formData.unsampled_meters}
            onChange={handleChange}
            placeholder="Enter unsampled meters"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="well_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Well ID:
          </label>
          <input
            type="number"
            id="well_id"
            name="well_id"
            value={formData.well_id}
            onChange={handleChange}
            placeholder="Enter well ID"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>

        <button
          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          type="submit"
        >
          Submit Survey
        </button>
      </form>
    </div>
  )
}

export default SamplySurvey
