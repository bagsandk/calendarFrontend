import { Logout } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import { Grid, Typography, Button } from "@mui/material";
import React from "react";
import { useHistory } from "react-router";
import { useAuth } from "../Context/Auth";

function Layout({ children }) {
  const { me, logout } = useAuth();
  const history = useHistory();
  return (
    <div>
      <Grid container spacing="2">
        <Grid
          container
          xs="12"
          style={{
            backgroundColor: "#0da2ff",
            paddingRight: 30,
            paddingLeft: 30,
          }}
        >
          <Grid item xs="6" style={{ padding: 5 }}>
            <Typography variant="h4" color="white">
              Calendar APP
            </Typography>
          </Grid>
          <Grid
            item
            xs="6"
            style={{ display: "flex", justifyContent: "flex-end", padding: 5 }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div>
                <Typography variant="body1" style={{ fontWeight: "bold" }}>
                  Hay {me && me.name}
                  {/* <span>level : </span> */}
                </Typography>
                <small style={{ margin: 0 }}>Level {me && me.level}</small>
              </div>
              <Button
                onClick={() => {
                  logout();
                  history.push("/");
                }}
                color={"error"}
                style={{ margin: 5, marginLeft: 10 }}
                variant={"contained"}
                size={"small"}
              >
                Logout
                <Logout />
              </Button>
            </div>
          </Grid>
        </Grid>
        <Grid item xs="12" style={{ margin: 30 }}>
          {children}
        </Grid>
        <Grid
          container
          xs="12"
          style={{
            paddingRight: 30,
            paddingLeft: 30,
            position: "relative",
            bottom: 0,
            left: 0,
            backgroundColor: "#0da2ff",
          }}
        >
          <p>footer</p>
        </Grid>
      </Grid>
    </div>
  );
}

export default Layout;
