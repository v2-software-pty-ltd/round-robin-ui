import React, { Fragment } from "react";

import { Button, Table, DatePicker } from "antd";
import { Controller, useFieldArray } from "react-hook-form";

const { RangePicker } = DatePicker;

export const LeaveTable = ({ control, errors }) => {
  const { fields, append } = useFieldArray({
    control: control,
    name: "advancedroundrobin__Leave_Dates",
  });

  const columns = [
    {
      title: "Dates",
      key: "dates",
      editable: true,
      render: (tags, record, index, ...args) => {
        return (
          <>
            <Controller
              rules={{
                required: true,
                validate: (value) => {
                  return value.length === 2;
                },
              }}
              control={control}
              defaultValue={record["dates"]}
              name={`advancedroundrobin__Leave_Dates[${index}].dates`}
              as={<RangePicker showTime />}
            />
            {errors &&
              errors.advancedroundrobin__Leave_Dates &&
              errors.advancedroundrobin__Leave_Dates[index] && (
                <div style={{ color: "red" }}>
                  Please select valid start and end date
                </div>
              )}
          </>
        );
      },
    },
  ];

  const addLeaveRecord = () => {
    append({ dates: [] });
  };

  return (
    <Fragment>
      <Button onClick={addLeaveRecord}>Add Leave</Button>
      <Table
        bordered
        rowKey="dates"
        dataSource={fields}
        columns={columns}
        rowClassName="editable-row"
      />
    </Fragment>
  );
};
