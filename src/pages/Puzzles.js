import React, { useState, useContext, useEffect } from "react";
// import { AuthContext } from "../context/AuthContext";
import useHttp from "../hooks/useHttp";
import useMount from "../hooks/useMount";
import { useHistory } from "react-router";

import VerticalButton from "../components/VerticalButton";
import Nav from "../components/Nav";
import "./Puzzles.css";
var icons = require.context("../assets/icons", true);

const Puzzles = props => {
  const mounted = useMount();
  // const auth = useContext(AuthContext);
  const [currentPuzzleId, setCurrentPuzzleId] = useState("");
  const [currentPuzzleData, setCurrentPuzzleData] = useState(undefined);

  const [puzzleList, setPuzzleList] = useState([]);
  const [sendReq, loading, resData] = useHttp();
  const history = useHistory();

  useEffect(() => {
    let path = props.location.pathname.split("/")[2];
    console.log(path);
    if (path !== undefined && path !== "") setCurrentPuzzleId(path);
    else setCurrentPuzzleId("");
  }, [props.location]);

  useEffect(() => {
    if (mounted) {
      if (currentPuzzleId !== "") {
        console.log("send res id");
        sendReq("/quizzes/" + currentPuzzleId);
      } else {
        if (puzzleList.length === 0) {
          console.log("send res quizzes");
          sendReq("/quizzes");
        }
      }
    }
  }, [currentPuzzleId, mounted]);

  useEffect(() => {
    if (mounted && loading === false) {
      if (currentPuzzleId !== "" && resData !== undefined) {
        setCurrentPuzzleData(resData.data);
        history.push("/Puzzles/" + currentPuzzleId);
      } else {
        if (puzzleList.length === 0 && resData !== undefined) {
          setPuzzleList(resData.data);
        }
        setCurrentPuzzleId("");
        setCurrentPuzzleData(undefined);

        history.push("/Puzzles");
      }
    }
  }, [loading, resData, currentPuzzleId]);

  return (
    <div className="puzzles">
      {currentPuzzleData === undefined &&
        puzzleList.map(item => (
          <VerticalButton
            key={item._id}
            icon={item.icon ? item.icon : "./puzzle.svg"}
            title={item.title}
            onClick={e => {
              setCurrentPuzzleId(item._id);
            }}
          />
        ))}
      {currentPuzzleData !== undefined && (
        <React.Fragment>
          <div className="puzzle">
            <img
              src={icons(
                currentPuzzleData.icon ? currentPuzzleData.icon : "./puzzle.svg"
              )}
              alt=""
            />
            <h3>{currentPuzzleData.title}</h3>
            <p>{currentPuzzleData.description}</p>
            <Nav
              links={[
                {
                  to: "/Puzzles",
                  name: "Back",
                  icon: "./arrow_left.svg"
                },
                {
                  to: "/Game/" + currentPuzzleId,
                  name: "Start",
                  icon: "./ok.svg"
                }
              ]}
            />
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default Puzzles;
