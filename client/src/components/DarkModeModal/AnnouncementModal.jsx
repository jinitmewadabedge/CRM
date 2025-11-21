import { useEffect } from "react";
import { Modal } from "bootstrap";
import Lottie from "lottie-react";
import darkModeAnimation from "../../assets/Day-Night.json"

export default function AnnouncementModal({ show }) {
  useEffect(() => {
    if (show) {
      const modal = new Modal(document.getElementById("announcementModal"));
      modal.show();
    }
  }, [show]);

  return (
    <div
      className="modal fade announcementDarkModal"
      id="announcementModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-3 text-center">
          <div className="modal-header border-0 d-flex justify-content-end">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div className="d-flex justify-content-center mt-2">
            <Lottie
              animationData={darkModeAnimation}
              loop={true}
              style={{ height: 150 }}
            />
          </div>

          <h5 className="mt-1 fw-bold">🌙 Try our new Dark Mode!</h5>

          <div className="px-4 mt-2 mb-3 text-muted">
            We’ve added a brand-new dark mode experience.
            Click on <b className="text-dark">Top Right</b> Toggle button to try it now!
          </div>

          <div className="modal-footer border-0 d-flex justify-content-center">
            <button
              className="btn btn-dark"
              data-bs-dismiss="modal"
            >
              Got It!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
