import React, { Fragment } from 'react';

import { TagInput } from './TagInput';

import {
  Button,
  Form,
  Popconfirm,
  Input,
  Select,
  Table,
  Tag
} from 'antd';

const comparisonTypes = [
  {
    label: 'Not Equal',
    value: 'notequal'
  },
  {
    label: 'Equals',
    value: 'equal'
  },
  {
    label: 'Contains',
    value: 'contains'
  },
  {
    label: "Doesn't Contain",
    value: 'notcontains'
  },
  {
    label: "Starts With",
    value: 'starts_with'
  },
  {
    label: "Doesn't Start With",
    value: 'not_starts_with'
  },
  {
    label: 'Multi Select Equal',
    value: 'multi-select-equal'
  },
  {
    label: 'Not Empty',
    value: 'notempty'
  },
  {
    label: '>=',
    value: '>='
  },
  {
    label: '>',
    value: '>'
  },
  {
    label: '<=',
    value: '<='
  },
  {
    label: '<',
    value: '<'
  }
];

const EditableContext = React.createContext();

function composeEditableCell(fieldsForThisModule) {
  return class EditableCell extends React.Component {
    getInput = () => {
      if (this.props.dataIndex === 'fieldName') {
        return <Select style={{ width: 200 }} placeholder="Field Name">
          {fieldsForThisModule.map(field => (
            <Select.Option key={field.api_name} value={field.api_name}>
              {field.field_label}
            </Select.Option>
          ))}
        </Select>
      } else if (this.props.dataIndex === 'comparisonType') {
        return <Select style={{ width: 200 }} placeholder="Comparison Type">
          {comparisonTypes.map(option => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      } else if (this.props.dataIndex === 'possibleValues') {
        return <TagInput />;
      }
      return <Input />;
    };

    renderCell = (contextData) => {
      const { getFieldDecorator } = contextData;

      const {
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        ...restProps
      } = this.props;
      return (
        <td {...restProps}>
          {editing ? (
            <Form.Item style={{ margin: 0 }}>
              {getFieldDecorator(dataIndex, {
                rules: [
                  {
                    required: true,
                    message: `Please Input ${title}!`,
                  },
                ],
                initialValue: record[dataIndex],
              })(this.getInput())}
            </Form.Item>
          ) : (
              children
            )}
        </td>
      );
    };

    render() {
      return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
    }
  }
}

export class FieldCriteriaTable extends React.Component {

  fieldCriteriaColumns = [
    {
      title: 'Field Name',
      dataIndex: 'fieldName',
      key: 'fieldName',
      editable: true,
      desiredInputType: 'select',
      possibleOptions: ['TODO']
    },
    {
      title: 'Comparison Type',
      dataIndex: 'comparisonType',
      key: 'comparisonType',
      editable: true,
      desiredInputType: 'select',
      possibleOptions: comparisonTypes
    },
    {
      title: 'Possible Values',
      dataIndex: 'possibleValues',
      key: 'possibleValues',
      width: '40%',
      editable: true,
      desiredInputType: 'tags',
      render: (tags) => {
        return <Fragment>
          {tags.map((tagName) => <Tag key={tagName} closable={false}>{tagName}</Tag>)}
        </Fragment>
      }
    },
    {
      title: 'Save',
      dataIndex: 'operation',
      render: (text, record) => {
        const { editingKey } = this.state;
        const editable = this.isEditing(record);
        return editable ? (
          <span>
            <EditableContext.Consumer>
              {form => (
                <Button
                  onClick={() => this.save(form, record.key)}
                  style={{ marginRight: 8 }}
                >
                  Save
                </Button>
              )}
            </EditableContext.Consumer>
            <Popconfirm title="Are you sure you want to cancel?" onConfirm={() => this.cancel(record.key)}>
              <Button>Cancel</Button>
            </Popconfirm>
          </span>
        ) : (
            <Button disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
              Edit
            </Button>
          );
      },
    },
  ];

  state = {
    editingKey: '',
    loading: true,
  };

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }

      const newData = [...this.props.value];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ editingKey: '' });
      } else {
        newData.push(row);
        this.setState({ editingKey: '' });
      }

      this.props.onChange(newData);
    });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  addRow = () => {
    const newData = [...this.props.value];
    newData.push({ possibleValues: [] });

    this.props.onChange(newData);
  }

  render() {
    const fieldCriteriaColumns = this.fieldCriteriaColumns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    const components = {
      body: {
        cell: composeEditableCell(this.props.fieldsForThisModule),
      },
    };

    return (
      <Fragment>
        <Button onClick={this.addRow}>Add Row</Button>
        <EditableContext.Provider value={this.props.form}>
          <Table
            components={components}
            bordered
            dataSource={this.props.value}
            columns={fieldCriteriaColumns}
            rowClassName="editable-row"
            pagination={{
              onChange: this.cancel,
            }}
          />
        </EditableContext.Provider>
      </Fragment>
    );
  }
}
