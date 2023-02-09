import {
  ActionIcon,
  Avatar,
  Box,
  Card,
  Group,
  Menu,
  Modal,
  NativeSelect,
  Pagination,
  ScrollArea,
  Skeleton,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useEffect, useState } from "react";
import { Dots, Search, Trash } from "tabler-icons-react";
import BreadCrumb from "../../Components/BreadCrumbs";
import { fetchOffers, handleDeleteOffers } from "../../helpers/api";
import { dataSlice } from "../../helpers/common";
import notificationHelper from "../../helpers/notificationHelper";
import { dataSearch, setSorting, Th } from "../../helpers/tableHelper";
import useStyles from "../../Styles/Style";
import "../../Styles/style.css";

function Offers() {
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
  const [sortBy, setSortBy] = useState(null); // Seting the sortby table type
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      if (mounted) {
        const response = await fetchOffers();

        if (response.status === 200) {
          setState((state) => {
            return {
              ...state,
              data: response.data.offers,
              skeletonLoading: false,
            };
          });
          const datas = dataSlice({
            data: response.data.offers,
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

  const handleDelete = async (id) => {
    modals.openConfirmModal({
      title: "Do you really want to delete this offer?",
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => deleteOffers(id),
    });
  };

  const deleteOffers = async (id) => {
    const req = {
      id: id,
    };
    const response = await handleDeleteOffers(req);

    if (response.status === 200) {
      setcheked(!checked);
      notificationHelper({
        color: "green",
        title: "Offer deleted successfully",
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
  const [viewImage, setViewImage] = useState("");
  const handleViewImageCancel = () => {
    setOpenViewImage(false);
  };
  const handleViewImage = (e) => {
    setViewImage(e);
    setOpenViewImage(true);
  };

  const rows = sortedData.map((row, index) => (
    <tr key={row.id}>
      <td>{activePage * total - total + index + 1}</td>
      <td onClick={() => handleViewImage(row.image)}>
        <Group spacing="sm">
          <Avatar src={row.image} size={30} radius={30} />
          {row.title}
        </Group>
      </td>
      <td>{row.description}</td>
      <td>{row.offer_posted_at}</td>
      <td>{row.offer_status}</td>
      <td>{row.offer_from}</td>
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
        <BreadCrumb Text="Offers" />
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
                  <Th>Title</Th>
                  <Th>Description</Th>
                  <Th>Created At</Th>
                  <Th>Status</Th>
                  <Th
                    sorted={sortBy === "offer_from"}
                    reversed={reverseSortDirection}
                    onSort={async () => {
                      const reversed =
                        "offer_from" === sortBy ? !reverseSortDirection : false;
                      setReverseSortDirection(reversed);
                      setSortBy("offer_from");
                      const datas = await setSorting({
                        data: state.data,
                        sortby: "offer_from",
                        reversed: reversed,
                        search: search,
                        activePage: activePage,
                        total: total,
                      });
                      setSortedData(datas);
                      setRefreshTable(new Date());
                    }}
                  >
                    Created By
                  </Th>
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
            <img src={viewImage} alt="PostsImage" width="100%" />
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default Offers;
