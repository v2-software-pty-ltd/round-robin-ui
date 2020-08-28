import { Button, DatePicker, Form, Input, InputNumber, Select } from "antd";
import moment from "moment";
import React from "react";

import { FieldCriteriaTable } from "./FieldCriteriaTable";
import { AvailabilityTable } from "./AvailabilityTable";

const validateAndSubmit = (e, validateFields, submitHandler) => {
  e.preventDefault();
  validateFields((err, values) => {
    if (!err) {
      submitHandler(values);
    }
  });
};

class UnwrappedEditSettingForm extends React.Component {
  render() {
    const { data, activeUsers, form } = this.props;
    const { getFieldDecorator } = form;

    const disabledUntilDate = data["advancedroundrobin__Disabled_Until"]
      ? moment(data["advancedroundrobin__Disabled_Until"], "YYYY-MM-DD")
      : null;

    return (
      <div style={{ padding: "40px" }}>
        <Form
          layout="vertical"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 16 }}
          onSubmit={(e) =>
            validateAndSubmit(
              e,
              this.props.form.validateFields,
              this.props.onSubmit
            )
          }
        >
          <Form.Item label="Owner">
            {getFieldDecorator("Owner", {
              initialValue:
                data["Owner"]?.id ??
                data["advancedroundrobin.Owner"]?.id ??
                data["advancedroundrobin.advancedroundrobin.Owner"]?.id,
            })(
              <Select style={{ width: 200 }} placeholder="Owner">
                {activeUsers.map((user) => (
                  <Select.Option value={user.id} key={user.id}>
                    {user.full_name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Module">
            {getFieldDecorator("Module", {
              initialValue: data["advancedroundrobin__Module"],
            })(
              <Select style={{ width: 200 }} placeholder="Module">
                {["Leads", "Contacts", "Deals"].map((moduleName) => (
                  <Select.Option key={moduleName} value={moduleName}>
                    {moduleName}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Percentage">
            {getFieldDecorator("Percentage", {
              initialValue: data["advancedroundrobin__Percent"],
            })(<InputNumber />)}
          </Form.Item>
          <Form.Item label="Email For Notifications">
            {getFieldDecorator("email", {
              initialValue: data.Email,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Disabled Until (useful for holidays)">
            {getFieldDecorator("Disabled_Until", {
              initialValue: disabledUntilDate,
            })(<DatePicker format={"MMM-DD-YYYY"} />)}
          </Form.Item>
          <Form.Item label="Field Criteria">
            {getFieldDecorator("fieldCriteria", {
              initialValue: data["fieldCriteriaForUI"],
            })(
              <FieldCriteriaTable
                form={form}
                fieldsForThisModule={data["fieldsForThisModule"]}
              />
            )}
          </Form.Item>
          <Form.Item label="Availability">
            {getFieldDecorator("advancedroundrobin__Complex_Availability", {
              initialValue: data["advancedroundrobin__Complex_Availability"],
            })(<AvailabilityTable form={form} />)}
          </Form.Item>
          <Form.Item style={{ position: "fixed", top: "70px", right: "10px" }}>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export const EditSettingForm = Form.create({
  name: "edit_round_robin_setting",
})(UnwrappedEditSettingForm);
