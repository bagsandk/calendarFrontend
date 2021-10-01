import { gql, useApolloClient, useQuery } from "@apollo/client";
import React from "react";
import { Redirect, Route } from "react-router";
import { useAuth } from "../Context/Auth";
const ME = gql`
  query {
    me {
      user_id
      name
      email
      level
    }
  }
`;
function PrivateRoute({ component: Component, ...rest }) {
  const { setMe, isLogging, setIsLogging } = useAuth();
  const { loading, error, data } = useQuery(ME, {
    onCompleted(me) {
      console.log("aaa", data);
      setMe(data.me);
      if (data) {
        setIsLogging(true);
      } else {
        setIsLogging(false);
      }
    },
  });
  if (loading) {
    return (
      <div>
        <p>loading...</p>
      </div>
    );
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        data && data.me !== null ? (
          <Component {...props} />
        ) : (
          <Kick location={props.location} />
        )
      }
    />
  );
}

const Kick = ({ location }) => {
  const client = useApolloClient();
  client.cache.reset();
  return (
    <Redirect
      to={{
        pathname: "/",
        state: { from: location },
      }}
    />
  );
};
export default PrivateRoute;
