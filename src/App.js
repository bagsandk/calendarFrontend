import { Button, TextField } from "@mui/material";
import moment from "moment";
import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./App.css";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const App = () => {
  const [selected, setSelected] = React.useState(null);
  const [title, setTitle] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [state, setState] = React.useState([
    {
      id: 1,
      start: moment().toDate(),
      end: moment().add(1, "days").toDate(),
      title: "Some title",
      desc: "shdasd",
    },
  ]);
  const onEventResize = (data) => {
    const { start, end } = data;
    const asd = state.map((v, i) => {
      return {
        ...v,
        start: start,
        end: end,
      };
    });
    setState(asd);
  };
  const onEventDrop = (data) => {
    const asd = state.map((v, i) => {
      return {
        ...v,
        start: data.start,
        end: data.end,
      };
    });
    setState(asd);
  };
  const onSelect = (data) => {
    setSelected(data);
    setTitle(data.title);
    setDesc(data.desc);
  };
  const changeCreate = (data) => {
    setSelected(null);
    setTitle("");
    setDesc("");
  };

  return (
    <div
      style={{
        padding: 20,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <div style={{}}>
        <TextField
          id="outlined-basic"
          label="Title"
          variant="outlined"
          fullWidth
          value={title}
          style={{ marginBottom: 20 }}
        />
        <TextField
          id="outlined-basic"
          label="Desc"
          variant="outlined"
          fullWidth
          value={desc}
          style={{ marginBottom: 20 }}
        />
        {selected == null ? (
          <Button variant={"contained"}>Create</Button>
        ) : (
          <>
            <Button style={{ marginRight: 10 }} variant={"contained"}>
              Update
            </Button>
            <a onClick={changeCreate}>Create?</a>
          </>
        )}
      </div>
      <DnDCalendar
        defaultDate={moment().toDate()}
        defaultView="month"
        events={state}
        localizer={localizer}
        onEventDrop={onEventDrop}
        onEventResize={onEventResize}
        resizable
        onSelectEvent={onSelect}
        style={{ height: "100vh" }}
      />
    </div>
  );
};

export default App;
