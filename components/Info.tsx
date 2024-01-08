import React from "react";
import { isMobile } from "react-device-detect";
import ReactDOM from "react-dom";
import styled from "styled-components";
import * as C from "../utils/constants";

interface ModalProps {
  show: boolean;
  onClose: any;
  children: any;
  handleModalData: (data: string | undefined) => void;
  handleTrigger: (data: boolean) => void;
}

const Info: React.FC<ModalProps> = ({
  show,
  onClose,
  children,
  handleModalData,
  handleTrigger,
}) => {
  const [browser, setBrowser] = React.useState(false);
  const [color, setColor] = React.useState("cyan");
  React.useEffect(() => {
    setBrowser(true);
  }, []);

  const handleCloseClick = (e: { preventDefault: () => void }) => {
    handleTrigger(false);
    handleModalData("");
    setColor("cyan");
    e.preventDefault();
    onClose();
  };

  const modalContent = show ? (
    <StyledModalOverlay>
      <StyledModal>
        <StyledModalHeader>
          <a href="#" onClick={handleCloseClick}>
            <span className="material-icons">close</span>
          </a>
        </StyledModalHeader>
        {show && (
          <StyledModalTitle>
            <div
              className="material-icons"
              style={{
                marginTop: "10px",
                fontSize: "66px",
              }}
            >
              hub
            </div>
            <div
              style={{
                marginTop: "17px",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontSize: "24px", fontWeight: "700" }}>
                Your IPFS Hash
              </span>
            </div>
          </StyledModalTitle>
        )}
        <StyledModalBody>
          <div
            className="flex-row"
            style={{
              width: "400px",
            }}
          >
            <input
              id="info"
              key="1"
              value={children}
              type="text"
              style={{
                background: "black",
                outline: "none",
                border: "none",
                padding: "7px",
                borderRadius: "3px",
                fontFamily: "SF Mono",
                letterSpacing: "-0.5px",
                fontWeight: "400",
                fontSize: "15px",
                width: "150%",
                wordWrap: "break-word",
                textAlign: "left",
                color: color,
                cursor: "copy",
                paddingRight: "32px",
              }}
              disabled
            />
            <button
              className="button-empty"
              onClick={() => {
                setColor("lime"), C.copyToClipboard("info");
              }}
              style={{
                marginLeft: "-25px",
                marginTop: "2px",
                color: color || "cyan",
              }}
            >
              <span
                className="material-icons"
                style={{
                  fontSize: "22px",
                  fontWeight: "700",
                }}
              >
                content_copy
              </span>
            </button>
          </div>
          <button
            className="button"
            style={{
              height: "33px",
              width: "140px",
              padding: "5px",
              marginTop: "20px",
              fontSize: "17px",
              fontWeight: "700",
            }}
            onClick={handleCloseClick}
            data-tooltip="Roger That"
          >
            <div
              className="flex-row"
              style={{
                fontSize: "17px",
              }}
            >
              {"Ok"}&nbsp;
              <span className="material-icons smoller">done_all</span>
            </div>
          </button>
        </StyledModalBody>
      </StyledModal>
    </StyledModalOverlay>
  ) : null;

  if (browser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal")!
    );
  } else {
    return null;
  }
};

const StyledModalBody = styled.div`
  padding-top: 5px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 25px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: auto;
  overflow-y: auto;
  color: white;
  font-size: 14px;
  font-weight: 700;
  margin-top: 5px;
`;

const StyledModalTitle = styled.div`
  margin-top: -15px;
  font-size: 14px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  font-weight: 700;
  color: white;
  padding-left: 20px;
  padding-right: 20px;
  color: cyan;
  margin-left: 10px;
`;

const StyledModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StyledModal = styled.div`
  background: rgba(66,46,40,1);
  background-size: 400% 400%;
  width: 460px;
  max-width: ${isMobile ? "90%" : "60%"};
  height: 270px;
  border-radius: 6px;
  overflow-y: initial !important
  display: flex;
  text-align: center;
  justify-content: center;
  padding: 3px;
`;

const StyledModalOverlay = styled.div`
  position: absolute;
  top: -60px;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 1);
`;

export default Info;
