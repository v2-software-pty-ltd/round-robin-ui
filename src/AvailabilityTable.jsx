import React from "react";
import moment from "moment";
import { Table, Checkbox, TimePicker, Button } from "antd";
import { Controller, useFieldArray } from "react-hook-form";

const format = "HH:mm";

const ErrorMessage = ({ msg }) => {
  return <div style={{ color: "red" }}>{msg}</div>;
};

export const AvailabilityTable = ({
  control,
  setValue,
  getValues,
  errors,
  trigger,
}) => {
  const { fields } = useFieldArray({
    control,
    name: "advancedroundrobin__Complex_Availability",
  });

  const copyStartDate = () => {
    fields.forEach((field, index) => {
      setValue(
        `advancedroundrobin__Complex_Availability[${index}].startTime`,
        getValues(`advancedroundrobin__Complex_Availability[0].startTime`)
      );
      setValue(
        `advancedroundrobin__Complex_Availability[${index}].available`,
        true
      );
      trigger(`advancedroundrobin__Complex_Availability[${index}].startTime`);
      if (errors?.advancedroundrobin__Complex_Availability?.[index]?.endTime) {
        trigger(`advancedroundrobin__Complex_Availability[${index}].endTime`);
      }
    });
  };

  const copyEndDate = () => {
    fields.forEach((field, index) => {
      setValue(
        `advancedroundrobin__Complex_Availability[${index}].endTime`,
        getValues(`advancedroundrobin__Complex_Availability[0].endTime`)
      );
      setValue(
        `advancedroundrobin__Complex_Availability[${index}].available`,
        true
      );
      trigger(`advancedroundrobin__Complex_Availability[${index}].endTime`);
      if (
        errors?.advancedroundrobin__Complex_Availability?.[index]?.startTime
      ) {
        trigger(`advancedroundrobin__Complex_Availability[${index}].startTime`);
      }
    });
  };

  const validateStartTime = (value, index) => {
    let end = getValues(
      `advancedroundrobin__Complex_Availability[${index}].endTime`
    );
    end = moment(end || "23:59", "HH:mm");
    const start = moment(value || "00:01", "HH:mm");
    return start.isSameOrBefore(end);
  };

  const validateEndTime = (value, index) => {
    let start = getValues(
      `advancedroundrobin__Complex_Availability[${index}].startTime`
    );
    start = moment(start || "00:01", "HH:mm");
    const end = moment(value || "23:59", "HH:mm");
    return end.isSameOrAfter(start);
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
            defaultValue={record.available}
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
              rules={{
                validate: (value) => validateStartTime(value, index),
              }}
              render={({ onChange, value }) => (
                <TimePicker
                  allowClear={false}
                  value={moment(value || "00:01", "HH:mm")}
                  onChange={(time) => {
                    if (
                      errors?.advancedroundrobin__Complex_Availability?.[index]
                        ?.endTime
                    ) {
                      trigger(
                        `advancedroundrobin__Complex_Availability[${index}].endTime`
                      );
                    }
                    onChange(moment(time).format("HH:mm"));
                    setValue(
                      `advancedroundrobin__Complex_Availability[${index}].available`,
                      true
                    );
                  }}
                  format={format}
                />
              )}
            />
            {errors?.advancedroundrobin__Complex_Availability?.[index]
              ?.startTime && (
              <ErrorMessage msg="Start time must be before end time" />
            )}
            {index === 0 ? (
              <div>
                <Button
                  type="primary"
                  size="small"
                  onClick={copyStartDate}
                  style={{ marginTop: "8px" }}
                >
                  Copy to other days
                </Button>
              </div>
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
              rules={{
                validate: (value) => validateEndTime(value, index),
              }}
              name={`advancedroundrobin__Complex_Availability[${index}].endTime`}
              render={({ onChange, value }) => (
                <TimePicker
                  allowClear={false}
                  value={moment(value || "23:59", "HH:mm")}
                  onChange={(time) => {
                    if (
                      errors?.advancedroundrobin__Complex_Availability?.[index]
                        ?.startTime
                    ) {
                      trigger(
                        `advancedroundrobin__Complex_Availability[${index}].startTime`
                      );
                    }
                    setValue(
                      `advancedroundrobin__Complex_Availability[${index}].available`,
                      true
                    );
                    onChange(moment(time).format("HH:mm"));
                  }}
                  format={format}
                />
              )}
            />
            {errors?.advancedroundrobin__Complex_Availability?.[index]
              ?.endTime && (
              <ErrorMessage msg="End time must be after start time" />
            )}
            {index === 0 ? (
              <div>
                <Button
                  type="primary"
                  size="small"
                  onClick={copyEndDate}
                  style={{ marginTop: "8px" }}
                >
                  Copy to other days
                </Button>
              </div>
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
