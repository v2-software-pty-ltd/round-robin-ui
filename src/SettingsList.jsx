import React from 'react';
import { Alert, Button, Icon, Input, Layout, Table } from 'antd';
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
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
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

  message = () => {
    debugger;
    if (this.props.message) {
      return <Alert message={this.props.message} type="success" />;
    }
  }

  render() {
    let { filteredStatus } = this.state;
    filteredStatus = filteredStatus || {};
    const columns = [
      {
        title: 'Owner',
        dataIndex: 'ownerName',
        key: 'ownerName',
        ...this.getColumnSearchProps('ownerName', 'Owner'),
      },
      {
        title: 'Percentage',
        dataIndex: 'advancedroundrobin.Percent',
        key: 'advancedroundrobin.Percent',
      },
      {
        title: 'Module',
        dataIndex: 'advancedroundrobin.Module',
        key: 'advancedroundrobin.Module',
        ...this.getColumnSearchProps('advancedroundrobin.Module', 'Module'),
      },
      {
        title: 'Field Criteria',
        dataIndex: 'advancedroundrobin.Field_Criteria',
        key: 'advancedroundrobin.Field_Criteria',
        ...this.getColumnSearchProps('advancedroundrobin.Field_Criteria', 'Field Criteria'),
      },
      {
        title: 'Edit',
        render: currentRow => {
          return (
            <Button onClick={() => this.props.handleEditRecord(currentRow.id)}>Edit</Button>
          );
        }
      }
    ];

    return (
      <Layout>
        <Layout.Content style={{ background: '#fff' }}>
          <div style={{ margin: '8px' }}>
            {this.message()}
            {this.clearFiltersButton()}
            <Table
              key={this.state.columnIndex}
              columns={columns}
              dataSource={this.props.data}
              expandedRowRender={this.expandedRowRender}
              onChange={this.handleChange}
            />
          </div>
        </Layout.Content>
      </Layout>
    );
  }
}
