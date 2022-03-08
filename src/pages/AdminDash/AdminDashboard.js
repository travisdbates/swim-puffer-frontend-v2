import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { withRouter, Link } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/lab/Slider";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import SimpleLineChart from "./SimpleLineChart";
import Months from "../../components/common/Months";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import Loading from "../../components/common/Loading";
import AdminTable from "../../components/table/AdminTable";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Topbar from "../../components/Topbar";
import jwt from "jsonwebtoken";
import Auth from "../../utils/auth";
const auth = new Auth();

const numeral = require("numeral");
numeral.defaultFormat("0,000");

// const backgroundShape = require('../images/shape.svg');

const PARENT_QUERY = gql`
  query GetAllStudents($email: String!) {
    getParent(email: $email) {
      firstName
      lastName
      email
      phone
      admin
    }
    getAllStudents {
      firstName
      timeAssigned
      sessionAssigned
      sessionPreference
      timePreference
      email
      age
      id
    }
  }
`;

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey["100"],
    overflow: "hidden",
    backgroundSize: "cover",
    backgroundPosition: "0 400px",
    paddingBottom: 200,
  },
  grid: {
    width: 1600,
    margin: `0 ${theme.spacing.unit * 2}px`,
    [theme.breakpoints.down("sm")]: {
      width: "calc(100% - 20px)",
    },
  },
  loadingState: {
    opacity: 0.05,
  },
  paper: {
    padding: theme.spacing.unit * 3,
    textAlign: "left",
    color: theme.palette.text.secondary,
  },
  rangeLabel: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: theme.spacing.unit * 2,
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  outlinedButtom: {
    textTransform: "uppercase",
    margin: theme.spacing.unit,
  },
  actionButtom: {
    textTransform: "uppercase",
    margin: theme.spacing.unit,
    width: 152,
    height: 36,
  },
  blockCenter: {
    padding: theme.spacing.unit * 2,
    textAlign: "center",
  },
  block: {
    padding: theme.spacing.unit * 2,
  },
  loanAvatar: {
    display: "inline-block",
    verticalAlign: "center",
    width: 16,
    height: 16,
    marginRight: 10,
    marginBottom: -2,
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
  },
  interestAvatar: {
    display: "inline-block",
    verticalAlign: "center",
    width: 16,
    height: 16,
    marginRight: 10,
    marginBottom: -2,
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.light,
  },
  inlining: {
    display: "inline-block",
    marginRight: 10,
  },
  buttonBar: {
    display: "flex",
  },
  noBorder: {
    borderBottomStyle: "hidden",
  },
  mainBadge: {
    textAlign: "center",
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4,
  },
});

const monthRange = Months;

class AdminDashboard extends Component {
  state = {
    loading: true,
    amount: 15000,
    period: 3,
    start: 0,
    monthlyInterest: 0,
    totalInterest: 0,
    monthlyPayment: 0,
    totalPayment: 0,
    data: [],
    email: "",
  };

  updateValues() {
    const { amount, period, start } = this.state;
    const monthlyInterest =
      (amount * Math.pow(0.01 * 1.01, period)) / Math.pow(0.01, period - 1);
    const totalInterest = monthlyInterest * (period + start);
    const totalPayment = amount + totalInterest;
    const monthlyPayment =
      period > start ? totalPayment / (period - start) : totalPayment / period;

    const data = Array.from({ length: period + start }, (value, i) => {
      const delayed = i < start;
      return {
        name: monthRange[i],
        Type: delayed ? 0 : Math.ceil(monthlyPayment).toFixed(0),
        OtherType: Math.ceil(monthlyInterest).toFixed(0),
      };
    });

    this.setState({
      monthlyInterest,
      totalInterest,
      totalPayment,
      monthlyPayment,
      data,
    });
  }

  componentDidMount() {
    this.updateValues();
    if (!localStorage.getItem("isLoggedIn")) {
      auth.login();
    }

    let email = jwt.decode(localStorage.getItem("idToken")).email;
    this.setState({
      email,
    });
  }

  handleChangeAmount = (event, value) => {
    this.setState({ amount: value, loading: false });
    this.updateValues();
  };

  handleChangePeriod = (event, value) => {
    this.setState({ period: value, loading: false });
    this.updateValues();
  };

  handleChangeStart = (event, value) => {
    this.setState({ start: value, loading: false });
    this.updateValues();
  };

