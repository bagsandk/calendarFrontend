import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import * as Yup from "yup";

const ItemDialog = ({ onAdd, onClose, onUpdate, open, processing, item }) => {
  const editMode = Boolean(item && item.calendar_id);

  const handleSubmit = (values) => {
    if (item && item.calendar_id) {
      onUpdate({ ...values }, parseInt(item.calendar_id));
    } else {
      onAdd(values);
    }
  };
  const formik = useFormik({
    initialValues: {
      calendar_name: item ? item.calendar_name : "",
    },
    validationSchema: Yup.object({
      calendar_name: Yup.string().required("Harus Disisi"),
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
            id="app-logo"
            label={"Calendar Name"}
            name="calendar_name"
            disabled={processing}
            value={formik.values.calendar_name}
            onChange={formik.handleChange}
            error={
              formik.touched.calendar_name &&
              Boolean(formik.errors.calendar_name)
            }
            helperText={
              formik.touched.calendar_name && formik.errors.calendar_name
            }
          />
        </DialogContent>
        <DialogActions>
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
