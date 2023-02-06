import {
  ActionIcon,
  Code,
  Header,
  Menu,
  Text,
  TextInput,
  MediaQuery,
  Burger,
  useMantineTheme,
} from "@mantine/core"; //for import mantine required functions and theme
import { useLocalStorage } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import { openSpotlight, SpotlightProvider } from "@mantine/spotlight";
import { IconSearch } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { Logout, MoonStars, Settings, Sun } from "tabler-icons-react";

function Headerss({ opened, setOpened }) {
  const theme = useMantineTheme();
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
  });
  const dark = colorScheme === "dark";

  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  const modals = useModals();
  let navigate = useNavigate();
  const actions = [
    {
      title: "Dashboard",
      onTrigger: () => navigate("/"),
    },
    {
      title: "Vlogs",
      onTrigger: () => navigate("/vlogs"),
    },
    {
      title: "Offers",
      onTrigger: () => navigate("/offers"),
    },
    {
      title: "Posts",
      onTrigger: () => navigate("/posts"),
    },
    {
      title: "Organisations",
      onTrigger: () => navigate("/organisation"),
    },
    {
      title: "Users",
      onTrigger: () => navigate("/users"),
    },
    {
      title: "Roles",
      onTrigger: () => navigate("/roles"),
    },
    {
      title: "Lookup",
      onTrigger: () => navigate("/Parentlookup"),
    },
  ];
  return (
    <Header
      height={42}
      style={{
        borderBottom: "0px",
      }}
      className="border-bottom noprint"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: theme.colorScheme === "dark" ? "#25262b" : "#FFFFFF",
        }}
      >
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>
        <div
          style={{
            backgroundColor:
              theme.colorScheme === "dark" ? "#25262b" : "#FFFFFF",
            display: "flex",
            justifyContent: "space-between",
            padding: 5,
            paddingTop: 6,
            marginLeft: 10,
          }}
        >
          <Text color={theme.colorScheme === "dark" ? "#FFFFFF" : "#25262b"}>
            {" "}
            Connect Me
          </Text>
        </div>

        <div
          style={{
            backgroundColor:
              theme.colorScheme === "dark" ? "#25262b" : "#FFFFFF",
            display: "flex",
            justifyContent: "space-between",
            padding: 5,
            paddingTop: 6,
            marginRight: 8,
          }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            <ActionIcon
              className="zc-mt-1 no-drag"
              color={dark ? "yellow" : "blue"}
              onClick={() => toggleColorScheme()}
              title="Toggle dark light"
            >
              {dark ? (
                <Sun strokeWidth="0.8" size={20} />
              ) : (
                <MoonStars strokeWidth="0.8" size={20} />
              )}
            </ActionIcon>

            {/* For Profile Dropdown list */}
            <Menu shadow="md" className="no-drag zc-mr-1" width={200}>
              <Menu.Target>
                <ActionIcon
                  className="zc-mt-1"
                  color="dark"
                  type="button"
                  title="Setting"
                >
                  <Settings strokeWidth="0.8" size={20} />
                </ActionIcon>
              </Menu.Target>
              {/* Profile setting page */}
              <Menu.Dropdown>
                <Menu.Item
                  icon={<Settings size={14} />}
                  // onClick={() => navigate("/manages")}
                >
                  Settings
                </Menu.Item>
                {/* For logout button */}
                <Menu.Item
                  onClick={() => {
                    modals.openConfirmModal({
                      title: "Confirm Logout ",
                      children: <Text size="sm">Do you want to logout.</Text>,

                      labels: {
                        confirm: "Confirm",
                        cancel: "Cancel",
                      },
                      confirmProps: { color: "red" },
                      onCancel: () => console.log("Cancel"),
                      onConfirm: () => {
                        localStorage.clear();
                        navigate("/login");
                      },
                    });
                  }}
                  color="red"
                  icon={<Logout size={14} />}
                >
                  Log Out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>

            <SpotlightProvider
              className="no-drag"
              actions={actions}
              searchPlaceholder="Search..."
              shortcut={["ctrl + k", "mod + K", "⌘ + K"]}
              nothingFoundMessage="Nothing found..."
            >
              <div
                style={{ width: 150 }}
                className="no-drag"
                onClick={openSpotlight}
              >
                <TextInput
                  variant="filled"
                  placeholder="Search"
                  onClick={openSpotlight}
                  size="xs"
                  pt={2}
                  pb={1}
                  shortcut={["ctrl + k", "mod + K", "⌘ + K"]}
                  icon={<IconSearch size={12} stroke={1.5} />}
                  rightSectionWidth={70}
                  rightSection={<Code>⌘ + K</Code>}
                />
              </div>
            </SpotlightProvider>
          </div>
        </div>
      </div>
    </Header>
  );
}

export default Headerss;
