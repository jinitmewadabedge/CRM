import React, { useEffect, useState } from 'react'
import axios from 'axios'

const SalesDashboard = () => {

  const [leads, setLeads] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedMember, setSelectedMember] = useState("");
  const [assignedLeads, setAssignedLeads] = useState([]);
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  // const fetchAllLeads = async () => {
  //   try {
  //     const token = sessionStorage.getItem("token");
  //     const res = await axios.get(`${BASE_URL}/api/leads`, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     console.log("All Leads:", res.data);
  //   } catch (error) {
  //     console.error("Error fetching all leads:", error.response?.data || error);
  //   }
  // }

  // const fetchLeads = async () => {
  //   const loggedInUser = JSON.parse(sessionStorage.getItem("user"));
  //   const roleName = loggedInUser?.role?.name;
  //   const token = sessionStorage.getItem("token");

  //   try {
  //     if (roleName === "Lead_Gen_Manager" || roleName === "Sales") {
  //       const unassignedRes = await axios.get(`${BASE_URL}/api/leads/unassigned`, {
  //         headers: { Authorization: `Bearer ${token}` }
  //       });
  //       setLeads(unassignedRes.data);
  //       console.log("Unassigned Leads:", unassignedRes.data);
  //     } else {
  //       setLeads([]);
  //     }

  //     const assignedRes = await axios.get(`${BASE_URL}/api/leads/assigned`, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     setAssignedLeads(assignedRes.data);
  //     console.log("Assigned Leads:", assignedRes.data);
  //   } catch (error) {
  //     console.error("Error fetching leads:", error.response?.data || error);
  //   }
  // }

  const fetchUnassignedLeads = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/leads/unassigned`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeads(res.data);
      console.log("Unassigned Leads:", res.data);
    } catch (error) {
      console.error("Error fetching unassigned leads:", error.response?.data || error);
    }
  };

  const fetchAssignedLeads = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/leads/assigned`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Assigned leads:", res.data);
      setAssignedLeads(res.data);
    } catch (error) {
      console.error("Error fetching assigned leads:", error.response?.data || error);
    }
  }

  const fetchTeamMember = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/auth/users`);
      console.log("Team members response:", res.data);
      setTeamMembers(res.data);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  // const fetchLeadById = async (leadId) => {
  //   try {
  //     const token = sessionStorage.getItem("token");
  //     const res = await axios.get(`${BASE_URL}/api/leads/leads/${leadId}`, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     console.log("Lead details:", res.data);
  //   } catch (error) {
  //     console.error("Error fethcing lead by ID:", error.response?.data || error);
  //   }
  // }

  useEffect(() => {
    fetchUnassignedLeads();
    fetchAssignedLeads();
    // fetchLeads();
    fetchTeamMember();
  }, []);

  const handleAssign = async () => {

    if (!selectedLead || !selectedMember) return;

    const token = sessionStorage.getItem("token");

    console.log("Sending token to backend:", token);

    console.log("Selected Lead ID:", selectedLead, "Selected Member ID:", selectedMember);

    try {
      const loggedInUser = JSON.parse(sessionStorage.getItem("user"));
      const roleName = loggedInUser?.role?.name;

      const managerId = loggedInUser?._id;

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

      setSelectedLead(null);
      setSelectedMember("");
      fetchUnassignedLeads();
      fetchAssignedLeads();
      // fetchLeads();
    } catch (error) {
      console.error("Error assigning lead:", error);
      alert("Failed to assign lead. Check console for more details")
    }
  };

  return (
    <div>
      <h2>Unassigned Leads</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id}>
              <td>{lead.candidate_name}</td>
              <td>{lead.candidate_email}</td>
              <td>{lead.candidate_phone_no}</td>
              <td>
                <button onClick={() => setSelectedLead(lead._id)}>
                  Assign
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedLead && (
        <div style={{ border: "1px solid black", padding: "10px", marginTop: "20px" }}>
          <h3>Assign Lead</h3>
          <select
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
          >
            <option value="">Select Team Member</option>
            {teamMembers
              .filter((member) => member.role?.name === "Sales")
              .map((member) => (
                <option key={member._id} value={member._id}>{member.name}</option>
              ))}
          </select>
          <button onClick={handleAssign} disabled={!selectedMember}>Confirm Assign</button>
          <button onClick={() => setSelectedLead(null)}>Cancel</button>
        </div>
      )}

      <h2>Assigned Leads</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Assigned To</th>
            <th>Assigned By</th>
          </tr>
        </thead>
        <tbody>
          {assignedLeads.map((lead) => (
            <tr key={lead._id}>
              <td>{lead.candidate_name}</td>
              <td>{lead.candidate_email}</td>
              <td>{lead.candidate_phone_no}</td>
              <td>{lead.assignedTo?.name}</td>
              <td>{lead.assignedBy?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}

export default SalesDashboard