import React, { useState, useEffect } from "react";
import BreadCrumb from "../../Components/BreadCrumbs";
import {
  ActionIcon,
  Button,
  Card,
  Drawer,
  Group,
  Menu,
  NativeSelect,
  Pagination,
  ScrollArea,
  Skeleton,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { Dots, Pencil, Search, Trash } from "tabler-icons-react";
import useStyles from "../../Styles/Style";
import { dataSearch, Th } from "../../helpers/tableHelper";
import { fetchRoles, handleAddRole, handleDeleteRole } from "../../helpers/api";
import { dataSlice } from "../../helpers/common";
import { useModals } from "@mantine/modals";
import { useForm } from "@mantine/form";
import "../../Styles/style.css";
import notificationHelper from "../../helpers/notificationHelper";

function Roles() {
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
  });
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState([]);
  const [activePage, setPage] = useState(1);
  const [total, setTotal] = useState(10);

  // For form validation
  const form = useForm({
    initialValues: {
      rolename: "",
      roledescription: "",
    },
  });

  const editForm = useForm({
    initialValues: {
      rolename: "",
      roledescription: "",
    },
  });

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      if (mounted) {
        const response = await fetchRoles();

        if (response.status === 200) {
          setState((state) => {
            return {
              ...state,
              data: response.data.roles,
              skeletonLoading: false,
            };
          });
          const datas = dataSlice({
            data: response.data.roles,
            page: 1,
            total: 10,
          });
          setSortedData(datas);
        }
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  //   Confirmation modal for deleting the variables
  const openConfirmModal = (e) => {
    setState({ ...state, deleteIndex: e });
    modals.openConfirmModal({
      title: "Do you want to delete this role",
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => DeleteRole(e),
    });
  };

  //   For Editing the Roles
  const handleEdit = (e) => {
    var datas = state.data.find((text) => text.id === e);
    editForm.setFieldValue("rolename", datas.rolename);
    editForm.setFieldValue("roledescription", datas.roledescription);
    setState({ ...state, deleteIndex: e, openEdit: true });
  };

  //   For adding the Roles
  const AddRoles = async (e) => {
    setState({ ...state, submitLoading: true });
    const req = {
      rolename: e.rolename,
      roledescription: e.roledescription,
      status: "y",
    };
    const response = await handleAddRole(req);
    // Check for response for actions
    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Role added successfully",
      });
      form.reset();

      setState({
        ...state,
        submitLoading: false,
        data: response.data.role_data,
      });
      const datas = dataSlice({
        data: response.data.role_data,
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
  const EditRole = async (e) => {
    setState({ ...state, submitLoading: true });
    const req = {
      rolename: e.rolename,
      roledescription: e.roledescription,
      id: state.deleteIndex,
      status: "y",
    };

    const response = await handleAddRole(req);
    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Role updated successfully",
      });
      setState({
        ...state,
        submitLoading: false,
        data: response.data.role_data,
      });
      const datas = dataSlice({
        data: response.data.role_data,
        page: activePage,
        total: total,
      });
      setSortedData(datas);
      setRefreshTable(new Date());
    } else {
      notificationHelper({
        color: "red",
        title: "Failed! Please enter correct details",
        message: response.data.message,
      });
      setState({ ...state, submitLoading: false });
    }
  };

  const DeleteRole = async (e) => {
    const response = await handleDeleteRole(e);
    // Check the response for notification and actions
    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Role deleted successfully",
      });
      var filter = state.data;
      filter = filter.filter((img) => img.id !== e);
      setState({
        ...state,
        submitLoading: false,
        data: filter,
      });
      const datas = dataSlice({
        data: filter,
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

  const rows = sortedData.map((row, index) => (
    <tr key={row.id}>
      <td>{activePage * total - total + index + 1}</td>
      <td>{row.rolename}</td>
      <td>{row.roledescription}</td>

      <td justifycontent="right" align="right">
        <Menu shadow="sm" size="xs">
          <Menu.Target>
            <ActionIcon
              color="zevcore"
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
            <Menu.Item
              onClick={() => openConfirmModal(row.id)}
              icon={<Trash size={14} />}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </td>
    </tr>
  ));
  return (
    <div>
      <Skeleton radius="md" visible={state.skeletonLoading}>
        <BreadCrumb Text="Roles" />
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
                    + Add Roles
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
                  <Th>Rolename</Th>
                  <Th>Role Description</Th>
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
      {/* Drawer for adding roles */}
      <Drawer
        opened={state.addDrawer}
        onClose={() => setState({ ...state, addDrawer: false })}
        title="Add Role"
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
              <form onSubmit={form.onSubmit((values) => AddRoles(values))}>
                <TextInput
                  required
                  variant="filled"
                  value={form.values.rolename}
                  label="Role Name"
                  placeholder="Role Name"
                  {...form.getInputProps("rolename")}
                />
                <TextInput
                  variant="filled"
                  mt={10}
                  value={form.values.roledescription}
                  label="Role Description"
                  placeholder="Role Description"
                  {...form.getInputProps("roledescription")}
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
        title="Edit Role"
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
              <form onSubmit={editForm.onSubmit((values) => EditRole(values))}>
                <TextInput
                  required
                  variant="filled"
                  value={editForm.values.rolename}
                  label="Role Name"
                  placeholder="Role Name"
                  {...editForm.getInputProps("rolename")}
                />
                <TextInput
                  variant="filled"
                  mt={5}
                  value={editForm.values.roledescription}
                  label="Role Description"
                  placeholder="Role Description"
                  {...editForm.getInputProps("roledescription")}
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

export default Roles;