  render() {
    const { classes } = this.props;
    const {
      amount,
      period,
      start,
      monthlyPayment,
      monthlyInterest,
      data,
      loading,
      email,
    } = this.state;
    const currentPath = this.props.location.pathname;

    return (
      <Query
        fetchPolicy="cache-and-network"
        variables={{ email }}
        query={PARENT_QUERY}
      >
        {({ loading, error, data }) => {
          if (loading) {
            return (
              <div
                style={{
                  display: "flex",
                  width: "100vw",
                  height: "100vh",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress
                  style={{
                    marginBottom: 32,
                    width: 100,
                    height: 100,
                  }}
                />
              </div>
            );
          }
          if (error) {
            console.log(error);
            return (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span>Oops... Something went wrong.</span>
              </div>
            );
          }
          if (!data.getParent.admin) {
            window.location.replace("/dash");
          }
          return (
            <React.Fragment>
              <CssBaseline />
              <Topbar currentPath={currentPath} />
              <div className={classes.root}>
                <Grid container justify="center">
                  <Grid
                    spacing={24}
                    alignItems="center"
                    justify="center"
                    container
                    className={classes.grid}
                  >
                    <Grid item xs={12}>
                      <div className={classes.topBar}>
                        <div className={classes.block}>
                          <Typography variant="h6" gutterBottom>
                            Admin Dashboard
                          </Typography>
                          <Typography variant="body1" />
                        </div>
                      </div>
                    </Grid>
                    {/* <Grid item xs={12} md={4}>
                      <Paper className={classes.paper}>
                        <div>
                          <Typography variant="subtitle1" gutterBottom>
                            How much you want to transfer
                          </Typography>
                          <Typography variant="body1">
                            Use slider to set the amount you need.
                          </Typography>
                          <div className={classes.blockCenter}>
                            <Typography
                              color="secondary"
                              variant="h6"
                              gutterBottom>
                              {numeral(amount).format()} USD
                            </Typography>
                          </div>
                          <div>
                            <Slider
                              value={amount}
                              min={20000}
                              max={150000}
                              step={15000}
                              onChange={this.handleChangeAmount}
                            />
                          </div>
                          <div className={classes.rangeLabel}>
                            <div>
                              <Typography variant="subtitle2">
                                15,000 USD
                              </Typography>
                            </div>
                            <div>
                              <Typography variant="subtitle2">
                                150,000 USD
                              </Typography>
                            </div>
                          </div>
                        </div>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Paper className={classes.paper}>
                        <div>
                          <Typography variant="subtitle1" gutterBottom>
                            Period
                          </Typography>
                          <Typography variant="body1">
                            A sample period
                          </Typography>
                          <div className={classes.blockCenter}>
                            <Typography
                              color="secondary"
                              variant="h6"
                              gutterBottom>
                              {period} months
                            </Typography>
                          </div>
                          <div>
                            <Slider
                              value={period}
                              min={1}
                              max={6}
                              step={1}
                              onChange={this.handleChangePeriod}
                            />
                          </div>
                          <div className={classes.rangeLabel}>
                            <div>
                              <Typography variant="subtitle2">
                                1 month
                              </Typography>
                            </div>
                            <div>
                              <Typography variant="subtitle2">
                                6 months
                              </Typography>
                            </div>
                          </div>
                        </div>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Paper className={classes.paper}>
                        <div>
                          <Typography variant="subtitle1" gutterBottom>
                            Start date
                          </Typography>
                          <Typography variant="body1">
                            Set your preferred start date.
                          </Typography>
                          <div className={classes.blockCenter}>
                            <Typography
                              color="secondary"
                              variant="h6"
                              gutterBottom>
                              {monthRange[start]}
                            </Typography>
                          </div>
                          <div>
                            <Slider
                              value={start}
                              min={0}
                              max={5}
                              step={1}
                              onChange={this.handleChangeStart}
                            />
                          </div>
                          <div className={classes.rangeLabel}>
                            <div>
                              <Typography variant="subtitle2">
                                Dec 2018
                              </Typography>
                            </div>
                            <div>
                              <Typography variant="subtitle2">
                                May 2019
                              </Typography>
                            </div>
                          </div>
                        </div>
                      </Paper>
                    </Grid> */}
                    <Grid container spacing={24} justify="center">
                      <Grid item xl={12} md={12}>
                        <Paper
                          className={classes.paper}
                          style={{ position: "relative" }}
                        >
                          {/* <Loading loading={loading} /> */}

                          <Typography variant="subtitle1" gutterBottom>
                            Signups
                          </Typography>
                          <Typography variant="body1">All students</Typography>
                          <div style={{ marginTop: 14, marginBottom: 14 }}>
                            <div className={classes.inlining}>
                              <Avatar className={classes.loanAvatar} />
                              <Typography
                                className={classes.inlining}
                                variant="subtitle2"
                                gutterBottom
                              />
                              <Typography
                                className={classes.inlining}
                                color="secondary"
                                variant="h6"
                                gutterBottom
                              >
                                {data.getAllStudents.length} total signups
                              </Typography>
                            </div>
                            <div className={classes.inlining}>
                              <Avatar className={classes.loanAvatar} />
                              <Typography
                                className={classes.inlining}
                                variant="subtitle2"
                                gutterBottom
                              />
                              <Typography
                                className={classes.inlining}
                                color="secondary"
                                variant="h6"
                                gutterBottom
                              >
                                {
                                  data.getAllStudents.filter(
                                    (signup) => signup.sessionPreference === "1"
                                  ).length
                                }
                                {" - "}
                                1st Session
                              </Typography>
                            </div>
                            <div className={classes.inlining}>
                              <Avatar className={classes.loanAvatar} />
                              <Typography
                                className={classes.inlining}
                                variant="subtitle2"
                                gutterBottom
                              />
                              <Typography
                                className={classes.inlining}
                                color="secondary"
                                variant="h6"
                                gutterBottom
                              >
                                {
                                  data.getAllStudents.filter(
                                    (signup) => signup.sessionPreference === "2"
                                  ).length
                                }
                                {" - "}
                                2nd Session
                              </Typography>
                            </div>
                            <div className={classes.inlining}>
                              <Avatar className={classes.loanAvatar} />
                              <Typography
                                className={classes.inlining}
                                variant="subtitle2"
                                gutterBottom
                              />
                              <Typography
                                className={classes.inlining}
                                color="secondary"
                                variant="h6"
                                gutterBottom
                              >
                                {
                                  data.getAllStudents.filter(
                                    (signup) => signup.sessionPreference === "3"
                                  ).length
                                }
                                {" - "}
                                3rd Session
                              </Typography>
                            </div>
                            <div className={classes.inlining}>
                              <Avatar className={classes.loanAvatar} />
                              <Typography
                                className={classes.inlining}
                                variant="subtitle2"
                                gutterBottom
                              />
                              <Typography
                                className={classes.inlining}
                                color="secondary"
                                variant="h6"
                                gutterBottom
                              >
                                {
                                  data.getAllStudents.filter(
                                    (signup) => signup.sessionPreference === "4"
                                  ).length
                                }
                                {" - "}
                                4th Session
                              </Typography>
                            </div>
                            {/* <div className={classes.inlining}>
                              <Avatar className={classes.interestAvatar} />
                              <Typography
                                className={classes.inlining}
                                variant="subtitle2"
                                gutterBottom>
                                Other type
                              </Typography>
                              <Typography
                                className={classes.inlining}
                                color="secondary"
                                variant="h6"
                                gutterBottom>
                                {numeral(monthlyInterest).format()} units
                              </Typography>
                            </div> */}
                          </div>
                          <div>
                            <AdminTable data={data.getAllStudents} />
                          </div>
                        </Paper>
                      </Grid>
                      {/* <Grid container spacing={24} justify="center">
                <Grid item xl={12} md={12}>
                  <Paper
                    className={classes.paper}
                    style={{ position: 'relative' }}>
                    <Loading loading={loading} />
                    <div className={loading ? classes.loadingState : ''}>
                      <Typography variant="subtitle1" gutterBottom>
                        Some details
                      </Typography>
                      <Typography variant="body1">
                        Details about the graph
                      </Typography>
                      <div style={{ marginTop: 14, marginBottom: 14 }}>
                        <div className={classes.inlining}>
                          <Avatar className={classes.loanAvatar} />
                          <Typography
                            className={classes.inlining}
                            variant="subtitle2"
                            gutterBottom>
                            Type
                          </Typography>
                          <Typography
                            className={classes.inlining}
                            color="secondary"
                            variant="h6"
                            gutterBottom>
                            {numeral(monthlyPayment).format()} units
                          </Typography>
                        </div>
                        <div className={classes.inlining}>
                          <Avatar className={classes.interestAvatar} />
                          <Typography
                            className={classes.inlining}
                            variant="subtitle2"
                            gutterBottom>
                            Othe type
                          </Typography>
                          <Typography
                            className={classes.inlining}
                            color="secondary"
                            variant="h6"
                            gutterBottom>
                            {numeral(monthlyInterest).format()} units
                          </Typography>
                        </div>
                      </div>
                      <div>
                        <SimpleLineChart data={data} />
                      </div>
                    </div>
                  </Paper>
                </Grid> */}
                      {/* <Grid item xs={12} md={4}>
                  <Paper
                    className={classes.paper}
                    style={{ position: 'relative' }}>
                    <Loading loading={loading} />
                    <div className={loading ? classes.loadingState : ''}>
                      <Typography variant="subtitle1" gutterBottom>
                        State
                      </Typography>
                      <div className={classes.mainBadge}>
                        <VerifiedUserIcon
                          style={{ fontSize: 72 }}
                          fontSize={'large'}
                          color={'secondary'}
                        />
                        <Typography
                          variant="h5"
                          color={'secondary'}
                          gutterBottom>
                          Verified
                        </Typography>
                      </div>
                      <div className={classes.buttonBar}>
                        <Button
                          to={{ pathname: '/dashboard', search: `?type=save` }}
                          component={Link}
                          variant="outlined"
                          className={classes.actionButtom}>
                          Save
                        </Button>
                        <Button
                          to={{ pathname: '/dashboard', search: `?type=apply` }}
                          component={Link}
                          color="primary"
                          variant="contained"
                          className={classes.actionButtom}>
                          Apply
                        </Button>
                      </div>
                    </div>
                  </Paper>
                </Grid> */}
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            </React.Fragment>
          );
        }}
      </Query>
    );
  }
}

export default withRouter(withStyles(styles)(AdminDashboard));
