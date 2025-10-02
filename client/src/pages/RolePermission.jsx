import { useEffect, useState } from "react";
import axios from "axios";
import LeadImg from "../../src/assets/Lead_Img.png";

const RolePermission = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/roles`);
      setRoles(res.data);
    } catch (err) {
      console.error("Error fetching roles:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = async (roleId, entity, field, value) => {
    try {
      const updatedPermissions = { entity, field, value };
      console.log("Sending permission update:", updatedPermissions);

      const res = await axios.put(`${BASE_URL}/api/roles/${roleId}`, updatedPermissions);
      console.log("Backend response:", res.data);

      fetchRoles();
    } catch (err) {
      console.error("Error updating permission:", err);
    }
  };


  return (
    <div className="container-fluid mt-5 px-5" style={{ fontSize: "14px" }}>
      <div className="row g-5">
        <h5 className="mb-0">
          Roles & Permissions{" "}
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
        </h5>
      </div>
      <div className="col-12 col-md-8 col-lg-12 mt-2">
        <div className="rounded-4 bg-white shadow-sm p-4 table-responsive h-100">
          <div className="card-body">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="table-container">
                <table className="table table-hover table-responsive align-middle rounded-5 mb-0 bg-white">
                  <thead className="bg-light">
                    <tr>
                      <th className="text-left tableHeader">Role Name</th>
                      <th className="text-left tableHeader">Create Scope</th>
                      <th className="text-left tableHeader">Read Scope</th>
                      <th className="text-left tableHeader">Update Scope</th>
                      <th className="text-left tableHeader">Delete Scope</th>
                      <th className="text-left tableHeader">Assign To Sales</th>
                      <th className="text-left tableHeader">Bulk Add</th>
                      <th className="text-left tableHeader">Export</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map((role) => {
                      const isAdmin = role.name === "Admin";
                      return (
                        <tr key={role._id}>
                          <td>
                            <p className="mb-0 text-left tableData">
                              {role.name}
                            </p>
                          </td>

                          <td>
                            <select
                              className="form-select form-select-sm roles-form-select"
                              value={role.permissions?.lead?.createScope || "own"}
                              disabled={isAdmin}
                              onChange={(e) =>
                                handlePermissionChange(
                                  role._id,
                                  "lead",
                                  "createScope",
                                  e.target.value
                                )
                              }
                            >
                              <option value="none">None</option>
                              <option value="own">Own</option>
                              <option value="dept">Dept</option>
                              <option value="team+dept">Team+Dept</option>
                              <option value="all">All</option>
                            </select>
                          </td>

                          <td>
                            <select
                              className="form-select form-select-sm roles-form-select"
                              value={role.permissions?.lead?.readScope || "own"}
                              disabled={isAdmin}
                              onChange={(e) =>
                                handlePermissionChange(
                                  role._id,
                                  "lead",
                                  "readScope",
                                  e.target.value
                                )
                              }
                            >
                              <option value="none">None</option>
                              <option value="own">Own</option>
                              <option value="dept">Dept</option>
                              <option value="team+dept">Team+Dept</option>
                              <option value="all">All</option>
                            </select>
                          </td>

                          <td>
                            <select
                              className="form-select form-select-sm roles-form-select"
                              value={role.permissions?.lead?.updateScope || "own"}
                              disabled={isAdmin}
                              onChange={(e) =>
                                handlePermissionChange(
                                  role._id,
                                  "lead",
                                  "updateScope",
                                  e.target.value
                                )
                              }
                            >
                              <option value="own">Own</option>
                              <option value="dept">Dept</option>
                              <option value="team+dept">Team+Dept</option>
                              <option value="all">All</option>
                            </select>
                          </td>

                          <td>
                            <select
                              className="form-select form-select-sm roles-form-select"
                              value={role.permissions?.lead?.deleteScope || "none"}
                              disabled={isAdmin}
                              onChange={(e) =>
                                handlePermissionChange(
                                  role._id,
                                  "lead",
                                  "deleteScope",
                                  e.target.value
                                )
                              }
                            >
                              <option value="none">None</option>
                              <option value="own">Own</option>
                              <option value="dept">Dept</option>
                              <option value="team+dept">Team+Dept</option>
                              <option value="all">All</option>
                            </select>
                          </td>

                          <td className="text-center">
                            <input
                              type="checkbox"
                              checked={role.permissions?.lead?.assignToSales || false}
                              disabled={isAdmin}
                              onChange={(e) =>
                                handlePermissionChange(
                                  role._id,
                                  "lead",
                                  "assignToSales",
                                  e.target.checked
                                )
                              }
                            />
                          </td>

                          <td className="text-center">
                            <input
                              type="checkbox"
                              checked={role.permissions?.lead?.bulkAdd || false}
                              disabled={isAdmin}
                              onChange={(e) =>
                                handlePermissionChange(
                                  role._id,
                                  "lead",
                                  "bulkAdd",
                                  e.target.checked
                                )
                              }
                            />
                          </td>

                          <td className="text-center">
                            <input
                              type="checkbox"
                              checked={role.permissions?.lead?.export || false}
                              disabled={isAdmin}
                              onChange={(e) =>
                                handlePermissionChange(
                                  role._id,
                                  "lead",
                                  "export",
                                  e.target.checked
                                )
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolePermission;
