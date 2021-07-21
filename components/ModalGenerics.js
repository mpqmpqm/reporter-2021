import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import styled from "styled-components"

const PageOverlayParent = styled(motion.div)`
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  left: 0;
  right: 0;
  color: white;
  z-index: 99;
  background-color: rgba(15, 15, 15, 0.95);
  backdrop-filter: grayscale(1) blur(10px);
  display: flex;
  flex-direction: column;

  .dismiss-modal {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    padding: 12px;
    z-index: 999;
  }
`

const ModalParent = styled(motion.div)`
  width: 100%;
  padding: 10% 7.5% 0;
  margin: 0 auto 2.5%;
  min-height: 70%;
  display: flex;
  flex-direction: column;
  z-index: 100;
  overflow-y: auto;
`

const PageOverlay = ({ children, className, origin }) => (
  <PageOverlayParent
    className={className}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 2 } }}
    transition={{ duration: 0.2 }}
  >
    <Link to={origin} className="dismiss-modal">
      <DismissButton />
    </Link>
    <Modal {...{ className }}>{children}</Modal>
  </PageOverlayParent>
)

const Modal = ({ children, className }) => (
  <ModalParent
    className={className}
    initial={{ y: 200, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.15 } }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </ModalParent>
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
