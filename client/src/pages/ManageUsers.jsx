import { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import UsersImg from "../assets/Lead_Img.png"
import { FaEye, FaSync, FaEyeSlash, FaPlus, FaDownload, FaUserAlt, FaUserCircle, FaArrowUp } from "react-icons/fa";
import * as XLSX from 'xlsx';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedEmail, setSelectedEmail] = useState("");
  const [editUser, setEditUser] = useState({ _id: "", name: "", email: "", plainPassword: "", role: "" });
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "Admin" });
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    axios.get(`${BASE_URL}/api/auth/users`)
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));

    const res = axios.get(`${BASE_URL}/api/roles`)
      .then(res => setRoles(res.data))
      .catch(err => console.error(err));
  }, []);

  const filteredUsers = users.filter(user => {
    const roleMatch = selectedRole === "All" || user.role?.name === selectedRole;
    const emailMatch = user.email?.toLowerCase().includes(selectedEmail.toLowerCase());
    return roleMatch && emailMatch;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser(pre => ({ ...pre, [name]: value }));
  }

  const handleEditClick = (user) => {
    setEditUser({
      _id: user._id,
      name: user.name || "",
      email: user.email,
      plainPassword: user.plainPassword,
      role: user.role && typeof user.role === 'object' ? user.role._id : user.role
    });
  };

  const handleAddClick = () => {
    setNewUser({ name: "", email: "", password: "", role: "Admin" });
  };

  // const handleRefresh = async () => {
  //   try {
  //     const res = await axios.get("/api/users");
  //     console.log(res.data);
  //     const usersArray = Array.isArray(res.data) ? res.data : res.data.users;
  //     setUsers(usersArray);
  //   } catch (err) {
  //     console.error("Error refreshing users:", err);
  //   }
  // };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/auth/users`);
      console.log("User Data:", res.data);
      setUsers(res.data);
    } catch (err) {
      console.error("Error refreshing users:", err);
    } finally {
      setLoading(false);
    }
  };



  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role
      };
      console.log("Payload sending:", payload);
      const res = await axios.post(`${BASE_URL}/api/auth/users`, payload);
      setUsers([...users, res.data]);
      Modal.getInstance(document.getElementById("addUserModal")).hide();
    } catch (error) {
      if (error.response) {
        console.error("Backend error:", error.response.data);
      } else {
        console.error(error);
      }
    }
  };


  const handleChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        name: editUser.name,
        email: editUser.email,
        plainPassword: editUser.plainPassword,
        role: editUser.role
      }
      const res = await axios.put(
        `${BASE_URL}/api/auth/users/${editUser._id}`,
        payload
      );
      setUsers(prev => prev.map(u => (u._id === editUser._id ? res.data : u)));
      Modal.getInstance(document.getElementById("editUserModal")).hide();
    } catch (err) {
      if (err.response) {
        console.error("Backend error:", err.response.data);
      } else {
        console.error(err);
      }
    }
    handleRefresh();
  };

  const handleImportExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const usersData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      console.log("Parsed usersData:", usersData);

      try {
        await axios.post(`${BASE_URL}/api/auth/users/import`, {
          users: usersData,
        });
        alert("Excel Imported Successfully");

        const res = await axios.get(`${BASE_URL}/api/auth/users`);
        setUsers(res.data);
      } catch (error) {
        console.error("Excel Import Error:", error.response?.data || error.message);
        alert("Error importing Excel");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/auth/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const exportToCSV = () => {
    const headers = ["Email", "Password", "Role"];
    const rows = users.map(u => [
      u.email,
      u.plainPassword || "••••••••",
      u.role?.name || "N/A"
    ]);
    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" +
      rows.map(r => r.map(val => `"${val}"`).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container-fluid mt-5 px-5">
      <div className="row g-5">
        <h4 className='mt-4 text-left adminDashboardTitle'>Hello Admin <img src={UsersImg} alt="Users" className="mb-2" style={{ width: "40px", border: "0px solid green", borderRadius: "20px" }} /> ,</h4>
        <div className="col-12 col-md-4 m-0 mb-2">
          <div className="rounded-4 bg-white shadow-sm py-4 h-100">
            <div className="d-flex flex-column flex-md-row align-items-center text-center text-md-start gap-3 px-3">
              <img src={UsersImg} alt="Users" className="mb-2 img-fluid" />
              <div>
                <h6 className="mb-1 text-muted">Total Users</h6>
                <h4 className="fw-bold">{users.length}</h4>
                <small className="text-success">▲ 16% this month</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4 m-0 mb-2">
          <div className="rounded-4 bg-white shadow-sm py-4 h-100">
            <div className="d-flex flex-column flex-md-row align-items-center text-center text-md-start gap-3 px-3">
              <img src={UsersImg} alt="Users" className="mb-2 img-fluid" />
              <div>
                <h6 className="mb-1 text-muted">Total Users</h6>
                <h4 className="fw-bold">{users.length}</h4>
                <small className="text-success">▲ 16% this month</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4 m-0 mb-2">
          <div className="rounded-4 bg-white shadow-sm py-4 h-100">
            <div className="d-flex flex-column flex-md-row align-items-center text-center text-md-start gap-3 px-3">
              <img src={UsersImg} alt="Users" className="mb-2 img-fluid" />
              <div>
                <h6 className="mb-1 text-muted">Total Users</h6>
                <h4 className="fw-bold">{users.length}</h4>
                <small className="text-success">▲ 16% this month</small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-8 col-lg-12 mt-2">
          <div className="rounded-4 bg-white shadow-sm p-4 table-responsive h-100">
            <div className="d-flex justify-content-between align-items-center px-3 mt-2 mb-3">
              <div>
                <h5 className="leadManagementTitle">All Users</h5>
                <h6 className="leadManagementSubtitle mb-3">Active Users</h6>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3 px-3">
              <div className="d-flex gap-2 flex-wrap">
                <select
                  className="form-select form-select-sm w-auto roleSelect"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="All">All Roles</option>
                  {roles.map(r => (
                    <option key={r._id} value={r.name}>{r.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Search by Email"
                  className="form-control form-control-sm w-auto emailInput"
                  value={selectedEmail}
                  onChange={(e) => setSelectedEmail(e.target.value)}
                />
              </div>

              <div className="adminButtons">
                <button className="btn btn-primary btn-sm me-2 addUserBtn addUser" data-bs-toggle="modal" data-bs-target="#addUserModal" onClick={handleAddClick}>
                  <FaPlus className="me-2" /> Add User
                </button>

                <button className="btn btn-outline-success btn-sm me-2 importCsv" onClick={() => document.getElementById("csvInput").click()}> <FaDownload className="me-2" />Import CSV</button>

                <input type="file" id="csvInput" accept=".csv,.xlsx,.xls" style={{ display: "none" }} onChange={handleImportExcel} />

                <button className="btn btn-outline-primary btn-sm exportBtn" onClick={exportToCSV}>
                  <FaArrowUp />  Export CSV
                </button>

                <button
                  className="btn btn-outline-danger btn-sm ms-2 refresh" onClick={handleRefresh} >
                  <FaSync className="me-1" /> Refresh
                </button>

              </div>
            </div>

            {loading ? (
              <div className="text-center mt-3">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p>Loading User....</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="table table-hover table-responsive align-middle rounded-5 mb-0 bg-white">
                  <thead className="bg-light">
                    <tr>
                      <th className="text-left tableHeader">Name</th>
                      <th className="text-left tableHeader">Email</th>
                      <th className="text-left tableHeader">Password</th>
                      <th className="text-left tableHeader">Role</th>
                      <th className="text-left tableHeader">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.length > 0 ? currentUsers.map(user => (
                      <tr key={user._id}>
                        <td className="mb-0 text-left tableData">{user.name}</td>
                        <td className="mb-0 text-left tableData">{user.email}</td>
                        <td className="mb-0 text-left tableData">
                          {user.showPassword ? user.plainPassword : "••••••••••"}
                          <button
                            className="btn btn-sm ms-2 p-0"
                            onClick={() =>
                              setUsers(prev =>
                                prev.map(u => u._id === user._id ? { ...u, showPassword: !u.showPassword } : u)
                              )
                            }
                          >
                            {user.showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </td>
                        <td className="mb-0 text-left tableData">{user.role?.name || "N/A"}</td>
                        <td>
                          <button className="btn btn-outline-success btn-sm me-2" data-bs-toggle="modal" data-bs-target="#editUserModal" onClick={() => handleEditClick(user)}>Edit</button>
                          <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(user._id)}>Delete</button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="text-center py-4">No Users Found...</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            <div className="d-flex justify-content-end mt-3 gap-2">
              <button className="btn btn-sm btn-outline-primary" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`btn btn-sm ${currentPage === index + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button className="btn btn-sm btn-outline-primary" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT USER MODAL */}
      <div className="modal fade shadow-lg" id="editUserModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-sm" role="document">
          <div className="modal-content">
            <div className="modal-body p-0">
              <div className="card card-plain">
                <h3 className="modal-title editUserTitle mt-5">Edit User</h3>
                <div className="card-body">
                  <form role="form text-left">

                    <label htmlFor="" className="form-check-label">Name</label>
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        name="name"
                        className="form-control form-control-sm"
                        placeholder="Name"
                        value={editUser.name || ""}
                        onChange={handleChange} />
                    </div>

                    <label className="form-check-label">Email</label>
                    <div className="input-group mb-3">
                      <input
                        type="email"
                        name="email"
                        className="form-control form-control-sm"
                        placeholder="Email"
                        value={editUser.email}
                        onChange={handleChange}
                      />
                    </div>

                    <label className="form-check-label">Password</label>
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        name="plainPassword"
                        className="form-control form-control-sm"
                        placeholder="Password"
                        value={editUser.plainPassword}
                        onChange={handleChange}
                      />
                    </div>

                    <label className="form-check-label">Role</label>
                    <div className="input-group mb-3">
                      <select
                        name="role"
                        className="form-select form-select-sm "
                        value={
                          editUser.role && typeof editUser.role === "object"
                            ? editUser.role._id
                            : editUser.role || ""
                        }
                        onChange={handleChange}
                      >
                        {roles.map(r => (
                          <option key={r._id} value={r._id}>{r.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="text-center">
                      <button
                        type="button"
                        className="btn btn-round btn-success btn-sm w-100 mt-2 mb-0 btnColor"
                        onClick={handleUpdate}
                      >
                        Update
                      </button>
                    </div>
                  </form>
                </div>
                <p className="editFooterText mx-auto mb-5">
                  Changed your mind?
                  <a
                    href="javascript:;"
                    data-bs-dismiss="modal"
                    className="text-success text-gradient font-weight-bold ms-1 editUserCancel"
                  >
                    Cancel
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ADD USER MODAL  */}
      <div className="modal fade" id="addUserModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-sm" role="document">
          <div className="modal-content">
            <div className="modal-body p-0">
              <div className="card card-plain">
                <h3 className="modal-title editUserTitle mt-5">Add User</h3>
                <div className="card-body">
                  <label htmlFor="" className="form-check-label">Name</label>
                  <div className="input-group mb-3">
                    <input name="name" type="text" value={newUser.name} onChange={handleNewUserChange} className="form-control form-control-sm" placeholder="Name" />
                  </div>
                  <label htmlFor="" className="form-check-label">Email</label>
                  <div className="input-group mb-3">
                    <input name="email" type="email" value={newUser.email} onChange={handleNewUserChange} className="form-control form-control-sm" placeholder="Email" />
                  </div>
                  <form role="form text-left">
                    <label htmlFor="" className="form-check-label">Password</label>
                    <div className="input-group mb-3">
                      <input name="password" type="text" value={newUser.password} onChange={handleNewUserChange} className="form-control form-control-sm" placeholder="Password" />
                    </div>
                    <label htmlFor="" className="form-check-label">Role</label>
                    <div className="input-group mb-3">
                      <select name="role" value={newUser.role} onChange={handleNewUserChange} className="form-select form-select-sm mb-2">
                        {roles.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                      </select>
                    </div>
                    <div className="text-center">
                      <button type="button" className="btn btn-round btn-success btn-sm w-100 mt-2 mb-0 btnColor" onClick={handleAddUser}>Add User</button>
                    </div>
                  </form>
                </div>
                <p className="editFooterText mx-auto mb-5">
                  Changed your mind.?
                  <a href="javascript:;" data-bs-dismiss="modal" className="tezt-succes text-gradient font-weight-bold ms-1 editUserCancel">Cancel</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
export default AdminDashboard;
