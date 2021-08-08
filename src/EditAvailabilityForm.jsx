import React from 'react';
import { Button, Form, Select } from 'antd';
import { tz } from "moment-timezone";
import { Controller, useForm } from "react-hook-form";

import { AvailabilityTable } from "./AvailabilityTable";
import { LeaveTable } from "./LeaveTable";

const getDefaultAvailabilityData = () => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return days.map((day) => {
    return { day: day, available: false, startTime: "00:05", endTime: "" };
  });
};

export function EditAvailabilityForm({ availabilityData, handleSave }) {
  const defaultValues = {
    advancedroundrobin__Complex_Availability:
      availabilityData["advancedroundrobin__Complex_Availability"] || getDefaultAvailabilityData(),
    advancedroundrobin__Timezone:
      availabilityData["advancedroundrobin__Timezone"] ||
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    advancedroundrobin__Leave_Dates: availabilityData["advancedroundrobin__Leave_Dates"] || [],
  };

  const {
    control,
    handleSubmit,
    errors,
    watch,
    setValue,
    getValues,
    trigger,
  } = useForm({
    defaultValues,
  });

  return (
    <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        onFinish={handleSubmit(handleSave)}
    >
      <Form.Item label="Time Zone" labelAlign="left">
      <Controller
        control={control}
        name="advancedroundrobin__Timezone"
        render={(props) => (
          <Select
            style={{ width: 200 }}
            placeholder="Timezone"
            showSearch
            {...props}
          >
            {tz.names().map((field) => (
              <Select.Option key={field} value={field}>
                {field}
              </Select.Option>
            ))}
          </Select>
        )}
      ></Controller>
      </Form.Item>
      <Form.Item label="Availability" labelAlign="left">
        <AvailabilityTable
          control={control}
          setValue={setValue}
          getValues={getValues}
          errors={errors}
          trigger={trigger}
          watch={watch}
        />
      </Form.Item>
      <Form.Item
        label="Dates on Leave"
        labelAlign="left"
        style={{ whiteSpace: "normal" }}
      >
        <LeaveTable control={control} errors={errors} watch={watch} />
      </Form.Item>
      <Form.Item style={{ position: "fixed", top: "70px", right: "10px" }}>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  );
}
