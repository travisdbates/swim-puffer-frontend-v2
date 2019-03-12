import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { timeHelper } from './timeHelper';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import gql from 'graphql-tag';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Query, Mutation } from 'react-apollo';
import { times } from './sessionTimesHelper';
import ReactTooltip from 'react-tooltip';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 700
  },
  rootEmpty: {
    width: '100%',
    height: '250px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    textAlign: 'center'
  }
});

const UPDATE_STUDENT = gql`
  mutation UpdateStudent(
    $id: ID!
    $email: String!
    $firstName: String!
    $age: Int
    $sessionAssigned: Int
    $timeAssigned: Int
    $sideAssigned: String
  ) {
    studentUpdate(
      id: $id
      email: $email
      firstName: $firstName
      age: $age
      timeAssigned: $timeAssigned
      sessionAssigned: $sessionAssigned
      sideAssigned: $sideAssigned
    ) {
      firstName
      age
      sessionAssigned
      timeAssigned
      sideAssigned
      id
      __typename
    }
  }
`;

const PARENT_QUERY = gql`
  query GetAllStudents {
    getAllStudents {
      firstName
      timeAssigned
      sessionAssigned
      sessionPreference
      timePreference
      sideAssigned
      notes
      email
      age
      id
      __typename
    }
  }
`;

class AdminTable extends Component {
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const { classes } = this.props;
    return (
      <Query fetchPolicy="cache-and-network" query={PARENT_QUERY}>
        {({ loading, error, data }) => {
          if (loading) {
            return (
              <div
                style={{
                  display: 'flex',
                  width: '100vw',
                  height: '100vh',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                <CircularProgress
                  style={{
                    marginBottom: 32,
                    width: 100,
                    height: 100
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
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                <span>Oops... Something went wrong.</span>
              </div>
            );
          }

          if (!data.getAllStudents.length > 0) {
            return (
              <Paper className={classes.rootEmpty}>
                <span
                  role="img"
                  aria-label="emoji"
                  style={{
                    fontSize: 58,
                    textAlign: 'center',
                    display: 'inline-block',
                    width: '100%'
                  }}>
                  🙈
                </span>
                <span>Oops! No kiddos have been signed up yet!</span>
                <span>Click the + button below, or click "Signup" above!</span>
              </Paper>
            );
          }

          return (
            <Mutation mutation={UPDATE_STUDENT}>
              {updateStudent => (
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
                        <TableCell align="right">Side Assigned</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.getAllStudents
                        .sort((a, b) => {
                          return (
                            new Date(a.sessionPreference) -
                            new Date(b.sessionPreference)
                          );
                        })
                        .map(row => (
                          <TableRow hover key={row.id}>
                            <TableCell component="th" scope="row">
                              {row.firstName}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {row.age}
                            </TableCell>
                            <TableCell align="right">
                              {row.sessionPreference}
                            </TableCell>
                            <TableCell
                              style={
                                row.notes
                                  ? { color: '#54B3B0', cursor: 'pointer' }
                                  : null
                              }
                              align="right">
                              {row.notes ? (
                                <p data-delay-show="100" data-tip={row.notes}>
                                  {timeHelper(row.timePreference)}
                                </p>
                              ) : (
                                timeHelper(row.timePreference)
                              )}
                              {/* {row.timePreference} */}
                            </TableCell>
                            <TableCell align="right">
                              <Select
                                value={row.sessionAssigned}
                                onChange={async e => {
                                  e.preventDefault();
                                  await updateStudent({
                                    variables: {
                                      firstName: row.firstName,
                                      email: row.email,
                                      sessionAssigned: e.target.value,
                                      id: row.id,
                                      __typename: row.__typename
                                    }
                                  });
                                }}
                                input={
                                  <OutlinedInput
                                    labelWidth={1}
                                    name="sessionAssigned"
                                  />
                                }>
                                <MenuItem value="">
                                  <em>Select an option</em>
                                </MenuItem>
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={4}>4</MenuItem>
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={6}>6</MenuItem>
                              </Select>
                            </TableCell>
                            <TableCell align="right">
                              <Select
                                value={row.timeAssigned}
                                onChange={async e => {
                                  e.preventDefault();
                                  await updateStudent({
                                    variables: {
                                      firstName: row.firstName,
                                      email: row.email,
                                      timeAssigned: e.target.value,
                                      id: row.id,
                                      __typename: row.__typename
                                    }
                                  });
                                }}
                                input={
                                  <OutlinedInput
                                    labelWidth={1}
                                    name="timeAssigned"
                                  />
                                }>
                                <MenuItem value="">
                                  <em>Select an option</em>
                                </MenuItem>
                                {times.map(time => {
                                  return (
                                    <MenuItem value={time.value}>
                                      {time.label}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </TableCell>
                            <TableCell align="right">
                              <Select
                                value={row.sideAssigned}
                                onChange={async e => {
                                  e.preventDefault();
                                  await updateStudent({
                                    variables: {
                                      firstName: row.firstName,
                                      email: row.email,
                                      sideAssigned: e.target.value,
                                      id: row.id,
                                      __typename: row.__typename
                                    }
                                  });
                                }}
                                input={
                                  <OutlinedInput
                                    labelWidth={1}
                                    name="timeAssigned"
                                  />
                                }>
                                <MenuItem value="">
                                  <em>Select an option</em>
                                </MenuItem>
                                <MenuItem value={'N'}>N</MenuItem>
                                <MenuItem value={'S'}>S</MenuItem>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      <ReactTooltip />
                    </TableBody>
                  </Table>
                </Paper>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

AdminTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AdminTable);
