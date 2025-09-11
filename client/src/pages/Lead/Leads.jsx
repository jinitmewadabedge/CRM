import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getLeadById, createLead, getLeads, deleteLead, updateLead } from "../../api/leadApi";
import { FaPlus, FaDownload, FaFileCsv, FaFileExcel } from "react-icons/fa";
import "bootstrap-icons/font/bootstrap-icons.css";
import LeadImg from "../../assets/Lead_Img.png"
import axios from "axios";
import * as XLSX from 'xlsx';
import { FaLink, FaCheckCircle, FaSync, FaStar, FaHourglassHalf, FaTimesCircle, FaArrowUp } from "react-icons/fa";

const Leads = () => {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
  console.log(user?.permission?.lead?.bulkAdd);
  const bulkAdd = user?.permission?.lead?.bulkAdd === true
  const exports = user?.permission?.lead?.export === true
  const [leads, setLeads] = useState([]);
  const [viewLead, setViewLead] = useState(null);
  const navigate = useNavigate();
  const [totalLeads, SetTotalLeads] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [loading, setLoading] = useState(false);
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
    status: "",
  });
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
  const [leadsPerPage] = useState(5);
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    status: "",
    visa: "",
    technology: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    sortField: "candidate_name",
    sortOrder: "asc",
    dateSort: ""
  });

  // useEffect(() => {
  //   async function fetchLead() {
  //     try {
  //       const res = await getLeadById(id);

  //       console.log("Visa from DB:", JSON.stringify(res.data.visa));
  //       console.log("All option values:", ["All Visa", "H1B", "F1", "OPT", "L1", "Green Card", "Citizen"]);

  //       setFormData({
  //         ...res.data,
  //         visa: res.data.visa?.trim() || ""
  //       })
  //     } catch (error) {
  //       console.error("Error fetching lead for edit:", error)
  //     }
  //   }
  //   fetchLead()
  // }, [id]);

  useEffect(() => {
    async function fetchLead() {
      if (!id) {
        console.log("No lead id provided in route");
        return;
      }
      try {
        const res = await getLeadById(id);
        setViewLead(res.data);
      } catch (error) {
        console.error("Error fetching lead details:", error);
      }
    }
    fetchLead();
  }, [id]);

  // if (!viewLead) return <p className="text-center mt-5">Loading...</p>;

  const handleChange = (e) => {
    setNewLead({
      ...newLead,
      [e.target.name]: e.target.value
    });
  }

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleEditClick = (lead) => {
    setSelectedLead(lead);
    setFormData({
      ...lead,
      visa: lead.visa?.trim() || ""
    })
  }

  const handleSubmitNew = async (e) => {
    e.preventDefault();
    console.log("Submitting Lead:", newLead);

    const payload = {
      ...newLead,
      technology: newLead.technology.split(",").map((t) => t.trim()).filter((t) => t != "")
    };

    try {
      const res = await createLead(payload);
      console.log("New Lead Added:", res.data);
      alert("Lead added successfully!");
      setLeads([...leads, res.data]);
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
      })

    } catch (error) {
      console.error("Error adding lead:", error.response?.data || error.message);
      alert("Failed to add lead");
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      id: selectedLead._id,
      technology: formData.technology.split(",").map(t => t.trim()).filter(t => t !== "")
    };

    try {
      await axios.put(`http://localhost:5000/api/leads/${selectedLead._id}`, payload);
      alert("Lead updated successfully!");
      setLeads(leads.map(l => (l._id === formData._id ? payload : l)));
    } catch (error) {
      console.error("Error updating lead:", error);
      alert("Failed to update lead");
    }
  }

  const handleViewClick = (lead) => {
    setSelectedLead(lead);
    setShowViewModal(true);

    // const modal = new window.bootstrap.Modal(document.getElementById("viewLeads"));
    // modal.show();

    // const modal = document.getElementById("viewLeads");
    // const modalInstance = new Modal(modal);
    // modalInstance.show();

    // modal.show();
  }
  // const handleCloseModal = () => {
  //   setShowViewModal(false);
  //   setSelectedLead(null);
  // }

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/leads");
      console.log("User Data:", res.data);
      setLeads(res.data);
    } catch (err) {
      console.error("Error refreshing users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLeadClick = () => {
    setNewLead({
      candidate_name: "",
      candidate_email: "",
      candidate_phone_no: "",
      type: "",
      visa: "",
      status: "",
      createdAt: "",
      updatedAt: ""
    })
  }

  const handleAddUser = (e) => {
    e.preventDefault();
    handleSubmitNew(e);
  };


  const handleImportExcel = (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("No file selected");
      return;
    }

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      alert("Please upload a valid Excel file");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        alert("Excel file has no sheets or is invalid");
        return;
      }

      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      try {
        await axios.post("http://localhost:5000/api/leads/import", { leads: worksheet });
        alert("Excel Imported Successfully");

        const res = await getLeads();
        setLeads(res.data);
      } catch (error) {
        console.error("Excel Import Error:", error);
        alert("Error importing Excel");
      }
    };
    reader.readAsArrayBuffer(file);
  };


  const exportToCSV = () => {
    const headers = [
      "Name", "Email", "Lead Type", "Phone No.", "URL",
      "Technology", "Visa", "Preferred Time", "Status",
      "Created At", "Updated At"
    ];

    const rows = leads.map(lead => [
      lead.candidate_name,
      lead.candidate_email,
      lead.type,
      lead.candidate_phone_no,
      lead.linked_in_url,
      Array.isArray(lead.technology) ? lead.technology.join(", ") : lead.technology,
      lead.visa,
      lead.preferred_time_to_talk,
      lead.status,
      formatDateTimeIST(lead.createdAt),
      formatDateTimeIST(lead.updatedAt)
    ]);

    let csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(e => e.map(val => `"${val}"`).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "leads_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  const formatDateTimeIST = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    const options = {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };

    return new Intl.DateTimeFormat("en-GB", options).format(date);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pageNumbers;
  };


  const filteredLeads = leads
    .filter((lead) => {
      const searchMatch =
        lead.candidate_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        lead.candidate_email?.toLowerCase().includes(filters.search.toLowerCase()) ||
        lead.candidate_phone_no?.toString().includes(filters.search)

      const typeMatch = filters.type ? lead.type === filters.type : true

      const statusMatch = filters.status ? lead.status === filters.status : true
      const visaMatch = filters.visa ? lead.visa === filters.visa : true

      const dateMatch =
        (!filters.startDate || new Date(lead.createdAt) >= new Date(filters.startDate)) &&
        (!filters.endDate || new Date(lead.createdAt) <= new Date(filters.endDate))

      const timeMatch =
        (!filters.startTime || lead.preferred_time_to_talk >= filters.startTime) &&
        (!filters.endTime || lead.preferred_time_to_talk <= filters.endTime)

      return searchMatch && typeMatch && statusMatch && visaMatch && dateMatch && timeMatch
    })
    .sort((a, b) => {
      if (filters.dateSort) {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);

        if (filters.dateSort === "newest") {
          return dateB - dateA;
        } else {
          return dateA - dateB;
        }
      }

      if (!filters.sortField) return 0;

      let valA = a[filters.sortField];
      let valB = b[filters.sortField];

      if (valA == null) valA = "";
      if (valB == null) valB = "";

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (filters.sortOrder === "asc") {
        return valA > valB ? 1 : valA < valB ? -1 : 0;
      } else {
        return valA < valB ? 1 : valA > valB ? -1 : 0;
      }
    });

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);



  // console.log("Sample lead:", leads[0]);
  // console.log("Sample lead after filter:", filteredLeads[0]);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await getLeads()
        console.log("Full API Response:", res.data)
        setLeads(Array.isArray(res.data) ? res.data : [res.data])
      } catch (error) {
        console.error("Error fetching leads:", error)
      }
    }
    fetchLeads()
  }, []);

  useEffect(() => {
    const fetchActiveLead = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/leads/active-lead-count');
        SetTotalLeads(res.data.count);
        console.log(res.data.count);
      } catch (error) {
        console.error(error);
      }
    }
    fetchActiveLead();
  }, [])

  return (
    <div className="container-fluid mt-5 px-5">
      <div className="row g-5">
        <h4 className='mt-4 text-left adminDashboardTitle'>Hello Leads <img src={LeadImg} alt="Users" className="mb-2" style={{ width: "40px", border: "0px solid green", borderRadius: "20px" }} /> ,</h4>
        <div className="col-12 col-md-4 m-0 mb-2">
          <div className="rounded-4 bg-white shadow-sm py-4 h-100">
            <div className="d-flex flex-column flex-md-row align-items-center text-center text-md-start gap-3 px-3">
              <img src={LeadImg} alt="" className="mb-2 img-fluid" />
              <div>
                <h6 className="mb-1 text-muted">Total Leads</h6>
                <h4 className="fw-bold">{totalLeads}</h4>
                <small className="text-success">16% this month</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4 m-0 mb-2">
          <div className="rounded-4 bg-white shadow-sm py-4 h-100">
            <div className="d-flex flex-column flex-md-row align-items-center text-center text-md-start gap-3 px-3">
              <img src={LeadImg} alt="" className="mb-2 img-fluid" />
              <div>
                <h6 className="mb-1 text-muted">Total Leads</h6>
                <h4 className="fw-bold">{totalLeads}</h4>
                <small className="text-success">16% this month</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4 m-0 mb-2">
          <div className="rounded-4 bg-white shadow-sm py-4 h-100">
            <div className="d-flex flex-column flex-md-row align-items-center text-center text-md-start gap-3 px-3">
              <img src={LeadImg} alt="" className="mb-2 img-fluid" />
              <div>
                <h6 className="mb-1 text-center">Total Leads</h6>
                <h4 className="fw-bold">{totalLeads}</h4>
                <small className="text-success">16% this month</small>
              </div>
            </div>
          </div>
        </div>


        <div className="col-12 col-md-8 col-lg-12 mt-2">
          <div className="rounded-4 bg-white shadow-sm p-4 table-responsive h-100">
            <div className="d-flex justify-content-between align-items-center px-3 mt-2 mb-3">
              <div>
                <h5 className="text-left leadManagementTitle mt-4">All Customers</h5>
                <h6 className="leadManagementSubtitle mb-3">Active Leads</h6>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3 px-3 searchBox">
              <div className="d-flex gap-2 flex-wrap">
                <div className="input-group input-group-sm w-auto search">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="form-control form-control-sm w-auto"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="d-flex flex-wrap gap-2 mx-3 my-2 filterContainer">
              <select
                className="form-select form-select-sm w-auto leadType"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="">Lead Types</option>
                <option value="Resume Lead">Resume</option>
                <option value="Manual Lead">Manual</option>

              </select>

              <select
                className="form-select form-select-sm w-auto status"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">Status</option>
                <option value="New">New</option>
                <option value="Connected">Connected</option>
                <option value="In Progress">In Progress</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Rejected">Rejected</option>
                <option value="Converted">Converted</option>
              </select>

              <select
                className="form-select form-select-sm w-auto allVisa"
                value={filters.visa}
                onChange={(e) => setFilters({ ...filters, visa: e.target.value })}
              >
                <option value="">All Visa</option>
                <option value="H1B">H1B</option>
                <option value="F1">F1</option>
                <option value="OPT">OPT</option>
                <option value="L1">L1</option>
                <option value="Green Card">Green Card</option>
                <option value="Citizen">Citizen</option>
              </select>

              <input
                type="date"
                className="form-control form-control-sm w-auto startDate"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />

              <input type="date"
                className="form-control form-control-sm w-auto endDate"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />

              <input type="time"
                className="form-control form-control-sm w-auto startTime"
                value={filters.startTime}
                onChange={(e) => setFilters({ ...filters, startTime: e.target.value })}
              />

              <input type="time"
                className="form-control form-control-sm w-auto endTime"
                value={filters.endTime}
                onChange={(e) => setFilters({ ...filters, endTime: e.target.value })}
              />

              <select
                className="form-select form-select-sm w-auto dateSort"
                value={filters.dateSort}
                onChange={(e) => setFilters({ ...filters, dateSort: e.target.value })}
              >
                <option value="">Sort by Date</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>


              <select
                className="form-select form-select-sm w-auto sortByOrder"
                value={filters.sortOrder}
                onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}
              >
                <option value="">Sort by Order</option>
                <option value="asc">Asc</option>
                <option value="desc">Desc</option>
              </select>

              <select className="form-select form-select-sm w-auto sortField"
                value={filters.sortField}
                onChange={(e) => setFilters({ ...filters, sortField: e.target.value })}
              >
                <option value="">Sort By</option>
                <option value="candidate_name">Name</option>
                <option value="candidate_email">Email</option>
                <option value="candidate_phone_no">Phone</option>
                <option value="type">Lead Type</option>
                <option value="visa">Visa</option>
                <option value="status">Status</option>
                <option value="createdAt">Created Date</option>
              </select>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() =>
                  setFilters({
                    search: "",
                    type: "",
                    status: "",
                    visa: "",
                    technology: "",
                    startDate: "",
                    endDate: "",
                    startTime: "",
                    endTime: "",
                    sortField: "",
                    sortOrder: "asc",
                  })
                }
              >
                Reset
              </button>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-4 mx-3 mb-3 buttonContainer">

              <button className="btn btn-primary btn-sm me-2 addUserBtn" data-bs-toggle="modal" data-bs-target="#addNewLead" onClick={handleAddLeadClick}>
                <FaPlus className="me-2" /> Add New Lead
              </button>

              <div className="d-flex justify-content-center align-items-center innerButtons">
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleImportExcel}
                  style={{ display: "none" }}
                  id="importExcel"
                />

                {bulkAdd && (
                  <label htmlFor="importExcel" className="btn btn-outline-primary me-3 btn-sm importLead">
                    <FaDownload /> Import Leads
                  </label>
                )}


                {exports && (
                  <button className="btn btn-outline-primary btn-sm csvFont exportLead" onClick={exportToCSV}>
                    <FaArrowUp />  Export Leads to CSV
                  </button>
                )}

                <button
                  className="btn btn-outline-danger btn-sm me-2 refresh" onClick={handleRefresh} >
                  <FaSync className="me-1" /> Refresh
                </button>
              </div>

            </div>

            {loading ? (
              <div className="text-center mt-3">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden"></span>
                </div>
                <p>Loading Leads....</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="table table-hover table-responsive align-middle rounded-5 mb-0 bg-white">
                  <thead className="bg-light">
                    <tr>
                      <th className="text-left tableHeader">Name</th>
                      <th className="text-left tableHeader">Email</th>
                      <th className="text-left tableHeader">Lead Type</th>
                      <th className="text-left tableHeader">Phone No</th>
                      <th className="text-left tableHeader">URL</th>
                      {/* <th className="text-left tableHeader">University</th> */}
                      <th className="text-left tableHeader">Technology</th>
                      <th className="text-left tableHeader">Visa</th>
                      <th className="text-left tableHeader">Preferred Time</th>
                      {/* <th className="text-left tableHeader">Source</th> */}
                      <th className="text-center tableHeader">Status</th>
                      <th className="text-left tableHeader">Created At</th>
                      <th className="text-left tableHeader">Updated At</th>
                      <th className="text-left tableHeader">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentLeads.map((lead) => (
                      <tr key={lead._id}>
                        <td>
                          <p className="mb-0 text-left tableData">{lead.candidate_name}</p>
                        </td>
                        <td>
                          <p className="mb-0 text-left tableData">{lead.candidate_email}</p>
                        </td>
                        <td>
                          <p className="mb-0 text-left tableData">{lead.type}</p>
                        </td>
                        <td>
                          <p className="mb-0 text-left tableData">{lead.candidate_phone_no}</p>
                        </td>
                        <td>
                          <p className="mb-0 text-left tableData">{lead.linked_in_url}</p>
                        </td>
                        {/* <td>
                    <p className="mb-0 text-left tableData">{lead.university}</p>
                  </td> */}
                        <td className="text-left tableData">
                          {Array.isArray(lead.technology)
                            ? lead.technology.join(", ")
                            : lead.technology}
                        </td>
                        <td className="text-left tableData">
                          <p className="mb-0">{lead.visa}</p>
                        </td>
                        <td className="text-left tableData">
                          <p className="mb-0">{lead.preferred_time_to_talk}</p>
                        </td>
                        {/* <td className="text-left tableData">
                    <p className="mb-0">{lead.source}</p>
                  </td> */}
                        <td className="text-center">
                          <span
                            className={`badge status-badge px-2 py-2 d-flex gap-2
                            ${lead.status === "New" ? "bg-new" :
                                lead.status === "Connected" ? "bg-connected" :
                                  lead.status === "In Progress" ? "bg-inprogress" :
                                    lead.status === "Shortlisted" ? "bg-shortlisted text-dark" :
                                      lead.status === "Rejected" ? "bg-rejected" :
                                        lead.status === "Converted" ? "bg-converted" : "bg-secondary"}`}
                          >
                            {lead.status === "New" && <FaLink />}
                            {lead.status === "Connected" && <FaCheckCircle />}
                            {lead.status === "In Progress" && <FaHourglassHalf />}
                            {lead.status === "Shortlisted" && <FaStar />}
                            {lead.status === "Rejected" && <FaTimesCircle />}
                            {lead.status === "Converted" && <FaUserCheck />}

                            {lead.status}
                          </span>
                        </td>


                        <td className="text-left tableData">
                          <p className="mb-0">{formatDateTimeIST(lead.createdAt)}</p>
                        </td>
                        <td className="text-left tableData">
                          <p className="mb-0">{formatDateTimeIST(lead.updatedAt)}</p>
                        </td>

                        <td className="text-left tableData">
                          {/* <button
                        type="button"
                        className="btn btn-outline-primary btn-sm btn-rounded me-2"
                        onClick={() => navigate(`/leads/${lead._id}`)}
                      >
                        View
                      </button> */}

                          <button className="btn btn-outline-warning btn-sm btn-rounded me-2" data-bs-toggle="modal" data-bs-target="#viewLead" onClick={() => setSelectedLead(lead)}>View</button>

                          {/* <button
                        type="button"
                        className="btn btn-outline-success btn-sm btn-rounded me-2"
                        onClick={() => navigate(`/leads/edit/${lead._id}`)}
                      >
                        Edit
                      </button> */}

                          <button className="btn btn-outline-success btn-sm btn-rounded me-2" data-bs-toggle="modal" data-bs-target="#editLead" onClick={() => handleEditClick(lead)}>Edit</button>

                          <button type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={async () => {
                              if (window.confirm("Are you sure?")) {
                                await deleteLead(lead._id);
                                setLeads(leads.filter(l => l._id !== lead._id));
                              }
                            }}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            )}


            <div className="d-flex justify-content-end align-items-center mt-3 mb-3 p-2">
              <button
                className="btn btn-sm btn-outline-primary me-2"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`btn btn-sm me-1 ${currentPage === index + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                className="btn btn-sm btn-outline-primary ms-2"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT LEAD MODAL */}
      <div className="modal fade" id="editLead" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-md" role="document">
          <div className="modal-content">
            <div className="modal-body p-0">
              <div className="card card-plain">
                <h3 className="modal-title editUserTitle mt-2">Edit Lead</h3>
                <div className="card-body">
                  {
                    selectedLead && (
                      <form action="" onSubmit={handleSubmitEdit} className="card p-3 shadow-sm" role="form text-left">

                        <label htmlFor="" className="form-check-label">Candidate Name</label>
                        <div className="input-group mb-3">
                          <input name="candidate_name" type="text" value={selectedLead?.candidate_name} onChange={(e) => setSelectedLead({ ...selectedLead, candidate_name: e.target.value })} className="form-control form-control-sm" placeholder="Email" required />
                        </div>

                        <label htmlFor="" className="form-check-label">Email</label>
                        <div className="input-group mb-3">
                          <input name="candidate_email" type="email" value={selectedLead?.candidate_email} onChange={(e) => setSelectedLead({ ...selectedLead, candidate_email: e.target.value })} className="form-control form-control-sm" placeholder="Password" />
                        </div>

                        <label htmlFor="" className="form-check-label">Phone</label>
                        <div className="input-group mb-3">
                          <input
                            type="text"
                            name="candidate_phone_no"
                            maxLength="10"
                            placeholder="Phone No"
                            className="form-control form-control-sm"
                            value={selectedLead?.candidate_phone_no}
                            onChange={(e) => setSelectedLead({ ...selectedLead, candidate_phone_no: e.target.value })}
                            required
                          />
                        </div>

                        <label htmlFor="" className="form-check-label">LinkedIn URL</label>
                        <div className="input-group mb-3">
                          <input
                            type="url"
                            name="linked_in_url"
                            className="form-control form-control-sm"
                            placeholder="LinkedIn URL"
                            value={selectedLead?.linked_in_url}
                            onChange={(e) => setSelectedLead({ ...selectedLead, linked_in_url: e.target.value })}
                          />
                        </div>

                        <label htmlFor="" className="form-check-label">University</label>
                        <div className="input-group mb-3">
                          <input
                            type="text"
                            name="university"
                            className="form-control form-control-sm"
                            placeholder="University"
                            value={selectedLead?.university}
                            onChange={(e) => setSelectedLead({ ...selectedLead, university: e.target.value })}
                          />
                        </div>

                        <label htmlFor="" className="form-check-label">Technology</label>
                        <div className="input-group mb-3">
                          <input
                            type="text"
                            name="technology"
                            className="form-control form-control-sm w-100"
                            value={selectedLead?.technology}
                            onChange={(e) => setSelectedLead({ ...selectedLead, technology: e.target.value })}
                            placeholder="e.g React, Node, Angular"
                          />
                          <small className="technologyFont text-muted">Enter multiple technologies separated by commas</small>
                        </div>

                        <label htmlFor="" className="form-check-label">Visa</label>
                        <div className="input-group mb-3">
                          <select
                            name="visa"
                            className="form-control form-control-sm"
                            value={selectedLead?.visa}
                            onChange={(e) => setSelectedLead({ ...selectedLead, visa: e.target.value })}
                            required
                          >
                            <option value="">----Select Type----</option>
                            <option value="All Visa">All Visa</option>
                            <option value="H1B">H1B</option>
                            <option value="F1">F1</option>
                            <option value="OCI">OCI</option>
                            <option value="Tier 2">Tier 2</option>
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
                            className="form-control form-control-sm"
                            value={selectedLead?.preferred_time_to_talk}
                            onChange={(e) => setSelectedLead({ ...selectedLead, preferred_time_to_talk: e.target.value })}
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
                            className="form-control form-control-sm"
                            placeholder="Source"
                            value={selectedLead?.source}
                            onChange={(e) => setSelectedLead({ ...selectedLead, source: e.target.value })}
                          />
                        </div>

                        <label htmlFor="" className="form-check-label">Status</label>
                        <div className="input-group mb-3">
                          {/* <input
                            type="text"
                            name="status"
                            placeholder="Status"
                            className="form-control form-control-sm"
                            value={selectedLead?.status}
                            onChange={(e) => setSelectedLead({ ...selectedLead, status: e.target.value })}
                          /> */}
                          <select
                            name="status"
                            className="form-control form-control-sm"
                            value={selectedLead?.status}
                            onChange={(e) => setSelectedLead({ ...selectedLead, status: e.target.value })}
                            required
                          >
                            <option value="">----Select Status----</option>
                            <option value="New">New</option>
                            <option value="Connected">Connected</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Converted">Converted</option>
                          </select>
                        </div>

                        <label htmlFor="" className="form-check-label">Interview Type</label>
                        <div className="input-group mb-3">
                          <select
                            name="type"
                            className="form-control form-control-sm"
                            value={selectedLead?.type}
                            onChange={(e) => setSelectedLead({ ...selectedLead, type: e.target.value })}
                            required
                          >
                            <option value="">----Select Type----</option>
                            <option value="Resume Lead">Resume Lead</option>
                            <option value="Manual Lead">Manual Lead</option>
                          </select>
                        </div>

                        {/* <div className="input-group mb-3">
                      <select name="role" value={newUser.role} onChange={handleChange} className="form-select form-select-sm mb-2">
                        {roles.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                      </select>
                    </div> */}

                        <div className="text-center d-flex justify-content-center gap-5">
                          <button className="btn btn-success btn-sm w-50" onClick={async () => {
                            try {
                              await updateLead(selectedLead._id, selectedLead);
                              alert("Lead updated successfully!");
                              window.location.reload();
                            } catch (err) {
                              console.error("Error updating lead:", err);
                            }
                          }}>Update</button>
                          {/* <button className="btn btn-round btn-success btn-sm w-100 mt-2 mb-0 btnColor" onClick={handleAddUser}>Add Lead</button> */}
                          <button className="btn btn-round btn-danger btn-sm w-50"><a href="" data-bs-dismiss="modal" className="text-decoration-none text-light">Cancel</a></button>
                        </div>
                      </form>
                    )
                  }

                </div>
                {/* <p className="editFooterText mx-auto mb-5">
                  Changed your mind.?
                  <a href="javascript:;" data-bs-dismiss="modal" className="text-success text-gradient font-weight-bold ms-1 editUserCancel">Cancel</a>
                </p> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ADD LEAD MODAL */}
      <div className="modal fade" id="addNewLead" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-md" role="document">
          <div className="modal-content">
            <div className="modal-body p-0">
              <div className="card card-plain">
                <h3 className="modal-title editUserTitle mt-2">Add New Lead</h3>
                <div className="card-body">
                  <form action="" onSubmit={handleSubmitNew} className="card p-3 shadow-sm" role="form text-left">

                    <label htmlFor="" className="form-check-label">Candidate Name</label>
                    <div className="input-group mb-3">
                      <input name="candidate_name" type="text" value={newLead.candidate_name} onChange={handleChange} className="form-control form-control-sm" placeholder="Candidate Name" required />
                    </div>

                    <label htmlFor="" className="form-check-label">Email</label>
                    <div className="input-group mb-3">
                      <input name="candidate_email" type="text" value={newLead.candidate_email} onChange={handleChange} className="form-control form-control-sm" placeholder="Email" />
                    </div>

                    <label htmlFor="" className="form-check-label">Phone</label>
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        name="candidate_phone_no"
                        maxLength="10"
                        placeholder="Phone No"
                        className="form-control form-control-sm"
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
                        className="form-control form-control-sm"
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
                        className="form-control form-control-sm"
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
                        className="form-control form-control-sm w-100"
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
                        className="form-control form-control-sm"
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
                        className="form-control form-control-sm"
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
                        className="form-control form-control-sm"
                        placeholder="Source"
                        value={newLead.source}
                        onChange={handleChange}
                      />
                    </div>

                    <label htmlFor="" className="form-check-label">Status</label>
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        name="status"
                        placeholder="Status"
                        className="form-control form-control-sm"
                        value={newLead.status}
                        onChange={handleChange}
                      />
                    </div>

                    <label htmlFor="" className="form-check-label">Interview Type</label>
                    <div className="input-group mb-3">
                      <select
                        name="type"
                        className="form-control form-control-sm"
                        value={newLead.type}
                        onChange={handleChange}
                        required
                      >
                        <option value="">----Select Type----</option>
                        <option value="Resume Lead">Resume Lead</option>
                        <option value="Manual Lead">Manual Lead</option>
                      </select>
                    </div>

                    {/* <div className="input-group mb-3">
                      <select name="role" value={newUser.role} onChange={handleChange} className="form-select form-select-sm mb-2">
                        {roles.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                      </select>
                    </div> */}

                    <div className="text-center">
                      <button className="btn btn-success btn-sm w-100 mt-2 mb-0" onClick={handleAddUser}>Add Lead</button>
                      {/* <button className="btn btn-round btn-success btn-sm w-100 mt-2 mb-0 btnColor" onClick={handleAddUser}>Add Lead</button> */}
                      <button className="btn btn-round btn-danger btn-sm w-100 my-2"><a href="javascript:;" data-bs-dismiss="modal" className="text-decoration-none text-light">Cancel</a></button>
                    </div>
                  </form>
                </div>
                {/* <p className="editFooterText mx-auto mb-5">
                  Changed your mind.?
                  <a href="javascript:;" data-bs-dismiss="modal" className="text-success text-gradient font-weight-bold ms-1 editUserCancel">Cancel</a>
                </p> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Lead Modal */}
      <div className="modal fade" id="viewLead" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-md" role="document">
          <div className="modal-content">
            <div className="modal-body p-0">
              <div className="card card-plain">
                <h3 className="modal-title editUserTitle mt-2 text-center">Lead Details</h3>

                <div className="card-body">
                  {selectedLead ? (
                    <form className="card p-3 shadow-sm">


                      <label className="form-check-label">Name</label>
                      <div className="input-group mb-3">
                        <h4 className="form-control form-control-sm">{selectedLead.candidate_name}</h4>
                      </div>


                      <label className="form-check-label">Email</label>
                      <div className="input-group mb-3">
                        <h4 className="form-control form-control-sm">{selectedLead.candidate_email}</h4>
                      </div>


                      <label className="form-check-label">Lead Type</label>
                      <div className="input-group mb-3">
                        <h4 className="form-control form-control-sm">{selectedLead.type}</h4>
                      </div>


                      <label className="form-check-label">Phone</label>
                      <div className="input-group mb-3">
                        <h4 className="form-control form-control-sm">{selectedLead.candidate_phone_no}</h4>
                      </div>

                      <label className="form-check-label">LinkedIn</label>
                      <div className="input-group mb-3">
                        <h4 className="form-control form-control-sm">{selectedLead.linked_in_url}</h4>
                      </div>

                      <label className="form-check-label">University</label>
                      <div className="input-group mb-3">
                        <h4 className="form-control form-control-sm">{selectedLead.university}</h4>
                      </div>

                      <label className="form-check-label">Technology</label>
                      <div className="input-group mb-3">
                        <h4 className="form-control form-control-sm">
                          {Array.isArray(selectedLead.technology)
                            ? selectedLead.technology.join(", ")
                            : selectedLead.technology}
                        </h4>
                      </div>


                      <label className="form-check-label">Visa</label>
                      <div className="input-group mb-3">
                        <h4 className="form-control form-control-sm">{selectedLead.visa}</h4>
                      </div>

                      <label className="form-check-label">Preferred Time</label>
                      <div className="input-group mb-3">
                        <h4 className="form-control form-control-sm">{selectedLead.preferred_time_to_talk}</h4>
                      </div>


                      <label className="form-check-label">Source</label>
                      <div className="input-group mb-3">
                        <h4 className="form-control form-control-sm">{selectedLead.source}</h4>
                      </div>

                      <label className="form-check-label">Status</label>
                      <div className="input-group mb-3">
                        <h4
                          className={`badge px-3 py-2 rounded-pill ${selectedLead.status === "New"
                            ? "bg-primary"
                            : selectedLead.status === "Connected"
                              ? "bg-success"
                              : selectedLead.status === "In Progress"
                                ? "bg-warning text-dark"
                                : selectedLead.status === "Shortlisted"
                                  ? "bg-info text-dark"
                                  : selectedLead.status === "Rejected"
                                    ? "bg-danger"
                                    : "bg-secondary"
                            }`}
                        >
                          {selectedLead.status}
                        </h4>
                      </div>

                    </form>
                  ) : (
                    <h2 className="text-center my-3">Loading...</h2>
                  )}
                </div>

                <div className="text-center mb-4">
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                    onClick={() => setSelectedLead(null)}
                  >
                    Close
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>


    </div >
  )
}

export default Leads
