import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import moment from "moment";
import React from "react";
import * as Yup from "yup";

const ItemDialog = ({
  onAdd,
  onClose,
  onUpdate,
  open,
  processing,
  item,
  onDelete,
}) => {
  const [startDate, setStartDate] = React.useState(
    item ? item.start_date : new Date()
  );
  const [finishDate, setFinishDate] = React.useState(
    item ? item.finish_date : new Date()
  );
  const editMode = Boolean(item && item.event_id);
  const handleSubmit = (values) => {
    if (item && item.event_id) {
      onUpdate(
        {
          ...values,
          start_date: moment(startDate).add(1, "days").toDate(),
          finish_date: moment(finishDate).add(1, "days").toDate(),
        },
        parseInt(item.event_id)
      );
    } else {
      onAdd({ ...values, start_date: startDate, finish_date: finishDate });
    }
  };
  const formik = useFormik({
    initialValues: {
      title: item ? item.title : "",
      desc: item ? item.desc : "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Harus Disisi"),
      desc: Yup.string().required("Harus Disisi"),
    }),
    onSubmit: handleSubmit,
  });

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={onClose}
      aria-labelledby="user-dialog-title"
    >
      <form onSubmit={formik.handleSubmit} noValidate>
        <DialogTitle id="user-dialog-title">
          {editMode ? "Update" : "Add"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title-id"
            label={"Title"}
            name="title"
            disabled={processing}
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="desc-id"
            label={"Desc"}
            name="desc"
            disabled={processing}
            value={formik.values.desc}
            onChange={formik.handleChange}
            error={formik.touched.desc && Boolean(formik.errors.desc)}
            helperText={formik.touched.desc && formik.errors.desc}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label="Start Date"
              inputFormat="MM/dd/yyyy"
              value={startDate}
              onChange={(v) => setStartDate(v)}
              renderInput={(params) => (
                <TextField style={{ marginTop: 20 }} {...params} />
              )}
            />
            <DesktopDatePicker
              label="Finish Date"
              inputFormat="MM/dd/yyyy"
              value={finishDate}
              minDate={startDate}
              onChange={(v) => setFinishDate(v)}
              renderInput={(params) => (
                <TextField
                  style={{ marginTop: 20, float: "right" }}
                  {...params}
                />
              )}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          {item && (
            <Button
              color="error"
              style={{ float: "left" }}
              onClick={() => onDelete(item.event_id)}
            >
              {"Delete"}
            </Button>
          )}
          <Button onClick={onClose}>{"Cancel"}</Button>
          <Button
            disabled={processing}
            color="primary"
            type="submit"
            variant="contained"
          >
            {editMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ItemDialog;
