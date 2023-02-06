import {
  Button,
  createStyles,
  Paper,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X } from "tabler-icons-react";
import Bg from "../../assets/images/Bg.jpg";
import { handelLogin } from "../../helpers/api";

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: "100%",
    backgroundSize: "contain",
    minWidth: "100%",
    position: "fixed",
    backgroundImage: `url(${Bg})`,
  },

  form: {
    minHeight: 1000,
    borderRight: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    maxWidth: 450,
    paddingTop: 80,
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
  },
}));

function Login() {
  const { classes } = useStyles();
  let navigate = useNavigate();
  const [submitLoading, setSubmitLoading] = useState(false);
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  useEffect(() => {
    if (isAuthenticated === "true") {
      navigate("/");
    }
  });
  const LoginUser = async (e) => {
    const request = {
      email: e.email,
      password: e.password,
      gcm_id: null,
    };

    setSubmitLoading(true);
    const response = await handelLogin(request);
    if (response.status === 200) {
      setTimeout(() => {
        localStorage.setItem("notification", "yes");
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("isAuthenticated", "true");
        navigate("/");
      }, 300);
      showNotification({
        color: "green",
        title: "Login",
        message: "You have logged in successfully.. 😉",
        icon: <Check />,
      });
      setSubmitLoading(false);
    } else {
      // Error show notification
      showNotification({
        color: "red",
        title: "Login Error",
        message: response.data.message,
        icon: <X />,
      });
      setSubmitLoading(false);
    }
  };
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      gcm_id: "",
    },
    validate: {
      email: (value) => (value.length < 1 ? "Email is required" : null),
      password: (value) => (value.length < 1 ? "Password is required" : null),
    },
  });
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <div justify="center" align="center" style={{ marginBottom: 25 }}>
          Connect me
        </div>
        {/* For login form inputs */}
        <form onSubmit={form.onSubmit((values) => LoginUser(values))}>
          <TextInput
            value={form.values.email}
            label="Email"
            placeholder="example@agileidc.com"
            size="md"
            {...form.getInputProps("email")}
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            size="md"
            value={form.values.password}
            {...form.getInputProps("password")}
          />

          <Button
            mt="xl"
            type="submit"
            fullWidth
            color="Agile"
            loading={submitLoading}
          >
            Login
          </Button>
        </form>
      </Paper>
    </div>
  );
}

export default Login;
