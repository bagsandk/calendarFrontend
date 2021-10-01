import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Avatar,
  Button,
  CssBaseline,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";
import { useAuth } from "../../Context/Auth";

const useStyles = makeStyles({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundColor: "light",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: "8px 4px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: 10,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: 10,
  },
  submit: {
    marginTop: 10,
  },
});

export default () => {
  const classes = useStyles();
  const { login, loading, isLogging } = useAuth();
  const history = useHistory();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("e").required("e"),
      password: Yup.string("e").min(3, "3").required("r"),
    }),
    onSubmit: async (values) => {
      await login(values.email, values.password);
      console.log(isLogging);
      history.push("/home");
    },
  });

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={formik.handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label={"email"}
              name="email"
              autoComplete="email"
              autoFocus
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label={"password"}
              type="password"
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              className={classes.submit}
            >
              Sign In
            </Button>
            <Box mt={5}>
              <Typography variant="body2" color="textSecondary" align="center">
                <Link to="/register">Sign Up</Link>
              </Typography>
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
};
