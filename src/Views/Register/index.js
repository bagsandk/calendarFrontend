import {
  Button,
  Avatar,
  CssBaseline,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import { useHistory } from "react-router";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { makeStyles } from "@mui/styles";
import { useMutation, gql } from "@apollo/client";

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
const REGISTER = gql`
  mutation createUser(
    $name: String!
    $email: String!
    $password: String!
    $level: String!
  ) {
    createUser(name: $name, email: $email, password: $password, level: $level) {
      user_id
      name
      email
      level
    }
  }
`;
export default () => {
  const classes = useStyles();
  const history = useHistory();
  const [register, { loading, data, error }] = useMutation(REGISTER);
  const handleRegister = async (email, name, password) => {
    const a = await register({
      variables: { email, name, password, level: "user" },
    });
    if (a.data) {
      history.push("/login");
    }
  };
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("required"),
      email: Yup.string().email("valid email").required("required"),
      password: Yup.string().min(3, "min 3").required("required"),
    }),
    onSubmit: async (values) => {
      handleRegister(values.email, values.name, values.password);
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
            Sign up
          </Typography>
          <form className={classes.form} onSubmit={formik.handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              label={"name"}
              name="name"
              autoComplete="name"
              autoFocus
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
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
              className={classes.submit}
            >
              Sign Un
            </Button>
            <Box mt={5}>
              <Typography variant="body2" color="textSecondary" align="center">
                <Link>Sign Up</Link>
              </Typography>
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
};
