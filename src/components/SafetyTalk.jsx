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
    <div className="">
      <form
        className="cartadiv p-5"
        onSubmit={handleSubmit}
      >
        <div className="font-bold text-xl mb-2">Safety Talk Form</div>



        <div>
          <p className="text-gray-700 text-base font-sans">
            Titulo
          </p>
          <input className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Titulo"></input>
        </div>

        <div>
          <p className="text-gray-700 text-base">
            Supervisor:
          </p>
          <input className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Supervisor"></input>
        </div>

        <div>
          <p className="text-gray-700 text-base">
            Duracion:
          </p>
          <input className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-5 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Tiempo en minutos"></input>
        </div>

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

        <button className="bg-white hover:bg-slate-300  text-gray-800 font-semibold py-2 px-4 border border-slate-300 w-full rounded shadow">
          Enviar Datos
        </button>
      </form>
    </div>
  )
}

export default SafetyTalk
