import { gql, useMutation, useQuery } from "@apollo/client";
import { Add } from "@mui/icons-material";
import { Button, Grid, Typography } from "@mui/material";
import * as React from "react";
import { useHistory, useParams } from "react-router";
import CalendarItem from "../../Component/Calendar";
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

const CALENDAR_BY_URI = gql`
  query getCalendarByUri($uri: String!) {
    getCalendarByUri(uri: $uri) {
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
const EVENT_BY_USER_CALENDAR = gql`
  query getEventsByUser($calendar_id: Int!) {
    getEventsByUser(calendar_id: $calendar_id) {
      event_id
      title
      desc
      created_by {
        id
        name
      }
      start_date
      finish_date
    }
  }
`;

const CREATE_EVENT = gql`
  mutation createEvent(
    $calendar_id: Int!
    $title: String!
    $desc: String!
    $start_date: String!
    $finish_date: String
  ) {
    createEvent(
      calendar_id: $calendar_id
      title: $title
      desc: $desc
      start_date: $start_date
      finish_date: $finish_date
    ) {
      title
      desc
      start_date
      finish_date
    }
  }
`;
const UPDATE_EVENT = gql`
  mutation updateEvent(
    $id: Int!
    $title: String!
    $desc: String!
    $start_date: String!
    $finish_date: String
  ) {
    updateEvent(
      id: $id
      title: $title
      desc: $desc
      start_date: $start_date
      finish_date: $finish_date
    ) {
      title
      desc
      start_date
      finish_date
    }
  }
`;
const DELETE_EVENT = gql`
  mutation deleteEvent($event_id: Int!) {
    deleteEvent(event_id: $event_id) {
      event_id
    }
  }
`;
export default function Calendar() {
  const { me, logout } = useAuth();
  const { uri } = useParams();
  const history = useHistory();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [itemUpdated, setItemUpdated] = React.useState(null);

  const refetch = () => {
    return [
      EVENT_BY_USER_CALENDAR,
      {
        variables: { calendar_id: parseInt(uri) },
      },
    ];
  };
  const { loading, error, data } = useQuery(CALENDAR_BY_URI, {
    variables: { uri },
  });
  const calendar =
    data && data.getCalendarByUri.status == "APPROVE" && data.getCalendarByUri;
  console.log(calendar, "callll");
  const [add, addReturn] = useMutation(CREATE_EVENT, {
    refetchQueries: refetch,
  });
  const [update, updateReturn] = useMutation(UPDATE_EVENT, {
    refetchQueries: refetch,
  });
  const [deleteEvent, deleteReturn] = useMutation(DELETE_EVENT, {
    refetchQueries: refetch,
  });

  const handleAdd = async (values) => {
    console.log(values);
    await add({
      variables: { ...values, calendar_id: parseInt(calendar.calendar_id) },
    });
    setOpenDialog(false);
  };
  const handleUpdate = async (data, event_id) => {
    await update({
      variables: { id: event_id, ...data },
    });
    setOpenDialog(false);
  };
  const handleDelete = async (event_id) => {
    await deleteEvent({
      variables: { event_id: parseInt(event_id) },
    });
    setOpenDialog(false);
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
  let processing = loading;

  return (
    <Layout>
      <Grid container style={{ padding: 30 }}>
        {calendar ? (
          <Content
            handleOpenItemDialog={handleOpenItemDialog}
            calendar={calendar}
            handleOpenDialog={handleOpenDialog}
            handleDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ) : (
          <Grid xs="12">
            <Typography align="center" variant={"h4"} color="error">
              Calendar Can not Access
            </Typography>
          </Grid>
        )}
      </Grid>
      {openDialog && (
        <Dialog
          onAdd={handleAdd}
          onClose={handleCloseDialog}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          open={openDialog}
          processing={processing}
          item={itemUpdated}
        />
      )}
    </Layout>
  );
}

const Content = ({
  handleOpenDialog,
  calendar,
  handleOpenItemDialog,
  onUpdate,
}) => {
  const { loading, error, data } = useQuery(EVENT_BY_USER_CALENDAR, {
    variables: { calendar_id: parseInt(calendar.calendar_id) },
  });
  if (loading) {
    return <>loading...</>;
  }
  console.log("refc", data);
  const list = data && data.getEventsByUser;
  return (
    <>
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography variant={"h5"}>
            Calendar Name : {calendar.calendar_name}
          </Typography>
          <span style={{color:"blue"}}>created by {calendar.created_by.name}</span>
        </div>
        <Typography variant={"h5"}>Event</Typography>
      </Grid>
      <Grid xs={"12"}>
        <CalendarItem
          handleOpenItemDialog={handleOpenItemDialog}
          list={list}
          onUpdate={onUpdate}
        />
      </Grid>
    </>
  );
};
