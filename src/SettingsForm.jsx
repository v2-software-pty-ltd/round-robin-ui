import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Divider,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { tz } from "moment-timezone";

import { enableRoundRobinAvailability } from "./utils/callCRMAPI";
import { AvailabilityTable } from "./AvailabilityTable";
import { FieldCriteriaTable } from "./FieldCriteriaTable";
import { LeaveTable } from "./LeaveTable";

const { Option } = Select;

const labelWrapStyle = {
  whiteSpace: "normal",
  lineHeight: 1.2,
};

export const EditSettingForm = (props) => {
  const { data, activeUsers, onSubmit } = props;

  const [modules, setModules] = useState(["Leads", "Contacts", "Deals"]);
  const [name, setName] = useState("");

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
      advancedroundrobin__Timezone:
        data["advancedroundrobin__Timezone"] ||
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      advancedroundrobin__Leave_Dates: data["advancedroundrobin__Leave_Dates"],
      advancedroundrobin__Max_Leads_For_This_Setting:
        data["advancedroundrobin__Max_Leads_For_This_Setting"],
    },
  });

  const { isDirty } = formState;

  useEffect(() => {
    setAvailabilityEnabled(data.availabilityEnabled);
  }, [data.availabilityEnabled]);

  useEffect(() => {
    const module = data["advancedroundrobin__Module"];
    setModules((prevState) => {
      if (!prevState.includes(module)) {
        return [...prevState, module];
      } else {
        return prevState;
      }
    });
  }, [data]);

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
    const newData = JSON.parse(JSON.stringify(data));
    const leaveDates = data["advancedroundrobin__Leave_Dates"];
    if (leaveDates) {
      leaveDates.forEach((dates, index) => {
        newData["advancedroundrobin__Leave_Dates"][index] = {
          startTime: dates.dates[0].toISOString(),
          endTime: dates.dates[1].toISOString(),
        };
      });
    }
    newData["fieldCriteria"] = newData["fieldCriteria"] || [];
    onSubmit(newData);
  };

  const handleSpecifyClick = async () => {
    const result = await enableRoundRobinAvailability();
    if (result === "success") {
      setAvailabilityEnabled(true);
    }
  };

  const addItem = () => {
    if (name.length) {
      setModules((prevState) => [...prevState, name]);
      setName("");
    }
  };

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  return (
    <div style={{ padding: "40px" }}>
      <Form
        labelCol={{ span: 4 }}
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
              <Select
                style={{ width: 200 }}
                placeholder="Module"
                {...props}
                dropdownRender={(menu) => (
                  <div>
                    {menu}
                    <Divider style={{ margin: "4px 0" }} />
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "nowrap",
                        padding: 8,
                      }}
                    >
                      <Input
                        style={{ flex: "auto" }}
                        value={name}
                        onChange={onNameChange}
                      />

                      <a
                        href="# "
                        style={{
                          flex: "none",
                          padding: "8px",
                          display: "block",
                          cursor: "pointer",
                        }}
                        onClick={addItem}
                      >
                        <PlusOutlined /> Add Module
                      </a>
                    </div>
                  </div>
                )}
              >
                {modules.map((item) => (
                  <Option key={item}>{item}</Option>
                ))}
              </Select>
            )}
          ></Controller>
        </Form.Item>
        <Form.Item
          label={<span style={labelWrapStyle}>Max Leads For This Setting</span>}
          labelAlign="left"
        >
          <Controller
            as={InputNumber}
            control={control}
            name="advancedroundrobin__Max_Leads_For_This_Setting"
          ></Controller>
        </Form.Item>
        <Form.Item label="Percentage" labelAlign="left">
          <Controller
            as={InputNumber}
            control={control}
            name="Percentage"
          ></Controller>
        </Form.Item>
        <Form.Item
          label={<span style={labelWrapStyle}>Email For Notifications</span>}
          labelAlign="left"
        >
          <Controller as={Input} control={control} name="email"></Controller>
        </Form.Item>
        <Form.Item
          label={
            <span style={labelWrapStyle}>
              Disabled Until (useful for holidays)
            </span>
          }
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
            label={
              <span style={labelWrapStyle}>
                Do you have salespeople who only work part time?
              </span>
            }
            labelAlign="left"
            la
          >
            <Button type="primary" onClick={handleSpecifyClick}>
              Specify salesperson availability
            </Button>
          </Form.Item>
        )}
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
    </div>
  );
};
