// import React from 'react'
// import { useState } from 'react';

// const AddUserModal = () => {

//     const [roles, setRoles] = useState([]);
//     const [newUser, setNewUser] = useState({ email: "", password: "", role: "Admin" });

//     const handleNewUserChange = (e) => {
//         const { name, value } = e.target;
//         setNewUser(pre => ({ ...pre, [name]: value }));
//     }

//     const handleAddUser = async () => {
//         try {
//             const payload = {
//                 email: newUser.email,
//                 password: newUser.password,
//                 role: newUser.role
//             };
//             const res = await axios.post("http://localhost:5000/api/auth/users", payload);
//             setUsers([...users, res.data]);
//             Modal.getInstance(document.getElementById("addUserModal")).hide();
//         } catch (error) {
//             if (error.response) {
//                 console.error("Backend error:", error.response.data);
//             } else {
//                 console.error(error);
//             }
//         }
//     };

//     return (
//         <div>
//             <div className="modal fade" id="addUserModal" tabIndex="-1">
//                 <div className="modal-dialog">
//                     <div className="modal-content">
//                         <div className="modal-header">
//                             <h5 className="modal-title">Add User</h5>
//                             <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
//                         </div>
//                         <div className="modal-body">
//                             <input name="email" value={newUser.email} onChange={handleNewUserChange} className="form-control mb-2" placeholder="Email" />
//                             <input name="password" value={newUser.password} onChange={handleNewUserChange} className="form-control mb-2" placeholder="Password" />
//                             <select name="role" value={newUser.role} onChange={handleNewUserChange} className="form-select mb-2">
//                                 {roles.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
//                             </select>
//                         </div>
//                         <div className="modal-footer">
//                             <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
//                             <button type="button" className="btn btn-success" onClick={handleAddUser}>Add</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default AddUserModal