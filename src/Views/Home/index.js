import { gql, useMutation, useQuery } from "@apollo/client";
import { Add, Delete, Edit } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";
import ShareIcon from "@mui/icons-material/Share";
import { Button, Grid, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import * as React from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../Context/Auth";
import Layout from "../../Layout";
import Dialog from "./Dialog";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

const ALL_CALENDAR = gql`
  query {
    getCalendars {
      calendar_id
      created_by {
        id
        name
      }
      uri
      calendar_name
      status
    }
  }
`;
const CALENDAR_BY_USER = gql`
  query getCalendarsByUser($id: Int!) {
    getCalendarsByUser(user_id: $id) {
      calendar_id
      calendar_name
      created_by {
        id
        name
      }
      status
      uri
      created_at
    }
  }
`;
const APPROVE = gql`
  mutation approveCalendar($id: Int!) {
    approveCalendar(id: $id) {
      status
    }
  }
`;
const REJECT = gql`
  mutation rejectCalendar($id: Int!) {
    rejectCalendar(id: $id) {
      status
    }
  }
`;
const CREATE_CALENDAR = gql`
  mutation createCalendar($calendar_name: String!) {
    createCalendar(calendar_name: $calendar_name) {
      calendar_id
      calendar_name
      created_by
      uri
      status
    }
  }
`;
const UPDATE_CALENDAR = gql`
  mutation updateCalendar($calendar_name: String!, $id: Int!) {
    updateCalendar(id: $id, calendar_name: $calendar_name) {
      calendar_id
      calendar_name
      created_by
      uri
      status
    }
  }
`;
const DELETE_CALENDAR = gql`
  mutation deleteCalendar($calendar_id: Int!) {
    deleteCalendar(calendar_id: $calendar_id) {
      calendar_id
    }
  }
`;
export default function Home() {
  const { me, logout } = useAuth();
  const history = useHistory();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [itemUpdated, setItemUpdated] = React.useState(null);

  const refetch = () => {
    return [
      me && me.level == "ADMIN" ? ALL_CALENDAR : CALENDAR_BY_USER,
      { variables: { id: me && parseInt(me.user_id) } },
    ];
  };
  const { loading, error, data } = useQuery(
    me && me.level == "ADMIN" ? ALL_CALENDAR : CALENDAR_BY_USER,
    { variables: { id: me && parseInt(me.user_id) } }
  );
  const [approve, approveReturn] = useMutation(APPROVE, {
    refetchQueries: refetch,
  });
  const [add, addReturn] = useMutation(CREATE_CALENDAR, {
    refetchQueries: refetch,
  });
  const [update, updateReturn] = useMutation(UPDATE_CALENDAR, {
    refetchQueries: refetch,
  });
  const [deleteCalendar, deleteReturn] = useMutation(DELETE_CALENDAR, {
    refetchQueries: refetch,
  });

  const [reject, rejectReturn] = useMutation(REJECT, {
    refetchQueries: refetch,
  });
  const handleAdd = async (values) => {
    await add({
      variables: { ...values },
    });
    setOpenDialog(false);
  };
  const handleUpdate = async (data, calendar_id) => {
    await update({
      variables: { id: calendar_id, ...data },
    });
    setOpenDialog(false);
  };
  const handleDelete = async (calendar_id) => {
    await deleteCalendar({
      variables: { calendar_id: parseInt(calendar_id) },
    });
    setOpenDialog(false);
  };
  const handleApprove = async (id) => {
    await approve({ variables: { id: parseInt(id) } });
  };
  const handleReject = async (id) => {
    console.log(parseInt(id));
    await reject({ variables: { id: parseInt(id) } });
  };
  const handleOpenItemDialog = (item) => {
    setItemUpdated(item);
    setOpenDialog(true);
  };
  const handleOpenDialog = () => {
    setItemUpdated(null);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  let list =
    me && me.level == "ADMIN"
      ? data && data.getCalendars
      : data && data.getCalendarsByUser;

  let processing = loading;

  return (
    <Layout>
      <Grid container style={{ padding: 30 }}>
        <Grid
          item
          xs={"12"}
          style={{
            display: "flex",
            flexDirection: "row-reverse",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant={"contained"}
            onClick={handleOpenDialog}
            style={{ marginBottom: 10 }}
          >
            <Add />
          </Button>
          <Typography variant={"h5"}>List Calendar</Typography>
        </Grid>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Calendar Name</TableCell>
                <TableCell align="right">Create By</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list &&
                list.map((row) => (
                  <TableRow
                    key={row.calendar_id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      onClick={() => history.push(`/calendar/${row.uri}`)}
                    >
                      <Typography color={"blue  "} variant={"h6"}>
                        {row.calendar_name}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{row.created_by.name}</TableCell>
                    <TableCell align="right">{row.status}</TableCell>
                    <TableCell align="right">
                      <Action
                        level={me.level}
                        handleApprove={() => handleApprove(row.calendar_id)}
                        handleDelete={() => handleDelete(row.calendar_id)}
                        handleOpenItemDialog={() => handleOpenItemDialog(row)}
                        handleReject={() => handleReject(row.calendar_id)}
                        handleShare={() => {
                          navigator.clipboard.writeText(
                            `http://localhost:3000/calendar/${row.uri}`
                          );
                          alert("link copied");
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      {openDialog && (
        <Dialog
          onAdd={handleAdd}
          onClose={handleCloseDialog}
          onUpdate={handleUpdate}
          open={openDialog}
          processing={processing}
          item={itemUpdated}
        />
      )}
    </Layout>
  );
}

const Action = ({
  level,
  handleApprove,
  handleReject,
  handleShare,
  handleOpenItemDialog,
  handleDelete,
}) => {
  return (
    <div>
      {level == "ADMIN" && (
        <>
          <Button onClick={handleApprove}>
            <CheckCircleIcon color={"success"} />
          </Button>
          <Button onClick={handleReject}>
            <DoDisturbOnIcon color={"error"} />
          </Button>
        </>
      )}
      <Button color={"warning"} onClick={handleDelete}>
        <Delete />
      </Button>
      <Button color={"primary"} onClick={handleOpenItemDialog}>
        <Edit />
      </Button>
      <Button onClick={handleShare}>
        <ShareIcon color={"info"} />
      </Button>
    </div>
  );
};
