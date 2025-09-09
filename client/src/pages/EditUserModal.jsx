import React from "react";
import { useState } from "react";

const EditUserModal = ({ editUser, roles = [], onChange, onUpdate, onClose }) => {

    const [showEditModal, setShowEditModal] = useState(false);

    return (
        // <div className="modal fade" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className={`modal fade ${showEditModal ? "show d-block" : ""}`} tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-sm" role="document">
                <div className="modal-content">
                    <div className="modal-body p-0">
                        <div className="card card-plain">
                            <h3 className="modal-title editUserTitle mt-5">Edit User</h3>
                            <div className="card-body">
                                <form role="form text-left">
                                    <label>Email</label>
                                    <div className="input-group mb-3">
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control form-control-sm"
                                            placeholder="Email"
                                            value={editUser.email}
                                            onChange={onChange}
                                        />
                                    </div>

                                    <label>Password</label>
                                    <div className="input-group mb-3">
                                        <input
                                            type="text"
                                            name="plainPassword"
                                            className="form-control form-control-sm"
                                            placeholder="Password"
                                            value={editUser.plainPassword}
                                            onChange={onChange}
                                        />
                                    </div>

                                    <label>Role</label>
                                    <div className="input-group mb-3">
                                        <select
                                            name="role"
                                            className="form-select form-select-sm"
                                            value={editUser.role}
                                            onChange={onChange}
                                        >
                                            {roles.map(r => (
                                                <option key={r._id} value={r._id}>{r.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="text-center">
                                        <button
                                            type="button"
                                            className="btn btn-success btn-sm w-100 mt-2 mb-0"
                                            onClick={onUpdate}
                                        >
                                            Update
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <p className="editFooterText mx-auto mb-5">
                                Changed your mind?{" "}
                                <span
                                    onClick={onClose}
                                    className="text-success text-gradient font-weight-bold ms-1 editUserCancel"
                                    style={{ cursor: "pointer" }}
                                >
                                    Cancel
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditUserModal;
