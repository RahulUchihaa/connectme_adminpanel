import {
  Avatar,
  Box,
  Card,
  createStyles,
  Divider,
  Grid,
  Modal,
  NativeSelect,
  Pagination,
  ScrollArea,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Search, UserCheck, UserOff, UserX } from "tabler-icons-react";
import Batman from "../../assets/images/Batman.png";
import {
  fetchDashboardata,
  fetchOffers,
  fetchPosts,
  fetchRoles,
  fetchVlogs,
} from "../../helpers/api";
import { dataSlice } from "../../helpers/common";
import { dataSearch, setSorting, Th } from "../../helpers/tableHelper";

function Dashboard() {
  const useStyles = createStyles((theme) => ({
    icon: {
      width: 21,
      height: 21,
      borderRadius: 21,
    },
  }));
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
    offersData: [],
    dashboardData: [],
  });

  const [sortedData, setSortedData] = useState([]);
  const [activePage, setPage] = useState(1);
  const [total, setTotal] = useState(10);
  const [checked, setcheked] = useState(false);
  const [search, setSearch] = useState(""); // For set the search value name of table
  const [sortBy, setSortBy] = useState(null); // Seting the sortby table type
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      if (mounted) {
        const response = await fetchPosts();

        if (response.status === 200) {
          setState((state) => {
            return {
              ...state,
              data: response.data.postsdata,
              skeletonLoading: false,
            };
          });
          const datas = dataSlice({
            data: response.data.postsdata,
            page: 1,
            total: 10,
          });
          setSortedData(datas);
        }
        const roles = await fetchVlogs();
        if (roles.status === 200) {
          setState((state) => {
            return {
              ...state,
              roleData: roles.data.vlog_data,
            };
          });
        }
        const offers = await fetchOffers();
        if (offers.status === 200) {
          setState((state) => {
            return {
              ...state,
              offersData: offers.data.offers,
            };
          });
        }
        const dashboard = await fetchDashboardata();

        if (dashboard.status === 200) {
          setState((state) => {
            return {
              ...state,
              dashboardData: dashboard.data,
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

  // Image Modal
  const [openViewImage, setOpenViewImage] = useState(false);
  const [viewImage, setViewImage] = useState("");
  const [viewVideo, setViewVideo] = useState("");
  const handleViewImageCancel = () => {
    setOpenViewImage(false);
  };
  const handleViewImage = (e) => {
    setViewImage(e);
    setViewVideo("");
    setOpenViewImage(true);
  };

  const handleViewvideo = (e) => {
    setViewVideo(e);
    setOpenViewImage(true);
  };

  //For Apex Line Charts
  const seriesArray = [
    {
      name: "Orders",
      data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
    },
  ];

  const [series, setSeries] = useState(seriesArray);

  const [options, setOptions] = useState({
    chart: {
      height: 350,
      type: "line",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: true,
        tools: {
          download: false, // <== line to add
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
      ],
      labels: {
        style: {
          colors: "#9e9e9e",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#9e9e9e",
        },
      },
    },
    grid: {
      show: false,
      borderColor: "#9e9e9e",
    },
  });

  const rows = sortedData.map((row, index) => (
    <tr key={row.id}>
      <td>{activePage * total - total + index + 1}</td>
      {row.content_type === "VIDEO" ? (
        <td onClick={() => handleViewvideo(row.postcontent[0].image_url)}>
          <Avatar src={row.postcontent[0].image_url} size={30} radius={30} />
        </td>
      ) : (
        <td
          onClick={() =>
            handleViewImage(row.postcontent[0].image_url.split(",")[0])
          }
        >
          <Avatar src={row.postcontent[0].image_url} size={30} radius={30} />
        </td>
      )}

      <td>{row.org_name}</td>
      <td>{row.content_type}</td>
      <td>{row.category_name}</td>
      <td>{row.username}</td>
    </tr>
  ));
  return (
    <div>
      <Grid>
        <Grid.Col xs={4}>
          <Grid>
            {/* Welcome Admin card */}
            <Grid.Col xs={12}>
              <Card shadow="sm" p="lg" withBorder>
                <Card.Section sx={{ backgroundColor: "#90c8f0" }}>
                  <Grid>
                    <Grid.Col xs={5}>
                      <div style={{ flexDirection: "column", padding: 25 }}>
                        <Text color="Agile">Welcome Back!</Text>
                        <Text color="Agile">Admin</Text>
                      </div>
                    </Grid.Col>
                  </Grid>
                </Card.Section>

                <img
                  src={Batman}
                  alt="PostsImage"
                  height={80}
                  style={{ marginTop: -20 }}
                />
                <Text mt={10} style={{ marginLeft: 20 }}>
                  Super User{" "}
                </Text>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div style={{ marginRight: 20, marginLeft: 40 }}>
                    <Text style={{ textAlign: "center" }} size="xl">
                      {state.dashboardData.total_posts}
                    </Text>
                    <Text size="md" color="dimmed">
                      Total Posts
                    </Text>
                  </div>
                  <div>
                    <Text style={{ textAlign: "center" }} size="xl">
                      {state.dashboardData.total_vlogs}
                    </Text>
                    <Text size="md" color="dimmed">
                      Total Vlogs
                    </Text>
                  </div>
                </div>
              </Card>
            </Grid.Col>
            {/* Packages card */}
            <Grid.Col xs={12}>
              <Card shadow="sm" p="lg" withBorder>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>Offers</Text>
                </div>
                <Divider my="sm" />
                <div
                  style={{
                    display: "flex",
                    marginTop: 15,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text size="md">Offers Name</Text>
                  <Text size="md">Offers Validity</Text>
                </div>

                {state.offersData.map((row) => (
                  <div
                    style={{
                      display: "flex",
                      marginTop: 15,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                    key={row.id}
                  >
                    <Text size="xs">{row.title}</Text>
                    <Text size="xs">{row.offer_status} </Text>
                  </div>
                ))}
              </Card>
            </Grid.Col>
            {/* Reminders card */}
            <Grid.Col xs={12}>
              <Card shadow="sm" p="lg" withBorder>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>Reminders</Text>
                </div>
              </Card>
            </Grid.Col>
          </Grid>
        </Grid.Col>
        {/* Col 8 for Right Grid */}
        <Grid.Col xs={8}>
          <Grid>
            {/* Active,Suspended & Blocked Users Card */}
            <Grid.Col xs={12}>
              <Grid>
                <Grid.Col xs={4}>
                  <Card shadow="sm" p="lg" withBorder>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ flexDirection: "column", marginTop: 10 }}>
                        <Text>Vendors</Text>
                        <Text size="xl">
                          {" "}
                          {state.dashboardData.vendor_count}
                        </Text>
                      </div>
                      <Avatar color="green" radius="xl" size={70}>
                        <UserCheck size={36} />
                      </Avatar>
                    </div>
                  </Card>
                </Grid.Col>
                <Grid.Col xs={4}>
                  <Card shadow="sm" p="lg" withBorder>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ flexDirection: "column", marginTop: 10 }}>
                        <Text>Customers</Text>
                        <Text size="xl">{state.dashboardData.customers}</Text>
                      </div>
                      <Avatar color="red" radius="xl" size={70}>
                        <UserOff size={36} />
                      </Avatar>
                    </div>
                  </Card>
                </Grid.Col>
                <Grid.Col xs={4}>
                  <Card shadow="sm" p="lg" withBorder>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ flexDirection: "column", marginTop: 10 }}>
                        <Text>Inactive Users</Text>
                        <Text size="xl">
                          {state.dashboardData.inactive_users}
                        </Text>
                      </div>
                      <Avatar color="red" radius="xl" size={70}>
                        <UserX size={36} />
                      </Avatar>
                    </div>
                  </Card>
                </Grid.Col>
              </Grid>
            </Grid.Col>
            {/* Orders by month chart card */}
            <Grid.Col xs={12}>
              <Grid>
                <Grid.Col xs={7}>
                  <Card shadow="sm" p="lg" withBorder>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text sx={{ fontSize: "16px" }}>
                        Users registered by month
                      </Text>
                    </div>

                    <div id="chart">
                      <ReactApexChart
                        options={options}
                        series={series}
                        type="line"
                        height={350}
                        width="95%"
                      />
                    </div>
                  </Card>
                </Grid.Col>
                {/* Tickets (Support) Card */}
                <Grid.Col xs={5}>
                  <Card shadow="sm" p="lg" withBorder>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text>Vlogs </Text>
                    </div>

                    <Divider my="sm" />
                    <ScrollArea
                      style={{ height: 339 }}
                      offsetScrollbars
                      scrollbarSize={4}
                    >
                      {state.roleData.map((row, index) => (
                        <Card>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              flexDirection: "row",
                            }}
                            key={row.id}
                          >
                            <Text>{row.video_caption}</Text>
                            <Avatar
                              onClick={() => handleViewvideo(row.video_url)}
                              src={row.video_url}
                              size={30}
                              radius={30}
                            />
                          </div>
                        </Card>
                      ))}
                    </ScrollArea>
                  </Card>
                </Grid.Col>
              </Grid>
            </Grid.Col>
            {/* Latest Posts Table*/}
            <Grid.Col xs={12}>
              <Card className="border">
                <ScrollArea>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
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
                        <Th>Post</Th>
                        <Th
                          sorted={sortBy === "org_name"}
                          reversed={reverseSortDirection}
                          onSort={async () => {
                            const reversed =
                              "org_name" === sortBy
                                ? !reverseSortDirection
                                : false;
                            setReverseSortDirection(reversed);
                            setSortBy("org_name");
                            const datas = await setSorting({
                              data: state.data,
                              sortby: "org_name",
                              reversed: reversed,
                              search: search,
                              activePage: activePage,
                              total: total,
                            });
                            setSortedData(datas);
                            setRefreshTable(new Date());
                          }}
                        >
                          Organisation
                        </Th>
                        <Th>Post Type</Th>
                        <Th>Category</Th>
                        <Th>Created By</Th>
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
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
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
            </Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid>
      <Modal
        opened={openViewImage}
        onClose={() => handleViewImageCancel(false)}
      >
        <Box>
          <div style={{ textAlign: "center" }}>
            {viewVideo !== "" ? (
              <video src={viewVideo} controls width={400} />
            ) : (
              <img src={viewImage} alt="PostsImage" width="100%" />
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default Dashboard;
