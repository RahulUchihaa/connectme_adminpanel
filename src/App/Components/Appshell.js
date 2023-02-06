import { useState } from "react";
import { AppShell, useMantineTheme } from "@mantine/core";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function AppShellDemo() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={<Sidebar opened={opened} />}
      header={<Header setOpened={setOpened} opened={opened} />}
    >
      <div>
        <Outlet />
      </div>
    </AppShell>
  );
}
