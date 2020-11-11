import React, { Fragment, useEffect, useState } from "react";

import { TagInput } from "./TagInput";

import { Button, Select, Table } from "antd";
import { Controller, useFieldArray } from "react-hook-form";
import { loadActiveUsers, loadFields } from "./utils/callCRMAPI";

const comparisonTypes = [
  {
    label: "Not Equal",
    value: "notequal",
  },
  {
    label: "Equals",
    value: "equal",
  },
  {
    label: "Contains",
    value: "contains",
  },
  {
    label: "Doesn't Contain",
    value: "notcontains",
  },
  {
    label: "Starts With",
    value: "starts_with",
  },
  {
    label: "Doesn't Start With",
    value: "not_starts_with",
  },
  {
    label: "Multi Select Equal",
    value: "multi-select-equal",
  },
  {
    label: "Not Empty",
    value: "notempty",
  },
  {
    label: ">=",
    value: ">=",
  },
  {
    label: ">",
    value: ">",
  },
  {
    label: "<=",
    value: "<=",
  },
  {
    label: "<",
    value: "<",
  },
];

export const FieldCriteriaTable = ({ control, errors, watch, getValues }) => {
  const watchModule = watch("Module");

  const [fieldsForThisModule, setfieldsForThisModule] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "fieldCriteria",
  });

  useEffect(() => {
    let isCancelled = false;
    async function fetchfields() {
      const fields = await loadFields(watchModule);
      if (!isCancelled) {
        setfieldsForThisModule(fields);
      }
    }

    fetchfields();

    return () => {
      isCancelled = true;
    };
  }, [watchModule]);

  useEffect(() => {
    let isCancelled = false;
    async function loadUsers() {
      const users = await loadActiveUsers();
      if (!isCancelled) {
        setActiveUsers(users);
      }
    }

    loadUsers();

    return () => {
      isCancelled = true;
    };
  }, []);

  const ErrorMessage = ({ msg }) => {
    return <div style={{ color: "red" }}>{msg}</div>;
  };

  const fieldCriteriaColumns = [
    {
      title: "Field Name",
      key: "fieldName",
      editable: true,
      render: (tags, record, index, ...args) => {
        return (
          <>
            <Controller
              rules={{ required: true }}
              control={control}
              defaultValue={record["fieldName"]}
              name={`fieldCriteria[${index}].fieldName`}
              render={(props) => (
                <Select
                  style={{ width: 200 }}
                  placeholder="Field Name"
                  showSearch
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  {...props}
                >
                  {fieldsForThisModule.map((field) => (
                    <Select.Option key={field.api_name} value={field.api_name}>
                      {field.field_label}
                    </Select.Option>
                  ))}
                </Select>
              )}
            />
            {errors.fieldCriteria?.[index]?.fieldName && (
              <ErrorMessage msg="Please Input Field Name" />
            )}
          </>
        );
      },
    },
    {
      title: "Comparison Type",
      key: "comparisonType",
      editable: true,
      desiredInputType: "select",
      possibleOptions: comparisonTypes,
      render: (tags, record, index, ...args) => {
        return (
          <>
            <Controller
              rules={{ required: true }}
              control={control}
              defaultValue={record["comparisonType"]}
              name={`fieldCriteria[${index}].comparisonType`}
              render={(props) => (
                <Select
                  style={{ width: 200 }}
                  placeholder="Comparison Type"
                  onChange={() => this.handleOnChange(record)}
                  {...props}
                >
                  {comparisonTypes.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              )}
            />
            {errors.fieldCriteria?.[index]?.comparisonType && (
              <ErrorMessage msg="Please Input Comparison Type" />
            )}
          </>
        );
      },
    },
    {
      title: "Possible Values",
      key: "possibleValues",
      width: "40%",
      editable: true,
      desiredInputType: "tags",
      render: (tags, record, index) => {
        const watchFieldName = watch(`fieldCriteria[${index}].fieldName`);
        return (
          <>
            <Controller
              defaultValue={record["possibleValues"]}
              name={`fieldCriteria[${index}].possibleValues`}
              rules={{
                required: true,
                validate: (value) => value.length > 0,
              }}
              control={control}
              render={(props) => {
                if (watchFieldName === "Owner") {
                  return (
                    <Select
                      mode="multiple"
                      allowClear
                      placeholder=""
                      {...props}
                    >
                      {activeUsers.map((user) => (
                        <Select.Option key={user.id} value={user.id}>
                          {user.full_name}
                        </Select.Option>
                      ))}
                    </Select>
                  );
                }
                return <TagInput {...props} />;
              }}
            />
            {errors.fieldCriteria?.[index]?.possibleValues && (
              <ErrorMessage msg="Please Input Possible Values" />
            )}
          </>
        );
      },
    },
    {
      title: "Remove",
      dataIndex: "operation",
      render: (text, record, index) => {
        return (
          <Button
            onClick={() => deleteRecord(index)}
            style={{ marginRight: 8 }}
          >
            Remove
          </Button>
        );
      },
    },
  ];

  const addRow = () => {
    append({ comparisonTypes: "", fieldName: "", possibleValues: [] });
  };

  const deleteRecord = (index) => {
    remove(index);
  };

  return (
    <Fragment>
      <Button onClick={addRow}>Add Row</Button>
      <Table
        bordered
        rowKey="id"
        dataSource={fields}
        columns={fieldCriteriaColumns}
        rowClassName="editable-row"
      />
    </Fragment>
  );
};
