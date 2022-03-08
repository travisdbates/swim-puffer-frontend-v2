import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { withRouter } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DoneIcon from "@material-ui/icons/Done";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import Fade from "@material-ui/core/Fade";
import Back from "./common/Back";
import InputLabel from "@material-ui/core/InputLabel";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import jwt from "jsonwebtoken";
import Auth from "../utils/auth";
const auth = new Auth();

const backgroundShape = require("../images/shape.svg");

const logo = require("../images/logo.svg");

const numeral = require("numeral");
numeral.defaultFormat("0");

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.secondary["A100"],
    overflow: "hidden",
    //background: `url(${backgroundShape}) no-repeat`,
    backgroundSize: "cover",
    backgroundPosition: "0 400px",
    marginTop: 10,
    padding: 20,
    paddingBottom: 500,
  },
  grid: {
    margin: `0 ${theme.spacing.unit * 2}px`,
  },
  smallContainer: {
    width: "100%",
  },
  bigContainer: {
    width: "80%",
  },
  logo: {
    marginBottom: 24,
    display: "flex",
    justifyContent: "center",
  },
  stepContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  stepGrid: {
    // width: '80%'
  },
  buttonBar: {
    marginTop: 32,
    display: "flex",
    justifyContent: "center",
  },
  button: {
    backgroundColor: theme.palette.primary["A100"],
  },
  backButton: {
    marginRight: theme.spacing.unit,
  },
  outlinedButtom: {
    textTransform: "uppercase",
    margin: theme.spacing.unit,
  },
  stepper: {
    backgroundColor: "transparent",
    width: "100vw",
  },
  paper: {
    padding: theme.spacing.unit * 3,
    textAlign: "left",
    color: theme.palette.text.secondary,
  },
  topInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 42,
  },
  formControl: {
    width: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

const getSteps = () => {
  return ["Add Child", "Select Session(s)", "Select Time(s)", "Add Notes"];
};

const SUBMIT_SIGNUP = gql`
  mutation StudentSignUp(
    $email: String!
    $firstName: String!
    $sessionPreference: [Boolean]!
    $timePreference: [Int]!
    $notes: [String]
    $age: Int
  ) {
    studentSignUp(
      email: $email
      firstName: $firstName
      sessionPreference: $sessionPreference
      timePreference: $timePreference
      notes: $notes
      age: $age
    ) {
      status
      message
    }
  }
`;

class Signup extends Component {
  state = {
    email: "",
    activeStep: 0,
    age: "",
    termsChecked: false,
    loading: true,
    firstName: "",
    session_1: false,
    session_2: false,
    session_3: false,
    session_4: false,
    session_5: false,
    session_6: false,
    sessionTime1: false,
    sessionTime2: false,
    sessionTime3: false,
    sessionTime4: false,
    sessionTime5: false,
    sessionTime6: false,
    sessionNotes1: "",
    sessionNotes2: "",
    sessionNotes3: "",
    sessionNotes4: "",
    sessionNotes5: "",
    sessionNotes6: "",
  };

  componentDidMount() {
    if (!localStorage.getItem("isLoggedIn")) {
      auth.login();
    }

    let email = jwt.decode(localStorage.getItem("idToken")).email;
    this.setState({
      email,
    });
  }

  isSessionSelected = () => {
    const {
      session_1,
      session_2,
      session_3,
      session_4,
      session_5,
    } = this.state;
    return !session_1 && !session_2 && !session_3 && !session_4 && !session_5;
  };

  isSessionTimeSelected = () => {
    const {
      sessionTime1,
      sessionTime2,
      sessionTime3,
      sessionTime4,
      sessionTime5,
    } = this.state;
    return (
      !sessionTime1 &&
      !sessionTime2 &&
      !sessionTime3 &&
      !sessionTime4 &&
      !sessionTime5
    );
  };

  timeSelectFields = () => {
    const {
      session_1,
      session_2,
      session_3,
      session_4,
      session_5,
    } = this.state;
    let sessions = {
      session_1,
      session_2,
      session_3,
      session_4,
      session_5,
    };

    let sessionTimes = [];

    for (var prop in sessions) {
      sessions[prop] && sessionTimes.push(prop);
    }
    return sessionTimes;
  };

  renderSessionTime = () => {
    return <div>Session</div>;
  };

  isNextDisabled = (activeStep) => {
    return activeStep === 0
      ? !this.state.age || !this.state.firstName
      : activeStep === 1
      ? this.isSessionSelected()
      : activeStep === 2
      ? this.areTimesSelected()
      : false;
  };

  areTimesSelected = () => {
    let times = this.timeSelectFields();
    let flag = false;
    times.map((time) => {
      if (!this.state[time.split("_").join("Time")]) {
        flag = true;
      }
    });
    return flag;
  };

  handleNext = () => {
    this.setState((state) => ({
      activeStep: state.activeStep + 1,
    }));
    if (this.state.activeStep === 3) {
      setTimeout(() => this.props.history.push("/dash"), 5000);
    }
  };

  handleBack = () => {
    this.setState((state) => ({
      activeStep: state.activeStep - 1,
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleTerms = (event) => {
    this.setState({ termsChecked: event.target.checked });
  };

  handleChangeCheckbox = (name) => (event) => {
    this.setState({ [name]: event.target.checked });
  };

  stepActions() {
    if (this.state.activeStep === 0) {
      return "Add Child";
    }
    if (this.state.activeStep === 1) {
      return "Confirm Sessions";
    }
    if (this.state.activeStep === 2) {
      return "Confirm Times";
    }
    return "Submit!";
  }

  selectedSessionTimes = () => {
    const {
      sessionTime1,
      sessionTime2,
      sessionTime3,
      sessionTime4,
      sessionTime5,
    } = this.state;

    let arr = [
      sessionTime1,
      sessionTime2,
      sessionTime3,
      sessionTime4,
      sessionTime5,
    ];

    return arr.map((session, index) => (session ? arr[index] : 0));
  };

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const {
      email,
      activeStep,
      loading,
      session_1,
      session_2,
      session_3,
      session_4,
      session_5,
      session_6,
      sessionNotes1,
      sessionNotes2,
      sessionNotes3,
      sessionNotes4,
      sessionNotes5,
      sessionNotes6,
      firstName,
      age,
    } = this.state;

    return (
      <Mutation mutation={SUBMIT_SIGNUP}>
        {(submitSignup, { data }) => (
          <React.Fragment>
            <CssBaseline />
            <div className={classes.root}>
              <Back />
              <Grid container justify="center">
                <Grid
                  spacing={24}
                  alignItems="center"
                  justify="center"
                  container
                  className={classes.grid}
                >
                  <Grid item xs={12}>
                    <div className={classes.logo}>
                      <img width={100} height={100} src={logo} />
                    </div>
                    <div className={classes.stepContainer}>
                      <div className={classes.stepGrid}>
                        <Stepper
                          classes={{ root: classes.stepper }}
                          activeStep={activeStep}
                          alternativeLabel
                        >
                          {steps.map((label) => {
                            return (
                              <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                              </Step>
                            );
                          })}
                        </Stepper>
                      </div>
                      {activeStep === 0 && (
                        <div className={classes.smallContainer}>
                          <Paper className={classes.paper}>
                            <div>
                              <div style={{ marginBottom: 32 }}>
                                <Typography
                                  variant="subtitle1"
                                  style={{ fontWeight: "bold" }}
                                  gutterBottom
                                >
                                  Child Name
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                  Please type in your child's name and age
                                </Typography>
                              </div>
                              <div style={{ display: "flex" }}>
                                <div style={{ flex: 1, padding: "5px" }}>
                                  <Typography
                                    style={{
                                      textTransform: "uppercase",
                                      marginBottom: 20,
                                    }}
                                    color="secondary"
                                    gutterBottom
                                  >
                                    Name
                                  </Typography>
                                  <FormControl
                                    variant="outlined"
                                    className={classes.formControl}
                                  >
                                    <TextField
                                      value={this.state.firstName}
                                      onChange={(e) =>
                                        this.setState({
                                          firstName: e.target.value,
                                        })
                                      }
                                    />
                                  </FormControl>
                                </div>
                                <div style={{ flex: 1, padding: "5px" }}>
                                  <Typography
                                    style={{
                                      textTransform: "uppercase",
                                      // marginBottom: 20
                                    }}
                                    color="secondary"
                                    gutterBottom
                                  >
                                    Age
                                  </Typography>
                                  <FormControl
                                    variant="outlined"
                                    className={classes.formControl}
                                  >
                                    <Select
                                      value={this.state.age}
                                      onChange={this.handleChange}
                                      input={
                                        <OutlinedInput
                                          labelWidth={this.state.labelWidth}
                                          name="age"
                                        />
                                      }
                                    >
                                      <MenuItem value="">
                                        <em>Select an option</em>
                                      </MenuItem>
                                      <MenuItem value={1}>1</MenuItem>
                                      <MenuItem value={2}>2</MenuItem>
                                      <MenuItem value={3}>3</MenuItem>
                                      <MenuItem value={4}>4</MenuItem>
                                      <MenuItem value={5}>5</MenuItem>
                                      <MenuItem value={6}>6</MenuItem>
                                      <MenuItem value={7}>7</MenuItem>
                                      <MenuItem value={8}>8</MenuItem>
                                      <MenuItem value={9}>9</MenuItem>
                                      <MenuItem value={10}>10</MenuItem>
                                      <MenuItem value={11}>11</MenuItem>
                                      <MenuItem value={12}>12</MenuItem>
                                      <MenuItem value={13}>13</MenuItem>
                                      <MenuItem value={14}>14</MenuItem>
                                      <MenuItem value={15}>15</MenuItem>
                                      <MenuItem value={16}>16</MenuItem>
                                      <MenuItem value={17}>17</MenuItem>
                                      <MenuItem value={18}>18</MenuItem>
                                    </Select>
                                  </FormControl>
                                </div>
                              </div>
                            </div>
                          </Paper>
                        </div>
                      )}
                      {activeStep === 1 && (
                        <div className={classes.smallContainer}>
                          <Paper className={classes.paper}>
                            <Grid item container xs={12}>
                              <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom>
                                  Choose the session(s) you want for{" "}
                                  {this.state.firstName}
                                </Typography>

                                <FormGroup>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        disabled={true}
                                        checked={session_1}
                                        onChange={this.handleChangeCheckbox(
                                          "session_1"
                                        )}
                                        value="session_1"
                                      />
                                    }
                                    label="Session 1 - 4/26-5/19 - $125 (Includes $5 heating fee)"
                                  />
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        disabled={false}
                                        checked={session_2}
                                        onChange={this.handleChangeCheckbox(
                                          "session_2"
                                        )}
                                        value="session_2"
                                      />
                                    }
                                    label="Session 2 - 6/7-6/30 - $120"
                                  />
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        disabled={false}
                                        checked={session_3}
                                        onChange={this.handleChangeCheckbox(
                                          "session_3"
                                        )}
                                        value="session_3"
                                      />
                                    }
                                    label="Session 3 - 7/12-7/22 - $80"
                                  />
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        disabled={false}
                                        checked={session_4}
                                        onChange={this.handleChangeCheckbox(
                                          "session_4"
                                        )}
                                        value="session_4"
                                      />
                                    }
                                    label="Session 4  - 8/2-8/18 - $90"
                                  />
                                  {/* <FormControlLabel
                                    control={
                                      <Checkbox
                                        disabled={false}
                                        checked={session_5}
                                        onChange={this.handleChangeCheckbox(
                                          "session_5"
                                        )}
                                        value="session_5"
                                      />
                                    }
                                    label="Session 5 - 8/17-8/27 - $75"
                                  /> */}
                                </FormGroup>
                              </Grid>
                            </Grid>
                          </Paper>
                        </div>
                      )}
                      {activeStep === 2 && (
                        <div className={classes.smallContainer}>
                          <Paper className={classes.paper}>
                            <div>
                              <div style={{ marginBottom: 32 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                  Select Time Preference
                                </Typography>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                {this.timeSelectFields().map((time) => {
                                  let name =
                                    time
                                      .split("_")
                                      .join(" ")
                                      .charAt(0)
                                      .toUpperCase() +
                                    time
                                      .split("_")
                                      .join(" ")
                                      .slice(1);

                                  let stateTime = time.split("_").join("Time");
                                  return (
                                    <div
                                      style={{
                                        flex: 1,
                                        width: "300px",
                                        padding: "10px 0px",
                                      }}
                                    >
                                      <FormControl
                                        style={{
                                          flex: 1,
                                          width: "300px",
                                          padding: "10px 0px",
                                        }}
                                      >
                                        <InputLabel htmlFor="time-select-simple">
                                          {name}
                                        </InputLabel>
                                        <Select
                                          value={this.state[stateTime]}
                                          onChange={this.handleChange}
                                          inputProps={{
                                            name: time.split("_").join("Time"),
                                            id: time,
                                          }}
                                        >
                                          <MenuItem value="">
                                            <em>None</em>
                                          </MenuItem>
                                          <MenuItem value={1}>
                                            9AM - 11:30AM
                                          </MenuItem>
                                          <MenuItem value={2}>
                                            11:30AM - 2:30PM
                                          </MenuItem>
                                          <MenuItem value={3}>
                                            2:30PM - 5:30PM
                                          </MenuItem>
                                        </Select>
                                      </FormControl>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </Paper>
                        </div>
                      )}
                      {activeStep === 3 && (
                        <div className={classes.smallContainer}>
                          <Paper className={classes.paper}>
                            <div>
                              <div style={{ marginBottom: 32 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                  Add notes if necessary
                                </Typography>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                {this.timeSelectFields().map((time) => {
                                  let name =
                                    time
                                      .split("_")
                                      .join(" ")
                                      .charAt(0)
                                      .toUpperCase() +
                                    time
                                      .split("_")
                                      .join(" ")
                                      .slice(1);

                                  let stateNotes = time
                                    .split("_")
                                    .join("Notes");
                                  return (
                                    <div
                                      style={{
                                        flex: 1,
                                        width: "300px",
                                        padding: "10px 0px",
                                      }}
                                    >
                                      <FormControl
                                        style={{
                                          flex: 1,
                                          width: "300px",
                                          padding: "10px 0px",
                                        }}
                                      >
                                        <TextField
                                          placeholder={name + " Notes"}
                                          value={this.state[stateNotes]}
                                          name={stateNotes}
                                          onChange={(e) =>
                                            this.handleChange({
                                              ...e,
                                              name: stateNotes,
                                            })
                                          }
                                        />
                                      </FormControl>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </Paper>
                        </div>
                      )}
                      {activeStep === 4 && (
                        <div className={classes.bigContainer}>
                          <Paper className={classes.paper}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <div style={{ width: 380, textAlign: "center" }}>
                                <div style={{ marginBottom: 32 }}>
                                  <Typography
                                    variant="h6"
                                    style={{ fontWeight: "bold" }}
                                    gutterBottom
                                  >
                                    Robots working!
                                  </Typography>
                                  <Typography variant="body2" gutterBottom>
                                    We are processing your request
                                  </Typography>
                                </div>
                                <div>
                                  <Fade
                                    in={loading}
                                    style={{
                                      transitionDelay: loading
                                        ? "800ms"
                                        : "0ms",
                                    }}
                                    unmountOnExit
                                  >
                                    <CircularProgress
                                      style={{
                                        marginBottom: 32,
                                        width: 100,
                                        height: 100,
                                      }}
                                    />
                                  </Fade>
                                </div>
                              </div>
                            </div>
                          </Paper>
                        </div>
                      )}
                      {activeStep !== 4 && (
                        <div className={classes.buttonBar}>
                          {activeStep !== 3 ? (
                            <Button
                              disabled={activeStep === 0}
                              onClick={this.handleBack}
                              className={classes.backButton}
                              size="large"
                            >
                              Back
                            </Button>
                          ) : (
                            <Button
                              disabled={activeStep === 0}
                              onClick={this.handleBack}
                              className={classes.backButton}
                              size="large"
                            >
                              Back
                            </Button>
                          )}
                          {activeStep === 3 ? (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={async () => {
                                try {
                                  await submitSignup({
                                    variables: {
                                      email,
                                      firstName,
                                      sessionPreference: [
                                        session_1,
                                        session_2,
                                        session_3,
                                        session_4,
                                        session_5,
                                        session_6,
                                      ],
                                      timePreference: this.selectedSessionTimes(),
                                      notes: [
                                        sessionNotes1,
                                        sessionNotes2,
                                        sessionNotes3,
                                        sessionNotes4,
                                        sessionNotes5,
                                        sessionNotes6,
                                      ],
                                      age,
                                    },
                                  });
                                  this.setState((state) => ({
                                    activeStep: state.activeStep + 1,
                                  }));
                                  setTimeout(
                                    () => this.props.history.push("/dash"),
                                    5000
                                  );
                                } catch (err) {
                                  alert("something went wrong");
                                }
                              }}
                              size="large"
                              style={
                                this.state.age.length
                                  ? {
                                      background: classes.button,
                                      color: "white",
                                    }
                                  : {}
                              }
                              disabled={this.isNextDisabled(activeStep)}
                            >
                              {this.stepActions()}
                            </Button>
                          ) : (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={this.handleNext}
                              size="large"
                              style={
                                this.state.age.length
                                  ? {
                                      background: classes.button,
                                      color: "white",
                                    }
                                  : {}
                              }
                              disabled={this.isNextDisabled(activeStep)}
                            >
                              {this.stepActions()}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </React.Fragment>
        )}
      </Mutation>
    );
  }
}

export default withRouter(withStyles(styles)(Signup));
