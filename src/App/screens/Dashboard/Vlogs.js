import {
  ActionIcon,
  Avatar,
  Box,
  Card,
  Menu,
  Modal,
  NativeSelect,
  Pagination,
  ScrollArea,
  Skeleton,
  Switch,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Dots, Search, Trash } from "tabler-icons-react";
import BreadCrumb from "../../Components/BreadCrumbs";
import {
  fetchVlogs,
  handleDeleteVlog,
  handleVlogStatus,
} from "../../helpers/api";
import { dataSlice } from "../../helpers/common";
import notificationHelper from "../../helpers/notificationHelper";
import { dataSearch, Th } from "../../helpers/tableHelper";
import useStyles from "../../Styles/Style";
import "../../Styles/style.css";

function Vlogs() {
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

  const [sortedData, setSortedData] = useState([]);
  const [activePage, setPage] = useState(1);
  const [total, setTotal] = useState(10);
  const [checked, setcheked] = useState(false);
  const [search, setSearch] = useState(""); // For set the search value name of table

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      if (mounted) {
        const response = await fetchVlogs();

        if (response.status === 200) {
          setState((state) => {
            return {
              ...state,
              data: response.data.vlog_data,
              skeletonLoading: false,
            };
          });
          const datas = dataSlice({
            data: response.data.vlog_data,
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
  }, [checked]);

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
    const response = await handleVlogStatus(req);
    if (response.status === 200) {
      setcheked(!checked);
      notificationHelper({
        color: "green",
        title: "Post status changed successfully",
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

  const handleDelete = async (id) => {
    modals.openConfirmModal({
      title: "Do you really want to delete this vlog?",
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => deletePosts(id),
    });
  };

  const deletePosts = async (id) => {
    const req = {
      id: id,
    };
    const response = await handleDeleteVlog(req);
    if (response.status === 200) {
      setcheked(!checked);
      notificationHelper({
        color: "green",
        title: "Vlog deleted successfully",
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

  // Image Modal
  const [openViewImage, setOpenViewImage] = useState(false);

  const [viewVideo, setViewVideo] = useState("");
  const handleViewImageCancel = () => {
    setOpenViewImage(false);
  };
  const handleViewImage = (e) => {
    setViewVideo(e);
    setOpenViewImage(true);
  };

  const rows = sortedData.map((row, index) => (
    <tr key={row.id}>
      <td>{activePage * total - total + index + 1}</td>

      <td onClick={() => handleViewImage(row.video_url)}>
        <Avatar src={row.video_url} size={30} radius={30} />
      </td>

      {row.video_caption !== null ? (
        <td>{row.video_caption}</td>
      ) : (
        <td>Null</td>
      )}

      <td>{row.org_details.orgname}</td>
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
              onClick={() => handleDelete(row.id)}
              icon={<Trash size={14} color="red" />}
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
        <BreadCrumb Text="Vlogs" />
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
                  <Th>Vlog</Th>
                  <Th>Vlog description</Th>
                  <Th>Created by</Th>
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

      <Modal
        opened={openViewImage}
        onClose={() => handleViewImageCancel(false)}
      >
        <Box>
          <div style={{ textAlign: "center" }}>
            <video src={viewVideo} controls width={400} />
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default Vlogs;
