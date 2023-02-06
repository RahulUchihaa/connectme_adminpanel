import {
  ActionIcon,
  Button,
  Card,
  Drawer,
  Group,
  Menu,
  NativeSelect,
  NumberInput,
  Pagination,
  PasswordInput,
  ScrollArea,
  Select,
  Skeleton,
  Switch,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useModals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Dots, Pencil, Search } from "tabler-icons-react";
import BreadCrumb from "../../Components/BreadCrumbs";
import {
  fetchRoles,
  fetchUsers,
  handleAdduser,
  handleUserstatus,
} from "../../helpers/api";
import { dataSlice } from "../../helpers/common";
import notificationHelper from "../../helpers/notificationHelper";
import { dataSearch, Th } from "../../helpers/tableHelper";
import useStyles from "../../Styles/Style";
import "../../Styles/style.css";

function Users() {
  const { classes } = useStyles();
  const modals = useModals();
  const [refreshTable, setRefreshTable] = useState(Date.now());
  const [state, setState] = useState({
    skeletonLoading: true,
    data: [],
    deleteIndex: 0,
    submitLoading: false,
    addDrawer: false,
    openEdit: false,
    editId: "",
    roleData: [],
  });
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState([]);
  const [activePage, setPage] = useState(1);
  const [total, setTotal] = useState(10);
  const [checked, setcheked] = useState(false);

  // For form validation
  const form = useForm({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      mobile: "",
      password: "",
      confirm_password: "",
      roleData: "",
    },
    validate: {
      password: (value) =>
        form.values.password !== form.values.confirm_password &&
        "Please enter the same password in both the fields",
      confirm_password: (value) =>
        form.values.password !== form.values.confirm_password &&
        "Please enter the same password in both the fields",
    },
  });

  const editForm = useForm({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      mobile: "",
      roleData: [],
    },
    validate: {
      password: (value) =>
        form.values.password !== form.values.confirm_password &&
        "Please enter the same password in both the fields",
      confirm_password: (value) =>
        form.values.password !== form.values.confirm_password &&
        "Please enter the same password in both the fields",
    },
  });

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      if (mounted) {
        const response = await fetchUsers();
        if (response.status === 200) {
          setState((state) => {
            return {
              ...state,
              data: response.data.usersdata,
              skeletonLoading: false,
            };
          });
          const datas = dataSlice({
            data: response.data.usersdata,
            page: 1,
            total: 10,
          });
          setSortedData(datas);
        }
        var Roledata = [];
        const roles = await fetchRoles();
        if (roles.status === 200) {
          for (var i = 0; i < roles.data.roles.length; i++) {
            var customRoles = {
              value: roles.data.roles[i].id,
              label: roles.data.roles[i].rolename,
            };
            Roledata.push(customRoles);
          }
          setState((state) => {
            return {
              ...state,
              roleData: Roledata,
            };
          });
        }
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, [checked]);

  //   For Editing the Roles
  const handleEdit = (e) => {
    var datas = state.data.find((text) => text.id === e);
    editForm.setFieldValue("firstname", datas.name);
    editForm.setFieldValue("lastname", datas.lastname);
    editForm.setFieldValue("email", datas.email);
    editForm.setFieldValue("mobile", Number(datas.mobile));
    editForm.setFieldValue("roleData", datas.role.id);

    setState({ ...state, deleteIndex: e, openEdit: true });
  };

  //   For adding the Roles
  const Addusers = async (e) => {
    setState({ ...state, submitLoading: true });
    const req = {
      name: e.firstname,
      lastname: e.lastname,
      email: e.email,
      mobile: e.mobile,
      password: e.password,
      role_id: e.roleData,
      status: 1,
    };
    const response = await handleAdduser(req);
    // Check for response for actions

    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "User added successfully",
      });
      form.reset();
      setState({
        ...state,
        submitLoading: false,
        data: response.data.users_data,
      });
      const datas = dataSlice({
        data: response.data.users_data,
        page: activePage,
        total: total,
      });
      setSortedData(datas);
    } else {
      notificationHelper({
        color: "red",
        title: "Failed! Please enter correct details",
        message: response.data.message,
      });
      setState({ ...state, submitLoading: false });
    }
  };

  //   For Updating the Roles
  const EditUsers = async (e) => {
    setState({ ...state, submitLoading: true });
    const req = {
      name: e.firstname,
      lastname: e.lastname,
      email: e.email,
      mobile: e.mobile,
      role_id: e.roleData,
      status: 1,
      id: state.deleteIndex,
    };

    const response = await handleAdduser(req);

    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "User updated successfully",
      });
      setState({
        ...state,
        submitLoading: false,
        data: response.data.users_data,
      });
      const datas = dataSlice({
        data: response.data.users_data,
        page: activePage,
        total: total,
      });
      setSortedData(datas);
      setRefreshTable(new Date());
    } else {
      notificationHelper({
        color: "red",
        title: "Failed! Please try again after some time",
        message: response.data.message,
      });
      setState({ ...state, submitLoading: false });
    }
  };

  const handleStatus = async (event, id) => {
    modals.openConfirmModal({
      title: "Do you really want to change the status?",
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => changeStatus(event, id),
    });
  };

  const changeStatus = async (event, id) => {
    const req = {
      status: event === false ? 1 : 0,
      id: id,
    };
    const response = await handleUserstatus(req);
    if (response.status === 200) {
      setcheked(!checked);
      notificationHelper({
        color: "green",
        title: "Users status changed successfully",
        message: response.data.message,
      });
    } else {
      notificationHelper({
        color: "red",
        title: "Failed! Please try again after some time",
        message: response.data.message,
      });
    }
  };

  const rows = sortedData.map((row, index) => (
    <tr key={row.id}>
      <td>{activePage * total - total + index + 1}</td>
      <td>{row.name + " " + row.lastname}</td>
      <td>{row.email}</td>
      <td>{row.mobile}</td>
      <td>{row.role.rolename}</td>
      <td>
        <Switch
          checked={row.status}
          color="teal"
          size="xs"
          onChange={(event) =>
            handleStatus(event.currentTarget.checked, row.id)
          }
          label={row.status === 0 ? "InActive" : "Active"}
          thumbIcon={
            row.staus ? (
              <IconCheck size={12} stroke={3} />
            ) : (
              <IconX size={12} stroke={3} />
            )
          }
        />
      </td>

      <td justifycontent="right" align="right">
        <Menu shadow="sm" size="xs">
          <Menu.Target>
            <ActionIcon
              color="Agile"
              type="button"
              style={{ marginLeft: 10 }}
              size="xs"
            >
              <Dots />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              onClick={() => handleEdit(row.id)}
              icon={<Pencil size={14} />}
            >
              Edit
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </td>
    </tr>
  ));
  return (
    <div>
      <Skeleton radius="md" visible={state.skeletonLoading}>
        <BreadCrumb Text="Users" />
      </Skeleton>
      <Skeleton radius="md" mt={10} visible={state.skeletonLoading}>
        <Card className="border">
          <ScrollArea>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ display: "flex" }}>
                {/* For search the table data input forms */}
                <TextInput
                  variant="filled"
                  placeholder="Search by any field"
                  mb="md"
                  size="xs"
                  value={search}
                  icon={<Search size={14} />}
                  onChange={async (e) => {
                    // On change search ofr the data that is enter
                    setSearch(e.currentTarget.value);
                    setPage(1);
                    const datas = await dataSearch({
                      data: state.data,
                      value: e.currentTarget.value,
                      activePage: activePage,
                      total: total,
                    });
                    setSortedData(datas);
                    setRefreshTable(new Date());
                  }}
                  sx={{ width: 250 }}
                />
              </div>
              <div>
                <Group spacing="xs">
                  <Button
                    variant="outline"
                    color="Agile"
                    size="xs"
                    onClick={() => setState({ ...state, addDrawer: true })}
                  >
                    + Add User
                  </Button>
                </Group>
              </div>
            </div>
            <Table
              horizontalSpacing="md"
              verticalSpacing="xs"
              className={classes.striped}
            >
              {/* Table header defines */}
              <thead>
                <tr>
                  <Th>Sl.No</Th>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Phone</Th>
                  <Th>Role</Th>
                  <Th>Status</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              {/* Table body defines from rows function */}
              <tbody key={refreshTable}>
                {rows.length > 0 ? (
                  rows
                ) : (
                  <tr>
                    <td>
                      <Text weight={500} align="center">
                        Nothing found
                      </Text>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </ScrollArea>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: 15,
            }}
          >
            {/* For number of rows display in table */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text size="xs" className="zc-pr-3 zc-pt-1">
                Per Page
              </Text>
              <NativeSelect
                size="xs"
                onChange={async (e) => {
                  setTotal(Number(e.currentTarget.value));
                  setPage(1);
                  const datas = await dataSlice({
                    data: state.data,
                    page: 1,
                    total: Number(e.currentTarget.value),
                  });
                  setSortedData(datas);
                  setRefreshTable(new Date());
                }}
                data={["10", "20", "50", "100"]}
                rightSectionWidth={20}
                sx={{ width: 70 }}
              />
            </div>
            {/* For pagination */}
            <Pagination
              size="sm"
              page={activePage}
              onChange={async (e) => {
                setPage(Number(e));
                const datas = await dataSlice({
                  data: state.data,
                  page: Number(e),
                  total: total,
                });
                setSortedData(datas);
                setRefreshTable(new Date());
              }}
              total={Math.ceil(state.data.length / total)}
              color="Agile"
            />
          </div>
        </Card>
      </Skeleton>
      {/* Drawer for adding users */}
      <Drawer
        opened={state.addDrawer}
        onClose={() => setState({ ...state, addDrawer: false })}
        title="Add User"
        classNames={{
          header: classes.header,
          drawer: classes.drawer,
          closeButton: classes.closeButton,
        }}
        size="xl"
        position="right"
      >
        {/* Drawer content */}
        <div className="zc-p-1">
          <ScrollArea
            style={{ height: 520 }}
            type="scroll"
            offsetScrollbars
            scrollbarSize={5}
          >
            <div className="zc-pr-3 zc-pl-3">
              {/* Product adding form name */}
              <form onSubmit={form.onSubmit((values) => Addusers(values))}>
                <Group>
                  <TextInput
                    required
                    variant="filled"
                    value={form.values.firstname}
                    label="First Name"
                    placeholder="First Name"
                    style={{ width: "47%" }}
                    {...form.getInputProps("firstname")}
                  />
                  <TextInput
                    variant="filled"
                    required
                    value={form.values.lastname}
                    label="Last Name"
                    placeholder="Last Name"
                    style={{ width: "48%" }}
                    {...form.getInputProps("lastname")}
                  />
                </Group>
                <Group mt={10}>
                  <TextInput
                    required
                    variant="filled"
                    value={form.values.email}
                    label="Email"
                    placeholder="Email"
                    style={{ width: "47%" }}
                    {...form.getInputProps("email")}
                  />
                  <NumberInput
                    variant="filled"
                    required
                    style={{ width: "48%" }}
                    value={form.values.mobile}
                    label="Mobile"
                    maxLength={10}
                    placeholder="Mobile"
                    {...form.getInputProps("mobile")}
                  />
                </Group>
                <Group mt={10}>
                  <PasswordInput
                    label="Password"
                    required
                    variant="filled"
                    placeholder="Your password"
                    style={{ width: "47%" }}
                    value={form.values.password}
                    {...form.getInputProps("password")}
                  />
                  <PasswordInput
                    label="Confirm Password"
                    required
                    variant="filled"
                    placeholder="Your password"
                    style={{ width: "48%" }}
                    value={form.values.password}
                    {...form.getInputProps("confirm_password")}
                  />
                </Group>
                <Select
                  variant="filled"
                  classNames={{ item: classes.selectItem }}
                  label="Select Role"
                  searchable
                  required
                  clearable
                  mt={10}
                  placeholder="Select Role"
                  {...form.getInputProps("roleData")}
                  data={state.roleData}
                />
                <Button
                  mt="xl"
                  mb={60}
                  type="submit"
                  fullWidth
                  color="Agile"
                  loading={state.submitLoading}
                >
                  Submit
                </Button>
              </form>
            </div>
          </ScrollArea>
        </div>
      </Drawer>
      {/* Edit Roles Drawer */}
      <Drawer
        opened={state.openEdit}
        onClose={() => setState({ ...state, openEdit: false })}
        title="Edit User"
        classNames={{
          header: classes.header,
          drawer: classes.drawer,
          closeButton: classes.closeButton,
        }}
        size="xl"
        position="right"
      >
        {/* Drawer content */}
        <div className="zc-p-1">
          <ScrollArea
            style={{ height: 520 }}
            type="scroll"
            offsetScrollbars
            scrollbarSize={5}
          >
            <div className="zc-pr-3 zc-pl-3">
              {/* Product Editing form name */}
              <form onSubmit={editForm.onSubmit((values) => EditUsers(values))}>
                <Group>
                  <TextInput
                    required
                    variant="filled"
                    value={editForm.values.firstname}
                    label="First Name"
                    placeholder="First Name"
                    style={{ width: "47%" }}
                    {...editForm.getInputProps("firstname")}
                  />
                  <TextInput
                    variant="filled"
                    required
                    value={editForm.values.lastname}
                    label="Last Name"
                    placeholder="Last Name"
                    style={{ width: "48%" }}
                    {...editForm.getInputProps("lastname")}
                  />
                </Group>
                <Group mt={10}>
                  <TextInput
                    required
                    variant="filled"
                    value={editForm.values.email}
                    label="Email"
                    placeholder="Email"
                    style={{ width: "47%" }}
                    {...editForm.getInputProps("email")}
                  />
                  <NumberInput
                    variant="filled"
                    required
                    style={{ width: "48%" }}
                    value={editForm.values.mobile}
                    label="Mobile"
                    maxLength={10}
                    placeholder="Mobile"
                    {...editForm.getInputProps("mobile")}
                  />
                </Group>
                <Select
                  variant="filled"
                  classNames={{ item: classes.selectItem }}
                  label="Select Role"
                  searchable
                  required
                  clearable
                  mt={10}
                  placeholder="Select Role"
                  {...editForm.getInputProps("roleData")}
                  data={state.roleData}
                />

                <Button
                  mt="xl"
                  mb={60}
                  type="submit"
                  fullWidth
                  color="Agile"
                  loading={state.submitLoading}
                >
                  Update
                </Button>
              </form>
            </div>
          </ScrollArea>
        </div>
      </Drawer>
    </div>
  );
}

export default Users;
