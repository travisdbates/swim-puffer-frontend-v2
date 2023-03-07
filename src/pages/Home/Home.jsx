import React, { Component } from "react";

import { Parallax } from "react-parallax";

import Nav from "../nav/Nav";
import Topbar from "../../components/Topbar";
import "./Home.css";
import "animate.css/animate.min.css";

import c from "../../assets/celeste.jpeg";
import t from "../../assets/tarryn.jpeg";
import k from "../../assets/Kiley.jpeg";

export default class Home extends Component {
  componentDidMount() {
    document.title = `Puffer Fish Swim Lessons`;
  }

  render() {
    const instructorList = [
      {
        name: "Celeste",
        img: c,
        para1:
          'I enjoy working with children of all ages, but my passion is the "little ones.' +
          '"  My motto is: Love what you do, Do what you love!',
        para2:
          "I have a degree in child development and raised 5 wonderful children. I am now e" +
          "njoying watching my 10 grandchildren grow up and learn to swim!",
      },
      {
        name: "Tarryn",
        img: t,
        para1:
          "I love swimming! I enjoy any & every sport involving the water and was a competi" +
          "tive synchronized swimmer for many years.",
        para2:
          "I also find joy in working with children. I graduated in elementary education & " +
          "have 4 children of my own.",
      },
      {
        name: "Kiley",
        img: k,
        para1:
          "I grew up in the same spot as your kids, taking lessons from Celeste! Since then I have swam for about 14 years on swim team and in high school, taught many lessons, and coached swim team!",
        para2:
          "I love helping kids be able to learn new techniques and be able to swim on their own!",
      },
    ];

    //     April 2-18     9 classes  TWTH     $85  (includes heating fee)
    // April 22-May 2     8 classes MTWTH     $80  (includes heating fee)
    // May 14-30          9 classes TWTH      $85  (includes heating fee)
    // June 4-27          12 classes TWTH     $110
    // July 9-25          9 classes TWTH      $80
    // August             session pending

    const sessions = [
      {
        name: "Session 1",
        dates: "April 11 - April 27",
        length: "9 Lessons",
        days: "T | W | Th",
        cost: "$120",
        disabled: true,
      },
      {
        name: "Session 2",
        dates: "May 2 - May 18",
        length: "9 Lessons",
        days: "T | W | Th",
        cost: "$120",
        disabled: true,
      },
      {
        name: "Session 3",
        dates: "May 30 - June 15",
        length: "9 Lessons",
        days: "T | W | Th",
        cost: "$115",
        disabled: true,
      },
      {
        name: "Session 4",
        dates: "June 20 - July 6*",
        length: "8 Lessons",
        days: "T | W | Th",
        cost: "$100",
        notes: "No lessons July 4th",
        disabled: false,
      },
      {
        name: "Session 5",
        dates: "August 1 - 17",
        length: "8 Lessons",
        days: "T | W | Th",
        cost: "$115",
        notes: "Last class is at 1:30 PM",
        disabled: false,
      },
    ];

    const image =
      "https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?auto=format&fit=cro" +
      "p&w=1950&q=80";

    const currentPath = this.props.location.pathname;
    return (
      <div className="outer">
        <Topbar currentPath={currentPath} />
        {/* <Nav /> */}
        <Parallax
          bgImage={image}
          blur={{
            min: -5,
            max: 5,
          }}
        >
          <div
            style={{
              height: "90vh",
              backgroundColor: "rgba(0, 0, 0, 0.35)",
            }}
          >
            <div className="sideBySide">
              <div className="divWelDiv">
                <div className="divider" />
                <span className="welcome">Welcome</span>
                <div className="divider" />
              </div>
              <div className="sideBySideL">
                <span>
                  Power Road Pufferfish
                  <br />
                  Swim Lessons
                </span>
              </div>
            </div>
          </div>
        </Parallax>
        <div className="boxSpacing">
          <div className="test">
            <span className="introHome">
              Power Road Pufferfish provides high quality, affordable swimming
              lessons for all ages and abilities. Our program encourages quick
              learning in a relaxed environment. We do our best to make it an
              enjoyable experience for both you and your child.
            </span>
          </div>
        </div>
        <div className="meetInst">
          <span>Meet the instructors</span>
        </div>
        <div className="instructors">
          {instructorList.map((inst, index) => {
            return (
              <div className="instructor" key={`inst${index}`}>
                <img src={inst.img} alt="#" className="instPic" />
                <span className="instName">{inst.name}</span>
                <span className="paragraph">{inst.para1}</span>
                <span className="paragraph">{inst.para2}</span>
              </div>
            );
          })}
        </div>
        <div>
          <div className="diagbottom" />
          <div className="diagbottomy" />
        </div>
        <div className="diagtopb">
          <span>Quick Info</span>
        </div>
        <div className="schedule">
          <div
            style={{
              width: "85%",
              display: "flex",
              justifyContent: "center",
              alignItems: "space-around",
              flexDirection: "column",
              color: "white",
              fontSize: "3.5vw",
              fontWeight: "400",
              height: "auto",
              padding: "50px 0px",
            }}
          >
            <span>&#9679; Each class is 1/2 hour long.</span>
            <span style={{ marginTop: "20px" }}>
              &#9679; There are 4 children per class.
            </span>
            <span style={{ marginTop: "20px" }}>
              &#9679; Classes are arranged by age.
            </span>
            <span style={{ marginTop: "20px" }}>
              &#9679; Classes run from 9:00 AM to 5:30 PM.
            </span>
          </div>
        </div>
        <div className="diagbottomb" />
        <div className="meetInst">
          <span>Schedule</span>
        </div>
        <div className="schedule2">
          {sessions.map((session, index) => {
            return (
              <div className="flexColumn" key={index}>
                <div className="info">
                  <span className="sessionName">{session.name}</span>
                  <div className="verticalDivider" />
                  <div className="dates">
                    <span className="sessDesc">Dates</span>
                    <span>{session.dates}</span>
                  </div>
                  <div className="verticalDividerS" />
                  <div className="dates">
                    <span className="sessDesc">Length</span>
                    <span>{session.length}</span>
                  </div>
                  <div className="verticalDividerS" />
                  <div className="dates">
                    <span className="sessDesc">Days</span>
                    <span>{session.days}</span>
                  </div>
                  <div className="verticalDividerS" />
                  <div className="dates">
                    <span className="sessDesc">Cost</span>
                    <span>{session.cost}</span>
                  </div>
                  <div className="verticalDividerS" />
                  <div className="dates">
                    <span className="sessDesc" />
                    <span style={{ fontSize: ".65em", color: "grey" }}>
                      {session.disabled ? "Session Full" : null}
                    </span>
                  </div>
                </div>
                {session.notes ? (
                  <span style={{ color: "GrayText", marginBottom: 16 }}>
                    * {session.notes}
                  </span>
                ) : null}
              </div>
            );
          })}
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {/* <a href={process.env.REACT_APP_LOGIN} className="signupButtonMid">
              Click here to register for sessions
            </a> */}
          </div>
        </div>
        <div className="diagbottomy" />
        <div className="diagtopb">
          <span>Our location</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#55B3B0",
            padding: "50px",
          }}
        >
          <iframe
            frameBorder="0"
            style={{
              border: 0,
              width: "75vw",
              height: "450px",
            }}
            title="map"
            src="https://www.google.com/maps/embed/v1/place?q=pufferfish%20swim%20school&key=AIzaSyDAXE4JvR2q6QUimiMWFwouwgI5wSxH13A"
            allowFullScreen
          />
        </div>
        <div>
          <div className="diagbottom" />
          <div className="diagbottomb" />
        </div>
        &#9400; {new Date().getFullYear()} Puffer Fish Swim Lessons | Website &
        Design by{" "}
        <a style={{ color: "#55B3B0", textDecoration: "underline" }} href="/">
          TB Design
        </a>
      </div>
    );
  }
}
