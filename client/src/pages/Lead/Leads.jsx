import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getLeadById, createLead, getLeads, deleteLead, updateLead } from "../../api/leadApi";
import { FaPlus, FaDownload, FaFileCsv, FaFileExcel, FaAlignRight, FaArrowRight } from "react-icons/fa";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import LeadImg from "../../assets/Lead_Img.png"
import axios from "axios";
import * as XLSX from 'xlsx';
import { FaLink, FaCheckCircle, FaSync, FaStar, FaHourglassHalf, FaTimesCircle, FaArrowUp } from "react-icons/fa";
// import LinuxCard from "../../components/LinuxCard";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import MyLoader from '../../components/Lead/MyLoader';
import { FiLogOut } from 'react-icons/fi'

const Leads = () => {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
  console.log(user?.permission?.lead?.bulkAdd);
  // const bulkAdd = user?.permission?.lead?.bulkAdd === true
  // const exports = user?.permission?.lead?.export === true
  const [leads, setLeads] = useState([]);
  // const [assign, setAssigns] = useState([]);
  const [unassignedLeads, setUnassignedLeads] = useState([]);
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [finalLead, setFinalLead] = useState(null);
  const [selectedMember, setSelectedMember] = useState("");
  const [userName, setUserName] = useState("");
  const [viewLead, setViewLead] = useState(null);
  const navigate = useNavigate();
  const [totalLeads, SetTotalLeads] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentUnassignedPage, setCurrentUnassignedPage] = useState(1);
  const [currentAssignedPage, setCurrentAssignedPage] = useState(1);
  const [modalSource, setModalSource] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState([]);

  const [selectedAllLeads, setSelectedAllLeads] = useState([]);
  const [selectAllAll, setSelectAllAll] = useState(false);

  const [selectedUnassignedLeads, setSelectedUnassignedLeads] = useState([]);
  const [selectAllUnassigned, setSelectAllUnassigned] = useState(false);

  const [selectedAssignedLeads, setSelectedAssignedLeads] = useState([]);
  const [selectAllAssigned, setSelectAllAssigned] = useState(false);

  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sqaureLoading, setSquareLoading] = useState(false);
  const [permissions, setPermissions] = useState({});
  const [outcome, setOutcome] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [allLeadIds, setAllLeadIds] = useState([]);
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  // const [stats, setStats] = useState({ total: 0, assigned: 0, unassigned: 0 });
  const [counts, setCounts] = useState({
    total: 0,
    unassigned: 0,
    assigned: 0
  });
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

  useEffect(() => {
    const fetchState = async () => {
      try {
        setSquareLoading(false);
        const token = sessionStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/api/leads/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        // setStats(res.data);
        setCounts(res.data);
        setSquareLoading(true);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }
    fetchState();
  }, []);

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

  useEffect(() => {

    const loggedInUser = JSON.parse(sessionStorage.getItem("user"));

    if (loggedInUser?.name) {
      setUserName(loggedInUser?.name);
    }

  }, [])

  useEffect(() => {
    console.log("Permissions for user:", permissions);
  }, [permissions]);


  useEffect(() => {
    fetchBackendLeads();
    fetchTeamMember();
    fetchPermissions();
    fetchAllLeadIds();
  }, []);

  const fetchBackendLeads = async () => {
    const token = sessionStorage.getItem("token");
    console.log("Token:", token);
    const loggedInUser = JSON.parse(sessionStorage.getItem("user"));
    console.log("LoggedInUser Details:", loggedInUser);
    const roleName = loggedInUser?.role;

    try {

      setSquareLoading(true);

      const res = await axios.get(`${BASE_URL}/api/leads/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUnassignedLeads(res.data.unassignedLeads || []);
      setAssignedLeads(res.data.assignedLeads || []);

      console.log("Unassigned state (after API):", res.data.unassignedLeads);
      console.log("Assigned state (after API):", res.data.assignedLeads);

      setCounts({
        total: res.data.total,
        unassigned: res.data.unassigned,
        assigned: res.data.assigned
      });

      console.log(`${roleName} Lead State:`, res.data);
    }
    catch (error) {
      console.error("Error fetching leads:", error.response?.data || error);
    }
    finally {
      setSquareLoading(false);
    }
  }

  const handleLogout = () => {

    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("role");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    navigate("/");
  }

  const fetchAllLeadIds = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const res = await axios.get(`${BASE_URL}/api/leads/idsOnly`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllLeadIds(res.data);
    } catch (error) {
      console.error("Error fetching all lead IDs:", error);
    }
  };

  const handleSelectAllAll = () => {
    if (selectAllAll) {
      setSelectedAllLeads([]);
      setSelectedLead([]);
      setSelectAllAll(false);
      console.log("Deselected all 'All Leads'");
    } else {
      const ids = leads.map(l => l._id);
      setSelectedAllLeads(ids);
      setSelectedLead(ids);
      setSelectAllAll(true);
      console.log(`Selected all 'All Leads': ${ids.length}`);
    }
  };

  const handleSelectAllUnassigned = () => {
    if (selectAllUnassigned) {
      setSelectedUnassignedLeads([]);
      setSelectedLead([]);
      setSelectAllUnassigned(false);
      console.log("Deselected all 'Unassigned Leads'")
    } else {
      const ids = unassignedLeads.map(l => l._id);
      setSelectedUnassignedLeads(ids);
      setSelectedLead(ids);
      setSelectAllUnassigned(true);
      console.log(`Selected all 'Unassigned Leads': ${ids.length}`);
    }
  };

  const handleSelectAllAssigned = () => {
    if (selectAllAssigned) {
      setSelectedAssignedLeads([]);
      setSelectedLead([]);
      setSelectAllAssigned(false);
      console.log("Deselected all 'Assigned Leads'");
    } else {
      const ids = assignedLeads.map(l => l._id);
      setSelectedAssignedLeads(ids);
      setSelectedLead(ids);
      setSelectAllAssigned(true);
      console.log(`Selected all 'Assigned Leads': ${ids.length}`);
    }
  };

  // const toggleLeadSelection = (id, type) => {
  //   switch (type) {
  //     case "all":
  //       setSelectedAllLeads(prev =>
  //         prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
  //       );
  //       setSelectAllAll(false);
  //       break;
  //     case "unassigned":
  //       setSelectedUnassignedLeads(prev =>
  //         prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
  //       );
  //       setSelectAllUnassigned(false);
  //       break;
  //     case "assigned":
  //       setSelectedAssignedLeads(prev =>
  //         prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
  //       );
  //       setSelectAllAssigned(false);
  //       break;
  //   }
  // };

  const toggleLeadSelection = (id, type) => {
    switch (type) {
      case "all":
        setSelectedAllLeads(prev => {
          let updated;
          if (prev.includes(id)) {
            updated = prev.filter(l => l !== id);
            setSelectAllAll(false);
          } else {
            updated = [...prev, id];
            if (updated.length === leads.length) setSelectAllAll(true);
          }
          return updated;
        });
        break;

      case "unassigned":
        setSelectedUnassignedLeads(prev => {
          let updated;
          if (prev.includes(id)) {
            updated = prev.filter(l => l !== id);
            setSelectAllUnassigned(false);
          } else {
            updated = [...prev, id];
            if (updated.length === unassignedLeads.length) setSelectAllUnassigned(true);
          }
          return updated;
        });
        break;

      case "assigned":
        setSelectedAssignedLeads(prev => {
          let updated;
          if (prev.includes(id)) {
            updated = prev.filter(l => l !== id);
            setSelectAllAssigned(false);
          } else {
            updated = [...prev, id];
            if (updated.length === assignedLeads.length) setSelectAllAssigned(true);
          }
          return updated;
        });
        break;
    }
  };

  const handleSelectAll = (e, type = "all") => {
    const checked = e.target.checked;
    setSelectAll(checked);

    if (!checked) {
      setSelectedLead([]);
      console.log("Selection Cleared");
      return;
    }

    let ids = [];

    switch (type) {
      case "unassigned":
        ids = unassignedLeads.map(lead => lead._id);
        break;
      case "assigned":
        ids = assignedLeads.map(lead => lead._id);
        break;
      case "all":
        ids = leads.map(lead => lead._id);
        break;
    }

    setSelectedLead(ids);
    console.log(`Selected ${ids.length} leads from type: ${type}`);
  }



  const handleBulkAssign = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const res = await axios.put(`${BASE_URL}/api/leads/bulk-assign`,
        {
          leadIds: selectedLead,
          teamMemberId: selectedMember
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
      setSelectedLead([]);
      setSelectAll(false);
      fetchBackendLeads();
      handleRefresh();
    } catch (error) {
      console.error("Bulk assign error:", error);
      alert("Error assigning leads");
    }
  }

  const handleBulkDelete = async () => {
    if (selectedAllLeads.length === 0) return;

    if (!window.confirm(`Are you sure you want to delete ${selectedAllLeads.length} leads?`)) return;

    try {
      const token = sessionStorage.getItem("token");

      const res = await axios.post(`${BASE_URL}/api/leads/bulk-delete`,
        { leadIds: selectedAllLeads },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message);
      setSelectedAllLeads([]);
      setSelectAllAll(false);
      fetchBackendLeads();
      handleRefresh();
    } catch (error) {
      console.error("Bulk delete error:", error);
      alert("Error deleting leads");
    }
  }

  const fetchTeamMember = async () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("user"));

    const assignerRole =
      typeof loggedInUser.role === "string"
        ? loggedInUser.role
        : loggedInUser.role?.name;

    try {
      const res = await axios.get(`${BASE_URL}/api/auth/users`);
      const users = res.data;

      console.log("Assigner Role (Normalized):", assignerRole);
      users.forEach((u) =>
        console.log(u.name, "| role?.name:", u.role?.name)
      );

      let filteredUsers = [];

      if (assignerRole === "Lead_Gen_Manager") {
        filteredUsers = users.filter(
          (u) => u.role?.name === "Sales_Manager"
        );
      } else if (assignerRole === "Sales_Manager") {
        filteredUsers = users.filter(
          (u) => u.role?.name === "Sales"
        );
      }

      setTeamMembers(filteredUsers);
      console.log("Final Filtered Users:", filteredUsers);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  const fetchPermissions = async () => {
    try {
      // const role = localStorage.getItem("role");
      const role = sessionStorage.getItem("role");
      console.log("Role from localStorage:", role);

      const res = await axios.get(`${BASE_URL}/api/roles`);
      console.log("Fetched permission from backend:", res.data);

      const currentRole = res.data.find(r => r.name === role);
      if (currentRole) {
        console.log("Permission for current real user permission:", currentRole.permissions);
        setPermissions(currentRole.permissions);
      }
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

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
      // fetchUnassignedLeads();
      fetchBackendLeads();
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
      await axios.put(`${BASE_URL}/api/leads/${selectedLead._id}`, payload);
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
  }

  const handleRefresh = async () => {
    try {
      setSquareLoading(true);
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/leads`);
      console.log("Lead fetched:", res.data);
      setLeads(res.data);
      console.log("Current permission:", permissions);

      await fetchBackendLeads();
      await fetchPermissions();

    } catch (err) {
      console.error("Error refreshing users:", err);
    } finally {
      setSquareLoading(true);
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
        await axios.post(`${BASE_URL}/api/leads/import`, { leads: worksheet });
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

  const handleAssign = async () => {

    if (!selectedLead || !selectedMember) return;

    const token = sessionStorage.getItem("token");

    console.log("Sending token to backend:", token);

    console.log("Selected Lead ID:", selectedLead, "Selected Member ID:", selectedMember);

    try {

      const loggedInUser = JSON.parse(sessionStorage.getItem("user"));
      console.log("LoggedIn User:", loggedInUser);

      const roleName = loggedInUser?.role?.name;

      const managerId = loggedInUser?._id || loggedInUser.id;
      console.log("Manager ID:", managerId);

      const res = await axios.post(`${BASE_URL}/api/leads/assign/${selectedLead}`,
        {
          teamMemberId: selectedMember,
          assignedBy: managerId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("Assign response:", res.data);

      alert("Lead assigned successfully!");

      setFinalLead(null);
      setSelectedMember("");
      // fetchUnassignedLeads();
      fetchBackendLeads();

      document.getElementById("closeAssignModalBtn").click();

    } catch (error) {
      console.error("Error assigning lead:", error.message);
      alert("Failed to assign lead. Check console for more details")
    }
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

  const indexOfLastUnassignedLeads = currentUnassignedPage * leadsPerPage;
  const indexOfFirstUnassignedLeads = indexOfLastUnassignedLeads - leadsPerPage;
  const currentUnassignedLeads = unassignedLeads.slice(indexOfFirstUnassignedLeads, indexOfLastUnassignedLeads);
  console.log("Unassigned Leads:", unassignedLeads);
  console.log("Current Unassigned Leads:", currentUnassignedLeads);

  const indexOfLastAssignedLeads = currentAssignedPage * leadsPerPage;
  const indexOfFirstAssignedLeads = indexOfLastAssignedLeads - leadsPerPage;
  const currentAssignedLeads = assignedLeads.slice(indexOfFirstAssignedLeads, indexOfLastAssignedLeads);

  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);
  const totalUnassignedPages = Math.ceil(unassignedLeads.length / leadsPerPage);
  const totalAssignedPages = Math.ceil(assignedLeads.length / leadsPerPage);


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
    async function fetchLeads() {
      try {
        const loggedInUser = JSON.parse(sessionStorage.getItem("user"));
        const token = sessionStorage.getItem("token");
        const roleName = loggedInUser?.role?.name;

        let apiEndpoint = "";
        if (roleName === "Sales") {
          apiEndpoint = `${BASE_URL}/api/leads/myleads`
        }
        if (roleName === "Sales_Manager") {
          apiEndpoint = `${BASE_URL}/api/leads/myleads`;
        } else {
          apiEndpoint = `${BASE_URL}/api/leads`;
        }

        const res = await axios.get(apiEndpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Role-based API Response:", res.data);
        setLeads(Array.isArray(res.data) ? res.data : [res.data]);
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    }
    fetchLeads();
  }, [])

  useEffect(() => {
    const fetchActiveLead = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/leads/active-lead-count`);
        SetTotalLeads(res.data.count);
        console.log(res.data.count);
      } catch (error) {
        console.error(error);
      }
    }
    fetchActiveLead();
  }, []);

  console.log("Unassigned state(render):", unassignedLeads);
  console.log("Assigned state(render):", assignedLeads);

  return (

    <div className="container-fluid mt-5 px-5">
      <div className="row g-5">
        <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
          <h4 className="text-left adminDashboardTitle mb-0">
            Hello, {userName || "User"}{" "}
            <img
              src={LeadImg}
              alt="Users"
              className="mb-2"
              style={{
                width: "40px",
                border: "0px solid green",
                borderRadius: "20px",
              }}
            />
            ,
          </h4>
        </div>
        <div className="col-12 col-md-4 m-0 mb-2">
          <div className="rounded-4 bg-white shadow-sm py-4 h-100">
            {loading ? (
              <span className="squareLoader"></span>
            ) : (
              <div className="d-flex flex-column flex-md-row align-items-center text-center text-md-start gap-3 px-3">
                <img src={LeadImg} alt="" className="mb-2 img-fluid" />
                <div>
                  <h6 className="mb-1 text-muted">Total Leads</h6>
                  <h4 className="fw-bold">{counts.total} </h4>
                  < small className="text-success">16% this month</small>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-12 col-md-4 m-0 mb-2">
          <div className="rounded-4 bg-white shadow-sm py-4 h-100">
            {loading ? (
              <span className="squareLoader"></span>
            ) : (
              <div className="d-flex flex-column flex-md-row align-items-center text-center text-md-start gap-3 px-3">
                <img src={LeadImg} alt="" className="mb-2 img-fluid" />
                <div>
                  <h6 className="mb-1 text-muted">Unassign Leads</h6>
                  <h4 className="fw-bold">{counts.unassigned}</h4>
                  <small className="text-success">16% this month</small>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-12 col-md-4 m-0 mb-2">
          <div className="rounded-4 bg-white shadow-sm py-4 h-100">
            {loading ? (
              <span className="squareLoader"></span>
            ) : (
              <div className="d-flex flex-column flex-md-row align-items-center text-center text-md-start gap-3 px-3">
                <img src={LeadImg} alt="" className="mb-2 img-fluid" />
                <div>
                  <h6 className="mb-1 text-center">Assigned Leads</h6>
                  <h4 className="fw-bold">{counts.assigned}</h4>
                  <small className="text-success">16% this month</small>
                </div>
              </div>
            )}
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
              <div>
                <button className="btn btn-primary btn-sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <i className="bi bi-funnel-fill me-2"></i>
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
              </div>
            </div>



            {showFilters && (
              <div className="d-flex flex-wrap gap-2 mx-3 my-2 filterContainer">
                <select
                  className="form-select form-select-sm w-auto leadType selectFont"
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                  <option value="">Lead Types</option>
                  <option value="Resume Lead">Resume</option>
                  <option value="Manual Lead">Manual</option>
                </select>

                <select
                  className="form-select form-select-sm w-auto status selectFont"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="">Status</option>
                  <option value="New">New</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Connected">Connected</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Converted">Converted</option>
                </select>

                <select
                  className="form-select form-select-sm w-auto allVisa selectFont"
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
                  className="form-control form-control-sm w-auto startDate selectFont"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                />

                <input type="date"
                  className="form-control form-control-sm w-auto endDate selectFont"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                />

                <input type="time"
                  className="form-control form-control-sm w-auto startTime selectFont"
                  value={filters.startTime}
                  onChange={(e) => setFilters({ ...filters, startTime: e.target.value })}
                />

                <input type="time"
                  className="form-control form-control-sm w-auto endTime selectFont"
                  value={filters.endTime}
                  onChange={(e) => setFilters({ ...filters, endTime: e.target.value })}
                />

                <select
                  className="form-select form-select-sm w-auto dateSort selectFont"
                  value={filters.dateSort}
                  onChange={(e) => setFilters({ ...filters, dateSort: e.target.value })}
                >
                  <option value="">Sort by Date</option>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>


                <select
                  className="form-select form-select-sm w-auto sortByOrder selectFont"
                  value={filters.sortOrder}
                  onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}
                >
                  <option value="">Sort by Order</option>
                  <option value="asc">Asc</option>
                  <option value="desc">Desc</option>
                </select>

                <select className="form-select form-select-sm w-auto sortField selectFont"
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
            )}

            <div className="d-flex justify-content-between align-items-center mt-4 mx-3 mb-3 buttonContainer">

              {selectedAllLeads.length > 0 && (
                <h6 className="tableHeader">
                  Selected Leads : {selectedAllLeads.length}
                </h6>
              )}


              {selectedAllLeads.length > 0 && permissions?.lead?.deleteScope !== "none" && (

                <button className="btn btn-outline-danger btn-sm" onClick={handleBulkDelete}> <i className="bi bi-trash-fill me-2"></i>Delete All ({selectedAllLeads.length})</button>
              )}

              {permissions?.lead?.createScope !== "none" && (
                <button className="btn btn-primary btn-sm addUserBtn" data-bs-toggle="modal" data-bs-target="#addNewLead" onClick={handleAddLeadClick}>
                  <FaPlus className="me-2" /> Add New Lead
                </button>
              )}

              <div className="d-flex justify-content-center align-items-center innerButtons">
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleImportExcel}
                  style={{ display: "none" }}
                  id="importExcel"
                />

                {permissions?.lead?.bulkAdd && (
                  <label htmlFor="importExcel" className="btn btn-outline-primary me-1 btn-sm importLead">
                    <FaDownload /> Import Leads
                  </label>
                )}

                {permissions?.lead?.export && (
                  <button className="btn btn-outline-primary btn-sm csvFont exportLead me-1" onClick={exportToCSV}>
                    <FaArrowUp />  Export Leads to CSV
                  </button>
                )}

                <button
                  className="btn btn-outline-danger btn-sm me-2 refresh" onClick={handleRefresh} >
                  <FaSync className="me-1" /> Refresh
                </button>
              </div>

            </div>

            {/* {selectedAllLeads.length > 0 && (
              <div className="d-flex justify-content-between align-items-center mb-3 mx-3">

                <div className="d-flex align-items-center gap-2">
                  <select
                    className="form-select"
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                    style={{ width: "200px" }}
                  >
                    <option value="">-- Select Team Member --</option>
                    {teamMembers.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name} ({user.role.name})
                      </option>
                    ))}
                  </select>

                  <button
                    className="btn btn-primary"
                    onClick={handleBulkAssign}
                    disabled={!selectedMember || selectedLead.length === 0}
                  >
                    Assign Selected ({selectedAllLeads.length})
                  </button>
                </div>
              </div>
            )} */}

            {loading ? (
              <MyLoader
                rowHeight={40}
                rowCount={5}
                columnWidths={["90", "140", "110", "110", "200", "130", "130", "110", "130"]} />
            ) : (
              <div className="table-container">
                <table className="table table-hover table-bordered table-responsive align-middle rounded-5 mb-0 bg-white">
                  <thead className="bg-light">
                    <tr>
                      <th className="text-center tableHeader">
                        <div className="d-flex align-items-start flex-column justify-content-center gap-2">
                          <label htmlFor="selectAllCheckbox" className="form-label">
                            Select All
                          </label>
                          <input
                            type="checkbox"
                            checked={selectAllAll}
                            onChange={handleSelectAllAll}
                            id="selectAllCheckbox"
                          />
                        </div>
                      </th>

                      <th className="text-left tableHeader">Name</th>
                      <th className="text-left tableHeader">Email</th>
                      <th className="text-left tableHeader">Lead Type</th>
                      <th className="text-left tableHeader">Phone No</th>
                      <th className="text-left tableHeader">URL</th>
                      <th className="text-left tableHeader">University</th>
                      <th className="text-left tableHeader">Technology</th>
                      <th className="text-left tableHeader">Visa</th>
                      <th className="text-left tableHeader">Preferred Time</th>
                      <th className="text-left tableHeader">Source</th>
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
                          <input type="checkbox"
                            checked={selectedAllLeads.includes(lead._id)}
                            onChange={() => toggleLeadSelection(lead._id, "all")}
                          />
                        </td>
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
                        <td>
                          <p className="mb-0 text-left tableData">{lead.university}</p>
                        </td>
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
                        <td className="text-left tableData">
                          <p className="mb-0">{lead.source}</p>
                        </td>
                        <td className="text-center">
                          <span
                            className={`badge status-badge px-2 py-2 d-flex gap-2
                            ${lead.status === "New" ? "bg-new" :
                                lead.status === "Connected" ? "bg-connected" :
                                  lead.status === "In Progress" ? "bg-inprogress" :
                                    lead.status === "Shortlisted" ? "bg-shortlisted text-dark" :
                                      lead.status === "Rejected" ? "bg-rejected" :
                                        lead.status === "Assigned" ? "bg-success" :
                                          lead.status === "Converted" ? "bg-converted" : "bg-secondary"}`}
                          >
                            {lead.status === "New" && <FaLink />}
                            {lead.status === "Connected" && <FaCheckCircle />}
                            {lead.status === "In Progress" && <FaHourglassHalf />}
                            {lead.status === "Shortlisted" && <FaStar />}
                            {lead.status === "Rejected" && <FaTimesCircle />}
                            {lead.status === "Converted" && <FaUserCheck />}
                            {lead.status === "Assigned" && <FaCheckCircle />}

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
                          <button
                            className="btn btn-outline-warning btn-sm btn-rounded me-2"
                            data-bs-toggle="modal"
                            data-bs-target="#viewLead"
                            onClick={() => {
                              setSelectedLead(lead);
                              setModalSource("all");
                            }}>
                            View
                          </button>

                          {permissions?.lead?.updateScope !== "none" && (
                            <button
                              className="btn btn-outline-success btn-sm btn-rounded me-2"
                              data-bs-toggle="modal"
                              data-bs-target="#editLead"
                              onClick={() => handleEditClick(lead)}>
                              Edit
                            </button>
                          )}

                          {permissions?.lead?.deleteScope !== "none" && (
                            <button type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={async () => {
                                if (window.confirm("Are you sure?")) {
                                  await deleteLead(lead._id);
                                  setLeads(leads.filter(l => l._id !== lead._id));
                                  fetchBackendLeads();
                                }
                              }}>
                              Delete
                            </button>
                          )}

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

        {/* Unassigned Leads */}

        <div className="col-12 col-md-8 col-lg-12 mt-2">
          <div className="rounded-4 bg-white shadow-sm p-4 table-responsive h-100">
            <div className="d-flex justify-content-between align-items-center px-3 mt-2 mb-3">
              <div>
                <h5 className="text-left leadManagementTitle mt-4">All Unassigned Leads({counts.unassigned})</h5>
                <h6 className="leadManagementSubtitle mb-3">Active Leads</h6>
              </div>
            </div>

            {/* <div>
              <button className="btn btn-primary btn-sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <i className="bi bi-funnel-fill me-2"></i>
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            </div> */}


            {selectedUnassignedLeads.length > 0 && (
              <div className="d-flex justify-content-between align-items-center mb-3 mx-3">
                <h6 className="tableHeader">Selected Leads : {selectedUnassignedLeads.length}</h6>

                <div className="d-flex align-items-center gap-2">
                  <select
                    className="form-select form-select-sm selectFont"
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                    style={{ width: "200px" }}>
                    <option value="">Select Team Member</option>
                    {teamMembers.map((user) => (
                      <option value={user._id} key={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </select>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleBulkAssign}
                    disabled={!selectedMember || selectedUnassignedLeads.length === 0}>
                    Assign Selected ({selectedUnassignedLeads.length})
                  </button>
                </div>
              </div>
            )}

            {loading ? (
              <MyLoader
                rowHeight={40}
                rowCount={5}
                columnWidths={["90", "140", "110", "110", "200", "130", "130", "110", "130"]} />
            ) : (
              <div className="table-container">
                <table className="table table-hover table-bordered table-responsive align-middle rounded-5 mb-0 bg-white">
                  <thead className="bg-light">
                    <tr>
                      <th className="text-left tableHeader">
                        <div className="d-flex align-items-start justify-content-center flex-column">
                          <label htmlFor="selectAllCheckbox" className="form-label">
                            Select All
                          </label>
                          <input
                            type="checkbox"
                            checked={selectAllUnassigned}
                            onChange={(e) => handleSelectAllUnassigned(e, "unassigned")}
                          />
                        </div>
                      </th>
                      <th className="text-left tableHeader">Name</th>
                      <th className="text-left tableHeader">Email</th>
                      <th className="text-left tableHeader">Phone No</th>
                      <th className="text-left tableHeader">Actions</th>
                      {/* <th className="text-left tableHeader">Lead Type</th> */}
                      {/* <th className="text-left tableHeader">URL</th> */}
                      {/* <th className="text-left tableHeader">University</th> */}
                      {/* <th className="text-left tableHeader">Technology</th> */}
                      {/* <th className="text-left tableHeader">Visa</th> */}
                      {/* <th className="text-left tableHeader">Preferred Time</th> */}
                      {/* <th className="text-left tableHeader">Source</th> */}
                      {/* <th className="text-center tableHeader">Status</th> */}
                      {/* <th className="text-left tableHeader">Created At</th> */}
                      {/* <th className="text-left tableHeader">Updated At</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {currentUnassignedLeads.map((a) => (
                      <tr key={a._id}>
                        <td>
                          <input type="checkbox"
                            checked={selectedUnassignedLeads.includes(a._id)}
                            onChange={() => toggleLeadSelection(a._id, "unassigned")}
                          />
                        </td>
                        <td>
                          <p className="mb-0 text-left tableData">{a.candidate_name}</p>
                        </td>
                        <td>
                          <p className="mb-0 text-left tableData">{a.candidate_email}</p>
                        </td>
                        {/* <td>
                        <p className="mb-0 text-left tableData">{a.type}</p>
                      </td> */}
                        <td>
                          <p className="mb-0 text-left tableData">{a.candidate_phone_no}</p>
                        </td>
                        <td>
                          {permissions?.lead?.assignToSales && (
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => setSelectedLead(a._id)}
                              data-bs-toggle="modal"
                              data-bs-target="#assignLeadModal">
                              Assign
                            </button>
                          )}
                        </td>

                        {/* <td className="text-left tableData">
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm btn-rounded me-2"
                          onClick={() => navigate(`/leads/${lead._id}`)}
                        >
                          View
                        </button> */}

                        {/* <button className="btn btn-outline-warning btn-sm btn-rounded me-2" data-bs-toggle="modal" data-bs-target="#viewLead" onClick={() => setSelectedLead(lead)}>View</button> */}

                        {/* <button
                        type="button"
                        className="btn btn-outline-success btn-sm btn-rounded me-2"
                        onClick={() => navigate(`/leads/edit/${lead._id}`)}
                      >
                        Edit
                      </button> */}

                        {/* <button className="btn btn-outline-success btn-sm btn-rounded me-2" data-bs-toggle="modal" data-bs-target="#editLead" onClick={() => handleEditClick(lead)}>Edit</button>

                        <button type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={async () => {
                            if (window.confirm("Are you sure?")) {
                              await deleteLead(lead._id);
                              setLeads(leads.filter(l => l._id !== lead._id));
                            }
                          }}>
                          Delete
                        </button> */}
                        {/* </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {
                  finalLead && (
                    <div style={{ border: "1px solid black", padding: "10px", marginTop: "20px" }}>
                      <h3>Assign Lead</h3>
                      <select
                        value={selectedMember}
                        onChange={(e) => setSelectedMember(e.target.value)}
                      >
                        <option value="">Select Team Member</option>
                        {teamMembers
                          .filter((member) => {

                            const roleName = JSON.parse(sessionStorage.getItem("user"))?.role?.name;

                            console.log("Member:", member.name, "Role:", member.role?.name);

                            if (!member.role?.name) return false;

                            if (roleName === "Lead_Gen_Manager") {
                              return member.role?.name === "Sales_Manager";
                            }
                            if (roleName === "Sales_Manager") {
                              return member.role?.name === "Sales";
                            }
                            return false;
                          })
                          .map((member) => (
                            <option key={member._id} value={member._id}>{member.name}</option>
                          ))}

                      </select>
                      <button onClick={handleAssign} disabled={!selectedMember}>Confirm Assign</button>
                      <button onClick={() => setFinalLead(null)}>Cancel</button>
                    </div>
                  )
                }
              </div >
            )}
            <div className="d-flex justify-content-end align-items-center mt-3 mb-3 p-2">
              <button
                className="btn btn-sm btn-outline-primary me-2"
                disabled={currentUnassignedPage === 1}
                onClick={() => setCurrentUnassignedPage(currentUnassignedPage - 1)}
              >
                Previous
              </button>

              {[...Array(totalUnassignedPages)].map((_, index) => (
                <button
                  key={index}
                  className={`btn btn-sm me-1 ${currentUnassignedPage === index + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setCurrentUnassignedPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                className="btn btn-sm btn-outline-primary ms-2"
                disabled={currentUnassignedPage === totalUnassignedPages}
                onClick={() => setCurrentUnassignedPage(currentUnassignedPage + 1)}
              >
                Next
              </button>
            </div>
          </div >
        </div >

        {/* Assigned Leads */}

        <div className="col-12 col-md-8 col-lg-12 mt-2" >
          <div className="rounded-4 bg-white shadow-sm p-4 table-responsive h-100">
            <div className="d-flex justify-content-between align-items-center px-3 mt-2 mb-3">
              <div>
                <h5 className="text-left leadManagementTitle mt-4">All Assigned Leads({counts.assigned})</h5>
                <h6 className="leadManagementSubtitle mb-3">Active Leads</h6>
              </div>
            </div>

            <div>
              {selectedAssignedLeads.length > 0 && (
                <div className="d-flex justify-content-between align-items-center mb-3 mx-3">
                  <h6 className="tableHeader">Selected Leads : {selectedAssignedLeads.length}</h6>

                  {user?.role !== "Sales" && (
                    <div className="d-flex align-items-center gap-2">
                      <select
                        className="form-select form-select-sm selectFont"
                        value={selectedMember}
                        onChange={(e) => setSelectedMember(e.target.value)}
                        style={{ width: "200px" }}
                      >
                        <option value="">Select Team Member</option>
                        {teamMembers.map((user) => (
                          <option key={user._id} value={user._id}>
                            {user.name} ({user.role.name})
                          </option>
                        ))}
                      </select>

                      <button
                        className="btn btn-primary btn-sm"
                        onClick={handleBulkAssign}
                        disabled={!selectedMember || selectedAssignedLeads.length === 0}
                      >
                        Assign Selected ({selectedAssignedLeads.length})
                      </button>
                    </div>
                  )}

                </div>
              )}
            </div>

            {loading ? (
              <MyLoader
                rowHeight={40}
                rowCount={5}
                columnWidths={["90", "140", "110", "110", "200", "130", "130", "110", "130"]} />
            ) : (
              <div className="table-container">
                <table className="table table-hover table-bordered table-responsive align-middle rounded-5 mb-0 bg-white">
                  <thead className="bg-light">
                    <tr>
                      <th className="text-left tableHeader">
                        <div className="d-flex justify-content-center align-items-start flex-column">
                          <label htmlFor="">Select All</label>
                          <input
                            type="checkbox"
                            checked={selectAllAssigned}
                            onChange={(e) => handleSelectAllAssigned(e, "assigned")}
                          />
                        </div>
                      </th>
                      <th className="text-left tableHeader">Name</th>
                      <th className="text-left tableHeader">Email</th>
                      {/* <th className="text-left tableHeader">Lead Type</th> */}
                      <th className="text-left tableHeader">Phone No</th>
                      {/* <th className="text-left tableHeader">URL</th> */}
                      {/* <th className="text-left tableHeader">University</th> */}
                      {/* <th className="text-left tableHeader">Technology</th> */}
                      {/* <th className="text-left tableHeader">Visa</th> */}
                      {/* <th className="text-left tableHeader">Preferred Time</th> */}
                      {/* <th className="text-left tableHeader">Source</th> */}
                      {/* <th className="text-center tableHeader">Status</th> */}
                      {/* <th className="text-left tableHeader">Created At</th> */}
                      {/* <th className="text-left tableHeader">Updated At</th> */}
                      <th className="text-left tableHeader">Assigned To</th>
                      <th className="text-left tableHeader">Assigned By</th>
                      <th className="text-left tableHeader">Actions</th>
                      {/* <th className="text-left tableHeader">Actions</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {currentAssignedLeads.map((a) => (
                      <tr key={a._id}>
                        <td>
                          <input type="checkbox"
                            checked={selectedAssignedLeads.includes(a._id)}
                            onChange={() => toggleLeadSelection(a._id, "assigned")}
                          />
                        </td>
                        <td>
                          <p className="mb-0 text-left tableData">{a.candidate_name}</p>
                        </td>
                        <td>
                          <p className="mb-0 text-left tableData">{a.candidate_email}</p>
                        </td>
                        <td>
                          <p className="mb-0 text-left tableData">{a.candidate_phone_no}</p>
                        </td>
                        <td>
                          <p className="mb-0 text-left tableData">{a.assignedTo?.name}</p>
                        </td>
                        <td>
                          <p className="mb-0 text-left tableData">{a.assignedBy?.name}</p>
                        </td>
                        <td>
                          <button
                            className="btn btn-outline-warning btn-sm btn-rounded me-2"
                            data-bs-toggle="modal"
                            data-bs-target="#viewLead"
                            onClick={() => {
                              setSelectedLead(a);
                              setModalSource("assigned")
                            }}>
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>

                <div className="d-flex justify-content-end align-items-center mt-3 mb-3 p-2">
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    disabled={currentAssignedPage === 1}
                    onClick={() => setCurrentAssignedPage(currentAssignedPage - 1)}
                  >
                    Previous
                  </button>

                  {[...Array(totalAssignedPages)].map((_, index) => (
                    <button
                      key={index}
                      className={`btn btn-sm me-1 ${currentAssignedPage === index + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setCurrentAssignedPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    className="btn btn-sm btn-outline-primary ms-2"
                    disabled={currentAssignedPage === totalAssignedPages}
                    onClick={() => setCurrentAssignedPage(currentAssignedPage + 1)}
                  >
                    Next
                  </button>
                </div>

                <div
                  className="modal fade"
                  id="assignLeadModal"
                  tabIndex="-1"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-dialog-centered modal-md" role="document">
                    <div className="modal-content">
                      <div className="modal-body p-0">
                        <div className="card card-plain">
                          <h3 className="modal-title mt-3 mb-2 text-center">Assign Lead</h3>

                          <div className="card-body">
                            {selectedLead ? (
                              <form className="card p-3 shadow-sm border-0">
                                {/* Dropdown */}
                                <label className="form-label form-label-sm fw-bold">Select Team Member</label>
                                <div className="input-group mb-3">
                                  <select
                                    className="form-select form-select-sm"
                                    value={selectedMember}
                                    onChange={(e) => setSelectedMember(e.target.value)}
                                  >
                                    <option value="">-- Choose Team Member --</option>
                                    {teamMembers.map((member) => (
                                      <option key={member._id} value={member._id}>
                                        {member.name} ({member.role?.name})
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div className="d-flex gap-2">
                                  <button
                                    type="button"
                                    id="closeAssignModalBtn"
                                    className="d-none"
                                    data-bs-dismiss="modal"
                                  ></button>
                                  <button
                                    type="button"
                                    className="btn btn-primary w-50 btn-sm"
                                    onClick={handleAssign}
                                    disabled={!selectedMember}
                                  >
                                    <i className="bi bi-check-circle me-2"></i>
                                    Confirm
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-outline-secondary w-50 btn-sm"
                                    data-bs-dismiss="modal"
                                    onClick={() => setSelectedLead(null)}
                                  >
                                    <i className="bi bi-x-circle me-2"></i>
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <h5 className="text-center my-4">Loading...</h5>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div >
            )}
          </div >
        </div >
      </div >

      {/* EDIT LEAD MODAL */}
      < div className="modal fade" id="editLead" tabIndex="-1" >
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
                          <input name="candidate_name" type="text" value={selectedLead?.candidate_name} onChange={(e) => setSelectedLead({ ...selectedLead, candidate_name: e.target.value })} className="form-control form-control-sm selectFont" placeholder="Email" required />
                        </div>

                        <label htmlFor="" className="form-check-label">Email</label>
                        <div className="input-group mb-3">
                          <input name="candidate_email" type="email" value={selectedLead?.candidate_email} onChange={(e) => setSelectedLead({ ...selectedLead, candidate_email: e.target.value })} className="form-control form-control-sm selectFont" placeholder="Password" />
                        </div>

                        <label htmlFor="" className="form-check-label">Phone</label>
                        <div className="input-group mb-3">
                          <input
                            type="text"
                            name="candidate_phone_no"
                            maxLength="10"
                            placeholder="Phone No"
                            className="form-control form-control-sm selectFont"
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
                            className="form-control form-control-sm selectFont"
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
                            className="form-control form-control-sm selectFont"
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
                            className="form-control form-control-sm w-100 selectFont"
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
                            className="form-control form-control-sm selectFont"
                            value={selectedLead?.visa}
                            onChange={(e) => setSelectedLead({ ...selectedLead, visa: e.target.value })}
                            required
                          >
                            <option value="" className="selectFont">----Select Type----</option>
                            <option value="All Visa" className="selectFont">All Visa</option>
                            <option value="H1B" className="selectFont">H1B</option>
                            <option value="F1" className="selectFont">F1</option>
                            <option value="OCI" className="selectFont">OCI</option>
                            <option value="Tier 2" className="selectFont">Tier 2</option>
                            <option value="OPT" className="selectFont">OPT</option>
                            <option value="L1" className="selectFont">L1</option>
                            <option value="Green Card" className="selectFont">Green Card</option>
                            <option value="Citizen" className="selectFont">Citizen</option>
                          </select>
                        </div>

                        <label htmlFor="" className="form-check-label">Preferred Time To Talk</label>
                        <div className="input-group mb-3">
                          <select
                            name="preferred_time_to_talk"
                            className="form-control form-control-sm selectFont"
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
                            className="form-control form-control-sm selectFont"
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
                            className="form-control form-control-sm selectFont"
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
                            className="form-control form-control-sm selectFont"
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

      {/* ADD NEW LEAD */}
      <div className="modal fade" id="addNewLead" tabIndex="-1" >
        <div className="modal-dialog modal-dialog-centered modal-md" role="document">
          <div className="modal-content">
            <div className="modal-body p-0">
              <div className="card card-plain">
                <h3 className="modal-title editUserTitle mt-2">Add New Lead</h3>
                <div className="card-body">
                  <form action="" onSubmit={handleSubmitNew} className="card p-3 shadow-sm" role="form text-left">

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
                        className="form-control form-cnotrol-sm selectFont"
                        value={newLead.status}
                        onChange={handleChange}
                        required>
                        <option value="">Select Status</option>
                        <option value="New">New</option>
                      </select>
                    </div>

                    <label htmlFor="" className="form-check-label">Interview Type</label>
                    <div className="input-group mb-3">
                      <select
                        name="type"
                        className="form-control form-control-sm selectFont"
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
      </div >

      {/* View Lead Modal */}
      <div className="modal fade" id="viewLead" tabIndex="-1" >
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-body p-0">
              <div className="card card-plain">
                <h3 className="modal-title editUserTitle mt-2 text-center">Lead Details</h3>
                <div className="card-body">
                  {selectedLead ? (
                    <form
                      className="card p-3 shadow-sm"
                      onSubmit={async (e) => {
                        e.preventDefault();
                        console.log("Submitting call for Lead ID:", selectedLead?._id);
                        console.log("Payload:", { outcome, date, time, duration, notes });
                        console.log("Token:", sessionStorage.getItem("token"));

                        setLoading(true);
                        try {
                          const token = sessionStorage.getItem("token");
                          const res = await axios.post(
                            `${BASE_URL}/api/leads/${selectedLead._id}/call`,
                            { outcome, date, time, duration, notes },
                            { headers: { Authorization: `Bearer ${token}` } }
                          );
                          alert("Call outcome saved successfully!");
                          fetchBackendLeads();
                          setSelectedLead(res.data.lead);
                          setOutcome(""); setDate(""); setTime(""); setDuration(""); setNotes("");
                        } catch (err) {
                          console.error("Error saving call outcome:", err.response?.data || err);
                          alert(err.response?.data?.message || "Failed to save call outcome!");
                        } finally {
                          setLoading(false);
                        }
                      }}
                    >

                      <div className="mb-0">
                        <table className="table table-bordered table-sm">
                          <tbody>
                            <tr>
                              <th className="tableHeader">Name</th>
                              <td className="tableData">{selectedLead.candidate_name}</td>
                            </tr>
                            <tr>
                              <th className="tableHeader">Email</th>
                              <td className="tableData">{selectedLead.candidate_email}</td>
                            </tr>
                            <tr>
                              <th className="tableHeader">Phone</th>
                              <td className="tableData">{selectedLead.candidate_phone_no}</td>
                            </tr>
                            <tr>
                              <th className="tableHeader">Technology</th>
                              <td className="tableData">
                                {Array.isArray(selectedLead.technology)
                                  ? selectedLead.technology.join(", ")
                                  : selectedLead.technology}
                              </td>
                            </tr>
                            <tr>
                              <th className="tableHeader">LinkedIn</th>
                              <td className="tableData">{selectedLead.linked_in_url}</td>
                            </tr>
                            <tr>
                              <th className="tableHeader">Visa</th>
                              <td className="tableData">{selectedLead.visa}</td>
                            </tr>
                            <tr>
                              <th className="tableHeader">Lead Type</th>
                              <td className="tableData">{selectedLead.type}</td>
                            </tr>
                            <tr>
                              <th className="tableHeader">University</th>
                              <td className="tableData">{selectedLead.university}</td>
                            </tr>
                            <tr>
                              <th className="tableHeader">Preferred Time to Talk</th>
                              <td className="tableData">{selectedLead.preferred_time_to_talk}</td>
                            </tr>
                            <tr>
                              <th className="tableHeader">Source</th>
                              <td className="tableData">{selectedLead.source}</td>
                            </tr>
                            {modalSource === "assigned" && selectedLead.assignedTo && (
                              <tr>
                                <th className="tableHeader">Assigned To</th>
                                <td className="tableData">{selectedLead.assignedTo.name}</td>
                              </tr>
                            )}
                            {modalSource === "assigned" && selectedLead.assignedBy && (
                              <tr>
                                <th className="tableHeader">Assigned By</th>
                                <td className="tableData">{selectedLead.assignedBy.name}</td>
                              </tr>
                            )}
                            <tr>
                              <th className="tableHeader">Created At</th>
                              <td className="tableData">{formatDateTimeIST(selectedLead.createdAt)}</td>
                            </tr>
                            <tr>
                              <th className="tableHeader">Updated At</th>
                              <td className="tableData">{formatDateTimeIST(selectedLead.updatedAt)}</td>
                            </tr>
                            <tr>
                              <th className="tableHeader">Status</th>
                              <td className="tableData">
                                <span
                                  className={`badge px-3 py-2 rounded-pill fw-normal 
                                 ${selectedLead.status === "New"
                                      ? "bg-primary"
                                      : selectedLead.status === "Connected"
                                        ? "bg-success"
                                        : selectedLead.status === "In Progress"
                                          ? "bg-warning text-dark"
                                          : selectedLead.status === "Shortlisted"
                                            ? "bg-info text-dark"
                                            : selectedLead.status === "Rejected"
                                              ? "bg-danger"
                                              : "bg-success"
                                    }`}
                                >
                                  {selectedLead.status}
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {user.role === "Sales" && (
                        <>
                          <div className="card p-3 shadow-sm mb-3">
                            <h6 className="text-center mb-3">Log Call Outcome</h6>
                            <select
                              value={outcome}
                              onChange={(e) => setOutcome(e.target.value)}
                              required
                              className="form-select form-select-sm mb-2 selectFont"
                            >
                              <option value="">Select Outcome</option>
                              <option value="Not Interested">Not Interested</option>
                              <option value="Interested">Interested</option>
                              <option value="In Discussion">In Discussion</option>
                              <option value="Follow-up">Follow-Up</option>
                            </select>

                            <input
                              type="date"
                              value={date}
                              onChange={(e) => setDate(e.target.value)}
                              required
                              className="form-control form-control-sm mb-2 selectFont"
                            />
                            <input
                              type="time"
                              value={time}
                              onChange={(e) => setTime(e.target.value)}
                              required
                              className="form-control form-control-sm mb-2 selectFont"
                            />
                            <input
                              type="text"
                              value={duration}
                              onChange={(e) => setDuration(e.target.value)}
                              placeholder="Enter Duration (Mins)"
                              required
                              className="form-control form-control-sm mb-2 selectFont"
                            />
                            <textarea
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              required
                              className="form-control form-control-sm mb-2 selectFont"
                              placeholder="Enter notes..."
                            />

                            <button
                              type="submit"
                              className={`btn btn-sm w-100 selectFont text-light ${loading ? "btn-secondary" : "btn-primary"
                                }`}
                              disabled={loading}
                            >
                              {loading ? "Saving..." : "Save Outcome"}
                            </button>
                          </div>

                          <h5 className="mt-3">Call History</h5>
                          {selectedLead?.callHistory && selectedLead.callHistory.length > 0 ? (
                            <div className="table-responsive">
                              <table className="table table-striped table-bordered">
                                <thead>
                                  <tr>
                                    <th className="tableHeader">#</th>
                                    <th className="tableHeader">Outcome</th>
                                    <th className="tableHeader">Date</th>
                                    <th className="tableHeader">Time</th>
                                    <th className="tableHeader">Duration</th>
                                    <th className="tableHeader">Notes</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {selectedLead.callHistory.map((call, index) => {
                                    const date = new Date(call.date);
                                    const formattedDate = date.toLocaleDateString("en-IN", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    });

                                    const [hours, minutes] = call.time.split(":");
                                    const timeDate = new Date();
                                    timeDate.setHours(hours, minutes);
                                    const formattedTime = timeDate.toLocaleTimeString("en-IN", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    });

                                    return (
                                      <tr key={index}>
                                        <td className="tableData">{index + 1}</td>
                                        <td className="tableData">{call.outcome}</td>
                                        <td className="tableData">{formattedDate}</td>
                                        <td className="tableData">{formattedTime}</td>
                                        <td className="tableData">{call.duration}</td>
                                        <td className="tableData">{call.notes}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p className="text-muted">No call history yet.</p>
                          )}
                        </>
                      )}
                      <div className="text-center">
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          data-bs-dismiss="modal"
                          onClick={() => setSelectedLead(null)}
                        >
                          Close
                        </button>
                      </div>
                    </form>
                  ) : (
                    <h2 className="text-center my-3">Loading...</h2>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div >
      </div>
    </div >
  )
}

export default Leads