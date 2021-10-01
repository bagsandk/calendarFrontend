import { Button, TextField } from "@mui/material";
import moment from "moment";
import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const CalendarItem = ({
  list,
  handleOpenItemDialog,
  onUpdate,
}) => {
  const [selected, setSelected] = React.useState(null);
  const [title, setTitle] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [state, setState] = React.useState([]);

  const event =
    list &&
    list.map((l) => {
      return {
        id: l.event_id,
        start: moment(l.start_date).toDate(),
        end: moment(l.finish_date).toDate(),
        title: l.title,
        desc: l.desc,
      };
    });
  const onEventResize = (data) => {
    console.log(data);
    const event = data.event;
    const start = data.start;
    const end = data.end;
    onUpdate(
      {
        title: event.title,
        desc: event.desc,
        start_date: moment(start).add(1, "days").toDate(),
        finish_date: moment(end).add(1, "days").toDate(),
      },
      parseInt(event.id)
    );
  };
  const onEventDrop = (data) => {
    console.log(data);
    const event = data.event;
    const start = data.start;
    const end = data.end;
    onUpdate(
      {
        title: event.title,
        desc: event.desc,
        start_date: moment(start).add(1, "days").toDate(),
        finish_date: moment(end).add(1, "days").toDate(),
      },
      parseInt(event.id)
    );
  };
  const onSelect = (data) => {
    handleOpenItemDialog({
      title: data.title,
      desc: data.desc,
      start_date: data.start,
      finish_date: data.end,
      event_id: data.id,
    });
  };
  const handleDoubleClick = (data) => {
   alert(data)
  };

  return (
    <DnDCalendar
      defaultDate={moment().toDate()}
      defaultView="month"
      events={event}
      localizer={localizer}
      onEventDrop={onEventDrop}
      onEventResize={onEventResize}
      resizable
      onDoubleClickEvent={handleDoubleClick}
      onSelectEvent={onSelect}
      style={{ height: "100vh" }}
    />
  );
};

export default CalendarItem;
