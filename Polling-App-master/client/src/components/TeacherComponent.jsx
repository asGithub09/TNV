import React, { useState } from "react";
import PollingResult from "./PollingResult";
import { Button } from "react-bootstrap";

const TeacherComponent = ({ socket }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([""]);
  const [questionPublished, setQuestionPublished] = useState(false);

  const askQuestion = () => {
    const questionData = {
      question,
      options: options.filter((option) => option.trim() !== ""),
    };

    if (socket && question && questionData.options.length) {
      socket.emit("teacher-ask-question", questionData);
      setQuestionPublished(true);
    }
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const updateOption = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const askAnotherQuestion = () => {
    setQuestionPublished(false);
    setQuestion("");
    setOptions([""]);
  };

  return (
    <div
      style={{
        width: "60%",
        height: "80vh",
        color: "white",
      }}
    >
      <h1>Teacher Interface</h1>
      {questionPublished ? (
        <>
          <PollingResult socket={socket} />
          <Button variant="primary" onClick={askAnotherQuestion}>
            Ask Another Question?
          </Button>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            rowGap: "16px",
          }}
        >
          <label>Enter Question and Options</label>
          <textarea
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter question..."
            style={{
              width: "50%",
              height: "100px",
              border: `1px solid #0dcaf0`,
              backgroundColor: "#2a444a",
              outline: "none",
              color: "white",
              borderRadius: "7px",
              padding: "10px",
            }}
          />
          <br />
          <label>Enter Options:</label>
          {options.map((option, index) => (
            <div key={index}>
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={`Enter Option number ${index + 1}`}
                style={{
                  width: "35%",
                  padding: "10px",
                  height: "30px",
                  border: `1px solid #087990`,
                  borderRadius: "7px",
                  border: `1px solid #0dcaf0`,
                  backgroundColor: "#2a444a",
                  outline: "none",
                  color: "white",
                }}
              />
            </div>
          ))}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button variant="outline-info" onClick={addOption}>
              Add another option +
            </Button>
            <Button variant="primary" onClick={askQuestion}>
              Ask Question -&gt;
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherComponent;
