import React, { useState, useEffect } from "react";
import { ProgressBar } from "react-bootstrap";
import { getVariant } from "../components/components.utils";

import tower from "../assets/tower-icon.png";

const PollingResult = ({ socket }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);

  const handleNewQuestion = (question) => {
    setCurrentQuestion(question);
  };
  useEffect(() => {
    socket.on("new-question", handleNewQuestion);

    return () => {
      socket.off("new-question", handleNewQuestion);
    };
  }, [socket]);

  return (
    <div
      style={{
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
      <div
        style={{
          rowGap: "16px",
          columnGap: "16px",
          rowGap: "16px",
          borderTop: "1px solid #6edff6",
          width: "100%",
        }}
      >
        {currentQuestion &&
          Object.entries(currentQuestion.optionsFrequency).map(([option]) => (
            <div
              style={{
                margin: "16px",
              }}
            >
              <ProgressBar
                now={parseInt(currentQuestion.results[option] ?? 0) ?? "0"}
                label={`${option}              ${parseInt(
                  currentQuestion.results[option]
                )}%`}
                variant={getVariant(
                  parseInt(currentQuestion.results[option] ?? 0)
                )}
                animated={
                  getVariant(parseInt(currentQuestion.results[option] ?? 0)) !=
                  "success"
                }
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default PollingResult;
