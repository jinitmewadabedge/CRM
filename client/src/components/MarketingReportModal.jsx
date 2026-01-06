import { FaTrash } from "react-icons/fa";

const MarketingReportModal = ({
    show,
    onClose,
    dailyReports = [],
    responseReports = [],
}) => {
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("en-GB"); // DD/MM/YYYY
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleString("en-GB");
    };

    const formatTime12Hour = (time24) => {
        if (!time24) return "-";

        if (time24.toLowerCase().includes("am") || time24.toLowerCase().includes("pm")) {
            return time24;
        }

        const [hourStr, minute] = time24.split(":");
        let hour = Number(hourStr);

        if (isNaN(hour)) return "-";

        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;

        return `${hour}:${minute} ${ampm}`;
    };

    if (!show) return null;

    return (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog modal-xl modal-dialog-scrollable">
                <div className="modal-content shadow-lg">
                    <div className="modal-header">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="modal-title fw-bold">Candidate Reports</h5>
                            <button className="btn-close" onClick={onClose}></button>
                        </div>
                    </div>

                    <div className="modal-body">

                        <h5 className="fw-bold mb-3">Daily Reports</h5>

                        {dailyReports.length === 0 ? (
                            <EmptyState />
                        ) : (
                            <div className="table-responsive mb-4">
                                <table className="table table-bordered table-striped align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="tableHeader">Report Date</th>
                                            <th className="tableHeader">Applications</th>
                                            <th className="tableHeader">Assessment</th>
                                            <th className="tableHeader">Screening</th>
                                            <th className="tableHeader">Interviews</th>
                                            <th className="tableHeader">Completed</th>
                                            <th className="tableHeader">Status</th>
                                            <th className="tableHeader">Reason</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dailyReports.map((r, index) => (
                                            <tr key={index}>
                                                {console.log("ROW DATA:", r)}
                                                <td className="tableData">{formatDateTime(r.createdAt)}</td>
                                                <td className="tableData">{r.noOfApplications}</td>
                                                <td className="tableData">{r.assessmentTechnical}</td>
                                                <td className="tableData">{r.screening}</td>
                                                <td className="tableData">{r.interviews}</td>
                                                <td className="tableData">{r.completed}</td>
                                                <td className="tableData">{r.status}</td>
                                                <td className="tableData" style={{ whiteSpace: "pre-wrap" }}>
                                                    {r.reason || "N/A"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <h5 className="fw-bold mb-3">Response Reports</h5>

                        {responseReports.length === 0 ? (
                            <EmptyState />
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="tableHeader">Report Date</th>
                                            <th className="tableHeader">Client Name</th>
                                            <th className="tableHeader">Contact No</th>
                                            <th className="tableHeader">Email</th>
                                            <th className="tableHeader">Recruiter Remarks</th>
                                            <th className="tableHeader">Response Type</th>
                                            <th className="tableHeader">Scheduled Date</th>
                                            <th className="tableHeader">Scheduled Time (EST)</th>
                                            <th className="tableHeader">Senior Remarks</th>
                                            <th className="tableHeader">Support</th>
                                            <th className="tableHeader">Support Person</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {responseReports.map((r, index) => (
                                            <tr key={index}>
                                                <td className="tableData">{formatDateTime(r.createdAt)}</td>
                                                <td className="tableData">{r.clientName}</td>
                                                <td className="tableData">{r.contactNo}</td>
                                                <td className="tableData">{r.email}</td>
                                                <td className="tableData">{r.recruiterRemarks}</td>
                                                <td className="tableData">{r.responseType}</td>
                                                <td className="tableData">{formatDate(r.scheduledDate)}</td>
                                                <td className="tableData">{formatTime12Hour(r.scheduledTime)}</td>
                                                <td className="tableData">{r.seniorRemarks || "-"}</td>
                                                <td className="tableData">{r.support ? "Yes" : "No"}</td>
                                                <td className="tableData">{r.supportPersonName || "-"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                    </div>

                    {/* FOOTER */}
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>
                            Close
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

const EmptyState = () => (
    <div className="d-flex justify-content-center align-items-center gap-2 my-4 text-muted">
        <FaTrash size={18} />
        <span className="fw-semibold">No history found</span>
    </div>
);

export default MarketingReportModal;
