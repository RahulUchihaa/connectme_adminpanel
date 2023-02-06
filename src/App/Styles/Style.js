import { createStyles } from "@mantine/core"; // Import the mantine custome style creater for application
// import BG from "../assets/images/bg.jpg";

const useStyles = createStyles((theme) => ({
  // For login page wallpaer style
  wrapper: {
    minHeight: "100%",
    backgroundSize: "cover",
    minWidth: "100%",
    position: "fixed",
    // backgroundImage: `url(${BG})`,
  },
  //  For login page side form style
  loginForm: {
    position: "absolute",
    top: "20%",
    left: "35%",
  },
  loginForm2: {
    minHeight: 1000,
    borderRight: `1px solid ${
      theme.colorScheme === "dark"
        ? theme.colors.Agile[7]
        : theme.colors.Agile[3]
    }`,
    maxWidth: 450,
    paddingTop: 80,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
  },

  // For sidebar styles list
  navbar: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0,
  },

  links: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
  },
  "mantine-Drawer-drawer": {
    padding: 0,
  },

  link2: {
    width: 50,
    height: 50,
    borderRadius: theme.radius.md,
    display: "flex",

    alignItems: "center",
    justifyContent: "center",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[0],
    },
  },

  active2: {
    "&, &:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
          : theme.colors[theme.primaryColor][0],
      color:
        theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 7],
    },
  },

  linksInner: {
    paddingBottom: theme.spacing.lg,
  },

  // For side bad navigation link hover on sidebar openable navbar
  control: {
    fontWeight: 500,
    display: "block",

    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontSize: theme.fontSizes.sm,
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.Agile[5]
          : theme.colors.Agile[0],
    },
  },

  link: {
    fontWeight: 500,
    display: "block",
    textDecoration: "none",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    paddingLeft: 31,
    marginLeft: 30,
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    borderLeft: `1px solid ${
      theme.colorScheme === "dark"
        ? theme.colors.Agile[3]
        : theme.colors.Agile[3]
    }`,
    cursor: "pointer",
  },

  linkActive: {
    borderLeft: `1px solid ${
      theme.colorScheme === "dark"
        ? theme.colors.Agile[8]
        : theme.colors.Agile[5]
    }`,
    "&, &:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.Agile[5]
          : theme.colors.Agile[0],
      color:
        theme.colorScheme === "dark"
          ? theme.colors.Agile[1]
          : theme.colors.Agile[9],
    },
  },

  chevron: {
    transition: "transform 200ms ease",
  },

  // For drawer header color settings
  drawer: {
    padding: 0,
    margin: 0,
  },
  header: {
    backgroundColor: "#043c64",

    color: "#ffffff",
    padding: 12,
  },
  closeButton: {
    color: "#ffffff",
    " &:hover": {
      color: "#000000",
    },
  },

  // Table striped show data
  striped: {
    width: "100%",
    "thead tr th button:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
    tbody: {
      border: "1px solid rgba(180, 180, 180,0.5)",
    },
    "thead tr th": {
      border: "1px solid rgba(180, 180, 180,0.5)",
    },
    "thead tr th button div": {
      fontSize: 12,
    },
    "tbody tr td": {
      border: "1px solid rgba(180, 180, 180,0.5)",
      fontWeight: 400,
      fontSize: 12,
    },
    "tbody tr:nth-of-type(odd)": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[0],
    },
  },

  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
  th: {
    padding: "0 !important",
  },
  controlTable: {
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    "&:hover": {
      backgroundColor: theme.colors.orange[0],
    },
  },

  // Custome style start
  boxShadowBottom: {
    boxShadow: "0px 10px 10px -15px rgb(0 0 0 0.93)",
  },
  boxShadowRight: {
    boxShadow: "10px 0px 10px -15px rgb(0 0 0 0.93)",
  },
  boxShadow: {
    boxShadow: "0 4px 24px 0 rgb(34 41 47 / 10%)",
  },
}));

export default useStyles;
