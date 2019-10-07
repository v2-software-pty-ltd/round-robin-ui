import React from 'react';
import { Col, Layout, Row, Spin, Typography } from 'antd';
import 'antd/dist/antd.css';

import { SettingsList } from './SettingsList';
import { addNewSetting, loadRoundRobinSettings } from './utils/callCRMAPI';

export default class extends React.Component {
  state = { roundRobinSettings: [], loading: true, error: null };

  componentDidMount() {
    this.fetchRoundRobinSettings();
  }

  fetchRoundRobinSettings = async () => {
    try {
      const roundRobinSettings = await loadRoundRobinSettings();
      this.setState({
        loading: false,
        roundRobinSettings
      });
    } catch (e) {
      this.error = e;
    }
  };

  header() {
    return (
      <Layout>
        <Layout.Header
          style={{
            backgroundColor: '#F2410A',
            display: 'flex',
            position: 'fixed',
            left: 0,
            zIndex: 1,
            width: '100%'
          }}
        >
          <Row gutter={16} style={{ width: '100%' }}>
            <Col span={24}>
              <Typography style={{ padding: '5px', alignSelf: 'center' }}>
                <Typography.Title
                  style={{
                    padding: '5px',
                    alignSelf: 'center',
                    color: 'white'
                  }}
                >
                  Round Robin Settings
                </Typography.Title>
              </Typography>
            </Col>
          </Row>
        </Layout.Header>
      </Layout>
    );
  }

  handleEditRecord = (recordID) => {
    this.props.setPage({
      page: 'edit_setting',
      recordID
    });
  }

  handleAddSetting = async () => {
    this.setState({ loading: true });
    const newRecordData = await addNewSetting();
    this.handleEditRecord(newRecordData.details.id);
  }

  content() {
    if (!this.state.loading && this.state.roundRobinSettings) {
      return (<SettingsList
        data={this.state.roundRobinSettings}
        handleEditRecord={this.handleEditRecord}
        handleAddSetting={this.handleAddSetting}
        message={this.props.message}
      />);
    }

    return <Spin tip="Loading..." />
  }

  render() {
    return (
      <Layout>
        <Layout.Header>
          {this.header()}
        </Layout.Header>
        <Layout.Content>
          {this.content()}
        </Layout.Content>
      </Layout>
    );
  }
}
