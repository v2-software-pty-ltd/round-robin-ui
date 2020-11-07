import { Button, DatePicker, Form, Input, InputNumber, Select } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { tz } from "moment-timezone";

import { enableRoundRobinAvailability } from "./utils/callCRMAPI";
import { AvailabilityTable } from "./AvailabilityTable";
import { FieldCriteriaTable } from "./FieldCriteriaTable";

export const EditSettingForm = (props) => {
  const { data, activeUsers, onSubmit } = props;

  const [availabilityEnabled, setAvailabilityEnabled] = useState(false);

  const {
    control,
    handleSubmit,
    errors,
    watch,
    formState,
    setValue,
    getValues,
    trigger,
  } = useForm({
    defaultValues: {
      Owner:
        data["Owner"]?.id ??
        data["advancedroundrobin.Owner"]?.id ??
        data["advancedroundrobin.advancedroundrobin.Owner"]?.id,
      Module: data["advancedroundrobin__Module"],
      Percentage: data["advancedroundrobin__Percent"],
      Name: data["Name"],
      email: data["Email"],
      Disabled_Until: data["advancedroundrobin__Disabled_Until"]
        ? moment(data["advancedroundrobin__Disabled_Until"], "YYYY-MM-DD")
        : null,
      fieldCriteria: data["fieldCriteriaForUI"],
      advancedroundrobin__Complex_Availability:
        data["advancedroundrobin__Complex_Availability"],
      advancedroundrobin__Timezone: data["advancedroundrobin__Timezone"],
    },
  });

  const { isDirty } = formState;

  useEffect(() => {
    setAvailabilityEnabled(data.availabilityEnabled);
  }, [data.availabilityEnabled]);

  useEffect(() => {
    window.onbeforeunload = function(event) {
      event.preventDefault();
      if (isDirty) {
        event.returnValue = "";
      }
    };

    return () => {
      window.removeEventListener("beforeunload");
    };
  }, [isDirty]);

  const handleSave = (data) => {
    data["fieldCriteria"] = data["fieldCriteria"] || [];
    onSubmit(data);
  };

  const handleSpecifyClick = async () => {
    const result = await enableRoundRobinAvailability();
    if (result === "success") {
      setAvailabilityEnabled(true);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <Form
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 16 }}
        onFinish={handleSubmit(handleSave)}
      >
        <Form.Item label="Setting Name" labelAlign="left">
          <Controller as={Input} control={control} name="Name"></Controller>
        </Form.Item>
        <Form.Item label="Owner" labelAlign="left">
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
        <Form.Item label="Module" labelAlign="left">
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
        <Form.Item label="Percentage" labelAlign="left">
          <Controller
            as={InputNumber}
            control={control}
            name="Percentage"
          ></Controller>
        </Form.Item>
        <Form.Item label="Email For Notifications" labelAlign="left">
          <Controller as={Input} control={control} name="email"></Controller>
        </Form.Item>
        <Form.Item
          label="Disabled Until (useful for holidays)"
          labelAlign="left"
        >
          <Controller
            control={control}
            name="Disabled_Until"
            render={(props) => <DatePicker format={"MMM-DD-YYYY"} {...props} />}
          ></Controller>
        </Form.Item>
        <Form.Item label="Field Criteria" labelAlign="left">
          <FieldCriteriaTable
            control={control}
            fieldsForThisModule={data["fieldsForThisModule"]}
            errors={errors}
            watch={watch}
          />
        </Form.Item>
        {availabilityEnabled ? (
          <>
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
              />
            </Form.Item>
          </>
        ) : (
          <Form.Item
            label="Do you have salespeople who only work part time?"
            labelAlign="left"
          >
            <Button type="primary" onClick={handleSpecifyClick}>
              Specify salesperson availability
            </Button>
          </Form.Item>
        )}
        <Form.Item style={{ position: "fixed", top: "70px", right: "10px" }}>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
