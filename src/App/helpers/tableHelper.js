import React from "react";
import useStyles from "../Styles/Style";
import { Group, Text, UnstyledButton, Center } from "@mantine/core";
import { Selector, ChevronDown, ChevronUp } from "tabler-icons-react";

export const Th = ({ children, reversed, sorted, onSort }) => {
  const { classes } = useStyles();
  const Icon = sorted ? (reversed ? ChevronUp : ChevronDown) : Selector;
  return (
    <th className={classes.th}>
      {typeof sorted !== "undefined" ? (
        <>
          <UnstyledButton onClick={onSort} className={classes.controlTable}>
            <Group position="apart">
              <Text weight={600} size="sm">
                {children}
              </Text>
              <Center className={classes.icon}>
                <Icon size={14} />
              </Center>
            </Group>
          </UnstyledButton>
        </>
      ) : (
        <UnstyledButton className={classes.controlTable}>
          <Text weight={600} size="sm">
            {children}
          </Text>
        </UnstyledButton>
      )}
    </th>
  );
};

// For slice the data acording to the pagination and perpage drop down change
const filterData = (data, search) => {
  const keys = Object.keys(data[0]);
  const query = search.toString().toLowerCase().trim();
  return data.filter((item) =>
    keys.some((key) => {
      if (key !== "id") {
        if (item[key] !== null && item[key] !== "") {
          return item[key].toString().toLowerCase().includes(query);
        }
      }
      return null;
    })
  );
};

const sortData = (data, payload) => {
  if (!payload.sortBy) {
    return filterData(data, payload.search);
  }
  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[payload.sortBy].localeCompare(a[payload.sortBy]);
      }
      return a[payload.sortBy].localeCompare(b[payload.sortBy]);
    }),
    payload.search
  );
};
export const dataSearch = ({ data, value, activePage, total }) => {
  var datas2 = sortData(data, {
    sortBy: null,
    reversed: false,
    search: value,
  });
  const datas = datas2.slice(
    (activePage - 1) * total,
    (activePage - 1) * total + total
  );
  return datas;
};

export const setSorting = ({
  data,
  sortby,
  reversed,
  search,
  activePage,
  total,
}) => {
  var sorted = sortData(data, { sortBy: sortby, reversed, search });
  const datas = sorted.slice(
    (activePage - 1) * total,
    (activePage - 1) * total + total
  );
  return datas;
};
