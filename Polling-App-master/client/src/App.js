import React, { useState } from "react";
import io from "socket.io-client";
import "bootstrap/dist/css/bootstrap.css";
import "../src/App.css";

import TeacherComponent from "./components/TeacherComponent";
import StudentComponent from "./components/StudentComponent";

const socket = io.connect("http://localhost:3001");

const App = () => {
  const [isTeacher, setIsTeacher] = useState(null);

  const handleRoleSelection = (role) => {
    setIsTeacher(role === "teacher");
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#032830",
        color: "white",
      }}
    >
      {isTeacher === null ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "80%",
          }}
        >
          <h1>Select what type of user you are?</h1>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "50%",
              margin: "100px",
              columnGap: "50px",
            }}
          >
            <button
              onClick={() => handleRoleSelection("teacher")}
              className="parentAndStudentButton"
            >
              I am a Teacher
            </button>
            <button
              onClick={() => handleRoleSelection("student")}
              className="parentAndStudentButton"
            >
              I am a Student
            </button>
          </div>
        </div>
      ) : isTeacher ? (
        <TeacherComponent socket={socket} />
      ) : (
        <StudentComponent socket={socket} />
      )}
    </div>
  );
};

export default App;
