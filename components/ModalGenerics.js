import { motion } from "framer-motion"
import { Link } from "react-router-dom"

const PageOverlay = ({ children, className, origin }) => (
  <motion.div
    className={`modal-page-overlay ${className ? className : ``}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 2 } }}
    transition={{ duration: 0.2 }}
  >
    <Link to={origin} className="dismiss-modal">
      <DismissButton />
    </Link>
    <Modal {...{ className }}>{children}</Modal>
  </motion.div>
)

const Modal = ({ children, className }) => (
  <motion.div
    className={`modal-content ${className ? className : ``}`}
    initial={{ y: 200, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.15 } }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
)

const DismissButton = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
)

export default PageOverlay
