import React from "react"
import { useEffect, useState, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getLeadById, createLead, getLeads, deleteLead, updateLead } from "../../api/leadApi";
import { FaPlus, FaDownload, FaFileCsv, FaFileExcel, FaAlignRight, FaArrowRight } from "react-icons/fa";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import LeadImg from "../../assets/Lead_Img.png"
import axios from "axios";
import * as XLSX from 'xlsx';
import { FaLink, FaCheckCircle, FaSync, FaStar, FaHourglassHalf, FaTimesCircle, FaThumbsDown, FaArrowUp, FaThumbsUp, FaComments, FaRedo, FaGraduationCap, FaMoneyBillWave, FaClock } from "react-icons/fa";
// import LinuxCard from "../../components/LinuxCard";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import MyLoader from '../../components/Lead/MyLoader';
import { toast } from "react-toastify";
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
  const [enrolledLeads, setEnrolledLeads] = useState([]);
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
  const [trainingLeads, setTrainingLeads] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState([]);
  const [untouchedLeads, setUntouchedLeads] = useState([]);
  const [touchedLeads, setTouchedLeads] = useState([]);
  const [completedLeads, setCompletedLeads] = useState([]);
  const [selectedAllLeads, setSelectedAllLeads] = useState([]);
  const [selectAllAll, setSelectAllAll] = useState(false);

  const [selectedUnassignedLeads, setSelectedUnassignedLeads] = useState([]);
  const [selectAllUnassigned, setSelectAllUnassigned] = useState(false);

  const [selectedAssignedLeads, setSelectedAssignedLeads] = useState([]);
  const [selectAllAssigned, setSelectAllAssigned] = useState(false);

  const [selectedTouchedLeads, setSelectedTouchedLeads] = useState([]);
  const [selectAllTouched, setSelectAllTouched] = useState(false);

  const [selectedCompletedLeads, setSelectedCompletedLeads] = useState([]);
  const [selectAllCompleted, setSelectAllCompleted] = useState(false);

  const [selectedEnrolledLeads, setSelectedEnrolledLeads] = useState([]);
  const [selectAllEnrolled, setSelectAllEnrolled] = useState(false);

  const [backendInterestedLeads, setBackendInterestedLeads] = useState([]);
  const [backendNotInterestedLeads, setBackendNotInterestedLeads] = useState([]);
  const [backendFollowUp, setBackendFollowUpLeads] = useState([]);
  const [backendInDiscussion, setBackendInDiscussionLeads] = useState([]);

  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sqaureLoading, setSquareLoading] = useState(false);
  const [permissions, setPermissions] = useState({});

  const [outcome, setOutcome] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [salesLeads, setSalesLeads] = useState([]);

  const [showOutcomeModal, setShowOutcomeModal] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);

  const [touchedFilters, setTouchedFilters] = useState({
    search: "",
  });

  const [completedFilters, setCompletedFilters] = useState({
    search: "",
  });

  const [untouchedFilters, setUntouchedFilters] = useState({
    search: "",
  });

  const [interestedFilters, setInterestedFilters] = useState({
    search: "",
  });

  const [notInterestedFilters, setNotInterestedFilters] = useState({
    search: "",
  });

  const [inDiscussionFilters, setInDiscussionFilters] = useState({
    search: ""
  });

  const [followUpFilters, setFollowUpFilters] = useState({
    search: "",
  });

  const [enrolledFilters, setEnrolledFilters] = useState({
    search: "",
  });

  const [assignedFilters, setAssignedFilters] = useState({
    sortByDate: "desc",
  });

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  // const [stats, setStats] = useState({ total: 0, assigned: 0, unassigned: 0 });
  const [counts, setCounts] = useState({
    total: 0,
    unassigned: 0,
    assigned: 0,
    untouched: 0,
    touched: 0,
    completed: 0
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
  const userRole = sessionStorage.getItem("role");
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
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollLead, setEnrollLead] = useState(null);
  const [enrollmentData, setEnrollmentData] = useState({
    enrollmentDate: new Date().toISOString().slice(0.10),
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
  const [candidates, setCandidates] = useState([]);
  const [cvLeads, setCVLeads] = useState([]);

  // useEffect(() => {
  //   const fetchState = async () => {
  //     try {
  //       setSquareLoading(false);
  //       const token = sessionStorage.getItem("token");
  //       const res = await axios.get(`${BASE_URL}/api/leads/stats`, {
  //         headers: { Authorization: `Bearer ${token}` }
  //       })
  //       // setStats(res.data);
  //       setCounts(res.data);
  //       setSquareLoading(true);
  //     } catch (error) {
  //       console.error("Error fetching stats:", error);
  //     }
  //   }
  //   fetchState();
  // }, []);

  useEffect(() => {
    fetchCandidates();
  }, [])

  const fetchCandidates = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/candidates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCandidates(res.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const fetchResumeLeads = async () => {
    const token = sessionStorage.getItem("token");

    const untouchedRes = await axios.get(`${BASE_URL}/api/resume/untouched`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const touchedRes = await axios.get(`${BASE_URL}/api/resume/touched`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const completedRes = await axios.get(`${BASE_URL}/api/resume/completed`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setCompletedLeads(completedRes.data);
    setUntouchedLeads(untouchedRes.data);
    setTouchedLeads(touchedRes.data);
  };

  // const handleStart = async (candidateId) => {
  //   const notes = prompt("Enter your notes:");
  //   const outcome = prompt("Enter call outcome (Interested / Not Interested / Follow-up");

  //   const token = sessionStorage.getItem("token");
  //   await axios.put(`${BASE_URL}/api/resume/mark-touched/${candidateId}`, {
  //     notes,
  //     callOutcome: outcome
  //   }, {
  //     headers: { Authorization: `Bearer ${token}` }
  //   });

  //   toast.success("Lead moved to touched successfully");
  //   setSuccessMessage("Lead moved to touched successfully!");
  //   fetchResumeLeads();
  // }

  const handleStart = (leadId) => {
    console.log("Start Work clicked for:", leadId);
    setSelectedLeadId(leadId);
    setShowOutcomeModal(true);
  };

  const statusColors = {
    "New": "#b83963ff",
    "Assigned": "#305220ff",
    "Interested": "#16a34a",       // green
    "Not Interested": "#dc2626",   // red
    "Follow-up": "#facc15",        // yellow
    "In Discussion": "#3b82f6",    // blue
    "Enrolled": "#8b5cf6",         // purple
    "completed": "#059669",        // teal
    "untouched": "#6b7280",        // gray
    "touched": "#f97316"           // orange
  };

  const handleStartWork = async (candidateId) => {
    const token = sessionStorage.getItem("token");
    await axios.put(`${BASE_URL}/api/resume/start-work/${candidateId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });

    toast.success("Work started successfully");
    setSuccessMessage("Work started successfully!");
    fetchResumeLeads();
  };


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

    const loggedInUser = JSON.parse(sessionStorage.getItem("user")) || JSON.parse(localStorage.getItem("user"));

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
    fetchResumeLeads();
  }, []);

  const fetchBackendLeads = async () => {
    const token = sessionStorage.getItem("token");
    console.log("Token:", token);
    const loggedInUser = JSON.parse(sessionStorage.getItem("user"));
    console.log("LoggedInUser Details:", loggedInUser);
    const roleName = loggedInUser?.role;

    try {

      setSquareLoading(true);

      setTrainingLeads([]);
      setCVLeads([]);
      setUntouchedLeads([]);
      setTouchedLeads([]);
      setCompletedLeads([]);

      const res = await axios.get(`${BASE_URL}/api/leads/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUnassignedLeads(res.data.unassignedLeads || []);
      setAssignedLeads(res.data.assignedLeads || []);
      setEnrolledLeads(res.data.enrolledLeads || []);
      setTrainingLeads(res.data.trainingLeads || []);
      setCVLeads(res.data.cvLeads || []);
      setUntouchedLeads(res.data.untouchedLeads || []);
      setTouchedLeads(res.data.touchedLeads || []);
      setCompletedLeads(res.data.completedLeads || []);
      setBackendInterestedLeads(res.data.interestedLeads || []);
      setBackendNotInterestedLeads(res.data.notInterestedLeads || []);
      setBackendFollowUpLeads(res.data.followUpLeads || []);
      setBackendInDiscussionLeads(res.data.inDiscussionLeads || []);

      setSalesLeads([
        ...(res.data.interestedLeads || []),
        ...(res.data.followUpLeads || []),
        ...(res.data.inDiscussionLeads || []),
        ...(res.data.notInterestedLeads || []),
      ]);

      console.log("Unassigned state (after API):", res.data.unassignedLeads);
      console.log("Assigned state (after API):", res.data.assignedLeads);
      console.log("Enrolled state (after API):", res.data.enrolledLeads);
      console.log("Untouched state (after API):", res.data.untouchedLeads);
      console.log("Touched state (after API):", res.data.touchedLeads);
      console.log("Completed state (after API):", res.data.completedLeads);
      console.log("In Discussion state (after API):", res.data.inDiscussionLeads);
      // console.log("Training state (after API):", res.data.trainingLeads);
      // console.log("cv state (after API):", res.data.cvLeads);

      setCounts({
        total: res.data.total || 0,
        unassigned: res.data.unassigned || 0,
        assigned: res.data.assigned || 0,
        enrolled: res.data.enrolled || 0,
        untouched: res.data.untouched || 0,
        touched: res.data.touched || 0,
        completed: res.data.completed || 0,
        backendInterested: res.data.interested || 0,
        backendNotInterested: res.data.notInterested || 0,
        backendFollowUp: res.data.followUp || 0,
        backendInDiscussion: res.data.inDiscussion || 0,
      });

      console.log(`${roleName} Lead State:`, res.data.training);
      console.log(`${roleName} Cv State:`, res.data.cv);

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

  const handleDelete = async (id) => {

    if (!window.confirm("Are you sure.?")) return;

    const token = sessionStorage.getItem("token");

    try {
      const res = await axios.delete(`${BASE_URL}/api/training/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTrainingLeads((prev) => prev.filter((t) => t._id !== id));
      console.log("Deleted Lead Successfully");
      // fetchTrainingLeads();
    } catch (error) {
      console.error("Failed to delete training lead", error);
      // fetchTrainingLeads();
      if (error.response?.status === 404) {
        setTrainingLeads((prev) => prev.filter((t) => t._id !== id));
      }
    }
  }

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

  const handleDone = async (candidateId) => {
    const token = sessionStorage.getItem("token");
    await axios.put(`${BASE_URL}/api/resume/mark-completed/${candidateId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });

    toast.success("Lead marked as done successfully");
    fetchResumeLeads();
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

  const handleSelectAllTouched = () => {
    if (selectAllTouched) {
      setSelectedTouchedLeads([]);
      setSelectedLead([]);
      setSelectAllTouched(false);
      console.log("Deselected all 'Assigned Leads'");
    } else {
      const ids = touchedLeads.map(l => l._id);
      setSelectedTouchedLeads(ids);
      setSelectedLead(ids);
      setSelectAllTouched(true);
      console.log(`Selected all 'Assigned Leads': ${ids.length}`);
    }
  };

  const handleSelectAllCompleted = () => {
    if (selectAllCompleted) {
      setSelectedCompletedLeads([]);
      setSelectedLead([]);
      setSelectAllCompleted(false);
      console.log("Deselected all 'Assigned Leads'");
    } else {
      const ids = completedLeads.map(l => l._id);
      setSelectedCompletedLeads(ids);
      setSelectedLead(ids);
      setSelectAllCompleted(true);
      console.log(`Selected all 'Assigned Leads': ${ids.length}`);
    }
  };

  const handleSelectAllEnrolled = () => {
    if (selectAllEnrolled) {
      setSelectedEnrolledLeads([]);
      setSelectedLead([]);
      setSelectAllEnrolled(false);
      console.log("Deselected all 'Assigned Leads'");
    } else {
      const ids = enrolledLeads.map(l => l._id);
      setSelectedEnrolledLeads(ids);
      setSelectedLead(ids);
      setSelectAllEnrolled(true);
      console.log(`Selected all 'Assigned Leads': ${ids.length}`);
    }
  };

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

      case "enrolled":
        setSelectedEnrolledLeads(prev => {
          let updated;
          if (prev.includes(id)) {
            updated = prev.filter(l => l !== id);
            setSelectAllEnrolled(false);
          } else {
            updated = [...prev, id];
            if (updated.length === enrolledLeads.length) setSelectAllEnrolled(true);
          }
          return updated;
        });
        break;


      case "touched":
        setSelectedTouchedLeads(prev => {
          let updated;
          if (prev.includes(id)) {
            updated = prev.filter(l => l !== id);
            setSelectAllTouched(false);
          } else {
            updated = [...prev, id];
            if (updated.length === touchedLeads.length) setSelectAllTouched(true);
          }
          return updated;
        });
        break;

      case "completed":
        setSelectedCompletedLeads(prev => {
          let updated;
          if (prev.includes(id)) {
            updated = prev.filter(l => l !== id);
            setSelectAllCompleted(false);
          } else {
            updated = [...prev, id];
            if (updated.length === completedLeads.length)
              setSelectAllCompleted(true);
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
      toast.success(res.data.message);
      setSelectedLead([]);
      setSelectAll(false);
      fetchBackendLeads();
      handleRefresh();
    } catch (error) {
      // console.error("Bulk assign error:", error);
      toast.error("Error assigning leads");
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

      toast.success(res.data.message);
      setSelectedAllLeads([]);
      setSelectAllAll(false);
      fetchBackendLeads();
      handleRefresh();
    } catch (error) {
      // console.error("Bulk delete error:", error);
      toast.error("Error deleting leads");
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
      setErrorMessage("Error Fetching Permissions!");
    }
  };

  const updateStage = async (id, stage) => {
    try {
      const token = sessionStorage.getItem("token");
      const data = {};

      if (stage === "training") data.movedToTraining = true;
      if (stage === "cv") data.movedToCV = true;

      const res = await axios.put(`${BASE_URL}/api/candidates/update-stage/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(res.data.message);
      setSuccessMessage(res.data.message);

      await fetchBackendLeads();

    } catch (error) {
      // console.error(error);
      toast.error(`Failed to move candidate to ${stage === "training" ? "training" : "CV"}`);
    }
  };


  const handleMoveToTraining = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.put(`${BASE_URL}/api/candidates/update-stage/${id}`, {
        movedToTraining: true
      }, { headers: { Authorization: `Bearer ${token}` } });

      toast.success(res.data.message);
      fetchBackendLeads();
    } catch (error) {
      toast.error("Failed to move candidate to training");
    }
  };

  const handleMoveToCV = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.put(`${BASE_URL}/api/candidates/update-stage/${id}`, {
        movedToCV: true
      }, { headers: { Authorization: `Bearer ${token}` } });

      toast.success(res.data.message);
      fetchBackendLeads();
    } catch (error) {
      toast.error("Failed to move candidate to CV");
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

  const handleSaveOutcome = async () => {
    if (!outcome) {
      alert("Please select a call outcome");
      return;
    }

    try {
      const res = await axios.put(
        `${BASE_URL}/api/resume/mark-touched/${selectedLeadId}`,
        {
          notes,
          callOutcome: outcome,
          duration,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        // alert("Lead moved to touched successfully!");
        toast.success("Lead Moved to touched successfully!");
        setShowOutcomeModal(false);
        setOutcome("");
        setDuration("");
        setNotes("");
        fetchBackendLeads();
      }
    } catch (err) {
      toast.error("Error marking lead as touched")
      // console.error("Error marking lead as touched:", err);
      alert("Failed to save outcome");
    }
  };

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
      toast.success("Lead Added Successfully!");
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
      toast.error("Failed to add lead. Please try again");
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
      toast.success("Lead updated successfully!");
      setLeads(leads.map(l => (l._id === formData._id ? payload : l)));
    } catch (error) {
      console.error("Error updating lead:", error);
      toast.error("Failed to update lead");
    }
  }

  const handleViewClick = (lead) => {
    console.log("Selected Lead in modal:", lead);
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
      await fetchCandidates();
      await fetchResumeLeads();

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
      toast.error("No file selected");
      return;
    }

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      toast.error("Please upload a valid Excel file");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        toast.error("Excel file has no sheets or is invalid");
        return;
      }

      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      try {
        await axios.post(`${BASE_URL}/api/leads/import`, { leads: worksheet });
        toast.success("Excel Imported Successfully");

        const res = await getLeads();
        setLeads(res.data);
      } catch (error) {
        console.error("Excel Import Error:", error);
        toast.error("Error importing Excel");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleEnrollCandidate = (lead) => {
    setEnrollLead(lead);
    setEnrollmentData(prev => ({
      ...prev,
      candidate_Name: lead.candidate_name,
      email: lead.candidate_email,
      number: lead.candidate_phone_no
    }));
    setShowEnrollModal(true);
  }

  const handleSubmitEnrollment = async (e) => {

    e.preventDefault();

    try {

      const token = sessionStorage.getItem("token");

      const res = await axios.post(`${BASE_URL}/api/candidates/enroll`, {
        leadId: enrollLead,
        ...enrollmentData,
        collectedPayments: enrollmentData.collectedPayments
      }, { headers: { Authorization: `Bearer ${token}` } });

      toast.success(res.data.message);
      setShowEnrollModal(false);
      await fetchBackendLeads();
    } catch (error) {
      // console.error("Enrollment error:", error);
      toast.error("Error enrolling candidate");
    }
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

  const handleMarkDone = async (candidateId) => {
    const token = sessionStorage.getItem("token");
    await axios.put(`${BASE_URL}/api/resume/mark-completed/${candidateId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    toast.success("Lead marked as completed!");
    fetchResumeLeads();
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

      toast.success("Lead assigned successfully!");

      setFinalLead(null);
      setSelectedMember("");
      // fetchUnassignedLeads();
      fetchBackendLeads();

      document.getElementById("closeAssignModalBtn").click();

    } catch (error) {
      console.error("Error assigning lead:", error.message);
      toast.error("Failed to assign lead. Check console for more details")
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

  const filteredTouchedLeads = touchedLeads.filter((lead) => {
    const searchTerm = touchedFilters.search.toLowerCase().trim();
    return (
      lead.name?.toLowerCase().includes(searchTerm) ||
      lead.email?.toLowerCase().includes(searchTerm) ||
      lead.phone?.toLowerCase().includes(searchTerm)
    );
  });

  const filteredCompletedLeads = completedLeads.filter((lead) => {
    const searchTerm = completedFilters.search.toLowerCase();
    return (
      lead.name?.toLowerCase().includes(searchTerm) ||
      lead.email?.toLowerCase().includes(searchTerm) ||
      lead.phone?.toLowerCase().includes(searchTerm)
    );
  });

  const filteredUntouchedLeads = untouchedLeads.filter((lead) => {
    const searchTerm = untouchedFilters.search.toLowerCase();
    return (
      lead.name?.toLowerCase().includes(searchTerm) ||
      lead.email?.toLowerCase().includes(searchTerm) ||
      lead.phone?.toLowerCase().includes(searchTerm)
    );
  });

  const getProgress = (candidate) => {
    if (!candidate.startDate && !candidate.endDate) return 0;
    if (candidate.startDate && !candidate.endDate) return 50;
    if (candidate.endDate) return 100;
  };

  const getColor = (percentage) => {
    if (percentage === 0) return "transparent";
    if (percentage < 100) return "#ffc107";
    return "#28a745";
  };

  const getTextColor = (percentage) => {
    if (percentage === 0) return "black";
    if (percentage < 100) return "black";
    return "white";
  };

  const getWidth = (percentage) => {
    return percentage > 0 ? `${percentage}%` : "0%";
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "touched":
        return <span className="badge badge-touched">Touched<FaLink className="ms-2" /></span >;
      case "in-progress":
        return <span className="badge badge-inprogress">In Progress<i className="bi bi-clock ms-1"></i></span>;
      case "completed":
        return <span className="badge badge-completed">Completed<i className="bi bi-check-circle-fill ms-1"></i></span>;
      default:
        return <span className="badge badge-secondary">Unknown</span>;
    }
  };

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);

  const indexOfLastUnassignedLeads = currentUnassignedPage * leadsPerPage;
  const indexOfFirstUnassignedLeads = indexOfLastUnassignedLeads - leadsPerPage;
  const currentUnassignedLeads = unassignedLeads.slice(indexOfFirstUnassignedLeads, indexOfLastUnassignedLeads);
  console.log("Unassigned Leads:", unassignedLeads);
  console.log("Current Unassigned Leads:", currentUnassignedLeads);

  const sortedAssignedLeads = useMemo(() => {
    return [...assignedLeads].sort((a, b) => {
      if (assignedFilters.sortByDate === "desc") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });
  }, [assignedLeads, assignedFilters.sortByDate]);

  const indexOfLastAssignedLeads = currentAssignedPage * leadsPerPage;
  const indexOfFirstAssignedLeads = indexOfLastAssignedLeads - leadsPerPage;
  const currentAssignedLeads = sortedAssignedLeads.slice(indexOfFirstAssignedLeads, indexOfLastAssignedLeads);

  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);
  const totalUnassignedPages = Math.ceil(unassignedLeads.length / leadsPerPage);
  const totalAssignedPages = Math.ceil(assignedLeads.length / leadsPerPage);

  const interestedLeads = salesLeads.filter(l => l.status === "Interested");
  const notInterestedLeads = salesLeads.filter(l => l.status === "Not Interested");
  const followUpLeads = salesLeads.filter(l => l.status === "Follow-up");
  const inDiscussionLeads = salesLeads.filter(l => l.status === "In Discussion");

  useEffect(() => {
    const interestedLeads = salesLeads.filter(l => l.status === "Interested");
    console.log("Interested Leads:", interestedLeads);

    const notInterestedLeads = salesLeads.filter(l => l.status === "Not Interested");
    console.log("Not Interested Leads:", notInterestedLeads);

    const followUpLeads = salesLeads.filter(l => l.status === "Follow-up");
    console.log("Follow Up Leads:", followUpLeads);
  }, [salesLeads]);


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
        setSalesLeads(Array.isArray(res.data) ? res.data : [res.data])
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

  const filteredInterestedLeads = interestedLeads.filter((lead) => {
    const searchTerm = interestedFilters.search.toLowerCase().trim();
    if (!searchTerm) return true;

    return (
      lead.candidate_name?.toLowerCase().includes(searchTerm) ||
      lead.candidate_email?.toLowerCase().includes(searchTerm) ||
      lead.candidate_phone_no?.toString().includes(searchTerm) ||
      lead.technology?.toString().toLowerCase().includes(searchTerm)
    );
  });

  const filteredNotInterestedLeads = notInterestedLeads.filter((lead) => {
    const searchTerm = notInterestedFilters.search.toLowerCase().trim();
    if (!searchTerm) return true;

    return (
      lead.candidate_name?.toLowerCase().includes(searchTerm) ||
      lead.candidate_email?.toLowerCase().includes(searchTerm) ||
      lead.candidate_phone_no?.toString().includes(searchTerm) ||
      lead.technology?.toString().toLowerCase().includes(searchTerm)
    );
  });

  const filteredInDiscussionLeads = inDiscussionLeads.filter((lead) => {
    const searchTerm = inDiscussionFilters.search.toLowerCase().trim();
    if (!searchTerm) return true;

    return (
      lead.candidate_name?.toLowerCase().includes(searchTerm) ||
      lead.candidate_email?.toLowerCase().includes(searchTerm) ||
      lead.candidate_phone_no?.toString().includes(searchTerm) ||
      lead.technology?.toString().toLowerCase().includes(searchTerm)
    );
  });

  const filteredFollowUpLeads = followUpLeads.filter((lead) => {
    const searchTerm = followUpFilters.search.toLowerCase().trim();
    if (!searchTerm) return true;

    return (
      lead.candidate_name?.toLowerCase().includes(searchTerm) ||
      lead.candidate_email?.toLowerCase().includes(searchTerm) ||
      lead.candidate_phone_no?.toString().includes(searchTerm) ||
      lead.technology?.toString().toLowerCase().includes(searchTerm)
    );
  });

  const filteredEnrolledLeads = enrolledLeads.filter((lead) => {
    const searchTerm = enrolledFilters.search.toLowerCase().trim();
    if (!searchTerm) return true;

    return (
      lead.name?.toLowerCase().includes(searchTerm) ||
      lead.email?.toLowerCase().includes(searchTerm) ||
      lead.phone?.toString().includes(searchTerm) ||
      lead.technology?.toString().toLowerCase().includes(searchTerm)
    );
  });

  console.log("Unassigned state(render):", unassignedLeads);
  console.log("Assigned state(render):", assignedLeads);

  return (

    <div className="container-fluid mt-5 px-5">
      <div className="row g-5">
        <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
          <h4 className="text-left adminDashboardTitle mb-0">
            Hello, {userName || "User"}{" "}
            <img
              src={LeadImg}
              alt="Users"
              loading="lazy"
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

        {["Lead_Gen_Manager", "Lead_Gen_Team_Lead", "Sr_Lead_Generator", "Lead_Gen", "Sales_Manager"].includes(userRole) && (
          <div className="col-12 col-md-4 m-0 mb-2">
            <div className="rounded-4 bg-white shadow-sm py-4 h-100 d-flex flex-column justify-content-center">
              {loading ? (
                <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100px" }}>
                  <span className="squareLoader" style={{ width: "2rem", height: "2rem" }}></span>
                </div>
              ) : (
                <div className="d-flex flex-column flex-md-row align-items-center text-center text-md-start gap-3 px-3">
                  <img
                    src={LeadImg}
                    alt="Untouched Leads"
                    loading="lazy"
                    className="mb-2 rounded-circle img-fluid d-none d-md-block"
                    style={{ width: "70px", height: "70px" }}
                  />
                  <img
                    src={LeadImg}
                    alt="Untouched Leads"
                    loading="lazy"
                    className="mb-2 rounded-circle img-fluid d-block d-md-none"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div>
                    <h6 className="mb-1 text-muted">Total Leads</h6>
                    <h4 className="fw-bold">{counts.total}</h4>
                    <small className="text-success">16% this month</small>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {["Lead_Gen_Manager", "Lead_Gen_Team_Lead", "Sr_Lead_Generator", "Lead_Gen", "Sales_Manager"].includes(userRole) && (
          <div className="col-12 col-md-4 m-0 mb-2">
            <div className="rounded-4 bg-white shadow-sm py-4 h-100 d-flex flex-column justify-content-center">
              {loading ? (
                <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100px" }}>
                  <span className="squareLoader" style={{ width: "2rem", height: "2rem" }}></span>
                </div>
              ) : (
                <div className="d-flex flex-column flex-md-row align-items-center text-center text-md-start gap-3 px-3">
                  <img
                    src={LeadImg}
                    alt="Untouched Leads"
                    loading="lazy"
                    className="mb-2 rounded-circle img-fluid d-none d-md-block"
                    style={{ width: "70px", height: "70px" }}
                  />
                  <img
                    src={LeadImg}
                    alt="Untouched Leads"
                    loading="lazy"
                    className="mb-2 rounded-circle img-fluid d-block d-md-none"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div>
                    <h6 className="mb-1 text-muted">Unassigned Leads</h6>
                    <h4 className="fw-bold">{counts.unassigned}</h4>
                    <small className="text-success">16% this month</small>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {["Lead_Gen_Manager", "Lead_Gen_Team_Lead", "Sr_Lead_Generator", "Lead_Gen", "Sales_Manager", "Sales"].includes(userRole) && (
          <div className="col-12 col-md-4 m-0 mb-2">
            <div className="rounded-4 bg-white shadow-sm py-4 h-100 d-flex flex-column justify-content-center">
              {loading ? (
                <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100px" }}>
                  <span className="squareLoader" style={{ width: "2rem", height: "2rem" }}></span>
                </div>
              ) : (
                <div className="d-flex flex-column flex-md-row align-items-center text-center text-md-start gap-3 px-3">
                  <img
                    src={LeadImg}
                    alt="Untouched Leads"
                    loading="lazy"
                    className="mb-2 rounded-circle img-fluid d-none d-md-block"
                    style={{ width: "70px", height: "70px" }}
                  />
                  <img
                    src={LeadImg}
                    alt="Untouched Leads"
                    loading="lazy"
                    className="mb-2 rounded-circle img-fluid d-block d-md-none"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div>
                    <h6 className="mb-1 text-muted">Assigned Leads</h6>
                    <h4 className="fw-bold">{counts.assigned}</h4>
                    <small className="text-success">16% this month</small>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {userRole === "Sales" && (
          <div className="col-12 col-md-4 col-lg-4 m-0 mb-2">
            <div className="rounded-4 bg-white shadow-sm py-4 h-100 d-flex flex-column justify-content-center">
              {loading ? (
                <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100px" }}>
                  <span className="squareLoader" style={{ width: "2rem", height: "2rem" }}></span>
                </div>
              ) : (
                <div className="d-flex flex-column flex-md-row align-items-center text-center text-md-start gap-3 px-3">
                  <img
                    src={LeadImg}
                    alt="Untouched Leads"
                    loading="lazy"
                    className="mb-2 rounded-circle img-fluid d-none d-md-block"
                    style={{ width: "70px", height: "70px" }}
                  />
                  <img
                    src={LeadImg}
                    alt="Untouched Leads"
                    loading="lazy"
                    className="mb-2 rounded-circle img-fluid d-block d-md-none"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div>
                    <h6 className="mb-1 text-muted">Enrolled Leads</h6>
                    <h4 className="fw-bold">{counts.enrolled}</h4>
                    <small className="text-success">16% this month</small>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {userRole === "Sales" && (
          <div className="col-12 col-md-4 col-lg-4 m-0 mb-2">
            <div className="rounded-4 bg-white shadow-sm py-4 h-100 d-flex flex-column justify-content-center">
              {loading ? (
                <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100px" }}>
                  <span className="squareLoader" style={{ width: "2rem", height: "2rem" }}></span>
                </div>
              ) : (
                <div className="d-flex flex-column flex-md-row align-items-center text-center text-md-start gap-3 px-3">
                  <img
                    src={LeadImg}
                    alt="Untouched Leads"
                    loading="lazy"
                    className="mb-2 rounded-circle img-fluid d-none d-md-block"
                    style={{ width: "70px", height: "70px" }}
                  />
                  <img
                    src={LeadImg}
                    alt="Untouched Leads"
                    loading="lazy"
                    className="mb-2 rounded-circle img-fluid d-block d-md-none"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div>
                    <h6 className="mb-1 text-muted">Interested Leads</h6>
                    <h4 className="fw-bold">{counts.backendInterested}</h4>
                    <small className="text-success">16% this month</small>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {userRole === "Sales" && (
          <div className="col-12 col-md-4 col-lg-4 m-0 mb-2">
            <div className="rounded-4 bg-white shadow-sm py-4 h-100 d-flex flex-column justify-content-center">
              {loading ? (
                <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100px" }}>
                  <span className="squareLoader" style={{ width: "2rem", height: "2rem" }}></span>
                </div>
              ) : (
                <div className="d-flex flex-column flex-md-row align-items-center text-center text-md-start gap-3 px-3">
                  <img
                    src={LeadImg}
                    alt="Untouched Leads"
                    loading="lazy"
                    className="mb-2 rounded-circle img-fluid d-none d-md-block"
                    style={{ width: "70px", height: "70px" }}
                  />
                  <img
                    src={LeadImg}
                    alt="Untouched Leads"
                    loading="lazy"
                    className="mb-2 rounded-circle img-fluid d-block d-md-none"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div>
                    <h6 className="mb-1 text-muted">Not Interested Leads</h6>
                    <h4 className="fw-bold">{counts.backendNotInterested}</h4>
                    <small className="text-success">16% this month</small>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {userRole === "Sales" && (
          <div className="col-12 col-md-4 col-lg-4 m-0 mb-2">
            <div className="rounded-4 bg-white shadow-sm py-4 h-100 d-flex flex-column justify-content-center">
              {loading ? (
                <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100px" }}>
                  <span className="squareLoader" style={{ width: "2rem", height: "2rem" }}></span>
                </div>
              ) : (
                <div className="d-flex flex-column flex-md-row align-items-center text-center text-md-start gap-3 px-3">
                  <img
                    src={LeadImg}
                    alt="Untouched Leads"
                    loading="lazy"
                    className="mb-2 rounded-circle img-fluid d-none d-md-block"
                    style={{ width: "70px", height: "70px" }}
                  />
                  <img
                    src={LeadImg}
                    alt="Untouched Leads"
                    loading="lazy"
                    className="mb-2 rounded-circle img-fluid d-block d-md-none"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div>
                    <h6 className="mb-1 text-muted">In Discussion Leads</h6>
                    <h4 className="fw-bold">{counts.backendInDiscussion}</h4>
                    <small className="text-success">16% this month</small>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {userRole === "Sales" && (
          <div className="col-12 col-md-4 col-lg-4 m-0 mb-2">
            <div className="rounded-4 bg-white shadow-sm py-4 h-100  d-flex flex-column justify-content-center">
              {loading ? (
                <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100px" }}>
                  <span className="squareLoader" style={{ width: "2rem", height: "2rem" }}></span>
                </div>
              ) : (
                <div className="d-flex flex-column flex-md-row align-items-center text-center text-md-start gap-3 px-3">
                  <img
                    src={LeadImg}
                    alt="Untouched Leads"
                    loading="lazy"
                    className="mb-2 rounded-circle img-fluid d-none d-md-block"
                    style={{ width: "70px", height: "70px" }}
                  />
                  <img
                    src={LeadImg}
                    alt="Untouched Leads"
                    loading="lazy"
                    className="mb-2 rounded-circle img-fluid d-block d-md-none"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div>
                    <h6 className="mb-1 text-muted">Follow Up Leads</h6>
                    <h4 className="fw-bold">{counts.backendFollowUp}</h4>
                    <small className="text-success">16% this month</small>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {userRole === "Resume" && (
          <div className="col-12 col-md-4 col-lg-4 m-0 mb-2">
            <div className="rounded-4 bg-white shadow-sm py-4 h-100 d-flex flex-column justify-content-center" style={{ minHeight: "160px" }}>
              {loading ? (
                <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100px" }}>
                  <span className="squareLoader" style={{ width: "2rem", height: "2rem" }}></span>
                </div>
              ) : (
                <div className="d-flex flex-column flex-md-row align-items-center text-center text-md-start gap-3 px-3">
                  <img
                    src={LeadImg}
                    alt="Untouched Leads"
                    loading="lazy"
                    className="mb-2 rounded-circle img-fluid d-none d-md-block"
                    style={{ width: "70px", height: "70px" }}
                  />
                  <img
                    src={LeadImg}
                    alt="Untouched Leads"
                    loading="lazy"
                    className="mb-2 rounded-circle img-fluid d-block d-md-none"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div>
                    <h6 className="mb-1 text-muted">Untouched Leads</h6>
                    <h4 className="fw-bold">{counts.untouched}</h4>
                    <small className="text-success">16% this month</small>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {userRole === "Resume" && (
          <div className="col-12 col-md-4 col-lg-4 m-0 mb-2">
            <div className="rounded-4 bg-white shadow-sm py-4 h-100 d-flex flex-column justify-content-center" style={{ minHeight: "160px" }}>
              {loading ? (
                <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100px" }}>
                  <span className="squareLoader" style={{ width: "2rem", height: "2rem" }}></span>
                </div>
              ) : (
                <div className="d-flex flex-column flex-md-row align-items-center text-center text-md-start gap-3 px-3">
                  <img
                    src={LeadImg}
                    alt="Untouched Leads"
                    loading="lazy"
                    className="mb-2 rounded-circle img-fluid d-none d-md-block"
                    style={{ width: "70px", height: "70px" }}
                  />
                  <img
                    src={LeadImg}
                    alt="Untouched Leads"
                    loading="lazy"
                    className="mb-2 rounded-circle img-fluid d-block d-md-none"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div>
                    <h6 className="mb-1 text-muted">Touched Leads</h6>
                    <h4 className="fw-bold">{counts.touched}</h4>
                    <small className="text-success">16% this month</small>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {userRole === "Resume" && (
          <div className="col-12 col-md-4 col-lg-4 m-0 mb-2">
            <div className="rounded-4 bg-white shadow-sm py-4 h-100 d-flex flex-column justify-content-center">
              {loading ? (
                <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100px" }}>
                  <span className="squareLoader" style={{ width: "2rem", height: "2rem" }}></span>
                </div>
              ) : (
                <div className="d-flex flex-column flex-md-row align-items-center text-center text-md-start gap-3 px-3">
                  <img
                    src={LeadImg}
                    alt="Untouched Leads"
                    loading="lazy"
                    className="mb-2 rounded-circle img-fluid d-none d-md-block"
                    style={{ width: "70px", height: "70px" }}
                  />
                  <img
                    src={LeadImg}
                    alt="Untouched Leads"
                    loading="lazy"
                    className="mb-2 rounded-circle img-fluid d-block d-md-none"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div>
                    <h6 className="mb-1 text-muted">Completed Leads</h6>
                    <h4 className="fw-bold">{counts.completed}</h4>
                    <small className="text-success">16% this month</small>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* All Lead Main Table */}
        {user.role !== "Resume" && user.role !== "Sales" && (
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
                    <option value="Enrolled">Enrolled</option>
                    <option value="Interested">Interested</option>
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
                        <th className="text-left tableHeader">#</th>
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
                      {currentLeads.map((lead, index) => (
                        <tr key={lead._id}>
                          <td>
                            <input type="checkbox"
                              checked={selectedAllLeads.includes(lead._id)}
                              onChange={() => toggleLeadSelection(lead._id, "all")}
                            />
                          </td>
                          <td>
                            <p className="mb-0 text-left tableData">{index + 1}</p>
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
                          {/* <td className="text-center">
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
                          </td> */}
                          <td className="text-center">
                            <span
                              className="badge px-2 d-flex align-items-center justify-content-center gap-2"
                              style={{
                                backgroundColor: statusColors[lead.status] || "#d1d5db",
                                color: "white",
                                borderRadius: "12px",
                                fontSize: "12px",
                                fontWeight: "normal",
                                textTransform: "capitalize",
                              }}
                            >
                              {/* Icons same as before */}
                              {lead.status === "New" && <FaLink />}
                              {lead.status === "Connected" && <FaCheckCircle />}
                              {lead.status === "In Progress" && <FaHourglassHalf />}
                              {lead.status === "Shortlisted" && <FaStar />}
                              {lead.status === "Rejected" && <FaTimesCircle />}
                              {lead.status === "Assigned" && <FaCheckCircle />}
                              {lead.status === "Converted" && <FaUserCheck />}
                              {lead.status === "Interested" && <FaThumbsUp />}
                              {lead.status === "Enrolled" && <FaGraduationCap />}
                              {lead.status === "Not Interested" && <FaThumbsDown />}
                              {lead.status === "Follow-up" && <FaRedo />}
                              {lead.status === "In Discussion" && <FaComments />}

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

              <div className="d-flex justify-content-center justify-content-md-end flex-wrap align-items-center gap-1 mt-2 mb-3 p-0">
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
        )}


        {/* Unassigned Leads */}
        {user.role !== "Resume" && user.role !== "Sales" && (
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
          </div>
        )}

        {/* Assigned Leads */}
        {user.role !== "Resume" && (
          <div className="col-12 col-md-8 col-lg-12 mt-2" >
            <div className="rounded-4 bg-white shadow-sm p-4 table-responsive h-100">
              <div className="d-flex justify-content-between align-items-center px-3 mt-2 mb-3">
                <div>
                  <h5 className="text-left leadManagementTitle mt-4">All Assigned Leads({counts.assigned})</h5>
                  <h6 className="leadManagementSubtitle mb-3">Active Leads</h6>
                </div>
                {user.role === "Sales" && (
                  <div className="d-flex justify-content-center align-items-center gap-3">
                    <select
                      className="form-select form-select-sm"
                      value={assignedFilters.sortByDate}
                      onChange={(e) => setAssignedFilters({ ...assignedFilters, sortByDate: e.target.value })}
                    >
                      <option value="">----Sort By Order----</option>
                      <option value="desc">Newest to Oldest</option>
                      <option value="asc">Oldest to Newest</option>
                    </select>

                    <button
                      className="btn btn-outline-danger btn-sm me-2 refresh" onClick={handleRefresh} >
                      <FaSync className="me-1" /> Refresh
                    </button>
                  </div>
                )}
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
                        <th className="text-left tableHeader">Assigned To</th>
                        <th className="text-left tableHeader">Assigned By</th>
                        <th className="text-left tableHeader">Actions</th>
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
                            <p className="mb-0 text-left tableData">{a.type}</p>
                          </td>
                          <td>
                            <p className="mb-0 text-left tableData">{a.candidate_phone_no}</p>
                          </td>
                          <td>
                            <p className="mb-0 text-left tableData">{a.linked_in_url}</p>
                          </td>
                          <td>
                            <p className="mb-0 text-left tableData">{a.university}</p>
                          </td>
                          <td>
                            <p className="mb-0 text-left tableData">{a.technology}</p>
                          </td>
                          <td>
                            <p className="mb-0 text-left tableData">{a.visa}</p>
                          </td>
                          <td>
                            <p className="mb-0 text-left tableData">{a.preferred_time_to_talk}</p>
                          </td>
                          <td>
                            <p className="mb-0 text-left tableData">{a.source}</p>
                          </td>
                          <td className="text-center">
                            <span
                              className="badge px-2 d-flex align-items-center justify-content-center gap-2"
                              style={{
                                backgroundColor: statusColors[a.status] || "#d1d5db",
                                color: "white",
                                borderRadius: "12px",
                                fontSize: "12px",
                                fontWeight: "normal",
                                textTransform: "capitalize",
                              }}
                            >
                              {/* Icons same as before */}
                              {a.status === "New" && <FaLink />}
                              {a.status === "Connected" && <FaCheckCircle />}
                              {a.status === "In Progress" && <FaHourglassHalf />}
                              {a.status === "Shortlisted" && <FaStar />}
                              {a.status === "Rejected" && <FaTimesCircle />}
                              {a.status === "Assigned" && <FaCheckCircle />}
                              {a.status === "Converted" && <FaUserCheck />}
                              {a.status === "Interested" && <FaThumbsUp />}
                              {a.status === "Enrolled" && <FaGraduationCap />}
                              {a.status === "Not Interested" && <FaThumbsDown />}
                              {a.status === "Follow-up" && <FaRedo />}
                              {a.status === "In Discussion" && <FaComments />}

                              {a.status}
                            </span>
                          </td>

                          <td>
                            <p className="mb-0 text-left tableData">{formatDateTimeIST(a.createdAt)}</p>
                          </td>
                          <td>
                            <p className="mb-0 text-left tableData">{formatDateTimeIST(a.updatedAt)}</p>
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
                            {permissions?.lead?.updateScope !== "none" && (
                              <button
                                className="btn btn-outline-success btn-sm btn-rounded me-2"
                                data-bs-toggle="modal"
                                data-bs-target="#editLead"
                                onClick={() => handleEditClick(a)}>
                                Edit
                              </button>
                            )}
                            {permissions?.lead?.deleteScope !== "none" && (
                              <button type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={async () => {
                                  if (window.confirm("Are you sure?")) {
                                    await deleteLead(a._id);
                                    setLeads(leads.filter(l => l._id !== a._id));
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

                  <div className="d-flex justify-content-center justify-content-md-end flex-wrap align-items-center gap-1 mt-2 mb-3 p-0">
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
        )}

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
                            {/* <option value="Connected">Connected</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Converted">Converted</option> */}
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
                              toast.success("Lead updated successfully!");
                              window.location.reload();
                            } catch (err) {
                              toast.error("Error updating lead:", err);
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

      {/* Enrollment Modal */}
      {showEnrollModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Enroll Candidate</h5>
                <button type="button" className="btn-close" onClick={() => setShowEnrollModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-2">
                  <div className="col-md-6">
                    <label>Enrollment Date</label>
                    <input type="date" className="form-control form-control-sm"
                      value={enrollmentData.enrollmentDate}
                      onChange={e => setEnrollmentData({ ...enrollmentData, enrollmentDate: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label>Candidate Name</label>
                    <input type="text" className="form-control form-control-sm" value={enrollLead?.candidate_name} disabled />
                  </div>
                  <div className="col-md-6">
                    <label>Email</label>
                    <input type="email" className="form-control form-control-sm" value={enrollLead?.candidate_email} disabled />
                  </div>
                  <div className="col-md-6">
                    <label>Number</label>
                    <input type="text" className="form-control form-control-sm" value={enrollLead?.candidate_phone_no} disabled />
                  </div>
                  <div className="col-md-6">
                    <label>Upfront</label>
                    <input type="number" className="form-control form-control-sm" value={enrollmentData.upfront} onChange={e => setEnrollmentData({ ...enrollmentData, upfront: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label>Contracted</label>
                    <input type="number" className="form-control form-control-sm" value={enrollmentData.contracted} onChange={e => setEnrollmentData({ ...enrollmentData, contracted: e.target.value })} />
                  </div>
                  {enrollmentData.collectedPayments.map((payment, index) => (
                    <React.Fragment key={index}>
                      <div className="col-md-6">
                        <label>Collected Amount {index + 1}</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={payment.amount}
                          onChange={(e) => {
                            const newPayments = [...enrollmentData.collectedPayments];
                            newPayments[index].amount = e.target.value;
                            setEnrollmentData({ ...enrollmentData, collectedPayments: newPayments });
                          }}
                        />
                      </div>
                      <div className="col-md-6">
                        <label>Collected Date {index + 1}</label>
                        <input
                          type="date"
                          className="form-control form-control-sm"
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
                    <label>Percentage</label>
                    <input type="number" className="form-control form-control-sm" value={enrollmentData.percentage} onChange={e => setEnrollmentData({ ...enrollmentData, percentage: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label>Job Guarantee</label>
                    {/* <input type="text" className="form-control form-control-sm" value={enrollmentData.jobGuarantee} onChange={e => setEnrollmentData({ ...enrollmentData, jobGuarantee: e.target.value })} /> */}
                    <select name="" id="" className="form-select form-select-sm" value={enrollmentData.jobGuarantee}
                      onChange={e => setEnrollmentData({ ...enrollmentData, jobGuarantee: e.target.value })}>
                      <option value="">-----Select---</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label>Technology</label>
                    <input type="text" className="form-control form-control-sm" value={enrollLead?.technology} disabled />
                  </div>

                  <div className="col-md-6">
                    <label>Plan</label>
                    <select className="form-select form-select-sm" value={enrollmentData.plan}
                      onChange={e => setEnrollmentData({ ...enrollmentData, plan: e.target.value })}>
                      <option value="">Select Plan</option>
                      <option value="Basic">Basic</option>
                      <option value="Standard">Standard</option>
                      <option value="Premium">Premium</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label>Payment Gateway</label>
                    <select className="form-select form-select-sm" value={enrollmentData.paymentGateway}
                      onChange={e => setEnrollmentData({ ...enrollmentData, paymentGateway: e.target.value })}>
                      <option value="">Select Gateway</option>
                      <option value="Razorpay">Razorpay</option>
                      <option value="Cashfree">Cashfree</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label form-label-sm">Payment Status</label>
                    <select className="form-select form-select-sm" value={enrollmentData.paymentStatus}
                      onChange={e => setEnrollmentData({ ...enrollmentData, paymentStatus: e.target.value })}>
                      <option value="">Select Payment Status</option>
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>

                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowEnrollModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSubmitEnrollment}>Enroll</button>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {console.log("Selected Lead in modal:", selectedLead)}
      {/* View Lead Modal */}
      <div className="modal fade" id="viewLead" tabIndex="-1" >
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-body p-0">
              <div className="card card-plain">
                <h3 className="modal-title editUserTitle mt-2 text-center">Lead Details</h3>
                <button type="button" className="btn-close ms-4" data-bs-dismiss="modal" aria-label="Close"></button>
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
                          toast.success("Call outcome saved successfully!");
                          setSelectedLead(res.data.lead);
                          setOutcome(""); setDate(""); setTime(""); setDuration(""); setNotes("");
                          fetchBackendLeads();
                        } catch (err) {
                          // console.error("Error saving call outcome:", err.response?.data || err);
                          toast.error(err.response?.data?.message || "Failed to save call outcome!");
                        } finally {
                          setLoading(false);
                        }
                      }}
                    >

                      <div className="mb-0 table-responsive">
                        <table className="table table-bordered table-sm">
                          <tbody>
                            <tr>
                              <th className="tableHeader">Name</th>
                              <td className="tableData" colSpan="5">{selectedLead.candidate_name || selectedLead.leadId?.candidate_name || selectedLead.name || "N/A"}</td>
                            </tr>
                            <tr>
                              <th className="tableHeader">Email</th>
                              <td className="tableData" colSpan="5">{selectedLead.candidate_email || selectedLead.leadId?.candidate_email || selectedLead.email || "N/A"}</td>
                            </tr>
                            <tr>
                              <th className="tableHeader">Phone</th>
                              <td className="tableData" colSpan="5">{selectedLead.candidate_phone_no || selectedLead.leadId?.candidate_phone_no || selectedLead.phone || "N/A"}</td>
                            </tr>
                            <tr>
                              <th className="tableHeader">Technology</th>
                              <td className="tableData" colSpan="5">
                                {Array.isArray(selectedLead.technology)
                                  ? selectedLead.technology.join(", ")
                                  : selectedLead.technology}
                              </td>
                            </tr>
                            {modalSource !== "enrolled" && (
                              <tr>
                                <th className="tableHeader">LinkedIn</th>
                                <td className="tableData" colSpan="5">{selectedLead.linked_in_url || selectedLead?.leadId?.linked_in_url || selectedLead.linked_in_url || "N/A"}</td>
                              </tr>
                            )}
                            {modalSource !== "enrolled" && (
                              <tr>
                                <th className="tableHeader">Visa</th>
                                <td className="tableData" colSpan="5">{selectedLead.visa || selectedLead?.leadId?.visa}</td>
                              </tr>
                            )}
                            {modalSource !== "enrolled" && (
                              <tr>
                                <th className="tableHeader">Lead Type</th>
                                <td className="tableData" colSpan="5">{selectedLead.type || selectedLead?.leadId?.type}</td>
                              </tr>
                            )}
                            {modalSource !== "enrolled" && (
                              <tr>
                                <th className="tableHeader">University</th>
                                <td className="tableData" colSpan="5">{selectedLead.university || selectedLead?.leadId?.university}</td>
                              </tr>
                            )}
                            {modalSource !== "enrolled" && (
                              <tr>
                                <th className="tableHeader">Preferred Time to Talk</th>
                                <td className="tableData" colSpan="5">{selectedLead.preferred_time_to_talk || selectedLead?.leadId?.preferred_time_to_talk}</td>
                              </tr>
                            )}
                            {modalSource !== "enrolled" && (
                              <tr>
                                <th className="tableHeader">Source</th>
                                <td className="tableData" colSpan="5">{selectedLead.source || selectedLead?.leadId?.source}</td>
                              </tr>
                            )}
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
                            {modalSource !== "touched" && modalSource !== "completed" && modalSource !== "enrolled" && (
                              <tr>
                                <th className="tableHeader">Created At</th>
                                <td className="tableData">{formatDateTimeIST(selectedLead.createdAt)}</td>
                              </tr>
                            )}
                            {modalSource !== "touched" && modalSource !== "completed" && modalSource !== "enrolled" && (
                              <tr>
                                <th className="tableHeader">Updated At</th>
                                <td className="tableData">{formatDateTimeIST(selectedLead.updatedAt)}</td>
                              </tr>
                            )}

                            {modalSource === "completed" && (
                              <tr>
                                <th className="tableHeader">Lead Work Start Date</th>
                                <td className="tableData" colSpan="5">{formatDateTimeIST(selectedLead.startDate)}</td>
                              </tr>
                            )}
                            {modalSource === "completed" && (
                              <tr>
                                <th className="tableHeader">Lead Work End Date</th>
                                <td className="tableData" colSpan="5">{formatDateTimeIST(selectedLead.endDate)}</td>
                              </tr>
                            )}
                            {modalSource === "enrolled" && (
                              <tr>
                                <th className="tableHeader">Payment Status</th>
                                <td className="tableData">
                                  <span className={`badge px-3 py-2 rounded-pill fw-normal 
                                        ${selectedLead.paymentStatus === "pending"
                                      ? "bg-warning text-dark fw-bold" : "bg-success"
                                    }`}>
                                    {selectedLead.paymentStatus}
                                  </span>
                                </td>
                              </tr>
                            )}

                            {modalSource === "enrolled" && (
                              <tr>
                                <th className="tableHeader">Upfront</th>
                                <td className="tableData">{selectedLead.upfront && selectedLead.upfront}</td>
                              </tr>
                            )}
                            {modalSource === "enrolled" && (
                              <tr>
                                <th className="tableHeader">Contracted</th>
                                <td className="tableData">{selectedLead.contracted}</td>
                              </tr>
                            )}
                            {modalSource === "enrolled" && selectedLead.collectedPayments?.length > 0 && (
                              <tr>
                                <th className="tableHeader">Payment 1</th>
                                <td className="tableData">
                                  {selectedLead.collectedPayments[0].amount} ({new Date(selectedLead.collectedPayments[0].date).toLocaleDateString("en-IN")})
                                </td>
                              </tr>
                            )}
                            {modalSource === "enrolled" && selectedLead.collectedPayments?.length > 0 && (
                              <tr>
                                <th className="tableHeader">Payment 2</th>
                                <td className="tableData">
                                  {selectedLead.collectedPayments[1].amount} ({new Date(selectedLead.collectedPayments[1].date).toLocaleDateString("en-IN")})
                                </td>
                              </tr>
                            )}
                            {modalSource === "enrolled" && selectedLead.collectedPayments?.length > 0 && (
                              <tr>
                                <th className="tableHeader">Payment 2</th>
                                <td className="tableData">
                                  {selectedLead.collectedPayments[2].amount} ({new Date(selectedLead.collectedPayments[2].date).toLocaleDateString("en-IN")})
                                </td>
                              </tr>
                            )}

                            {modalSource === "enrolled" && (
                              <tr>
                                <th className="tableHeader">Percentage</th>
                                <td className="tableData">{selectedLead.percentage}</td>
                              </tr>
                            )}
                            {modalSource === "enrolled" && (
                              <tr>
                                <th className="tableHeader">Job Guarantee</th>
                                <td className="tableData">{selectedLead.jobGuarantee ? "Yes" : "No"}</td>
                              </tr>
                            )}

                            {modalSource === "enrolled" && (
                              <tr>
                                <th className="tableHeader">Payment Gateway</th>
                                <td className="tableData">{selectedLead.paymentGateway}</td>
                              </tr>
                            )}
                            {modalSource === "enrolled" && (
                              <tr>
                                <th className="tableHeader">Enrollment Date</th>
                                <td><p className="mb-0 text-left tableData">{formatDateTimeIST(selectedLead.createdAt)}</p></td>
                              </tr>
                            )}
                            {modalSource === "enrolled" && (
                              <tr>
                                <th className="tableHeader">Plan</th>
                                <td className="tableData mb-0">{selectedLead.plan}</td>
                              </tr>
                            )}
                            <tr>
                              <th className="tableHeader">Status</th>
                              <td colSpan="5">
                                <span
                                  className="badge px-2 d-flex align-items-center justify-content-center gap-2"
                                  style={{
                                    backgroundColor: statusColors[selectedLead.status] || "#d1d5db",
                                    color: "white",
                                    borderRadius: "12px",
                                    fontWeight: "normal",
                                    textTransform: "capitalize",
                                    maxWidth: "100px"
                                  }}
                                >
                                  {selectedLead.status === "New" && <FaLink />}
                                  {selectedLead.status === "Connected" && <FaCheckCircle />}
                                  {selectedLead.status === "In Progress" && <FaHourglassHalf />}
                                  {selectedLead.status === "Shortlisted" && <FaStar />}
                                  {selectedLead.status === "Rejected" && <FaTimesCircle />}
                                  {selectedLead.status === "Assigned" && <FaCheckCircle />}
                                  {selectedLead.status === "Converted" && <FaUserCheck />}
                                  {selectedLead.status === "Interested" && <FaThumbsUp />}
                                  {selectedLead.status === "Not Interested" && <FaThumbsDown />}
                                  {selectedLead.status === "Follow-up" && <FaRedo />}
                                  {selectedLead.status === "In Discussion" && <FaComments />}
                                  {selectedLead.status === "completed" && <FaComments />}

                                  {selectedLead.status}
                                </span>
                              </td>
                            </tr>

                            {modalSource === "completed" || modalSource === "touched" && (
                              <>
                                {(() => {

                                  const resumeCalls = selectedLead?.callHistory || [];
                                  const salesCalls = selectedLead?.leadId?.callHistory || [];

                                  const allCalls = [...resumeCalls, ...salesCalls]
                                    .filter(call => call.source !== "Resume" || modalSource !== "assigned")
                                    .sort((a, b) => new Date(b.date) - new Date(a.date)
                                    );

                                  return allCalls.length > 0 ? (
                                    <>

                                      <tr>
                                        <th colSpan="12" className="text-center tableHeader bg-success text-white">
                                          Call Log Outcomes
                                        </th>
                                      </tr>

                                      <tr className="table-light">
                                        <th className="tableHeader">Index</th>
                                        <th className="tableHeader">Outcome</th>
                                        <th className="tableHeader">Date</th>
                                        <th className="tableHeader">Time</th>
                                        <th className="tableHeader">Duration</th>
                                        <th className="tableHeader">Notes</th>
                                        <th className="tableHeader">Source</th>
                                      </tr>

                                      {allCalls.map((call, index) => (
                                        <tr key={index}>
                                          <td className="tableData">{index + 1}</td>
                                          <td className="tableData">{call.outcome || "—"}</td>
                                          <td className="tableData">
                                            {call.date
                                              ? new Date(call.date).toLocaleDateString("en-IN", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                              })
                                              : "N/A"}
                                          </td>
                                          <td className="tableData">
                                            {call.date
                                              ? new Date(call.date).toLocaleTimeString("en-IN", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                              })
                                              : "N/A"}
                                          </td>
                                          <td className="tableData">{call.duration}</td>
                                          <td className="tableData">{call.notes}</td>
                                          <td
                                            className={`tableData ${resumeCalls.includes(call)
                                              ? "text-dark"
                                              : "text-dark"
                                              }`}
                                          >
                                            {resumeCalls.includes(call) ? "Resume" : "Sales"}
                                          </td>
                                        </tr>
                                      ))}
                                    </>
                                  ) : (
                                    <>
                                      <tr>
                                        <th colSpan="14" className="text-center tableHeader bg-secondary text-white">
                                          Call Log Outcomes
                                        </th>
                                      </tr>
                                      <tr>
                                        <td colSpan="14" className="text-center text-muted py-2 tableData">
                                          No outcome history found
                                        </td>
                                      </tr>
                                    </>
                                  );
                                })()}
                              </>
                            )}

                          </tbody>
                        </table>
                      </div>

                      {user.role === "Sales" && (modalSource === "interested" || modalSource === "Not Interested" || modalSource === "inDiscussion" || modalSource === "follow-up" || modalSource === "assigned") && modalSource !== "enrolled" && (
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
                              className={`btn btn-sm w-100 text-light ${loading ? "btn-secondary" : "btn-primary"
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


      {/* Interested Leads */}
      {user.role == "Sales" && (
        <div className="col-12 col-md-8 col-lg-12 mt-2">
          <div className="rounded-4 bg-white shadow-sm p-4 table-reponsive h-100">

            <div className="d-flex flex-wrap justify-content-between align-items-center px-3 mt-2 mb-3">
              <div className="mb-2 mb-md-0">
                <h5 className="text-left leadManagementTitle mt-4">Interested Leads({counts.backendInterested})</h5>
                <h6 className="leadManagementSubtitle mb-3">Active Interested Leads</h6>
              </div>

              <div className="d-flex flex-column flex-md-row align-items-md-center gap-2 w-md-auto">
                <div className="input-group input-group-sm search flex-nowrap w-md-auto">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="form-control form-control-sm border-start-0"
                    value={interestedFilters.search}
                    onChange={(e) =>
                      setInterestedFilters({ ...interestedFilters, search: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="table-container">
              <table className="table table-hover table-striped table-bordered table-responsive align-middle rounded-5 mb-0 bg-white">
                <thead className="bg-light">
                  <tr>
                    <th className="text-left tableHeader">#</th>
                    <th className="text-left tableHeader">Name</th>
                    <th className="text-left tableHeader">Email</th>
                    <th className="text-left tableHeader">Phone</th>
                    <th className="text-left tableHeader">Technology</th>
                    <th className="text-left tableHeader">Status</th>
                    <th className="text-left tableHeader">Created At</th>
                    <th className="text-left tableHeader">Updated At</th>
                    {/* <th className="text-left tableHeader">Upfront</th>
                    <th className="text-left tableHeader">Contracted</th> */}
                    {/* <th className="text-left tableHeader">Payment 1 (Date)</th>
                    <th className="text-left tableHeader">Payment 2 (Date)</th>
                    <th className="text-left tableHeader">Payment 3 (Date)</th> */}
                    {/* <th className="text-left tableHeader">Percentage</th>
                    <th className="text-left tableHeader">Payment Status</th>
                    <th className="text-left tableHeader">Job Guarantee</th>
                    <th className="text-left tableHeader">Enrollment Date</th> */}
                    {/* <th className="text-left tableHeader">Moved To Resume</th> */}
                    {/* <th className="text-left tableHeader">Moved To CV</th> */}
                    <th className="text-left tableHeader">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInterestedLeads.length > 0 ? (
                    filteredInterestedLeads.map((c, index) => (
                      <tr key={c._id}>
                        <td><p className="mb-0 text-left tableData">{index + 1}</p></td>
                        <td><p className="mb-0 text-left tableData">{c.candidate_name}</p></td>
                        <td><p className="mb-0 text-left tableData">{c.candidate_email}</p></td>
                        <td><p className="mb-0 text-left tableData">{c.candidate_phone_no || "N/A"}</p></td>
                        <td><p className="mb-0 text-left tableData">{Array.isArray(c.technology) ? c.technology.join(", ") : c.technology}</p></td>
                        {/* <td><p className="mb-0 text-left tableData">{c.upfront || "-"}</p></td>
                        <td><p className="mb-0 text-left tableData">{c.contracted || "-"}</p></td> */}
                        {/* <td>
                          <p className="mb-0 text-left tableData">
                            {c.collectedPayments[0]?.amount || 0} (
                            {c.collectedPayments[0]?.date ? new Date(c.collectedPayments[0].date).toLocaleDateString() : "N/A"})
                          </p>
                        </td>
                        <td>
                          <p className="mb-0 text-left tableData">
                            {c.collectedPayments[1]?.amount || 0} (
                            {c.collectedPayments[1]?.date ? new Date(c.collectedPayments[1].date).toLocaleDateString() : "N/A"})
                          </p>
                        </td>
                        <td>
                          <p className="mb-0 text-left tableData">
                            {c.collectedPayments[2]?.amount || 0} (
                            {c.collectedPayments[2]?.date ? new Date(c.collectedPayments[2].date).toLocaleDateString() : "N/A"})
                          </p>
                        </td> */}
                        {/* <td><p className="mb-0 text-left tableData">{c.percentage || "-"}</p></td>
                        <td>
                          <span className={`badge ${c.paymentStatus === "paid" ? "bg-success" : "bg-warning text-dark"}`}>
                            {c.paymentStatus}
                          </span>
                        </td>
                        <td><p className="mb-0 text-left tableData">{c.jobGuarantee ? "Yes" : "No"}</p></td>
                        <td><p className="mb-0 text-left tableData">{formatDateTimeIST(c.createdAt)}</p></td>
                        <td>
                          <span className={`badge d-flex align-items-center gap-1 ${c.movedToTraining ? "bg-success" : "bg-warning text-dark"}`}>
                            <i className={c.movedToTraining ? "bi bi-check-circle" : "bi bi-clock"}></i>
                            {c.movedToTraining ? "Done" : "Not Yet"}
                          </span>
                        </td> */}
                        {/* <td>
                          <span className={`badge d-flex align-items-center gap-1 ${c.movedToCV ? "bg-success" : "bg-warning text-dark"}`}>
                            <i className={c.movedToCV ? "bi bi-check-circle" : "bi bi-clock"}></i>
                            {c.movedToCV ? "Done" : "Not Yet"}
                          </span>
                        </td> */}
                        <td className="text-center">
                          <span
                            className="badge px-2 d-flex align-items-center justify-content-center gap-2"
                            style={{
                              backgroundColor: statusColors[c.status] || "#d1d5db",
                              color: "white",
                              borderRadius: "12px",
                              fontWeight: "normal",
                              textTransform: "capitalize",
                            }}
                          >
                            {/* Icons same as before */}
                            {c.status === "New" && <FaLink />}
                            {c.status === "Connected" && <FaCheckCircle />}
                            {c.status === "In Progress" && <FaHourglassHalf />}
                            {c.status === "Shortlisted" && <FaStar />}
                            {c.status === "Rejected" && <FaTimesCircle />}
                            {c.status === "Assigned" && <FaCheckCircle />}
                            {c.status === "Converted" && <FaUserCheck />}
                            {c.status === "Interested" && <FaThumbsUp />}
                            {c.status === "Not Interested" && <FaThumbsDown />}
                            {c.status === "Follow-up" && <FaRedo />}
                            {c.status === "In Discussion" && <FaComments />}

                            {c.status}
                          </span>
                        </td>
                        <td>
                          <p className="mb-0 text-left tableHeader">{formatDateTimeIST(c.createdAt)}</p>
                        </td>
                        <td>
                          <p className="mb-0 text-left tableHeader">{formatDateTimeIST(c.updatedAt)}</p>
                        </td>
                        {/* <td className="text-center">
                          <span
                            className={`badge status-badge px-2 py-2 d-flex gap-2
                            ${c.status === "New" ? "bg-new" :
                                c.status === "Connected" ? "bg-connected" :
                                  c.status === "In Progress" ? "bg-inprogress" :
                                    c.status === "Shortlisted" ? "bg-shortlisted text-dark" :
                                      c.status === "Rejected" ? "bg-rejected" :
                                        c.status === "Assigned" ? "bg-success" :
                                          c.status === "In Discussion" ? "bg-warning" :
                                            c.status === "Converted" ? "bg-converted" : "bg-secondary"}`}
                          >
                            {c.status === "New" && <FaLink />}
                            {c.status === "Connected" && <FaCheckCircle />}
                            {c.status === "In Progress" && <FaHourglassHalf />}
                            {c.status === "Shortlisted" && <FaStar />}
                            {c.status === "Rejected" && <FaTimesCircle />}
                            {c.status === "Converted" && <FaUserCheck />}
                            {c.status === "Assigned" && <FaCheckCircle />}

                            {c.status}
                          </span>
                        </td> */}

                        <td>
                          <div className="d-flex justify-content-center align-items-center gap-2">
                            {c.status === "Interested" && (
                              <button
                                className="btn btn-sm"
                                style={{
                                  backgroundColor: statusColors["Enrolled"],
                                  color: "white",
                                  fontWeight: "normal",
                                  borderRadius: "6px",
                                  padding: "5px 7px",
                                  border: "none",
                                  transition: "0.3s ease",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                                onClick={() => handleEnrollCandidate(c)}
                              >
                                <i className="bi bi-person-check-fill me-2"></i> Enroll
                              </button>
                            )}
                            <button
                              className="btn btn-sm me-2 d-flex align-items-center"
                              style={{
                                backgroundColor: "#2563eb",
                                color: "white",
                                fontWeight: "normal",
                                borderRadius: "6px",
                                border: "none",
                                transition: "0.3s ease",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                              data-bs-toggle="modal"
                              data-bs-target="#viewLead"
                              onClick={() => {
                                setSelectedLead(c);
                                setModalSource("interested");
                              }}
                            >
                              <i className="bi bi-eye-fill me-2"></i> View Lead
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="mb-0 text-center tableData">
                        No enrolled candidates found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Not Interested Leads */}
      {user.role == "Sales" && (
        <div className="col-12 col-md-8 col-lg-12 mt-2">
          <div className="rounded-4 bg-white shadow-sm p-4 table-reponsive h-100">

            <div className="d-flex flex-wrap justify-content-between align-items-center px-3 mt-2 mb-3">
              <div className="mb-2 mb-md-0">
                <h5 className="text-left leadManagementTitle mt-4">Not Interested Leads({counts.backendNotInterested})</h5>
                <h6 className="leadManagementSubtitle mb-3">Active Not Interested Leads</h6>
              </div>

              <div className="d-flex flex-column flex-md-row align-items-md-center gap-2 w-md-auto">
                <div className="input-group input-group-sm search flex-nowrap w-md-auto">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="form-control form-control-sm border-start-0"
                    value={notInterestedFilters.search}
                    onChange={(e) =>
                      setNotInterestedFilters({ ...notInterestedFilters, search: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="table-container">
              <table className="table table-hover table-striped table-bordered table-responsive align-middle rounded-5 mb-0 bg-white">
                <thead className="bg-light">
                  <tr>
                    <th className="text-left tableHeader">#</th>
                    <th className="text-left tableHeader">Name</th>
                    <th className="text-left tableHeader">Email</th>
                    <th className="text-left tableHeader">Phone</th>
                    <th className="text-left tableHeader">Technology</th>
                    <th className="text-left tableHeader">Status</th>
                    <th className="text-left tableHeader">Created At</th>
                    <th className="text-left tableHeader">Updated At</th>
                    {/* <th className="text-left tableHeader">Upfront</th>
                    <th className="text-left tableHeader">Contracted</th> */}
                    {/* <th className="text-left tableHeader">Payment 1 (Date)</th>
                    <th className="text-left tableHeader">Payment 2 (Date)</th>
                    <th className="text-left tableHeader">Payment 3 (Date)</th> */}
                    {/* <th className="text-left tableHeader">Percentage</th>
                    <th className="text-left tableHeader">Payment Status</th>
                    <th className="text-left tableHeader">Job Guarantee</th>
                    <th className="text-left tableHeader">Enrollment Date</th> */}
                    {/* <th className="text-left tableHeader">Moved To Resume</th> */}
                    {/* <th className="text-left tableHeader">Moved To CV</th> */}
                    <th className="text-left tableHeader">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNotInterestedLeads.length > 0 ? (
                    filteredNotInterestedLeads.map((c, index) => (
                      <tr key={c._id}>
                        <td><p className="mb-0 text-left tableData">{index + 1}</p></td>
                        <td><p className="mb-0 text-left tableData">{c.candidate_name}</p></td>
                        <td><p className="mb-0 text-left tableData">{c.candidate_email}</p></td>
                        <td><p className="mb-0 text-left tableData">{c.candidate_phone_no || "N/A"}</p></td>
                        <td><p className="mb-0 text-left tableData">{Array.isArray(c.technology) ? c.technology.join(", ") : c.technology}</p></td>
                        {/* <td><p className="mb-0 text-left tableData">{c.upfront || "-"}</p></td>
                        <td><p className="mb-0 text-left tableData">{c.contracted || "-"}</p></td> */}
                        {/* <td>
                          <p className="mb-0 text-left tableData">
                            {c.collectedPayments[0]?.amount || 0} (
                            {c.collectedPayments[0]?.date ? new Date(c.collectedPayments[0].date).toLocaleDateString() : "N/A"})
                          </p>
                        </td>
                        <td>
                          <p className="mb-0 text-left tableData">
                            {c.collectedPayments[1]?.amount || 0} (
                            {c.collectedPayments[1]?.date ? new Date(c.collectedPayments[1].date).toLocaleDateString() : "N/A"})
                          </p>
                        </td>
                        <td>
                          <p className="mb-0 text-left tableData">
                            {c.collectedPayments[2]?.amount || 0} (
                            {c.collectedPayments[2]?.date ? new Date(c.collectedPayments[2].date).toLocaleDateString() : "N/A"})
                          </p>
                        </td> */}
                        {/* <td><p className="mb-0 text-left tableData">{c.percentage || "-"}</p></td>
                        <td>
                          <span className={`badge ${c.paymentStatus === "paid" ? "bg-success" : "bg-warning text-dark"}`}>
                            {c.paymentStatus}
                          </span>
                        </td>
                        <td><p className="mb-0 text-left tableData">{c.jobGuarantee ? "Yes" : "No"}</p></td>
                        <td><p className="mb-0 text-left tableData">{formatDateTimeIST(c.createdAt)}</p></td>
                        <td>
                          <span className={`badge d-flex align-items-center gap-1 ${c.movedToTraining ? "bg-success" : "bg-warning text-dark"}`}>
                            <i className={c.movedToTraining ? "bi bi-check-circle" : "bi bi-clock"}></i>
                            {c.movedToTraining ? "Done" : "Not Yet"}
                          </span>
                        </td> */}
                        {/* <td>
                          <span className={`badge d-flex align-items-center gap-1 ${c.movedToCV ? "bg-success" : "bg-warning text-dark"}`}>
                            <i className={c.movedToCV ? "bi bi-check-circle" : "bi bi-clock"}></i>
                            {c.movedToCV ? "Done" : "Not Yet"}
                          </span>
                        </td> */}
                        <td className="text-center">
                          <span
                            className="badge px-2 d-flex align-items-center justify-content-center gap-2"
                            style={{
                              backgroundColor: statusColors[c.status] || "#d1d5db",
                              color: "white",
                              borderRadius: "8px",
                              fontWeight: "normal",
                              textTransform: "capitalize",
                            }}
                          >
                            {/* Icons same as before */}
                            {c.status === "New" && <FaLink />}
                            {c.status === "Connected" && <FaCheckCircle />}
                            {c.status === "In Progress" && <FaHourglassHalf />}
                            {c.status === "Shortlisted" && <FaStar />}
                            {c.status === "Rejected" && <FaTimesCircle />}
                            {c.status === "Assigned" && <FaCheckCircle />}
                            {c.status === "Converted" && <FaUserCheck />}
                            {c.status === "Interested" && <FaThumbsUp />}
                            {c.status === "Not Interested" && <FaThumbsDown />}
                            {c.status === "Follow-up" && <FaRedo />}
                            {c.status === "In Discussion" && <FaComments />}

                            {c.status}
                          </span>
                        </td>
                        <td>
                          <p className="mb-0 text-left tableHeader">{formatDateTimeIST(c.createdAt)}</p>
                        </td>
                        <td>
                          <p className="mb-0 text-left tableHeader">{formatDateTimeIST(c.updatedAt)}</p>
                        </td>
                        {/* <td className="text-center">
                          <span
                            className={`badge status-badge px-2 py-2 d-flex gap-2
                            ${c.status === "New" ? "bg-new" :
                                c.status === "Connected" ? "bg-connected" :
                                  c.status === "In Progress" ? "bg-inprogress" :
                                    c.status === "Shortlisted" ? "bg-shortlisted text-dark" :
                                      c.status === "Rejected" ? "bg-rejected" :
                                        c.status === "Assigned" ? "bg-success" :
                                          c.status === "Converted" ? "bg-converted" : "bg-secondary"}`}
                          >
                            {c.status === "New" && <FaLink />}
                            {c.status === "Connected" && <FaCheckCircle />}
                            {c.status === "In Progress" && <FaHourglassHalf />}
                            {c.status === "Shortlisted" && <FaStar />}
                            {c.status === "Rejected" && <FaTimesCircle />}
                            {c.status === "Converted" && <FaUserCheck />}
                            {c.status === "Assigned" && <FaCheckCircle />}

                            {c.status}
                          </span>
                        </td> */}

                        <td>
                          {/* <button className="btn btn-sm btn-warning me-2" disabled={c.movedToTraining} onClick={() => handleMoveToTraining(c._id)}>Move to Training</button>
                        <button className="btn btn-sm btn-success me-2" disabled={c.movedToCV} onClick={() => handleMoveToCV(c._id)}>Move to CV</button> */}
                          {/* <button className="btn btn-sm btn-warning me-2" onClick={() => updateStage(c._id, "training")} disabled={c.movedToTraining}>{c.movedToTraining ? "Moved" : "Move to Resume"}</button> */}
                          {/* <button className="btn btn-sm btn-success me-2" onClick={() => updateStage(c._id, "cv")}>Move to CV</button> */}

                          <button
                            className="btn btn-sm me-2 d-flex align-items-center"
                            style={{
                              backgroundColor: "#2563eb",
                              color: "white",
                              fontWeight: "normal",
                              borderRadius: "6px",
                              border: "none",
                              transition: "0.3s ease",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                            data-bs-toggle="modal"
                            data-bs-target="#viewLead"
                            onClick={() => {
                              setSelectedLead(c);
                              setModalSource("Not Interested");
                            }}
                          >
                            <i className="bi bi-eye-fill me-2"></i> View Lead
                          </button>

                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="mb-0 text-center tableData">
                        No enrolled candidates found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* In Discussion Leads */}
      {user.role == "Sales" && (
        <div className="col-12 col-md-8 col-lg-12 mt-2">
          <div className="rounded-4 bg-white shadow-sm p-4 table-reponsive h-100">

            <div className="d-flex flex-wrap justify-content-between align-items-center px-3 mt-2 mb-3">
              <div className="mb-2 mb-md-0">
                <h5 className="text-left leadManagementTitle mt-4">In Discussion Leads({counts.backendNotInterested})</h5>
                <h6 className="leadManagementSubtitle mb-3">Active Leads</h6>
              </div>

              <div className="d-flex flex-column flex-md-row align-items-md-center gap-2 w-md-auto">
                <div className="input-group input-group-sm search flex-nowrap w-md-auto">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="form-control form-control-sm border-start-0"
                    value={inDiscussionFilters.search}
                    onChange={(e) =>
                      setInDiscussionFilters({ ...inDiscussionFilters, search: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="table-container">
              <table className="table table-hover table-striped table-bordered table-responsive align-middle rounded-5 mb-0 bg-white">
                <thead className="bg-light">
                  <tr>
                    <th className="text-left tableHeader">#</th>
                    <th className="text-left tableHeader">Name</th>
                    <th className="text-left tableHeader">Email</th>
                    <th className="text-left tableHeader">Phone</th>
                    <th className="text-left tableHeader">Technology</th>
                    <th className="text-left tableHeader">Status</th>
                    <th className="text-left tableHeader">Created At</th>
                    <th className="text-left tableHeader">Updated At</th>
                    {/* <th className="text-left tableHeader">Upfront</th>
                    <th className="text-left tableHeader">Contracted</th> */}
                    {/* <th className="text-left tableHeader">Payment 1 (Date)</th>
                    <th className="text-left tableHeader">Payment 2 (Date)</th>
                    <th className="text-left tableHeader">Payment 3 (Date)</th> */}
                    {/* <th className="text-left tableHeader">Percentage</th>
                    <th className="text-left tableHeader">Payment Status</th>
                    <th className="text-left tableHeader">Job Guarantee</th>
                    <th className="text-left tableHeader">Enrollment Date</th> */}
                    {/* <th className="text-left tableHeader">Moved To Resume</th> */}
                    {/* <th className="text-left tableHeader">Moved To CV</th> */}
                    <th className="text-left tableHeader">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInDiscussionLeads.length > 0 ? (
                    filteredInDiscussionLeads.map((c, index) => (
                      <tr key={c._id}>
                        <td><p className="mb-0 text-left tableData">{index + 1}</p></td>
                        <td><p className="mb-0 text-left tableData">{c.candidate_name}</p></td>
                        <td><p className="mb-0 text-left tableData">{c.candidate_email}</p></td>
                        <td><p className="mb-0 text-left tableData">{c.candidate_phone_no || "N/A"}</p></td>
                        <td><p className="mb-0 text-left tableData">{Array.isArray(c.technology) ? c.technology.join(", ") : c.technology}</p></td>
                        {/* <td><p className="mb-0 text-left tableData">{c.upfront || "-"}</p></td>
                        <td><p className="mb-0 text-left tableData">{c.contracted || "-"}</p></td> */}
                        {/* <td>
                          <p className="mb-0 text-left tableData">
                            {c.collectedPayments[0]?.amount || 0} (
                            {c.collectedPayments[0]?.date ? new Date(c.collectedPayments[0].date).toLocaleDateString() : "N/A"})
                          </p>
                        </td>
                        <td>
                          <p className="mb-0 text-left tableData">
                            {c.collectedPayments[1]?.amount || 0} (
                            {c.collectedPayments[1]?.date ? new Date(c.collectedPayments[1].date).toLocaleDateString() : "N/A"})
                          </p>
                        </td>
                        <td>
                          <p className="mb-0 text-left tableData">
                            {c.collectedPayments[2]?.amount || 0} (
                            {c.collectedPayments[2]?.date ? new Date(c.collectedPayments[2].date).toLocaleDateString() : "N/A"})
                          </p>
                        </td> */}
                        {/* <td><p className="mb-0 text-left tableData">{c.percentage || "-"}</p></td>
                        <td>
                          <span className={`badge ${c.paymentStatus === "paid" ? "bg-success" : "bg-warning text-dark"}`}>
                            {c.paymentStatus}
                          </span>
                        </td>
                        <td><p className="mb-0 text-left tableData">{c.jobGuarantee ? "Yes" : "No"}</p></td>
                        <td><p className="mb-0 text-left tableData">{formatDateTimeIST(c.createdAt)}</p></td>
                        <td>
                          <span className={`badge d-flex align-items-center gap-1 ${c.movedToTraining ? "bg-success" : "bg-warning text-dark"}`}>
                            <i className={c.movedToTraining ? "bi bi-check-circle" : "bi bi-clock"}></i>
                            {c.movedToTraining ? "Done" : "Not Yet"}
                          </span>
                        </td> */}
                        {/* <td>
                          <span className={`badge d-flex align-items-center gap-1 ${c.movedToCV ? "bg-success" : "bg-warning text-dark"}`}>
                            <i className={c.movedToCV ? "bi bi-check-circle" : "bi bi-clock"}></i>
                            {c.movedToCV ? "Done" : "Not Yet"}
                          </span>
                        </td> */}
                        <td className="text-center">
                          <span
                            className="badge status-badge px-2 py-2 d-flex align-items-center justify-content-center gap-2"
                            style={{
                              backgroundColor: statusColors[c.status] || "#d1d5db",
                              color: "white",
                              padding: "6px 12px",
                              borderRadius: "8px",
                              fontWeight: "bold",
                              textTransform: "capitalize",
                              minWidth: "120px"
                            }}
                          >
                            {/* Icons same as before */}
                            {c.status === "New" && <FaLink />}
                            {c.status === "Connected" && <FaCheckCircle />}
                            {c.status === "In Progress" && <FaHourglassHalf />}
                            {c.status === "Shortlisted" && <FaStar />}
                            {c.status === "Rejected" && <FaTimesCircle />}
                            {c.status === "Assigned" && <FaCheckCircle />}
                            {c.status === "Converted" && <FaUserCheck />}
                            {c.status === "Interested" && <FaThumbsUp />}
                            {c.status === "Not Interested" && <FaThumbsDown />}
                            {c.status === "Follow-up" && <FaRedo />}
                            {c.status === "In Discussion" && <FaComments />}

                            {c.status}
                          </span>
                        </td>
                        <td>
                          <p className="mb-0 text-left tableHeader">{formatDateTimeIST(c.createdAt)}</p>
                        </td>
                        <td>
                          <p className="mb-0 text-left tableHeader">{formatDateTimeIST(c.updatedAt)}</p>
                        </td>
                        <td>
                          {/* <button className="btn btn-sm btn-warning me-2" disabled={c.movedToTraining} onClick={() => handleMoveToTraining(c._id)}>Move to Training</button>
                        <button className="btn btn-sm btn-success me-2" disabled={c.movedToCV} onClick={() => handleMoveToCV(c._id)}>Move to CV</button> */}
                          {/* <button className="btn btn-sm btn-warning me-2" onClick={() => updateStage(c._id, "training")} disabled={c.movedToTraining}>{c.movedToTraining ? "Moved" : "Move to Resume"}</button> */}
                          {/* <button className="btn btn-sm btn-success me-2" onClick={() => updateStage(c._id, "cv")}>Move to CV</button> */}

                          {/* <button
                            className="btn btn-sm btn-success ms-2"
                            data-bs-toggle="modal"
                            data-bs-target="#viewLead"
                            onClick={() => {
                              setSelectedLead(c);
                              setModalSource("inDiscussion");
                            }}
                          >
                            View Lead
                          </button> */}

                          <button
                            className="btn btn-sm me-2 d-flex align-items-center"
                            style={{
                              backgroundColor: "#2563eb",
                              color: "white",
                              fontWeight: "normal",
                              borderRadius: "6px",
                              border: "none",
                              transition: "0.3s ease",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                            data-bs-toggle="modal"
                            data-bs-target="#viewLead"
                            onClick={() => {
                              setSelectedLead(c);
                              setModalSource("inDiscussion");
                            }}
                          >
                            <i className="bi bi-eye-fill me-2"></i> View Lead
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="mb-0 text-center tableData">
                        No enrolled candidates found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Follow-Up Leads */}
      {user.role == "Sales" && (
        <div className="col-12 col-md-8 col-lg-12 mt-2">
          <div className="rounded-4 bg-white shadow-sm p-4 table-reponsive h-100">

            <div className="d-flex flex-wrap justify-content-between align-items-center px-3 mt-2 mb-3">
              <div className="mb-2 mb-md-0">
                <h5 className="text-left leadManagementTitle mt-4">Follow Up Leads({counts.backendNotInterested})</h5>
                <h6 className="leadManagementSubtitle mb-3">Active Leads</h6>
              </div>

              <div className="d-flex flex-column flex-md-row align-items-md-center gap-2 w-md-auto">
                <div className="input-group input-group-sm search flex-nowrap w-md-auto">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="form-control form-control-sm border-start-0"
                    value={followUpFilters.search}
                    onChange={(e) =>
                      setFollowUpFilters({ ...followUpFilters, search: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="table-container">
              <table className="table table-hover table-striped table-bordered table-responsive align-middle rounded-5 mb-0 bg-white">
                <thead className="bg-light">
                  <tr>
                    <th className="text-left tableHeader">#</th>
                    <th className="text-left tableHeader">Name</th>
                    <th className="text-left tableHeader">Email</th>
                    <th className="text-left tableHeader">Phone</th>
                    <th className="text-left tableHeader">Technology</th>
                    <th className="text-left tableHeader">Status</th>
                    <th className="text-left tableHeader">Created At</th>
                    <th className="text-left tableHeader">Updated At</th>
                    {/* <th className="text-left tableHeader">Upfront</th>
                    <th className="text-left tableHeader">Contracted</th> */}
                    {/* <th className="text-left tableHeader">Payment 1 (Date)</th>
                    <th className="text-left tableHeader">Payment 2 (Date)</th>
                    <th className="text-left tableHeader">Payment 3 (Date)</th> */}
                    {/* <th className="text-left tableHeader">Percentage</th>
                    <th className="text-left tableHeader">Payment Status</th>
                    <th className="text-left tableHeader">Job Guarantee</th>
                    <th className="text-left tableHeader">Enrollment Date</th> */}
                    {/* <th className="text-left tableHeader">Moved To Resume</th> */}
                    {/* <th className="text-left tableHeader">Moved To CV</th> */}
                    <th className="text-left tableHeader">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFollowUpLeads.length > 0 ? (
                    filteredFollowUpLeads.map((c, index) => (
                      <tr key={c._id}>
                        <td><p className="mb-0 text-left tableData">{index + 1}</p></td>
                        <td><p className="mb-0 text-left tableData">{c.candidate_name}</p></td>
                        <td><p className="mb-0 text-left tableData">{c.candidate_email}</p></td>
                        <td><p className="mb-0 text-left tableData">{c.candidate_phone_no || "N/A"}</p></td>
                        <td><p className="mb-0 text-left tableData">{Array.isArray(c.technology) ? c.technology.join(", ") : c.technology}</p></td>
                        {/* <td><p className="mb-0 text-left tableData">{c.upfront || "-"}</p></td>
                        <td><p className="mb-0 text-left tableData">{c.contracted || "-"}</p></td> */}
                        {/* <td>
                          <p className="mb-0 text-left tableData">
                            {c.collectedPayments[0]?.amount || 0} (
                            {c.collectedPayments[0]?.date ? new Date(c.collectedPayments[0].date).toLocaleDateString() : "N/A"})
                          </p>
                        </td>
                        <td>
                          <p className="mb-0 text-left tableData">
                            {c.collectedPayments[1]?.amount || 0} (
                            {c.collectedPayments[1]?.date ? new Date(c.collectedPayments[1].date).toLocaleDateString() : "N/A"})
                          </p>
                        </td>
                        <td>
                          <p className="mb-0 text-left tableData">
                            {c.collectedPayments[2]?.amount || 0} (
                            {c.collectedPayments[2]?.date ? new Date(c.collectedPayments[2].date).toLocaleDateString() : "N/A"})
                          </p>
                        </td> */}
                        {/* <td><p className="mb-0 text-left tableData">{c.percentage || "-"}</p></td>
                        <td>
                          <span className={`badge ${c.paymentStatus === "paid" ? "bg-success" : "bg-warning text-dark"}`}>
                            {c.paymentStatus}
                          </span>
                        </td>
                        <td><p className="mb-0 text-left tableData">{c.jobGuarantee ? "Yes" : "No"}</p></td>
                        <td><p className="mb-0 text-left tableData">{formatDateTimeIST(c.createdAt)}</p></td>
                        <td>
                          <span className={`badge d-flex align-items-center gap-1 ${c.movedToTraining ? "bg-success" : "bg-warning text-dark"}`}>
                            <i className={c.movedToTraining ? "bi bi-check-circle" : "bi bi-clock"}></i>
                            {c.movedToTraining ? "Done" : "Not Yet"}
                          </span>
                        </td> */}
                        {/* <td>
                          <span className={`badge d-flex align-items-center gap-1 ${c.movedToCV ? "bg-success" : "bg-warning text-dark"}`}>
                            <i className={c.movedToCV ? "bi bi-check-circle" : "bi bi-clock"}></i>
                            {c.movedToCV ? "Done" : "Not Yet"}
                          </span>
                        </td> */}
                        <td className="text-center">
                          <span
                            className="badge px-2 d-flex align-items-center justify-content-center gap-2"
                            style={{
                              backgroundColor: statusColors[c.status] || "#d1d5db",
                              color: "white",
                              borderRadius: "12px",
                              fontWeight: "normal",
                              textTransform: "capitalize",
                            }}
                          >
                            {c.status === "New" && <FaLink />}
                            {c.status === "Connected" && <FaCheckCircle />}
                            {c.status === "In Progress" && <FaHourglassHalf />}
                            {c.status === "Shortlisted" && <FaStar />}
                            {c.status === "Rejected" && <FaTimesCircle />}
                            {c.status === "Assigned" && <FaCheckCircle />}
                            {c.status === "Converted" && <FaUserCheck />}
                            {c.status === "Interested" && <FaThumbsUp />}
                            {c.status === "Not Interested" && <FaThumbsDown />}
                            {c.status === "Follow-up" && <FaRedo />}
                            {c.status === "In Discussion" && <FaComments />}

                            {c.status}
                          </span>
                        </td>
                        <td>
                          <p className="mb-0 text-left tableHeader">{formatDateTimeIST(c.createdAt)}</p>
                        </td>
                        <td>
                          <p className="mb-0 text-left tableHeader">{formatDateTimeIST(c.updatedAt)}</p>
                        </td>

                        <td>
                          {/* <button className="btn btn-sm btn-warning me-2" disabled={c.movedToTraining} onClick={() => handleMoveToTraining(c._id)}>Move to Training</button>
                        <button className="btn btn-sm btn-success me-2" disabled={c.movedToCV} onClick={() => handleMoveToCV(c._id)}>Move to CV</button> */}
                          {/* <button className="btn btn-sm btn-warning me-2" onClick={() => updateStage(c._id, "training")} disabled={c.movedToTraining}>{c.movedToTraining ? "Moved" : "Move to Resume"}</button> */}
                          {/* <button className="btn btn-sm btn-success me-2" onClick={() => updateStage(c._id, "cv")}>Move to CV</button> */}

                          {/* <button
                            className="btn btn-sm btn-success ms-2"
                            data-bs-toggle="modal"
                            data-bs-target="#viewLead"
                            onClick={() => {
                              setSelectedLead(c);
                              setModalSource("enrolled");
                            }}
                          >
                            View Lead
                          </button> */}

                          <button
                            className="btn btn-sm me-2 d-flex align-items-center"
                            style={{
                              backgroundColor: "#2563eb",
                              color: "white",
                              fontWeight: "normal",
                              borderRadius: "6px",
                              border: "none",
                              transition: "0.3s ease",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                            data-bs-toggle="modal"
                            data-bs-target="#viewLead"
                            onClick={() => {
                              setSelectedLead(c);
                              setModalSource("follow-up");
                            }}
                          >
                            <i className="bi bi-eye-fill me-2"></i> View Lead
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="mb-0 text-center tableData">
                        No enrolled candidates found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Enrolled Leads */}
      {user.role == "Sales" && (
        <div className="col-12 col-md-8 col-lg-12 mt-2">
          <div className="rounded-4 bg-white shadow-sm p-4 table-reponsive h-100">

            <div className="d-flex flex-wrap justify-content-between align-items-center px-3 mt-2 mb-3">
              <div className="mb-2 mb-md-0">
                <h5 className="text-left leadManagementTitle mt-4">All Enrolled Leads({counts.enrolled})</h5>
                <h6 className="leadManagementSubtitle mb-3">Active Leads</h6>
              </div>

              <div className="d-flex flex-column flex-md-row align-items-md-center gap-2 w-md-auto">
                <div className="input-group input-group-sm search flex-nowrap w-md-auto">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="form-control form-control-sm border-start-0"
                    value={enrolledFilters.search}
                    onChange={(e) =>
                      setEnrolledFilters({ ...enrolledFilters, search: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="table-container">
              <table className="table table-hover table-striped table-bordered table-responsive align-middle rounded-5 mb-0 bg-white">
                <thead className="bg-light">
                  <tr>
                    <th className="text-left tableHeader">
                      <div className="d-flex align-items-start justify-content-center flex-column">
                        <label htmlFor="selectAllTouchedCheckbox" className="form-label">
                          Select All
                        </label>
                        <input
                          type="checkbox"
                          checked={selectAllEnrolled}
                          onChange={(e) => handleSelectAllEnrolled(e, "enrolled")}
                        />
                      </div>
                    </th>
                    <th className="text-left tableHeader">#</th>
                    <th className="text-left tableHeader">Name</th>
                    <th className="text-left tableHeader">Email</th>
                    <th className="text-left tableHeader">Phone</th>
                    <th className="text-left tableHeader">Technology</th>
                    <th className="text-left tableHeader">Payment Status</th>
                    <th className="text-left tableHeader">Upfront</th>
                    <th className="text-left tableHeader">Contracted</th>
                    <th className="text-left tableHeader">Payment 1 (Date)</th>
                    <th className="text-left tableHeader">Payment 2 (Date)</th>
                    <th className="text-left tableHeader">Payment 3 (Date)</th>
                    <th className="text-left tableHeader">Percentage</th>
                    <th className="text-left tableHeader">Job Guarantee</th>
                    <th className="text-left tableHeader">Enrollment Date</th>
                    <th className="text-left tableHeader">Moved To Resume</th>
                    {/* <th className="text-left tableHeader">Moved To CV</th> */}
                    <th className="text-left tableHeader">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEnrolledLeads.length > 0 ? (
                    filteredEnrolledLeads.map((c, index) => (
                      <tr key={c._id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedEnrolledLeads.includes(c._id)}
                            onChange={() => toggleLeadSelection(c._id, "enrolled")}
                          />
                        </td>
                        <td><p className="mb-0 text-left tableData">{index + 1}</p></td>
                        <td><p className="mb-0 text-left tableData">{c.name}</p></td>
                        <td><p className="mb-0 text-left tableData">{c.email}</p></td>
                        <td><p className="mb-0 text-left tableData">{c.phone}</p></td>
                        <td><p className="mb-0 text-left tableData">{Array.isArray(c.technology) ? c.technology.join(", ") : c.technology}</p></td>
                        <td className="text-center">
                          <span
                            className="badge d-flex align-items-center gap-2 px-2"
                            style={{
                              fontSize: "12px",
                              fontWeight: "normal",
                              backgroundColor:
                                c.paymentStatus === "paid"
                                  ? "#16a34a"
                                  : c.paymentStatus === "pending"
                                    ? "#f59e0b"
                                    : "#d1d5db",
                              color: c.paymentStatus === "pending" ? "white" : "white",
                              borderRadius: "8px",
                            }}
                          >
                            {c.paymentStatus === "paid" && <FaMoneyBillWave />}
                            {c.paymentStatus === "pending" && <FaClock />}

                            {c.paymentStatus?.charAt(0).toUpperCase() + c.paymentStatus?.slice(1)}
                          </span>
                        </td>
                        <td><p className="mb-0 text-left tableData">{c.upfront || "-"}</p></td>
                        <td><p className="mb-0 text-left tableData">{c.contracted || "-"}</p></td>
                        <td>
                          <p className="mb-0 text-left tableData">
                            {c.collectedPayments[0]?.amount || 0} (
                            {c.collectedPayments[0]?.date ? new Date(c.collectedPayments[0].date).toLocaleDateString() : "N/A"})
                          </p>
                        </td>
                        <td>
                          <p className="mb-0 text-left tableData">
                            {c.collectedPayments[1]?.amount || 0} (
                            {c.collectedPayments[1]?.date ? new Date(c.collectedPayments[1].date).toLocaleDateString() : "N/A"})
                          </p>
                        </td>
                        <td>
                          <p className="mb-0 text-left tableData">
                            {c.collectedPayments[2]?.amount || 0} (
                            {c.collectedPayments[2]?.date ? new Date(c.collectedPayments[2].date).toLocaleDateString() : "N/A"})
                          </p>
                        </td>
                        <td><p className="mb-0 text-left tableData">{c.percentage || "-"}</p></td>
                        <td><p className="mb-0 text-left tableData">{c.jobGuarantee ? "Yes" : "No"}</p></td>
                        <td><p className="mb-0 text-left tableData">{formatDateTimeIST(c.createdAt)}</p></td>
                        <td className="text-center">
                          <span
                            className="badge d-flex align-items-center justify-content-center gap-2 px-3 py-1"
                            style={{
                              fontSize: "12px",
                              backgroundColor: c.movedToTraining ? "#16a34a" : "#f59e0b",
                              color: "white",
                              borderRadius: "8px",
                              fontWeight: "normal",
                            }}
                          >
                            <i
                              className={c.movedToTraining ? "bi bi-check-circle" : "bi bi-clock"}
                              style={{ fontSize: "14px" }}
                            ></i>
                            {c.movedToTraining ? "Done" : "Not Yet"}
                          </span>
                        </td>

                        <td className="d-flex">
                          <button className="btn btn-sm btn-warning me-2" onClick={() => updateStage(c._id, "training")} disabled={c.movedToTraining}>{c.movedToTraining ? "Moved" : "Move to Resume"}</button>
                          <button
                            className="btn btn-sm me-2 d-flex align-items-center"
                            style={{
                              backgroundColor: "#2563eb",
                              color: "white",
                              fontWeight: "normal",
                              borderRadius: "6px",
                              border: "none",
                              transition: "0.3s ease",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                            data-bs-toggle="modal"
                            data-bs-target="#viewLead"
                            onClick={() => {
                              setSelectedLead(c);
                              setModalSource("enrolled");
                            }}
                          >
                            <i className="bi bi-eye-fill me-2"></i> View Lead
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="mb-0 text-center tableData">
                        No enrolled candidates found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
      }

      {/* All Training Leads */}
      {/* {user.role === "Resume" && (
        <div className="col-12 col-md-8 col-lg-12 mt-2">
          <div className="rounded-4 bg-white shadow-sm p-4 table-responsive h-100">
            <div className="d-flex justify-content-between align-items-center px-3 mt-2 mb-3">
              <div>
                <h5 className="text-left leadManagementTitle mt-4">All Untouched Leads({counts.training})</h5>
                <h6 className="leadManagementSubtitle mb-3">Active Leads</h6>
              </div>
            </div>

            <div className="table-container">
              <table className="table table-hover table-striped table-bordered table-responsive align-middle rounded-5 mb-0 bg-white">
                <thead className="bg-light">
                  <tr>
                    <th className="text-left tableHeader">#</th>
                    <th className="text-left tableHeader">Name</th>
                    <th className="text-left tableHeader">Email</th>
                    <th className="text-left tableHeader">Phone</th>
                    <th className="text-left tableHeader">Start Date</th>
                    <th className="text-left tableHeader">Training Progress</th>
                    <th className="text-left tableHeader">Training Status</th>
                    <th className="text-left tableHeader">Start</th>
                    <th className="text-left tableHeader">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trainingLeads.map((t, i) => (
                    <tr key={t._id}>
                      <td className="mb-0 text-left tableData">{i + 1}</td>
                      <td className="mb-0 text-left tableData">{t.name || "N/A"}</td>
                      <td className="mb-0 text-left tableData">{t.email || "N/A"}</td>
                      <td className="mb-0 text-left tableData">{t.phone || "N/A"}</td>
                      <td className="mb-0 text-left tableData">{formatDateTimeIST(t.startDate) || "N/A"}</td>
                      <td className="mb-0 text-left tableData">{t.progress || "N/A"}</td>
                      <td className="mb-0 text-left tableData">{t.status || "N/A"}</td>
                      <td>
                        <button className="btn btn-sm btn-success">Start</button>
                        <button className="btn btn-sm btn-success me-2" onClick={() => updateStage(t._id, "cv")}>Start</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(t._id)}>Delete</button>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-success">View Lead</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )} */}

      {/* All Cvs Table */}
      {/* {user.role === "Resume" && (
        <div className="col-12 col-md-8 col-lg-12 mt-2">
          <div className="rounded-4 bg-white shadow-sm p-4 table-reponsive h-100">
            <div className="d-flex justify-content-between align-items-center px-3 mt-2 mb-3">
              <div>
                <h5 className="text-left leadManagementTitle mt-4">CVs({counts.cv})</h5>
                <h6 className="leadManagementSubtitle mb-3">Active cvs</h6>
              </div>
            </div>

            <div className="table-container">
              <table className="table table-hover table-striped table-bordered table-responsive align-middle rounded-5 mb-0 bg-white">
                <thead className="bg-light">
                  <tr>
                    <th className="text-left tableHeader">#</th>
                    <th className="text-left tableHeader">Name</th>
                    <th className="text-left tableHeader">Email</th>
                    <th className="text-left tableHeader">Phone</th>
                    <th className="text-left tableHeader">Start Date</th>
                    <th className="text-left tableHeader">CV Progress</th>
                    <th className="text-left tableHeader">CV Status</th>
                    <th className="text-left tableHeader">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cvLeads.map((t, i) => (
                    <tr key={t._id}>
                      <td className="mb-0 text-left tableData">{i + 1}</td>
                      <td className="mb-0 text-left tableData">{t.candidateId?.name || "N/A"}</td>
                      <td className="mb-0 text-left tableData">{t.candidateId?.email || "N/A"}</td>
                      <td className="mb-0 text-left tableData">{t.candidateId?.phone || "N/A"}</td>
                      <td className="mb-0 text-left tableData">{formatDateTimeIST(t.startDate) || "N/A"}</td>
                      <td className="mb-0 text-left tableData">{t.progress || "N/A"}</td>
                      <td className="mb-0 text-left tableData">{t.status || "N/A"}</td>
                      <td>
                        <button className="btn btn-sm btn-success">View Lead</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )} */}

      {/* All Untouched Leads */}
      {
        user.role === "Resume" && (
          <div className="col-12 col-md-8 col-lg-12 mt-2">
            <div className="rounded-4 bg-white shadow-sm p-4 table-reponsive h-100">
              <div className="d-flex flex-wrap justify-content-between align-items-center px-3 mt-2 mb-3">
                <div className="mb-2 mb-md-0">
                  <h5 className="text-left leadManagementTitle mt-4">Untouched Leads({counts.untouched})</h5>
                  <h6 className="leadManagementSubtitle mb-3">Active Untouched Leads</h6>
                </div>

                <div className="d-flex flex-wrap align-items-center gap-2">
                  <div className="input-group input-group-sm search w-auto">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      placeholder="Search..."
                      className="form-control form-control-sm border-start-0"
                      value={untouchedFilters.search}
                      onChange={(e) =>
                        setUntouchedFilters({ ...untouchedFilters, search: e.target.value })
                      }
                    />
                  </div>
                  <button
                    className="btn btn-outline-danger btn-sm me-2 refresh" onClick={handleRefresh} >
                    <FaSync className="me-1" /> Refresh
                  </button>
                </div>
              </div>

              <div className="table-container table-responsive">
                <table className="table table-hover table-striped table-bordered align-middle rounded-5 mb-0 bg-white">
                  <thead className="bg-light">
                    <tr>
                      <th className="text-left tableHeader">#</th>
                      <th className="text-left tableHeader">Name</th>
                      <th className="text-left tableHeader">Email</th>
                      <th className="text-left tableHeader">Phone</th>
                      {/* <th className="text-left tableHeader">Start Date</th>
                  <th className="text-left tableHeader">CV Progress</th>
                  <th className="text-left tableHeader">CV Status</th> */}
                      <th className="text-left tableHeader">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUntouchedLeads.length > 0 ? (
                      filteredUntouchedLeads.map((t, i) => (
                        <tr key={t._id}>
                          <td className="mb-0 text-left tableData">{i + 1}</td>
                          <td className="mb-0 text-left tableData">{t.name || "N/A"}</td>
                          <td className="mb-0 text-left tableData">{t.email || "N/A"}</td>
                          <td className="mb-0 text-left tableData">{t.phone || "N/A"}</td>
                          <td>
                            <button className="btn btn-sm btn-success" onClick={() => handleStart(t._id)}>Start Work</button>
                            <button
                              className="btn btn-sm btn-success ms-2"
                              data-bs-toggle="modal"
                              data-bs-target="#viewLead"
                              onClick={() => {
                                setTimeout(() => {
                                  setSelectedLead(t);
                                  setModalSource("untouched");
                                }, 600);
                              }}
                            >
                              View Lead
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center tableData">
                          No untouched leads found....
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      }

      {showOutcomeModal && (
        <div
          className="modal-overlay d-flex align-items-center justify-content-center"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
          }}
        >
          <div
            className="bg-white p-4 rounded shadow"
            style={{ width: "400px", maxWidth: "90%" }}
          >
            <h5 className="text-center mb-3">Log Call Outcome</h5>

            <select
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              className="form-select form-select-sm mb-2"
            >
              <option value="">Select Outcome</option>
              <option value="In Discussion">In Discussion</option>
              <option value="Verification">Verification</option>
              <option value="Final">Final</option>
            </select>

            {/* <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="form-control form-control-sm mb-2 selectFont"
            /> */}

            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Enter Duration (e.g., 12 mins)"
              required
              className="form-control form-control-sm mb-2 selectFont"
            />

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter notes..."
              className="form-control form-control-sm mb-3"
            />

            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowOutcomeModal(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleSaveOutcome}>
                Save Outcome
              </button>
            </div>
          </div>

        </div>
      )}

      {/* All Touched Leads */}
      {
        user.role === "Resume" && (
          <div className="col-12 col-md-8 col-lg-12 mt-2">
            <div className="rounded-4 bg-white shadow-sm p-4 table-reponsive h-100">
              <div className="d-flex flex-wrap justify-content-between align-items-center px-3 mt-2 mb-3">
                <div className="mb-2 mb-md-0">
                  <h5 className="text-left leadManagementTitle mt-4">Touched Leads({counts.touched})</h5>
                  <h6 className="leadManagementSubtitle mb-3">Active Touched Leads</h6>
                </div>

                <div className="d-flex flex-column flex-md-row align-items-md-center gap-2 w-md-auto">
                  <div className="input-group input-group-sm search flex-nowrap w-md-auto">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      placeholder="Search..."
                      className="form-control form-control-sm border-start-0"
                      value={touchedFilters.search}
                      onChange={(e) =>
                        setTouchedFilters({ ...touchedFilters, search: e.target.value })
                      }
                    />
                  </div>
                </div>

              </div>

              <div className="table-container">
                <table className="table table-hover table-striped table-bordered table-responsive align-middle rounded-5 mb-0 bg-white">
                  <thead className="bg-light">
                    <tr>
                      <th className="text-left tableHeader">
                        <div className="d-flex align-items-start justify-content-center flex-column">
                          <label htmlFor="selectAllTouchedCheckbox" className="form-label">
                            Select All
                          </label>
                          <input
                            type="checkbox"
                            checked={selectAllTouched}
                            onChange={(e) => handleSelectAllTouched(e, "touched")}
                          />
                        </div>
                      </th>
                      <th className="text-left tableHeader">#</th>
                      <th className="text-left tableHeader">Name</th>
                      <th className="text-left tableHeader">Email</th>
                      <th className="text-left tableHeader">Phone</th>
                      <th className="text-left tableHeader">Status</th>
                      <th className="text-left tableHeader">Timeline</th>
                      <th className="text-left tableHeader">Start Date</th>
                      <th className="text-left tableHeader">End Date</th>
                      {/* <th className="text-left tableHeader">Start Date</th>
                  <th className="text-left tableHeader">CV Progress</th>
                  <th className="text-left tableHeader">CV Status</th> */}
                      <th className="text-left tableHeader">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTouchedLeads.length > 0 ? (
                      filteredTouchedLeads.map((t, i) => (
                        <tr key={t._id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedTouchedLeads.includes(t._id)}
                              onChange={() => toggleLeadSelection(t._id, "touched")}
                            />
                          </td>
                          <td className="mb-0 text-left tableData">{i + 1}</td>
                          <td className="mb-0 text-left tableData">{t.name || "N/A"}</td>
                          <td className="mb-0 text-left tableData">{t.email || "N/A"}</td>
                          <td className="mb-0 text-left tableData">{t.phone || "N/A"}</td>
                          <td className="mb-0 text-left tableData">{getStatusBadge(t.status)}</td>
                          <td className="mb-0 text-left tableData">
                            <div className="progress-container" style={{ position: "relative" }}>
                              <div
                                className="progress-bar"
                                style={{
                                  width: `${getProgress(t)}%`,
                                  backgroundColor: getColor(getProgress(t)),
                                  height: "20px",
                                }}
                              ></div>
                              <span
                                style={{
                                  position: "absolute",
                                  left: "50%",
                                  top: "50%",
                                  transform: "translate(-50%, -50%)",
                                  fontWeight: "bold",
                                  color: getTextColor(getProgress(t)),
                                }}
                              >
                                {getProgress(t)}%
                              </span>
                            </div>
                          </td>
                          <td className="mb-0 text-left tableData">
                            {t.startDate ? new Date(t.startDate).toLocaleString() : "N/A"}
                          </td>
                          <td className="mb-0 text-left tableData">
                            {t.endDate ? new Date(t.endDate).toLocaleString() : "N/A"}
                          </td>
                          <td className="mb-0 text-left tableData">
                            {t.startDate ? (
                              t.endDate ? (
                                <button className="btn btn-sm btn-bg-muted" disabled>
                                  Done
                                </button>
                              ) : (
                                <button className="btn btn-sm btn-primary" onClick={() => handleDone(t._id)}>
                                  Done
                                </button>
                              )
                            ) : (
                              <button className="btn btn-sm btn-success" onClick={() => handleStartWork(t._id)}>
                                Start
                              </button>
                            )}
                            {/* <button
                              className="btn btn-sm btn-success ms-2"
                              data-bs-toggle="modal"
                              data-bs-target="#viewLead"
                              onClick={() => {
                                setSelectedLead(t);
                                setModalSource("touched");
                              }}
                            >
                              View Lead
                            </button> */}
                            <button
                              className="btn btn-sm btn-success ms-2"
                              data-bs-toggle="modal"
                              data-bs-target="#viewLead"
                              onClick={() => {
                                setTimeout(() => {
                                  console.log("Selected Lead in modal", t);
                                  setSelectedLead(t);
                                  setModalSource("touched");
                                }, 600);
                              }}
                            >
                              View Lead
                            </button>

                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={10} className="text-center tableData">
                          No touched leads found
                        </td>
                      </tr>
                    )}
                  </tbody>

                </table>
              </div>
            </div>
          </div>
        )
      }

      {/* Completed Leads */}
      {
        user.role === "Resume" && (
          <div className="col-12 col-md-8 col-lg-12 mt-2">
            <div className="rounded-4 bg-white shadow-sm p-4 table-reponsive h-100">
              <div className="d-flex flex-wrap justify-content-between align-items-center px-3 mt-2 mb-3">
                <div className="mb-2 mb-md-0">
                  <h5 className="text-left leadManagementTitle mt-4">Completed Leads({counts.completed})</h5>
                  <h6 className="leadManagementSubtitle mb-3">Active Completed Leads</h6>
                  {selectedCompletedLeads.length > 0 && (
                    <h6 className="tableHeader">
                      Selected Leads : {selectedCompletedLeads.length}
                    </h6>
                  )}
                </div>
                <div className="d-flex flex-column flex-md-row align-items-md-center gap-2 w-md-auto">
                  <div className="input-group input-group-sm search flex-nowrap w-md-auto w-100">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      placeholder="Search..."
                      className="form-control form-control-sm"
                      value={completedFilters.search}
                      onChange={(e) => setCompletedFilters({ ...completedFilters, search: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="table-container">
                <table className="table table-hover table-striped table-bordered table-responsive align-middle rounded-5 mb-0 bg-white">
                  <thead className="bg-light">
                    <tr>
                      <th className="text-left tableHeader">
                        <div className="d-flex align-items-start justify-content-center flex-column">
                          <label htmlFor="selectAllCompletedCheckbox" className="form-label">
                            Select All
                          </label>
                          <input
                            type="checkbox"
                            checked={selectAllCompleted}
                            onChange={(e) => handleSelectAllCompleted(e, "completed")}
                          />
                        </div>
                      </th>
                      <th className="text-left tableHeader">#</th>
                      <th className="text-left tableHeader">Name</th>
                      <th className="text-left tableHeader">Email</th>
                      <th className="text-left tableHeader">Phone</th>
                      <th className="text-left tableHeader">Status</th>
                      <th className="text-left tableHeader">Timeline</th>
                      <th className="text-left tableHeader">Start Date</th>
                      <th className="text-left tableHeader">End Date</th>
                      {/* <th className="text-left tableHeader">Start Date</th>
                  <th className="text-left tableHeader">CV Progress</th>
                  <th className="text-left tableHeader">CV Status</th> */}
                      <th className="text-left tableHeader">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCompletedLeads
                      .map((t, i) => (
                        <tr key={t._id}>
                          <td>
                            <input type="checkbox"
                              checked={selectedCompletedLeads.includes(t._id)}
                              onChange={() => toggleLeadSelection(t._id, "completed")}
                            />
                          </td>
                          <td className="mb-0 text-left tableData">{i + 1}</td>
                          <td className="mb-0 text-left tableData">{t.name || "N/A"}</td>
                          <td className="mb-0 text-left tableData">{t.email || "N/A"}</td>
                          <td className="mb-0 text-left tableData">{t.phone || "N/A"}</td>
                          <td className="mb-0 text-left tableData">
                            {getStatusBadge(t.status)}
                          </td>
                          <td className="mb-0 text-left tableData">
                            <div className="progress-container">
                              <div className="progress-bar"
                                style={{
                                  width: getWidth(getProgress(t)),
                                  backgroundColor: getColor(getProgress(t)),
                                  color: getTextColor(getProgress(t))
                                }}
                              >{getProgress(t) > 0 && `${getProgress(t)}%`}
                              </div>
                            </div>
                          </td>
                          <td className="mb-0 text-left tableData">
                            {t.startDate ? new Date(t.startDate).toLocaleString() : "N/A"}
                          </td>
                          <td className="mb-0 text-left tableData">
                            {t.endDate ? new Date(t.endDate).toLocaleString() : "N/A"}
                          </td>
                          <td className="mb-0 text-left tableData">
                            {t.startDate ? (
                              t.endDate ? (
                                <button
                                  className="btn btn-sm btn-bg-muted"
                                  disabled>
                                  Done
                                </button>
                              ) : (
                                <button
                                  className="btn btn-sm btn-primary"
                                  onClick={() => handleDone(t._id)}
                                >
                                  Done
                                </button>
                              )
                            ) : (
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleStartWork(t._id)}
                              >
                                Start
                              </button>

                            )}
                            <button className="btn btn-sm btn-success ms-2" data-bs-toggle="modal" data-bs-target="#viewLead" onClick={() => {
                              setSelectedLead(t);
                              setModalSource("completed");
                            }}>View Lead</button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      }

    </div >
  )
}

export default Leads