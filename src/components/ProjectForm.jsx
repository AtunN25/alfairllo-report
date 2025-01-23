"use client";

import { useEffect, useState } from "react";

export default function ProjectForm() {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    overseer: "",
    email: "",
    project_id: "",
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/project");
        if (!response.ok) throw new Error("Failed to fetch projects");
        const projects = await response.json();
        setData(projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to submit data");
      alert("Report submitted successfully!");
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-10 space-y-2">
      <h1 className="text-neutral-500 font-bold text-4xl">PROYECTO ALFARILLO FORM</h1>

      <div className="space-y-3 max-w-sm p-6 border border-gray-200 rounded-lg shadow dark:border-gray-700">
        <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Select an option
        </label>
        <select
          id="countries"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          {data.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <form
        className="space-y-3 max-w-sm p-6 border border-gray-200 rounded-lg shadow dark:border-gray-700"
        onSubmit={handleSubmit}
      >
        <h1>Report Form</h1>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="input-class"
            required
          />
        </div>
        <div>
          <label htmlFor="overseer">Overseer:</label>
          <input
            type="text"
            id="overseer"
            name="overseer"
            value={formData.overseer}
            onChange={handleChange}
            className="input-class"
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input-class"
            required
          />
        </div>
        <div>
          <label htmlFor="project_id">Project ID:</label>
          <select
            id="project_id"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="project_id"
            value={formData.project_id}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select a project
            </option>
            {data.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <button
          className="btn-class"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
