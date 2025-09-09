import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createLead } from '../../api/leadApi';

const LeadForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: "",
    candidate_name: "",
    candidate_email: "",
    candidate_phone_no: "",
    linked_in_url: "",
    university: "",
    technology: "",
    visa: "",
    preferred_time_to_talk: "",
    source: "",
    status: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Lead:", formData);

    const payload = {
      ...formData,
      technology: formData.technology.split(",").map((t) => t.trim()).filter((t) => t != "")
    };

    try {
      const res = await createLead(payload);
      console.log("New Lead Added:", res.data);
      alert("Lead added successfully!");
      navigate("/leads");
    } catch (error) {
      console.error("Error adding lead:", error.response?.data || error.message);
      alert("Failed to add lead");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Add New Lead</h2>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">

        <div className="mb-3">
          <label className="form-label">Candidate Name</label>
          <input
            type="text"
            name="candidate_name"
            className="form-control"
            value={formData.candidate_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="candidate_email"
            className="form-control"
            value={formData.candidate_email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="text"
            name="candidate_phone_no"
            maxLength="10"
            className="form-control"
            value={formData.candidate_phone_no}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">LinkedIn URL</label>
          <input
            type="url"
            name="linked_in_url"
            className="form-control"
            value={formData.linked_in_url}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">University</label>
          <input
            type="text"
            name="university"
            className="form-control"
            value={formData.university}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Technology</label>
          <input
            type="text"
            name="technology"
            className="form-control"
            value={formData.technology}
            onChange={handleChange}
            placeholder="e.g React, Node, Angular"
          />
          <small className="text-muted">Enter multiple technologies separated by commas</small>
        </div>

        <div className="mb-3">
          <label className="form-label">Visa</label>
          
          {/* <input
            type="text"
            name="visa"
            className="form-control"
            value={formData.visa}
            onChange={handleChange}
          /> */}

          <select
            name="visa"
            className="form-control"
            value={formData.visa}
            onChange={handleChange}
            required
          >
            <option value="">----Select Type----</option>
            <option value="All Visa">All Visa</option>
            <option value="H1B">H1B</option>
            <option value="F1">F1</option>
            <option value="OPT">OPT</option>
            <option value="L1">L1</option>
            <option value="Green Card">Green Card</option>
            <option value="Citizen">Citizen</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Preferred Time To Talk</label>
          <select
            name="preferred_time_to_talk"
            className="form-control"
            value={formData.preferred_time_to_talk}
            onChange={handleChange}
            required
          >
            <option value="">----Select Time----</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Night">Night</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Source</label>
          <input
            type="text"
            name="source"
            className="form-control"
            value={formData.source}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Status</label>
          <input
            type="text"
            name="status"
            className="form-control"
            value={formData.status}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="form-label">Interview Type</label>
          <select
            name="type"
            className="form-control"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="">----Select Type----</option>
            <option value="Resume Lead">Resume Lead</option>
            <option value="Manual Lead">Manual Lead</option>
          </select>
        </div>

        <div className="text-end">
          <button type="submit" className="btn btn-primary">
            Add Lead
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeadForm;
