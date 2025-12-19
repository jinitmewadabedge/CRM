import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaFile } from "react-icons/fa";

const InterviewReportModal = ({ show, onClose, lead }) => {
  if (!show) return null;

  const [form, setForm] = useState({
    clientName: "",
    email: "",
    number: "",
    scheduledDate: "",
    scheduledTime: "",
    responseType: "",
    responseMode: "",
    support: "",
    supportPersonName: "",
    interviewStatus: "",
    recruiterRemarks: "",
    followUpDate: "",
    finalStatus: "",
    seniorRemarks: ""
  });


  useEffect(() => {
    if (!lead) return;

    setForm((prev) => ({
      ...prev,
      clientName: lead.candidate_name || "",
      email: lead.candidate_email || "",
      number: lead.candidate_phone_no || ""
    }));
  }, [lead]);

  const handleSubmit = async () => {

    console.log("handleSubmit called");
    console.log("lead:", lead);
    console.log("selectedCandidate:", typeof selectedCandidate);


    if (!lead?._id) {
      toast.error("Lead not selected");
      return;
    }

    try {
      const token = sessionStorage.getItem("token") || localStorage.getItem("token");

      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/resume/responseReport/${lead._id}`,
        {
          leadId: lead._id,
          ...form
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setForm({
        clientName: "",
        email: "",
        number: "",
        scheduledDate: "",
        scheduledTime: "",
        responseType: "",
        responseMode: "",
        support: "",
        supportPersonName: "",
        interviewStatus: "",
        recruiterRemarks: "",
        followUpDate: "",
        finalStatus: "",
        seniorRemarks: ""
      })

      toast.success("Response report saved");
      onClose();
    } catch (err) {
      toast.error("Failed to save interview report");
    }
  };

  return (
    <div>
      <div className="modal fade show d-block" tabIndex="-1" id="">
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">

            <div className="modal-header">
              <div className="d-flex justify-content-center align-items-center">
                <h5 className="modal-title fs-3 fw-bold text-center">Interview Report</h5>
                <button className="btn-close" onClick={onClose} />
              </div>
            </div>

            <div className="modal-body">
              <div className="row g-3">

                <div className="col-md-6">
                  <label className="form-label selectFont fw-bold interviewFields">Name of Client / Vendor</label>
                  <input
                    className="form-control form-control-sm interviewBorder"
                    value={form.clientName}
                    placeholder="Enter Client/Vendor Name"
                    onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label selectFont fw-bold interviewFields">Email ID</label>
                  <input
                    className="form-control form-control-sm interviewBorder"
                    value={form.email}
                    placeholder="Enter Email ID"
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label selectFont fw-bold interviewFields">Contact No</label>
                  <input
                    className="form-control form-control-sm interviewBorder"
                    value={form.number}
                    maxLength="10"
                    placeholder="Enter Contact No"
                    onChange={(e) => setForm({ ...form, number: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label selectFont fw-bold interviewFields">Scheduled Date</label>
                  <input
                    type="date"
                    className="form-control form-control-sm interviewBorder"
                    value={form.scheduledDate}
                    onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label selectFont fw-bold interviewFields">Scheduled Time (EST)</label>
                  <input
                    type="time"
                    className="form-control form-control-sm interviewBorder"
                    value={form.scheduledTime}
                    onChange={(e) => setForm({ ...form, scheduledTime: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label selectFont fw-bold interviewFields">Type of Response</label>
                  <select
                    className="form-control form-control-sm interviewBorder"
                    value={form.responseType}
                    onChange={(e) => setForm({ ...form, responseType: e.target.value })}
                  >
                    <option value="">Select Response</option>
                    <option value="RTR">RTR</option>
                    <option value="Screening">Screening</option>
                    <option value="Assessment-Tech">Assessment - Tech</option>
                    <option value="One-Way-Screening">One Way Screening</option>
                    <option value="Interview">Interview</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label selectFont fw-bold interviewFields">Mode of response</label>
                  <select
                    className="form-control form-control-sm interviewBorder"
                    value={form.modeOfResponse}
                    onChange={(e) => setForm({ ...form, modeOfResponse: e.target.value })}
                  >
                    <option value="">Select Response</option>
                    <option value="Phone">Phone</option>
                    <option value="Web">Web</option>
                    <option value="AI">AI</option>
                    <option value="MS Teams">MS Teams</option>
                    <option value="G-Meet">G-Meet</option>
                    <option value="Zoom">Zoom</option>
                    <option value="Skype">Skype</option>
                    <option value="Webex">Webex</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label htmlFor="" className="form-label selectFont fw-bold interviewFields">Support</label>
                  <select name="" id="" className="form-select form-select-sm interviewBorder"
                    value={form.support}
                    onChange={(e) => setForm({ ...form, support: e.target.value === "true" })}>
                    <option value="">Select</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label htmlFor="" className="form-label selectFont fw-bold interviewFields">Support Person Name</label>
                  <select name="" id="" className="form-select form-select-sm interviewBorder"
                    value={form.supportPersonName}
                    onChange={(e) => setForm({ ...form, supportPersonName: e.target.value })}>
                    <option value="Rutvik">Rutvik</option>
                    <option value="Kishan">Kishan</option>
                    <option value="Sam">Sam</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label htmlFor="" className="form-label selectFont fw-bold interviewFields">Interview Status</label>
                  <select name="" id="" className="form-select form-select-sm interviewBorder"
                    value={form.interviewStatus}
                    onChange={(e) => setForm({ ...form, interviewStatus: e.target.value })}>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Rescheduled-Client">Rescheduled-Client</option>
                    <option value="Rescheduled-Candidate">Rescheduled-Candidate</option>
                    <option value="Cancelled-Client">Cancelled-Client</option>
                    <option value="Cancelled-Candidate">Cancelled-Candidate</option>
                  </select>
                </div>

                <div className="col-md-12">
                  <label className="form-label selectFont fw-bold interviewFields">Remarks of Recruiter</label>
                  <textarea
                    className="form-control form-control-sm interviewBorder textareaBG"
                    rows={2}
                    value={form.recruiterRemarks}
                    placeholder="Enter Remarks....."
                    onChange={(e) =>
                      setForm({ ...form, recruiterRemarks: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-12">
                  <label htmlFor="" className="selectFont fw-bold interviewFields">Final Status</label>
                  <select name="" id="" className="form-select form-select-sm interviewBorder"
                    value={form.finalStatus}
                    onChange={(e) => setForm({ ...form, finalStatus: e.target.value })}>
                    <option value="Next Round">Next Round</option>
                    <option value="Rescheduled">Rescheduled</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="In Process">In Process</option>
                    <option value="DNR">DNR</option>
                    <option value="Rejection">Rejection</option>
                    <option value="Placement">Placement</option>
                    <option value="Onboarding">Onboarding</option>
                  </select>
                </div>

                <div className="col-md-12">
                  <label className="form-label selectFont fw-bold interviewFields">Remarks of Sr. Recruiter & TL</label>
                  <textarea
                    className="form-control from-control-sm interviewBorder textareaBG"
                    rows={2}
                    value={form.seniorRemarks}
                    placeholder="Enter Remarks....."
                    onChange={(e) =>
                      setForm({ ...form, seniorRemarks: e.target.value })
                    }
                  />
                </div>

              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary cancelReport" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-primary fw-bold saveReport" onClick={handleSubmit}>
                Save Report <FaFile />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewReportModal;