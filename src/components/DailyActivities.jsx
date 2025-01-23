"use client";
import React, { useState } from 'react';

function DailyActivities() {

 
    const [formData, setFormData] = useState({
      title: "",
      picture: "",
      report_id: "",
    });
  

    const handleSubmit = async (e) => {
      e.preventDefault();
      const { title, picture, report_id } = formData;
  
      if (!title || !picture || !report_id) {
        alert("All fields are required!");
        return;
      }
  
      try {

        console.log(JSON.stringify(formData))
        const res = await fetch("http://localhost:3000/api/daily_activities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
  
        if (!res.ok) throw new Error("Failed to submit report");
        alert("Report submitted successfully!");
      } catch (error) {
        console.error("Error submitting report:", error);
      }
    };
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    return (
        <div className="p-10 space-y-6">
        

            <form
                className="space-y-4 max-w-md p-6 border border-gray-200 rounded-lg shadow dark:border-gray-700"
                onSubmit={handleSubmit}
            >
                <div>
                    Daily Activities Form
                    <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Title:
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="picture" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Picture URL:
                    </label>
                    <input
                        type="url"
                        id="picture"
                        name="picture"
                        value={formData.picture}
                        onChange={handleChange}
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
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                    />
                </div>

                <button
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    type="submit"
                >
                    Submit Report
                </button>
            </form>
        </div>
    )
}

export default DailyActivities
