import React from "react";
import moment from "moment";
import { Table, Checkbox, TimePicker, Button } from "antd";
import { Controller, useFieldArray } from "react-hook-form";

const format = "HH:mm";

export const AvailabilityTable = ({ control, watch, setValue }) => {
  const startTime = watch(
    "advancedroundrobin__Complex_Availability[0].startTime"
  );
  const endTime = watch("advancedroundrobin__Complex_Availability[0].endTime");
  const { fields } = useFieldArray({
    control,
    name: "advancedroundrobin__Complex_Availability",
  });

  const copyStartDate = () => {
    fields.forEach((field, index) => {
      setValue(
        `advancedroundrobin__Complex_Availability[${index}].startTime`,
        startTime
      );
    });
  };

  const copyEndDate = () => {
    fields.forEach((field, index) => {
      setValue(
        `advancedroundrobin__Complex_Availability[${index}].endTime`,
        endTime
      );
    });
  };

  const availabilitycolumns = [
    {
      title: "Day of the Week",
      key: "day",
      dataIndex: "day",
      editable: false,
      render: (text, record, index) => {
        return (
          <Controller
            control={control}
            defaultValue={record.day}
            name={`advancedroundrobin__Complex_Availability[${index}].day`}
            render={({ onChange, value }) => <span>{value}</span>}
          />
        );
      },
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
          <>
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
            {index === 0 ? (
              <Button
                type="primary"
                size="small"
                onClick={copyStartDate}
                style={{ marginTop: "8px" }}
              >
                Copy to other days
              </Button>
            ) : (
              ""
            )}
          </>
        );
      },
    },
    {
      title: "Availability end time",
      dataIndex: "endTime",
      editable: false,
      render: (text, record, index) => {
        return (
          <>
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
            {index === 0 ? (
              <Button
                type="primary"
                size="small"
                onClick={copyEndDate}
                style={{ marginTop: "8px" }}
              >
                Copy to other days
              </Button>
            ) : (
              ""
            )}
          </>
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
