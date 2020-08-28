import React, { Fragment } from "react";
import moment from "moment";

import { Table, Checkbox, TimePicker } from "antd";

const EditableContext = React.createContext();

export class AvailabilityTable extends React.Component {
  availabilitycolumns = [
    {
      title: "Day of the Week",
      dataIndex: "day",
      editable: false,
    },
    {
      title: "Available",
      dataIndex: "available",
      editable: false,
      render: (text, record, index) => {
        return (
          <Checkbox
            checked={record.value}
            onChange={(e) => this.saveAvailable(e, index)}
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
          <TimePicker
            allowClear={false}
            value={moment(record.startTime || "00:00:00", "HH:mm:ss")}
            onChange={(time) => this.saveStartTime(time, index)}
          />
        );
      },
    },
    {
      title: "Availability end time",
      dataIndex: "endTime",
      editable: false,
      render: (text, record, index) => {
        return (
          <TimePicker
            allowClear={false}
            value={moment(record.endTime || "00:00:00", "HH:mm:ss")}
            onChange={(time) => this.saveEndTime(time, index)}
          />
        );
      },
    },
  ];

  state = {
    editingKey: "",
    loading: true,
  };

  isEditing = (record) => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: "" });
  };

  saveAvailable(e, index) {
    const newData = [...this.props.value];
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      value: e.target.checked,
    });
    this.props.onChange(newData);
  }

  saveStartTime(time, index) {
    const newData = [...this.props.value];
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      startTime: moment(time).format("HH:mm:ss"),
    });
    this.props.onChange(newData);
  }

  saveEndTime(time, index) {
    const newData = [...this.props.value];
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      endTime: moment(time).format("HH:mm:ss"),
    });
    this.props.onChange(newData);
  }

  render() {
    const availabilitycolumns = this.availabilitycolumns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <Fragment>
        <EditableContext.Provider value={this.props.form}>
          <Table
            key="day"
            bordered
            dataSource={this.props.value}
            columns={availabilitycolumns}
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
