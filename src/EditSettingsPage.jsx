import React from "react";
import { Col, Layout, Row, Spin, Typography } from "antd";
import "antd/dist/antd.css";

import { EditSettingForm } from "./SettingsForm";
import {
  loadActiveUsers,
  loadActiveTeams,
  loadRoundRobinSetting,
  updateRoundRobinSetting,
} from "./utils/callCRMAPI";
import {
  processFieldCriteria,
  generateFieldCriteriaJSON,
  processLeaveDates,
} from "./utils/processFieldCriteria";
import { useState, useEffect } from "react";
import useAsyncError from "./hooks/useAsyncError";
import moment from "moment";

export default function EditSettingPage({ setPage, recordID }) {
  const [loading, setLoading] = useState(true);
  const [roundRobinSetting, setRoundRobinSetting] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [activeTeams, setActiveTeams] = useState([]);

  const throwError = useAsyncError();

  const getAvailabilityData = () => {
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    return days.map((day) => {
      return { day: day, available: false, startTime: "", endTime: "" };
    });
  };

  useEffect(() => {
    const fetchRoundRobinSetting = async () => {
      try {
        const roundRobinSetting = await loadRoundRobinSetting(recordID);
        const activeUsers = await loadActiveUsers();
        const activeTeams = await loadActiveTeams();

        const rawFieldCriteria =
          roundRobinSetting["advancedroundrobin__Field_Criteria"];

        const rawLeaveDates =
          roundRobinSetting["advancedroundrobin__Leave_Dates"];

        const leaveDates = processLeaveDates(rawLeaveDates);

        const fieldCriteriaForUI = processFieldCriteria(rawFieldCriteria).map(
          (row) => {
            return {
              ...row,
              key: `${row.fieldName}${row.comparisonType}`,
            };
          }
        );
        setLoading(false);
        setRoundRobinSetting({
          ...roundRobinSetting,
          fieldCriteriaForUI,
          advancedroundrobin__Complex_Availability: roundRobinSetting
            .advancedroundrobin__Complex_Availability.length
            ? JSON.parse(
                roundRobinSetting.advancedroundrobin__Complex_Availability
              )
            : getAvailabilityData(),
          advancedroundrobin__Leave_Dates: leaveDates,
        });
        setActiveUsers(activeUsers);
        setActiveTeams(activeTeams);
      } catch (e) {
        throwError(e);
      }
    };
    fetchRoundRobinSetting();
  }, [recordID, throwError]);

  const header = () => {
    return (
      <Layout>
        <Layout.Header
          style={{
            backgroundColor: "#F2410A",
            display: "flex",
            position: "fixed",
            left: 0,
            zIndex: 1,
            width: "100%",
          }}
        >
          <Row gutter={16} style={{ width: "100%" }}>
            <Col span={24}>
              <Typography style={{ padding: "5px", alignSelf: "center" }}>
                <Typography.Title
                  style={{
                    padding: "5px",
                    alignSelf: "center",
                    color: "white",
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
  };

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      const fieldCriteriaJSON = generateFieldCriteriaJSON(data.fieldCriteria);
      await updateRoundRobinSetting({
        ...roundRobinSetting,
        advancedroundrobin__Field_Criteria: fieldCriteriaJSON,
        advancedroundrobin__Complex_Availability:
          data.advancedroundrobin__Complex_Availability,
        advancedroundrobin__Module: data.Module,
        Owner: { id: data.Owner },
        Name: data.Name,
        advancedroundrobin__Percent:
          data.Percentage > 100 ? 100 : data.Percentage,
        Email: data.email,
        advancedroundrobin__Disabled_Until:
          data.Disabled_Until &&
          moment(data.Disabled_Until).format("YYYY-MM-DD"),
        advancedroundrobin__Timezone: data.advancedroundrobin__Timezone,
        advancedroundrobin__Leave_Dates: data.advancedroundrobin__Leave_Dates,
        advancedroundrobin__RR_Team: data.RR_Team,
        advancedroundrobin__Max_Leads_For_This_Setting:
          data.advancedroundrobin__Max_Leads_For_This_Setting,
      });

      setLoading(false);

      setPage({
        page: "list_settings",
        message: "Setting updated",
      });
    } catch (e) {
      throwError(e);
    }
  };

  const content = () => {
    if (!loading && roundRobinSetting) {
      return (
        <EditSettingForm
          activeUsers={activeUsers}
          activeTeams={activeTeams}
          data={roundRobinSetting}
          onSubmit={handleSubmit}
        />
      );
    }

    return <Spin tip="Loading..." />;
  };

  return (
    <Layout>
      <Layout.Header>{header()}</Layout.Header>
      <Layout.Content>{content()}</Layout.Content>
    </Layout>
  );
}
