// import React, { useEffect, useState } from "react"
// import { useParams, useNavigate } from "react-router-dom"
// import { getLeadById, updateLead } from "../../api/leadApi"

// const EditLead = () => {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const [formData, setFormData] = useState({
//     type: "",
//     candidate_name: "",
//     candidate_email: "",
//     candidate_phone_no: "",
//     linked_in_url: "",
//     university: "",
//     technology: "",
//     visa: "",
//     preferred_time_to_talk: "",
//     source: "",
//     status: ""
//   })

//   useEffect(() => {
//     async function fetchLead() {
//       try {
//         const res = await getLeadById(id)
//         setFormData(res.data)
//       } catch (error) {
//         console.error("Error fetching lead for edit:", error)
//       }
//     }
//     fetchLead()
//   }, [id]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     try {
//       await updateLead(id, formData)
//       alert("Lead updated successfully!")
//       navigate("/leads")
//     } catch (error) {
//       console.error("Error updating lead:", error)
//     }
//   }

//   return (
//     <div className="container mt-4">
//       <h2 className="text-center mb-4">Edit Lead</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <label>Lead Type</label>
//           <select
//             className="form-control"
//             name="type"
//             value={formData.type}
//             onChange={handleChange}
//           >
//             <option value="">Select Type</option>
//             <option value="Resume Lead">Resume Lead</option>
//             <option value="Manual Lead">Manual Lead</option>
//           </select>
//         </div>

//         <div className="mb-3">
//           <label>Candidate Name</label>
//           <input
//             type="text"
//             className="form-control"
//             name="candidate_name"
//             value={formData.candidate_name}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="mb-3">
//           <label>Email</label>
//           <input
//             type="email"
//             className="form-control"
//             name="candidate_email"
//             value={formData.candidate_email}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="mb-3">
//           <label>Phone</label>
//           <input
//             type="text"
//             className="form-control"
//             name="candidate_phone_no"
//             value={formData.candidate_phone_no}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="mb-3">
//           <label>LinkedIn URL</label>
//           <input
//             type="url"
//             className="form-control"
//             name="linked_in_url"
//             value={formData.linked_in_url}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="mb-3">
//           <label>University</label>
//           <input
//             type="text"
//             className="form-control"
//             name="university"
//             value={formData.university}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="mb-3">
//           <label>Technology</label>
//           <input
//             type="text"
//             className="form-control"
//             name="technology"
//             value={formData.technology}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="mb-3">
//           <label>Visa</label>
//           <input
//             type="text"
//             className="form-control"
//             name="visa"
//             value={formData.visa}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="mb-3">
//           <label>Preferred Time To Talk</label>
//           <input
//             type="text"
//             className="form-control"
//             name="preferred_time_to_talk"
//             value={formData.preferred_time_to_talk}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="mb-3">
//           <label>Source</label>
//           <input
//             type="text"
//             className="form-control"
//             name="source"
//             value={formData.source}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="mb-3">
//           <label>Status</label>
//           <select
//             className="form-control"
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//           >
//             <option value="">Select Status</option>
//             <option value="New">New</option>
//             <option value="Contacted">Connected</option>
//             <option value="In Progress">In Progress</option>
//             <option value="Shortlisted">Shortlisted</option>
//             <option value="Rejected">Rejected</option>
//             <option value="Converted">Converted</option>
//           </select>
//         </div>

//         <button type="submit" className="btn btn-primary">Save Changes</button>
//         <button
//           type="button"
//           className="btn btn-secondary ms-2"
//           onClick={() => navigate("/leads")}
//         >
//           Cancel
//         </button>
//       </form>
//     </div>
//   )
// }

// export default EditLead
