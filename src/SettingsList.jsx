import React from 'react';
import { Alert, Button, Input, Layout, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

export class SettingsList extends React.Component {
  state = {
    searchText: '',
    filteredStatus: null,
    columnIndex: 0
  };

  getColumnSearchProps = (dataIndex, columnName) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={node => {
              this.searchInput = node;
            }}
            placeholder={`Search ${columnName}`}
            value={selectedKeys[0]}
            onChange={e =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm)}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
        </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
        </Button>
        </div>
      ),

    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),

    onFilter: (value, record) => {
      return record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    },

    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },

    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ''}
      />
    )
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  handleChange = (pagination, filters) => {
    this.setState({ filteredStatus: filters });
  };

  clearAllFilters = () => {
    this.setState({
      filteredStatus: null,
      columnIndex: this.state.columnIndex + 1
    });
  };

  clearFiltersButton = () => {
    if (this.state.filteredStatus) {
      return (<div style={{ margin: '16px' }}>
        <Button onClick={this.clearAllFilters}>
          {' '}
          Clear all searches and filters{' '}
        </Button>
      </div>);
    }
  }

  addSettingButton = () => {
    return (<div style={{ margin: '16px' }}>
      <Button onClick={this.props.handleAddSetting}>
        Add New Setting
      </Button>
    </div>);
  }

  message = () => {
    if (this.props.message) {
      return <Alert message={this.props.message} type="success" />;
    }
  }

  settingsTable = () => {
    if (this.props.data.length === 0) {
      return <h1>Time to add your first setting</h1>;
    }
    const columns = [
      {
        title: 'Owner',
        dataIndex: "ownerName",
        key: "ownerName",
        ...this.getColumnSearchProps("ownerName", "Owner")
      },
      {
        title: "Percentage",
        dataIndex: "advancedroundrobin__Percent",
        key: "advancedroundrobin__Percent"
      },
      {
        title: "Module",
        dataIndex: "advancedroundrobin__Module",
        key: "advancedroundrobin__Module",
        ...this.getColumnSearchProps("advancedroundrobin__Module", "Module")
      },
      {
        title: "Disabled Until",
        dataIndex: "advancedroundrobin__Disabled_Until",
        key: "advancedroundrobin__Disabled_Until"
      },
      {
        title: "Field Criteria",
        dataIndex: "advancedroundrobin__Field_Criteria",
        key: "advancedroundrobin__Field_Criteria",
        ...this.getColumnSearchProps(
          "advancedroundrobin__Field_Criteria",
          "Field Criteria"
        )
      },
      {
        title: "Edit",
        render: currentRow => {
          return (
            <Button
              onClick={() => this.props.handleEditRecord(currentRow.id)}
            >
              Edit
            </Button>
          );
        }
      }
    ];

    return (<Table
      key={this.state.columnIndex}
      columns={columns}
      dataSource={this.props.data}
      expandedRowRender={this.expandedRowRender}
      onChange={this.handleChange}
    />);
  }

  render() {
    return (
      <Layout>
        <Layout.Content style={{ background: '#fff' }}>
          <div style={{ margin: '8px' }}>
            {this.message()}
            {this.addSettingButton()}
            {this.clearFiltersButton()}
            {this.settingsTable()}
          </div>
        </Layout.Content>
      </Layout>
    );
  }
}
