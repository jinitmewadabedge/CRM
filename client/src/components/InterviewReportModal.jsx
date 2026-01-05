import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaFile } from "react-icons/fa";

const InterviewReportModal = ({ show, onClose, lead }) => {

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  if (!show) return null;

  const formatDateOnly = (dateString) => {
    if (!dateString || !dateString.includes("-")) return "-";

    const [year, month, day] = dateString.split("-");
    if (!year || !month || !day) return "-";

    return `${day}/${month}/${year}`;
  };

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

  const formatTime12Hour = (time24) => {
    if (!time24) return "-";

    const [hourStr, minute] = time24.split(":");
    let hour = Number(hourStr);

    if (isNaN(hour)) return "-";

    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;

    return `${hour}:${minute} ${ampm}`;
  };

  const handleSubmit = async () => {

    console.log("BASE_URL:", BASE_URL);

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
        `${BASE_URL}/api/resume/responseReport/${lead._id}`,
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

      if (form.support && !form.supportPersonName) {
        toast.error("Support person name is required");
        return;
      }

      toast.success("Response report saved");
      onClose();
    } catch (err) {
      toast.error("Failed to save interview report");
    }
  };

  return (
    <div>
      <div className="modal fade show d-block" tabIndex="-1" id="">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">

            <div className="modal-header">
              <div className="d-flex justify-content-center align-items-center">
                <h5 className="modal-title fs-3 fw-bold text-center">Interview Report - {lead.name}</h5>
                <button className="btn-close" onClick={onClose} />
              </div>
            </div>

            <div className="modal-body">
              <div className="row g-5">

                <div className="col-lg-6 col-md-12">
                  <div className="row g-2">
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
                        <option value="" disabled>Select Response Type</option>
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
                        value={form.responseMode}
                        onChange={(e) => setForm({ ...form, responseMode: e.target.value })}
                      >
                        <option value="" disabled>Select Response Mode</option>
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
                        <option value="">Select Support Person Name</option>
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
                          <option value="">Select Interview Status</option>
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

                {/* RIGHT SIDE – PREVIEW */}
                <div className="col-lg-6 col-md-12">
                  <h5 className="mb-3 text-center modal-title">Preview</h5>

                  <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                      <tbody>
                        <tr>
                          <th className="tableData fw-bold">Client/Vendor Name</th>
                          <td className="tableData">{form.clientName || "-"}</td>
                        </tr>

                        <tr>
                          <th className="tableData fw-bold">Email ID</th>
                          <td className="tableData">{form.email || "-"}</td>
                        </tr>

                        <tr>
                          <th className="tableData fw-bold">Contact No</th>
                          <td className="tableData">{form.number || "-"}</td>
                        </tr>

                        <tr>
                          <th className="tableData fw-bold">Scheduled Date</th>
                          <td className="tableData">{formatDateOnly(form.scheduledDate)}  (DD-MM-YYYY)</td>
                        </tr>

                        <tr>
                          <th className="tableData fw-bold">Scheduled Time(EST)</th>
                          <td className="tableData">
                            {formatTime12Hour(form.scheduledTime || "-")}
                          </td>
                        </tr>

                        <tr>
                          <th className="tableData fw-bold">Response Type</th>
                          <td className="tableData">{form.responseType || "-"}</td>
                        </tr>

                        <tr>
                          <th className="tableData fw-bold">Response Mode</th>
                          <td className="tableData">{form.responseMode || "-"}</td>
                        </tr>

                        <tr>
                          <th className="tableData fw-bold">Support</th>
                          <td className="tableData">
                            {form.support === true
                              ? "Yes"
                              : form.support === false
                                ? "No"
                                : "-"}
                          </td>
                        </tr>

                        <tr>
                          <th className="tableData fw-bold">Support Person</th>
                          <td className="tableData">{form.supportPersonName || "-"}</td>
                        </tr>

                        <tr>
                          <th className="tableData fw-bold">Interview Status</th>
                          <td className="tableData">{form.interviewStatus || "-"}</td>
                        </tr>

                        <tr>
                          <th className="tableData fw-bold">Recruiter Remarks</th>
                          <td className="tableData">{form.recruiterRemarks || "-"}</td>
                        </tr>

                        <tr>
                          <th className="tableData fw-bold">Final Status</th>
                          <td className="tableData">{form.finalStatus || "-"}</td>
                        </tr>

                        <tr>
                          <th className="tableData fw-bold">Sr. Remarks</th>
                          <td className="tableData">{form.seniorRemarks || "-"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="modal-footer"> <button className="btn btn-secondary cancelReport" onClick={onClose}> Cancel </button> <button className="btn btn-primary fw-bold saveReport" onClick={handleSubmit}> Save Report <FaFile /> </button> </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewReportModal;