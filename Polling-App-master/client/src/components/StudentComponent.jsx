import React, { useState, useEffect } from "react";
import { Button, ProgressBar } from "react-bootstrap";
import tower from "../assets/tower-icon.png";

import { getVariant } from "../components/components.utils";

const StudentComponent = ({ socket }) => {
  const [name, setName] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [connectedStudents, setConnectedStudents] = useState(null);
  const [votingValidation, setVotingValidation] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("studentName");

    if (name) {
      setName(name);
      setShowQuestion(true);
      socket.emit("student-set-name", { name });
    }

    const handleNewQuestion = (question) => {
      setCurrentQuestion(question);
      setShowQuestion(true);
      setSelectedOption("");
    };

    const handleStudentVoteValidation = (connectedStudents) => {
      setConnectedStudents(connectedStudents);
    };

    socket.on("new-question", handleNewQuestion);
    socket.on("student-vote-validation", handleStudentVoteValidation);

    return () => {
      socket.off("new-question", handleNewQuestion);
      socket.off("student-vote-validation", handleStudentVoteValidation);
    };
  }, [socket]);

  const handleSubmit = () => {
    localStorage.setItem("studentName", name);
    socket.emit("student-set-name", { name });
    setShowQuestion(true);
  };

  const handlePoling = () => {
    socket.emit("handle-polling", {
      option: selectedOption,
    });
  };

  useEffect(() => {
    const found = connectedStudents
      ? connectedStudents?.find((data) => data.socketId === socket.id)
      : undefined;
    if (found) {
      setVotingValidation(found.voted);
    }
  }, [connectedStudents]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        height: "80vh",
        padding: "200px",
      }}
    >
      {showQuestion && name ? (
        <div
          style={{
            width: "100%",
            border: "1px solid #6edff6",
            backgroundColor: "#134652",
          }}
        >
          <h1 style={{ textAlign: "center" }}>Welcome, {name}</h1>
          {currentQuestion ? (
            currentQuestion.answered == false || votingValidation == false ? (
              <div
                style={{
                  rowGap: "16px",
                  columnGap: "16px",
                  borderTop: "1px solid #6edff6",
                  marginLeft: "0 16px",
                  padding: "50px",
                }}
              >
                <h2>Question: {currentQuestion.question}</h2>
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      border:
                        selectedOption === option
                          ? "2px solid green"
                          : "1px solid #6edff6",
                      justifyContent: "space-between",
                      margin: "16px 0",
                      height: "26px",
                      padding: "20px",
                      cursor: "pointer",
                      alignItems: "center",
                      borderRadius: "7px",
                    }}
                    onClick={() => setSelectedOption(option)}
                  >
                    {option}
                  </div>
                ))}
                <Button
                  variant="primary"
                  onClick={handlePoling}
                  disabled={!selectedOption}
                >
                  Submit
                </Button>
              </div>
            ) : (
              <div
                style={{
                  marginTop: "50px",
                  border: "1px solid #6edff6",
                  backgroundColor: "#134652",
                  marginBottom: "50px",
                }}
              >
                <h2
                  style={{
                    textAlign: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={tower}
                    alt=""
                    width="20px"
                    height="20px"
                    style={{ marginRight: "20px" }}
                  />
                  Live Results
                </h2>
                <ul
                  style={{
                    rowGap: "16px",
                    columnGap: "16px",
                    rowGap: "16px",
                    borderTop: "1px solid #6edff6",
                    width: "100%",
                  }}
                >
                  {currentQuestion &&
                    Object.entries(currentQuestion.optionsFrequency).map(
                      ([option]) => (
                        <div
                          style={{
                            margin: "16px",
                          }}
                        >
                          <ProgressBar
                            now={
                              parseInt(currentQuestion.results[option]) ?? "0"
                            }
                            label={`${option}              ${parseInt(
                              currentQuestion.results[option]
                            )}%`}
                            variant={getVariant(
                              parseInt(currentQuestion.results[option])
                            )}
                            animated={
                              getVariant(
                                parseInt(currentQuestion.results[option])
                              ) != "success"
                            }
                          />
                        </div>
                      )
                    )}
                </ul>
              </div>
            )
          ) : (
            <h1>Waiting for question...</h1>
          )}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            rowGap: "16px",
          }}
        >
          <h2>Enter your name to participate in the contest</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
            style={{
              width: "45%",
              padding: "10px",
              height: "40px",
              border: `1px solid #087990`,
              borderRadius: "7px",
              border: `1px solid #0dcaf0`,
              backgroundColor: "#2a444a",
              outline: "none",
              color: "white",
            }}
          />
          <Button variant="info" size="lg" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      )}
    </div>
  );
};

export default StudentComponent;
