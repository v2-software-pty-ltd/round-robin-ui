import React from "react";
import { Col, Layout, Row, Spin, Typography } from "antd";
import "antd/dist/antd.css";

import { EditSettingForm } from "./SettingsForm";
import {
  loadActiveUsers,
  loadRoundRobinSetting,
  updateRoundRobinSetting
} from "./utils/callCRMAPI";
import {
  processFieldCriteria,
  generateFieldCriteriaJSON
} from "./utils/processFieldCriteria";
import { loadFields } from "./utils/callCRMAPI";

export default class extends React.Component {
  state = {
    roundRobinSetting: null,
    loading: true,
    error: null,
    activeUsers: []
  };

  componentDidMount() {
    this.fetchRoundRobinSetting();
  }

  fetchRoundRobinSetting = async () => {
    try {
      const roundRobinSetting = await loadRoundRobinSetting(
        this.props.recordID
      );
      const activeUsers = await loadActiveUsers();

      const rawFieldCriteria =
        roundRobinSetting["advancedroundrobin__Field_Criteria"];

      const fieldCriteriaForUI = processFieldCriteria(rawFieldCriteria).map(
        row => {
          return {
            ...row,
            key: `${row.fieldName}${row.comparisonType}`
          };
        }
      );

      const moduleName = roundRobinSetting["advancedroundrobin__Module"];

      const fieldsForThisModule = await loadFields(moduleName);

      this.setState({
        loading: false,
        roundRobinSetting: {
          ...roundRobinSetting,
          fieldCriteriaForUI,
          fieldsForThisModule
        },
        activeUsers
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
            backgroundColor: "#F2410A",
            display: "flex",
            position: "fixed",
            left: 0,
            zIndex: 1,
            width: "100%"
          }}
        >
          <Row gutter={16} style={{ width: "100%" }}>
            <Col span={24}>
              <Typography style={{ padding: "5px", alignSelf: "center" }}>
                <Typography.Title
                  style={{
                    padding: "5px",
                    alignSelf: "center",
                    color: "white"
                  }}
                >
                  Edit Round Robin Setting
                </Typography.Title>
              </Typography>
            </Col>
          </Row>
        </Layout.Header>
      </Layout>
    );
  }

  handleSubmit = async (data) => {
    this.setState({ loading: true });
    const fieldCriteriaJSON = generateFieldCriteriaJSON(data.fieldCriteria);

    await updateRoundRobinSetting({
      ...this.state.roundRobinSetting,
      advancedroundrobin__Field_Criteria: fieldCriteriaJSON,
      advancedroundrobin__Module: data.Module,
      Owner: { id: data.Owner },
      advancedroundrobin__Percent:
        data.Percentage > 99 ? 99 : data.Percentage,
      Email: data.email,
      advancedroundrobin__Disabled_Until: data.Disabled_Until && data.Disabled_Until.format(
        "YYYY-MM-DD"
      )
    });

    this.setState({ loading: false });

    this.props.setPage({
      page: 'list_settings',
      message: 'Setting updated'
    });
  }

  content() {
    if (!this.state.loading && this.state.roundRobinSetting) {
      return (
        <EditSettingForm
          activeUsers={this.state.activeUsers}
          data={this.state.roundRobinSetting}
          onSubmit={this.handleSubmit}
        />
      );
    }

    return <Spin tip="Loading..." />;
  }

  render() {
    return (
      <Layout>
        <Layout.Header>{this.header()}</Layout.Header>
        <Layout.Content>{this.content()}</Layout.Content>
      </Layout>
    );
  }
}
