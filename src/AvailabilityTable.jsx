import React from "react";
import moment from "moment";
import { Table, Checkbox, TimePicker } from "antd";
import { Controller, useFieldArray } from "react-hook-form";

const format = "HH:mm";

export const AvailabilityTable = ({ control }) => {
  const { fields } = useFieldArray({
    control,
    name: "advancedroundrobin__Complex_Availability",
  });

  const availabilitycolumns = [
    {
      title: "Day of the Week",
      dataIndex: "day",
      editable: false,
    },
    {
      title: "Available",
      dataIndex: "available",
      editable: false,
      render: (text, record, index) => {
        return (
          <Controller
            control={control}
            defaultValue={record.value}
            name={`advancedroundrobin__Complex_Availability[${index}].available`}
            render={({ onChange, value }) => (
              <Checkbox
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
              />
            )}
          />
        );
      },
    },
    {
      title: "Availability start time",
      dataIndex: "startTime",
      editable: false,
      render: (text, record, index) => {
        return (
          <Controller
            control={control}
            defaultValue={record.startTime}
            name={`advancedroundrobin__Complex_Availability[${index}].startTime`}
            render={({ onChange, value }) => (
              <TimePicker
                allowClear={false}
                value={moment(value || "00:00", "HH:mm")}
                onChange={(time) => onChange(moment(time).format("HH:mm"))}
                format={format}
              />
            )}
          />
        );
      },
    },
    {
      title: "Availability end time",
      dataIndex: "endTime",
      editable: false,
      render: (text, record, index) => {
        return (
          <Controller
            control={control}
            defaultValue={record.endTime}
            name={`advancedroundrobin__Complex_Availability[${index}].endTime`}
            render={({ onChange, value }) => (
              <TimePicker
                allowClear={false}
                value={moment(value || "00:00", "HH:mm")}
                onChange={(time) => onChange(moment(time).format("HH:mm"))}
                format={format}
              />
            )}
          />
        );
      },
    },
  ];

  return (
    <Table
      rowKey="day"
      bordered
      dataSource={fields}
      columns={availabilitycolumns}
      rowClassName="editable-row"
    />
  );
};
