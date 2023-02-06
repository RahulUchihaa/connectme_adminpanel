import React from "react";
import { openModal } from "@mantine/modals";

export const dataSlice = ({ data, page, total }) => {
  const datas = data.slice((page - 1) * total, (page - 1) * total + total);
  return datas;
};

export const selectFilter = async ({ data }) => {
  var clean = await data.map((data) => ({
    value: data.value.toString(),
    label: data.label.toString(),
  }));
  return clean;
};

export const imageModal = async ({ data, title }) => {
  return openModal({
    title: title,
    children: (
      <>
        <img src={data} alt="" width="100%" />
      </>
    ),
  });
};
