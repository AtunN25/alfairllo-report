"use client";
import React, { useState } from "react";

function LabShipment() {

    const [formData, setFormData] = useState({
        laboratory_name: "",
        status: "",
        well_id: "",
      });
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        const payload = {
          laboratory_name: formData.laboratory_name.trim(),
          status: formData.status.trim(),
          well_id: Number(formData.well_id),
        };
    
        if (!payload.laboratory_name || !payload.status || isNaN(payload.well_id)) {
          alert("Todos los campos son obligatorios y deben ser válidos.");
          return;
        }
    
        try {
          const res = await fetch("http://localhost:3000/api/lab_shipment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
    
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Error al enviar los datos.");
          }
    
          alert("Datos enviados correctamente.");
          setFormData({ laboratory_name: "", status: "", well_id: "" });
        } catch (error) {
          console.error("Error:", error);
          alert(error.message);
        }
      };

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-neutral-500 font-bold text-4xl">Lab Shipment Form</h1>

      <form
        className="space-y-4 max-w-md p-6 border border-gray-200 rounded-lg shadow dark:border-gray-700"
        onSubmit={handleSubmit}
      >
        <div>
          <label htmlFor="laboratory_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Laboratory Name:
          </label>
          <input
            type="text"
            id="laboratory_name"
            name="laboratory_name"
            value={formData.laboratory_name}
            onChange={handleChange}
            placeholder="Enter laboratory name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Status:
          </label>
          <input
            type="text"
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            placeholder="Enter status"
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
          Submit Shipment
        </button>
      </form>
    </div>
  )
}

export default LabShipment
