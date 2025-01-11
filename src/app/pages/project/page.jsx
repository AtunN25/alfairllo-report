"use client";
import { useEffect, useState } from "react";

export default function ProjectPage() {
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
    <div className="bg-sky-950">
      <h1>Projects</h1>
      <ul>
        {data.map((project, index) => (
          <li key={index}>
            <strong>Name:</strong> {project.name} <br />
          </li>
        ))}
      </ul>

      <form className="p-4 "  onSubmit={handleSubmit}>
        <div>
          <label htmlFor="date">Date:</label>
          <input className="text-black"
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
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
            className="text-black"
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
            className="text-black"
            required
          />
        </div>
        <div>
          <label htmlFor="project_id">Project ID:</label>
          <input
            type="number"
            id="project_id"
            name="project_id"
            value={formData.project_id}
            onChange={handleChange}
            className="text-black"
            required
          />
        </div>
        <button className="bg-green-600 border-2 p-2" type="submit">Submit</button>
      </form>
    </div>
  );
}
