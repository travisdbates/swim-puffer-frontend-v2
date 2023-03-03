import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { timeHelper } from "./timeHelper";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { timesForDash } from "../table/sessionTimesHelper";
const styles = (theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto",
  },
  table: {
    minWidth: 700,
  },
  rootEmpty: {
    width: "100%",
    height: "250px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    textAlign: "center",
  },
});

const GET_UPDATED_STUDENT = gql`
  query getCurrentParent($email: String!) {
    getParentStudents(email: $email) {
      firstName
      sessionPreference
      timePreference
      sessionAssigned
      timeAssigned
      age
    }
  }
`;

const UPDATE_STUDENT = gql`
  mutation UpdateStudent($email: String!, $firstName: String!, $age: Int!) {
    studentUpdate(email: $email, firstName: $firstName, age: $age) {
      firstName
      age
      sessionPreference
      timePreference
      id
    }
  }
`;

class ParentChildTable extends Component {
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const { classes, data } = this.props;
    if (!data[0]) {
      return null;
    }
    if (!data[0].length > 0) {
      return (
        <Paper className={classes.rootEmpty}>
          <span
            role="img"
            aria-label="emoji"
            style={{
              fontSize: 58,
              textAlign: "center",
              display: "inline-block",
              width: "100%",
            }}
          >
            🙈
          </span>
          <span>Oops! No kiddos have been signed up yet!</span>
          <span>Click the + button below, or click "Signup" above!</span>
        </Paper>
      );
    }

    return (
      <Mutation mutation={UPDATE_STUDENT}>
        {(updateStudent) => (
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Child Name</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell align="right">Session Preference</TableCell>
                  <TableCell align="right">Time Preference</TableCell>
                  <TableCell align="right">Session Assigned</TableCell>
                  <TableCell align="right">Time Assigned</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data[0]
                  .sort((a, b) => {
                    return (
                      new Date(a.sessionPreference) -
                      new Date(b.sessionPreference)
                    );
                  })
                  .map((row) => (
                    <TableRow hover key={row.firstName + row.sessionPreference}>
                      <TableCell component="th" scope="row">
                        {row.firstName}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Select
                          value={row.age}
                          onChange={async (e) => {
                            e.preventDefault();
                            await updateStudent({
                              variables: {
                                email: this.props.email,
                                firstName: row.firstName,
                                age: e.target.value,
                              },
                            });
                            window.location.reload();
                          }}
                          input={<OutlinedInput labelWidth={1} name="age" />}
                        >
                          <MenuItem value="">
                            <em>Select an option</em>
                          </MenuItem>
                          <MenuItem value={1}>1</MenuItem>
                          <MenuItem value={1.5}>18 months</MenuItem>
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
                      </TableCell>
                      <TableCell align="right">
                        {row.sessionPreference}
                      </TableCell>
                      <TableCell align="right">
                        {timeHelper(row.timePreference)}
                        {/* {row.timePreference} */}
                      </TableCell>
                      <TableCell align="right">
                        {row.emailSent ? row.sessionAssigned : "N/A"}
                      </TableCell>
                      <TableCell align="right">
                        {row.emailSent ? timesForDash[row.timeAssigned] : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Mutation>
    );
  }
}

ParentChildTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ParentChildTable);
