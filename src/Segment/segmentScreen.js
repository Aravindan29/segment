import React, { useState, useRef } from "react";
import {
  Navbar,
  Container,
  Button,
  Offcanvas,
  FloatingLabel,
  Form,
  Spinner,
  Modal,
} from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
// import axios from "axios";
import "./segmentStyles.css";
import Icon from "../Icons/icons";

const SegmentScreen = () => {
  const segmentNameRef = useRef(null);
  const addSchemaToSegDrop = useRef(null);
  const [segmentArr, setSegmentArr] = useState([]);
  const [localState, setLocalState] = useState({
    segmentName: "",
    offCanvas: false,
    segmentValue: "",
    errMsg: "",
    spinner: false,
    successModal: false,
  });
  const [options, setOptions] = useState([
    { id: 1, value: "first_name", label: "First Name" },
    { id: 2, value: "last_name", label: "Last Name" },
    { id: 3, value: "gender", label: "Gender" },
    { id: 4, value: "age", label: "Age" },
    { id: 5, value: "account_name", label: "Account Name" },
    { id: 6, value: "city", label: "City" },
    { id: 7, value: "state", label: "State" },
  ]);
  const [removedOptions, setRemovedOptions] = useState([]);

  const handleSelectChange = (event) => {
    setLocalState((ls) => ({
      ...ls,
      segmentValue: event.target.value,
      errNameMsg: "",
      errMsg: "",
    }));
  };

  const addNewSchema = () => {
    if (localState.segmentValue === "") {
      setLocalState((ls) => ({
        ...ls,
        errMsg: "* Please select the drop down add schema to segment",
      }));
      addSchemaToSegDrop?.current?.focus();
    } else {
      setSegmentArr([
        ...segmentArr,
        {
          id: segmentArr.length,
          value: localState.segmentValue,
          label: options.find(
            (option) => option.value === localState.segmentValue
          )?.label,
          color:
            localState.segmentValue === "account_name" ||
            localState.segmentValue === "city" ||
            localState.segmentValue === "state"
              ? "#d6477a"
              : "#64d67e",
        },
      ]);
      removeOption(localState.segmentValue);
      setLocalState((ls) => ({
        ...ls,
        segmentValue: "",
      }));
    }
  };

  const removeOption = (value) => {
    const optionToRemove = options.find((option) => option.value === value);
    setOptions(options.filter((option) => option.value !== value));
    setRemovedOptions([...removedOptions, optionToRemove]);
  };

  const removeDrop = (index, item) => {
    setSegmentArr(segmentArr.filter((item) => item.id !== index));
    const optionToAddBack = removedOptions.find(
      (option) => option.value === item.value
    );
    setRemovedOptions(
      removedOptions.filter((option) => option.value !== item.value)
    );
    setOptions([...options, optionToAddBack]);
  };

  const saveTheSegment = async () => {
    if (localState.segmentName === "") {
      setLocalState((ls) => ({
        ...ls,
        errNameMsg: "* Please Enter the segment name",
      }));
      segmentNameRef?.current?.focus();
    } else if (segmentArr.length === 0) {
      setLocalState((ls) => ({
        ...ls,
        errMsg: "* Please select the drop down add schema to segment",
      }));
      addSchemaToSegDrop?.current?.focus();
    } else {
      const webhookUrl =
        "https://webhook.site/47ecdef8-00ef-4776-ba3b-9cec7c25cc40";
      const data = {
        segment_name: localState.segmentName,
        schema: segmentArr,
      };

      console.log("Sending data:", data);

      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        console.log("Fetch response:", response);

        setLocalState((ls) => ({
          ...ls,
          spinner: true,
        }));

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const responseData = await response.json();
        console.log("Success:", responseData);
        setLocalState((ls) => ({
          ...ls,
          successModal: true,
        }));
        // const response = await axios.post(webhookUrl, data, {
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // });
        // console.log("Success:", response.data);
        // setLocalState((ls) => ({
        //   ...ls,
        //   spinner: true,
        //   successModal: true,
        // }));
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div>
      <Navbar expand="lg" className="introHead">
        <Container fluid>
          <Navbar.Brand
            href="/"
            style={{
              fontSize: "1.5rem",
              color: "#fff",
            }}
          >
            <i className="bi bi-chevron-left"></i> View Audience
          </Navbar.Brand>
        </Container>
      </Navbar>
      <div className="cont">
        <Button
          variant="outline-secondary"
          onClick={() =>
            setLocalState((ls) => ({
              ...ls,
              offCanvas: true,
            }))
          }
        >
          Save Segment
        </Button>
      </div>

      <Offcanvas
        show={localState.offCanvas}
        onHide={() =>
          setLocalState((ls) => ({
            ...ls,
            offCanvas: false,
          }))
        }
        placement="end"
      >
        <Offcanvas.Header className="introHead">
          <Offcanvas.Title
            style={{
              fontSize: "1.5rem",
              color: "#fff",
            }}
          >
            {" "}
            <i className="bi bi-chevron-left"></i> Saving Segment
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <p>Enter the Name of the Segment</p>
          <FloatingLabel
            controlId="floatingInput"
            label="Name of the Segment"
            className="mb-3"
          >
            <Form.Control
              type="text"
              placeholder="Segment Name"
              ref={segmentNameRef}
              value={localState.segmentName}
              onChange={(e) =>
                setLocalState((ls) => ({
                  ...ls,
                  segmentName: e.target.value,
                  errNameMsg: "",
                }))
              }
            />
          </FloatingLabel>
          {localState.errNameMsg ? (
            <p
              style={{
                color: "red",
              }}
            >
              {localState.errNameMsg}
            </p>
          ) : null}
          <p>
            To save your segment, you need to add the schemas to build the query
          </p>
          <p style={{ textAlign: "end" }}>
            <i
              className="bi bi-circle-fill"
              style={{ color: "#64d67e", fontSize: "10px" }}
            ></i>{" "}
            - User{" "}
            <i
              className="bi bi-circle-fill"
              style={{ color: "#d6477a", fontSize: "10px" }}
            ></i>{" "}
            - Group
          </p>
          {segmentArr.map((item, index) => (
            <>
              <div className="row g-4" key={item.id}>
                <div className="col-1">
                  <i
                    className="bi bi-circle-fill"
                    style={{ color: item.color, fontSize: "10px" }}
                  ></i>
                </div>
                <div className="col-9">
                  <Form.Select aria-label="Default select example">
                    <option value={item.value}>{item.label}</option>
                  </Form.Select>
                </div>
                <div className="col-2">
                  <i
                    className="bi bi-dash-circle"
                    style={{
                      fontSize: "1.5rem",
                      cursor: "pointer",
                      color: "#2596be",
                    }}
                    onClick={() => removeDrop(index, item)}
                  ></i>
                </div>
              </div>
              <br />
            </>
          ))}

          <Form.Select
            aria-label="Default select example"
            ref={addSchemaToSegDrop}
            value={localState.segmentValue}
            onChange={handleSelectChange}
          >
            <option value="">Add schema to segment</option>
            {options.map((option) => (
              <option key={option.id} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
          {localState.errMsg ? (
            <>
              <br />
              <p
                style={{
                  color: "red",
                }}
              >
                {localState.errMsg}
              </p>
            </>
          ) : null}
          <br />
          <p
            style={{
              color: "#39afbd",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={addNewSchema}
          >
            +Add new schema
          </p>
        </Offcanvas.Body>
        <div className="offFooter">
          <div className="mb-2 fotcon">
            <Button
              className="savBtn"
              disabled={localState.spinner}
              onClick={saveTheSegment}
            >
              {localState.spinner && (
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              )}
              Save the Segment
            </Button>{" "}
            <Button
              className="canBtn"
              onClick={() =>
                setLocalState((ls) => ({
                  ...ls,
                  offCanvas: false,
                }))
              }
            >
              Cancel
            </Button>
          </div>
        </div>
      </Offcanvas>
      <Modal
        show={localState.successModal}
        onHide={() =>
          setLocalState((ls) => ({
            ...ls,
            successModal: false,
          }))
        }
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>Segment Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modalSty">
            <Icon name="check-circle" size="8rem" />{" "}
            <h4>Segment Added Successfully</h4>
            <Button
              variant="success"
              size="lg"
              onClick={() =>
                setLocalState((ls) => ({
                  ...ls,
                  successModal: false,
                }))
              }
            >
              Done
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default SegmentScreen;
