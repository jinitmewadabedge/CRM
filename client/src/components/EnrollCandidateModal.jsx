import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const EnrollCandidateModal = ({ show, onClose, lead, onEnrollSuccess }) => {
  const [enrollmentData, setEnrollmentData] = useState({
    enrollmentDate: new Date().toISOString().split("T")[0],
    plan: "",
    upfront: "",
    contracted: "",
    collectedPayments: [
      { amount: "", date: "" },
      { amount: "", date: "" },
      { amount: "", date: "" }
    ],
    percentage: "",
    paymentGateway: "",
    salesPerson: "",
    TL: "",
    manager: "",
    enrollmentForm: "",
    jobGuarantee: false,
    movedToCV: false,
    movedToTraining: false,
    technology: "",
    paymentType: "",
    reference: "",
    paymentStatus: ""
  });

  useEffect(() => {
    if (lead) {
      setEnrollmentData(prev => ({
        ...prev,
        candidate_Name: lead.candidate_name,
        email: lead.candidate_email,
        number: lead.candidate_phone_no,
        technology: lead.technology
      }));
    }
  }, [lead]);

  const formatDateOnly = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleSubmitEnrollment = async (e) => {
    e.preventDefault();

    if (!lead?._id) {
      toast.error("Please select a lead first");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");

      const res = await axios.post(`${BASE_URL}/api/candidates/enroll`, {
        leadId: lead._id,
        ...enrollmentData,
        collectedPayments: enrollmentData.collectedPayments
      }, { headers: { Authorization: `Bearer ${token}` } });

      toast.success(res.data.message);
      onClose();
      onEnrollSuccess && onEnrollSuccess();
    } catch (error) {
      toast.error("Error enrolling candidate");
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-center">Enroll Candidate</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <div className="row">
              <div className="col-lg-6 col-md-12">
                <div className="row g-2">
                  <div className="col-md-6">
                    <label className="tableData">Enrollment Date</label>
                    <input
                      type="date"
                      className="form-control form-control-sm tableData candidateFields"
                      value={enrollmentData.enrollmentDate}
                      onChange={e => setEnrollmentData({ ...enrollmentData, enrollmentDate: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="tableData">Candidate Name</label>
                    <input type="text" className="form-control form-control-sm tableData candidateField" value={lead?.candidate_name} disabled />
                  </div>

                  <div className="col-md-6">
                    <label className="tableData">Email</label>
                    <input type="email" className="form-control form-control-sm tableData candidateField" value={lead?.candidate_email} disabled />
                  </div>

                  <div className="col-md-6">
                    <label className="tableData">Number</label>
                    <input type="text" className="form-control form-control-sm tableData candidateField" value={lead?.candidate_phone_no} disabled />
                  </div>

                  <div className="col-md-6">
                    <label className="tableData">Upfront</label>
                    <input
                      type="number"
                      className="form-control form-control-sm tableData candidateField"
                      value={enrollmentData.upfront}
                      onChange={e => setEnrollmentData({ ...enrollmentData, upfront: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="tableData">Contracted</label>
                    <input
                      type="number"
                      className="form-control form-control-sm tableData candidateField"
                      value={enrollmentData.contracted}
                      onChange={e => setEnrollmentData({ ...enrollmentData, contracted: e.target.value })}
                    />
                  </div>

                  {enrollmentData.collectedPayments.map((payment, index) => (
                    <React.Fragment key={index}>
                      <div className="col-md-6">
                        <label className="tableData">Collected Amount {index + 1}</label>
                        <input
                          type="number"
                          className="form-control form-control-sm tableData candidateField"
                          value={payment.amount}
                          onChange={(e) => {
                            const newPayments = [...enrollmentData.collectedPayments];
                            newPayments[index].amount = e.target.value;
                            setEnrollmentData({ ...enrollmentData, collectedPayments: newPayments });
                          }}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="tableData">Collected Date {index + 1}</label>
                        <input
                          type="date"
                          className="form-control form-control-sm tableData candidateField"
                          value={payment.date}
                          onChange={(e) => {
                            const newPayments = [...enrollmentData.collectedPayments];
                            newPayments[index].date = e.target.value;
                            setEnrollmentData({ ...enrollmentData, collectedPayments: newPayments });
                          }}
                        />
                      </div>
                    </React.Fragment>
                  ))}

                  <div className="col-md-6">
                    <label className="tableData">Percentage</label>
                    <input
                      type="number"
                      className="form-control form-control-sm tableData candidateField"
                      value={enrollmentData.percentage}
                      onChange={e => setEnrollmentData({ ...enrollmentData, percentage: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="tableData">Job Guarantee</label>
                    <select
                      className="form-select form-select-sm tableData candidateField"
                      value={enrollmentData.jobGuarantee}
                      onChange={e => setEnrollmentData({ ...enrollmentData, jobGuarantee: e.target.value })}
                    >
                      <option value="">-----Select---</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="tableData">Technology</label>
                    <input type="text" className="form-control form-control-sm tableData candidateField" value={lead?.technology} disabled />
                  </div>

                  <div className="col-md-6">
                    <label className="tableData">Plan</label>
                    <select
                      className="form-select form-select-sm tableData candidateField"
                      value={enrollmentData.plan}
                      onChange={e => setEnrollmentData({ ...enrollmentData, plan: e.target.value })}
                    >
                      <option value="">Select Plan</option>
                      <option value="Basic">Basic</option>
                      <option value="Standard">Standard</option>
                      <option value="Premium">Premium</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="tableData">Payment Gateway</label>
                    <select
                      className="form-select form-select-sm tableData candidateField"
                      value={enrollmentData.paymentGateway}
                      onChange={e => setEnrollmentData({ ...enrollmentData, paymentGateway: e.target.value })}
                    >
                      <option value="">Select Gateway</option>
                      <option value="Razorpay">Razorpay</option>
                      <option value="Cashfree">Cashfree</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label form-label-sm tableData">Payment Status</label>
                    <select
                      className="form-select form-select-sm tableData candidateField"
                      value={enrollmentData.paymentStatus}
                      onChange={e => setEnrollmentData({ ...enrollmentData, paymentStatus: e.target.value })}
                    >
                      <option value="">Select Payment Status</option>
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="col-lg-6 col-md-12 mt-3 mt-lg-0">
                <h5 className="mb-3 text-center modal-title">Preview</h5>

                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <tbody>
                      <tr>
                        <th className="tableData fw-bold">Enrollment Date</th>
                        <td className="tableData">{formatDateOnly(enrollmentData.enrollmentDate)} (DD-MM-YYYY)</td>
                      </tr>

                      <tr>
                        <th className="tableData fw-bold">Candidate Name</th>
                        <td className="tableData">{lead?.candidate_name}</td>
                      </tr>

                      <tr>
                        <th className="tableData fw-bold">Email</th>
                        <td className="tableData">{lead?.candidate_email}</td>
                      </tr>

                      <tr>
                        <th className="tableData fw-bold">Phone</th>
                        <td className="tableData">{lead?.candidate_phone_no}</td>
                      </tr>

                      <tr>
                        <th className="tableData fw-bold">Upfront</th>
                        <td className="tableData">{enrollmentData.upfront || "-"}</td>
                      </tr>

                      <tr>
                        <th className="tableData fw-bold">Contracted</th>
                        <td className="tableData">{enrollmentData.contracted || "-"}</td>
                      </tr>

                      <tr>
                        <td colSpan="2" className="bg-light fw-bold text-center tableData">
                          Collected Payments
                        </td>
                      </tr>

                      {enrollmentData.collectedPayments.map((p, i) => (
                        <React.Fragment key={i}>
                          <tr>
                            <th className="tableData fw-bold">Amount {i + 1}</th>
                            <td className="tableData">{p.amount || "-"}</td>
                          </tr>

                          <tr>
                            <th className="tableData fw-bold">Date {i + 1}</th>
                            <td className="tableData">{formatDateOnly(p.date)} (DD-MM-YYYY)</td>
                          </tr>
                        </React.Fragment>
                      ))}

                      <tr>
                        <td colSpan="2" className="bg-light fw-bold text-center tableData">
                          Additional Info
                        </td>
                      </tr>

                      <tr>
                        <th className="tableData fw-bold">Percentage</th>
                        <td className="tableData">{enrollmentData.percentage || "-"}</td>
                      </tr>

                      <tr>
                        <th className="tableData fw-bold">Job Guarantee</th>
                        <td className="tableData">{enrollmentData.jobGuarantee === "true" ? "Yes" : "No"}</td>
                      </tr>

                      <tr>
                        <th className="tableData fw-bold">Technology</th>
                        <td className="tableData">{lead?.technology || "-"}</td>
                      </tr>

                      <tr>
                        <th className="tableData fw-bold">Plan</th>
                        <td className="tableData">{enrollmentData.plan || "-"}</td>
                      </tr>

                      <tr>
                        <th className="tableData fw-bold">Payment Gateway</th>
                        <td className="tableData">{enrollmentData.paymentGateway || "-"}</td>
                      </tr>

                      <tr>
                        <th className="tableData fw-bold">Payment Status</th>
                        <td className="tableData">{enrollmentData.paymentStatus || "-"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={handleSubmitEnrollment}>Enroll</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollCandidateModal;