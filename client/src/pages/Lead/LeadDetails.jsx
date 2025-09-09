import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLeadById } from "../../api/leadApi";
import { FaArrowLeft } from "react-icons/fa";

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [viewLead, setViewLead] = useState(null);

  useEffect(() => {
    async function fetchLead() {
      try {
        const res = await getLeadById(id);
        setViewLead(res.data);
      } catch (error) {
        console.error("Error fetching lead details:", error);
      }
    }
    fetchLead();
  }, [id]);

  if (!viewLead) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container-fluid leadDetailsBG">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mt-4">Lead Details</h2>
        <button
          className="btn btn-outline-primary fw-bold"
          onClick={() => navigate("/leads")}
        >
          <FaArrowLeft className="me-2" /> Back
        </button>
      </div>

      <div className="card shadow-sm rounded-3 border-0">
        <div className="card-body">
          <div className="row g-4">
            <div className="col-md-6">
              <h6 className="text-muted">Name</h6>
              <p className="fw-semibold">{viewLead.candidate_name}</p>
            </div>
            <div className="col-md-6">
              <h6 className="text-muted">Email</h6>
              <p className="fw-semibold">{viewLead.candidate_email}</p>
            </div>
            <div className="col-md-6">
              <h6 className="text-muted">Lead Type</h6>
              <p className="fw-semibold">{viewLead.type}</p>
            </div>
            <div className="col-md-6">
              <h6 className="text-muted">Email</h6>
              <p className="fw-semibold">{viewLead.candidate_email}</p>
            </div>
            <div className="col-md-6">
              <h6 className="text-muted">Phone No</h6>
              <p className="fw-semibold">{viewLead.candidate_phone_no}</p>
            </div>
            <div className="col-md-6">
              <h6 className="text-muted">LinkedIn</h6>
              <p>
                <a
                  href={viewLead.linked_in_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fw-semibold text-decoration-none text-primary"
                >
                  {viewLead.linked_in_url}
                </a>
              </p>
            </div>
            <div className="col-md-6">
              <h6 className="text-muted">University</h6>
              <p className="fw-semibold">{viewLead.university}</p>
            </div>
            <div className="col-md-6">
              <h6 className="text-muted">Technology</h6>
              <p className="fw-semibold">
                {Array.isArray(viewLead.technology)
                  ? viewLead.technology.join(", ")
                  : viewLead.technology}
              </p>
            </div>
            <div className="col-md-6">
              <h6 className="text-muted">Visa</h6>
              <p className="fw-semibold">{viewLead.visa}</p>
            </div>
            <div className="col-md-6">
              <h6 className="text-muted">Preferred Time</h6>
              <p className="fw-semibold">{viewLead.preferred_time_to_talk}</p>
            </div>
            <div className="col-md-6">
              <h6 className="text-muted">Source</h6>
              <p className="fw-semibold">{viewLead.source}</p>
            </div>
            <div className="col-md-6">
              <h6 className="text-muted">Status</h6>
              <span
                className={`badge px-3 py-2 rounded-pill ${viewLead.status === "New"
                  ? "bg-primary"
                  : viewLead.status === "Connected"
                    ? "bg-success"
                    : viewLead.status === "In Progress"
                      ? "bg-warning text-dark"
                      : viewLead.status === "Shortlisted"
                        ? "bg-info text-dark"
                        : viewLead.status === "Rejected"
                          ? "bg-danger"
                          : "bg-secondary"
                  }`}
              >
                {viewLead.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;
