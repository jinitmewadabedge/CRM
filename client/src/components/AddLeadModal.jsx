import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const AddLeadModal = ({ onLeadAdded }) => {
  const [newLead, setNewLead] = useState({
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
    setNewLead({
      ...newLead,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitNew = async (e) => {
    e.preventDefault();
    console.log("Submitting Lead:", newLead);

    const payload = {
      ...newLead,
      technology: newLead.technology.split(",").map((t) => t.trim()).filter((t) => t != "")
    };

    try {
      const res = await axios.post(`${BASE_URL}/api/leads/`, payload);
      console.log("New Lead Added:", res.data);
      toast.success("Lead Added Successfully!");
      setNewLead({
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
      onLeadAdded && onLeadAdded();
      // Close modal
      const modalEl = document.getElementById("addNewLead");
      if (modalEl) {
        const modal = window.bootstrap.Modal.getInstance(modalEl);
        modal.hide();
      }
    } catch (error) {
      console.error("Error adding lead:", error.response?.data || error.message);
      toast.error("Failed to add lead. Please try again");
    }
  };

  return (
    <div className="modal fade" id="addNewLead" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-md" role="document">
        <div className="modal-content">
          <div className="modal-body p-0">
            <div className="card card-plain">
              <h3 className="modal-title editUserTitle mt-2">Add New Lead</h3>
              <button type="button" className="btn-close ms-4" data-bs-dismiss="modal" aria-label="Close"></button>
              <div className="card-body">
                <form action="" onSubmit={handleSubmitNew} className="card p-3 shadow-sm darkForm" role="form text-left">
                  <label htmlFor="" className="form-check-label">Candidate Name</label>
                  <div className="input-group mb-3">
                    <input name="candidate_name" type="text" value={newLead.candidate_name} onChange={handleChange} className="form-control form-control-sm selectFont" placeholder="Candidate Name" required />
                  </div>

                  <label htmlFor="" className="form-check-label">Email</label>
                  <div className="input-group mb-3">
                    <input name="candidate_email" type="text" value={newLead.candidate_email} onChange={handleChange} className="form-control form-control-sm selectFont" placeholder="Email" />
                  </div>

                  <label htmlFor="" className="form-check-label">Phone</label>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      name="candidate_phone_no"
                      maxLength="10"
                      placeholder="Phone No"
                      className="form-control form-control-sm selectFont"
                      value={newLead.candidate_phone_no}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <label htmlFor="" className="form-check-label">LinkedIn URL</label>
                  <div className="input-group mb-3">
                    <input
                      type="url"
                      name="linked_in_url"
                      className="form-control form-control-sm selectFont"
                      placeholder="LinkedIn URL"
                      value={newLead.linked_in_url}
                      onChange={handleChange}
                    />
                  </div>

                  <label htmlFor="" className="form-check-label">University</label>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      name="university"
                      className="form-control form-control-sm selectFont"
                      placeholder="University"
                      value={newLead.university}
                      onChange={handleChange}
                    />
                  </div>

                  <label htmlFor="" className="form-check-label">Technology</label>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      name="technology"
                      className="form-control form-control-sm w-100 selectFont"
                      value={newLead.technology}
                      onChange={handleChange}
                      placeholder="e.g React, Node, Angular"
                    />
                    <small className="technologyFont text-muted">Enter multiple technologies separated by commas</small>
                  </div>

                  <label htmlFor="" className="form-check-label">Visa</label>
                  <div className="input-group mb-3">
                    <select
                      name="visa"
                      className="form-control form-control-sm selectFont"
                      value={newLead.visa}
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

                  <label htmlFor="" className="form-check-label">Preferred Time To Talk</label>
                  <div className="input-group mb-3">
                    <select
                      name="preferred_time_to_talk"
                      className="form-control form-control-sm selectFont"
                      value={newLead.preferred_time_to_talk}
                      onChange={handleChange}
                      required
                    >
                      <option value="">----Select Time----</option>
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                      <option value="Night">Night</option>
                    </select>
                  </div>

                  <label htmlFor="" className="form-check-label">Source</label>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      name="source"
                      className="form-control form-control-sm selectFont"
                      placeholder="Source"
                      value={newLead.source}
                      onChange={handleChange}
                    />
                  </div>

                  <label htmlFor="" className="form-check-label">Status</label>
                  <div className="input-group mb-3">
                    <select name="status"
                      className="form-control form-control-sm selectFont"
                      value={newLead.status}
                      onChange={handleChange}
                      required>
                      <option value="">Select Status</option>
                      <option value="New">New</option>
                    </select>
                  </div>

                  <label htmlFor="" className="form-check-label">Interview Type</label>
                  <div className="input-group mb-3">
                    <select name="type"
                      className="form-control form-control-sm selectFont"
                      value={newLead.type}
                      onChange={handleChange}
                      required>
                      <option value="">Lead Type</option>
                      <option value="Resume Lead">Resume Lead</option>
                      <option value="Manual Lead">Manual Lead</option>
                    </select>
                  </div>

                  <div className="text-center">
                    <button type="submit" className="btn btn-primary btn-sm">Add Lead</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLeadModal;