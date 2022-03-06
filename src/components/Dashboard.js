import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { withRouter } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/lab/Slider";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import SimpleLineChart from "./SimpleLineChart";
import Months from "./common/Months";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import Loading from "./common/Loading";
import ParentChildTable from "./table/ParentChildTable";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";
import { Query } from "react-apollo";
import Topbar from "./Topbar";
import gql from "graphql-tag";
import SimpleModalWrapped from "../components/SimpleModalWrapped";
import jwt from "jsonwebtoken";
import CircularProgress from "@material-ui/core/CircularProgress";
import Auth from "../utils/auth";
const auth = new Auth();

const numeral = require("numeral");
numeral.defaultFormat("0,000");

const backgroundShape = require("../images/shape.svg");

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey["100"],
    overflow: "hidden",
    //background: `url(${backgroundShape}) no-repeat`,
    backgroundSize: "cover",
    backgroundPosition: "0 400px",
    paddingBottom: 200,
    marginTop: "100px",
  },
  fab: {
    // margin: theme.spacing.unit,
    position: "fixed",
    bottom: 15,
    right: 15,
  },
  grid: {
    width: 1200,
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

const PARENT_QUERY = gql`
  query getCurrentParent($email: String!) {
    getParent(email: $email) {
      firstName
      lastName
      email
      phone
    }
    getParentStudents(email: $email) {
      firstName
      sessionPreference
      timePreference
      sessionAssigned
      timeAssigned
      emailSent
      age
      created_at
      id
    }
  }
`;
class Dashboard extends Component {
  state = {
    loading: false,
    data: [],
    email: "",
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
    const currentPath = this.props.location.pathname;

    return (
      <Query
        fetchPolicy="network-only"
        query={PARENT_QUERY}
        variables={{
          email: this.state.email,
        }}
      >
        {({ loading, error, data }) => {
          console.log({ loading, error, data });
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
          return (
            <React.Fragment>
              <Fab color="primary" aria-label="Add" className={classes.fab}>
                <Link to="/signup" style={{ color: "white" }}>
                  <AddIcon linkButton={true} />
                </Link>
              </Fab>
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
                            {!loading &&
                              data.getParent &&
                              data.getParent.firstName + "'s"}{" "}
                            Dashboard
                          </Typography>
                          <Typography variant="body2">
                            Here you can add your children and check back to see
                            your assigned times.
                          </Typography>
                        </div>
                      </div>
                    </Grid>

                    <Grid container spacing={24} xs={12} justify="left">
                      <Loading loading={loading} />
                      <ParentChildTable
                        data={[data.getParentStudents]}
                        email={this.state.email}
                      />
                    </Grid>
                    <SimpleModalWrapped
                      email={this.state.email}
                      parent={data.getParent}
                    />
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

export default withRouter(withStyles(styles)(Dashboard));
