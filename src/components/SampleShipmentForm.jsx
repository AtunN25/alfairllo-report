"use client";
import React, { useState } from "react";

function SampleShipmentForm() {
    const [formData, setFormData] = useState({
        date: "",
        trc: "",
        trc_from: "",
        trc_to: "",
        meters_from: "",
        meters_to: "",
        observation: "",
        status: "",
        lab_shipment_id: "",
      });
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        const payload = {
          date: formData.date.trim(),
          trc: formData.trc.trim(),
          trc_from: Number(formData.trc_from),
          trc_to: Number(formData.trc_to),
          meters_from: Number(formData.meters_from),
          meters_to: Number(formData.meters_to),
          observation: formData.observation.trim(),
          status: formData.status.trim(),
          lab_shipment_id: Number(formData.lab_shipment_id),
        };
    
        if (
          !payload.date ||
          !payload.trc ||
          isNaN(payload.trc_from) ||
          isNaN(payload.trc_to) ||
          isNaN(payload.meters_from) ||
          isNaN(payload.meters_to) ||
          !payload.observation ||
          !payload.status ||
          isNaN(payload.lab_shipment_id)
        ) {
          alert("Todos los campos son obligatorios y deben ser válidos.");
          return;
        }
    
        try {
            console.log(JSON.stringify(payload))
          const res = await fetch("http://localhost:3000/api/sample_shipment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
    
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Error al enviar los datos.");
          }
    
          alert("Datos enviados correctamente.");
          setFormData({
            date: "",
            trc: "",
            trc_from: "",
            trc_to: "",
            meters_from: "",
            meters_to: "",
            observation: "",
            status: "",
            lab_shipment_id: "",
          });
        } catch (error) {
          console.error("Error:", error);
          alert(error.message);
        }
      };

  return (
    <div className="p-10 space-y-6">
  <h1 className="text-neutral-500 font-bold text-4xl">Sample Shipment Form</h1>

  <form
    className="space-y-4 max-w-md p-6 border border-gray-200 rounded-lg shadow dark:border-gray-700"
    onSubmit={handleSubmit}
  >
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900">Date:</label>
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        required
      />
    </div>

    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900">TRC:</label>
      <input
        type="text"
        name="trc"
        value={formData.trc}
        onChange={handleChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        required
      />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900">TRC From:</label>
        <input
          type="number"
          name="trc_from"
          value={formData.trc_from}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900">TRC To:</label>
        <input
          type="number"
          name="trc_to"
          value={formData.trc_to}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900">Meters From:</label>
        <input
          type="number"
          name="meters_from"
          value={formData.meters_from}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900">Meters To:</label>
        <input
          type="number"
          name="meters_to"
          value={formData.meters_to}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>
    </div>

    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900">Observation:</label>
      <input
        type="text"
        name="observation"
        value={formData.observation}
        onChange={handleChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        required
      />
    </div>

    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900">Status:</label>
      <input
        type="text"
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        required
      />
    </div>

    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900">Lab Shipment ID:</label>
      <input
        type="number"
        name="lab_shipment_id"
        value={formData.lab_shipment_id}
        onChange={handleChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        required
      />
    </div>

    <button className="w-full px-4 py-2 text-sm font-medium bg-blue-600 rounded-lg hover:bg-blue-700" type="submit">
      Submit Shipment
    </button>
  </form>
</div>
  )
}

export default SampleShipmentForm
