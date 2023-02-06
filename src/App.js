import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { NotificationsProvider } from "@mantine/notifications"; // For show the notification import
import { Route, Routes } from "react-router-dom";
// import ProtectedRoute from "./App/Components/ProtectRoute";
import ErrorBoundary from "./App/Components/ErrorBoundary";

import Login from "./App/screens/Authentication/login";

import AppShellDemo from "./App/Components/Appshell";
import ErrorPage from "./App/Components/ErrorPage";
import ProtectedRoute from "./App/Components/ProtectedRoute";
import Dashboard from "./App/screens/Dashboard/Dashboard";
import Offers from "./App/screens/Dashboard/Offers";
import Vlogs from "./App/screens/Dashboard/Vlogs";
import Posts from "./App/screens/Posts";
import Roles from "./App/screens/configuration/Roles";
import Lookup from "./App/screens/configuration/Lookup";
import Childlookup from "./App/screens/configuration/Childlookup";
import Users from "./App/screens/users/Users";
import Organisation from "./App/screens/Organisation";

function App() {
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
  });
  const [color] = useLocalStorage({
    key: "color",
    defaultValue: "#043c64",
  });

  const LightenDarkenColor = (col, amt) => {
    var usePound = false;
    if (col[0] === "#") {
      col = col.slice(1);
      usePound = true;
    }
    var num = parseInt(col, 16);
    var r = (num >> 16) + amt;
    if (r > 255) r = 255;
    else if (r < 0) r = 0;
    var b = ((num >> 8) & 0x00ff) + amt;
    if (b > 255) b = 255;
    else if (b < 0) b = 0;
    var g = (num & 0x0000ff) + amt;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
  };
  return (
    // Colorscheme provider is used for toggling between light and dark modes
    <ColorSchemeProvider
      // colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      {/* Mantine provider is used for customizing our own theme */}
      <MantineProvider
        theme={{
          "::-webkit-scrollbar": {
            backgroundColor: LightenDarkenColor(color, 120),
            width: "5px",
            height: "10px",
            borderRadius: 5,
          },
          "::-webkit-scrollbar-thumb": {
            backgroundColor: LightenDarkenColor(color, 120),
            borderRadius: 5,
            // "#D50000"
          },
          fontFamily: "Inter",
          fontWeight: 300,
          colorScheme,
          colors: {
            Agile: [
              LightenDarkenColor(color, 140),
              LightenDarkenColor(color, 130),
              LightenDarkenColor(color, 120),
              LightenDarkenColor(color, 110),
              LightenDarkenColor(color, 100),
              LightenDarkenColor(color, 90),
              LightenDarkenColor(color, 50),
              LightenDarkenColor(color, 80),
              LightenDarkenColor(color, 50),
              LightenDarkenColor(color, 20),
            ],
          },
        }}
      >
        <NotificationsProvider autoClose={3000}>
          <ErrorBoundary>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route element={<AppShellDemo />}>
                <Route
                  exact
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/roles"
                  element={
                    <ProtectedRoute>
                      <Roles />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/Parentlookup"
                  element={
                    <ProtectedRoute>
                      <Lookup />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/child_lookup/:id"
                  element={
                    <ProtectedRoute>
                      <Childlookup />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/offers"
                  element={
                    <ProtectedRoute>
                      <Offers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vlogs"
                  element={
                    <ProtectedRoute>
                      <Vlogs />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/posts"
                  element={
                    <ProtectedRoute>
                      <Posts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute>
                      <Users />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organisation"
                  element={
                    <ProtectedRoute>
                      <Organisation />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </ErrorBoundary>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
