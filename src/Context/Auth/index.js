import { gql, useApolloClient, useMutation } from "@apollo/client";
import React, { createContext, useContext, useState } from "react";
import { useHistory, useLocation } from "react-router";
export const AuthContext = createContext();

const LOGOUT = gql`
  mutation {
    logout {
      ok
    }
  }
`;
const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      name
      user_id
      email
      level
    }
  }
`;

const AuthProvider = ({ children }) => {
  const [me, setMe] = useState(null);
  const client = useApolloClient();
  const [isLogging, setIsLogging] = useState(false);
  const [logout, rLogout] = useMutation(LOGOUT);
  const [login, { loading, data, error }] = useMutation(LOGIN);
  const handlelogout = () => {
    logout();
    client.cache.reset();
    setIsLogging(false);
  };
  const handleLogin = async (email, password) => {
    const a = await login({
      variables: { email, password },
    });
    if (a.data) {
      console.log(a);
      await setIsLogging(true);
      await setMe(a.data);
    }
  };
  let loadinging = loading || rLogout.loading;
  return (
    <AuthContext.Provider
      value={{
        me,
        setMe,
        setIsLogging,
        logout: handlelogout,
        isLogging,
        loading: loadinging,
        login: handleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
