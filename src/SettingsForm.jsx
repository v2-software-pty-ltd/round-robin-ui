import { Button, DatePicker, Form, Input, InputNumber, Select } from "antd";
import moment from "moment";
import React from "react";

import { FieldCriteriaTable } from "./FieldCriteriaTable";
import { AvailabilityTable } from "./AvailabilityTable";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

export const EditSettingForm = (props) => {
  useEffect(() => {
    window.addEventListener("beforeunload", (event) => {
      event.preventDefault();
      event.returnValue = "";
    });
  }, []);

  const { data, activeUsers, onSubmit } = props;

  const { control, handleSubmit, errors, watch } = useForm({
    defaultValues: {
      Owner:
        data["Owner"]?.id ??
        data["advancedroundrobin.Owner"]?.id ??
        data["advancedroundrobin.advancedroundrobin.Owner"]?.id,
      Module: data["advancedroundrobin__Module"],
      Percentage: data["advancedroundrobin__Percent"],
      email: data.Email,
      Disabled_Until: data["advancedroundrobin__Disabled_Until"]
        ? moment(data["advancedroundrobin__Disabled_Until"], "YYYY-MM-DD")
        : null,
      fieldCriteria: data["fieldCriteriaForUI"],
      advancedroundrobin__Complex_Availability:
        data["advancedroundrobin__Complex_Availability"],
    },
  });

  return (
    <div style={{ padding: "40px" }}>
      <Form
        layout="vertical"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 16 }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Form.Item label="Owner">
          <Controller
            name="Owner"
            control={control}
            render={(props) => (
              <Select style={{ width: 200 }} placeholder="Owner" {...props}>
                {activeUsers.map((user) => (
                  <Select.Option value={user.id} key={user.id}>
                    {user.full_name}
                  </Select.Option>
                ))}
              </Select>
            )}
          ></Controller>
        </Form.Item>
        <Form.Item label="Module">
          <Controller
            control={control}
            name="Module"
            render={(props) => (
              <Select style={{ width: 200 }} placeholder="Module" {...props}>
                {["Leads", "Contacts", "Deals"].map((moduleName) => (
                  <Select.Option key={moduleName} value={moduleName}>
                    {moduleName}
                  </Select.Option>
                ))}
              </Select>
            )}
          ></Controller>
        </Form.Item>
        <Form.Item label="Percentage">
          <Controller
            as={InputNumber}
            control={control}
            name="Percentage"
          ></Controller>
        </Form.Item>
        <Form.Item label="Email For Notifications">
          <Controller as={Input} control={control} name="email"></Controller>
        </Form.Item>
        <Form.Item label="Disabled Until (useful for holidays)">
          <Controller
            control={control}
            name="Disabled_Until"
            render={(props) => <DatePicker format={"MMM-DD-YYYY"} {...props} />}
          ></Controller>
        </Form.Item>
        <Form.Item label="Field Criteria">
          <FieldCriteriaTable
            control={control}
            fieldsForThisModule={data["fieldsForThisModule"]}
            errors={errors}
            watch={watch}
          />
        </Form.Item>
        <Form.Item label="Availability">
          <AvailabilityTable control={control} />
        </Form.Item>
        <Form.Item style={{ position: "fixed", top: "70px", right: "10px" }}>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
