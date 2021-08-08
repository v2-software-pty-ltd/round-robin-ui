import React, { useEffect } from 'react';
import { Col, Layout, Row, Spin, Typography } from 'antd';
import moment from "moment";
import 'antd/dist/antd.css';

import useAsyncError from "./hooks/useAsyncError";
import { loadRoundRobinAvailabilityForTeamMember, updateRoundRobinAvailability } from './utils/callCRMAPI';
import { EditAvailabilityForm } from './EditAvailabilityForm';

const Header = () => {
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
                Round Robin Availability
              </Typography.Title>
            </Typography>
          </Col>
        </Row>
      </Layout.Header>
    </Layout>
  );
}

const EditAvailabilityPage = ({ teamMemberId, teamMemberRecord }) => {
  const [availabilityData, setAvailabilityData] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const throwError = useAsyncError();

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setIsLoading(true);

        const availabilityData = await loadRoundRobinAvailabilityForTeamMember(teamMemberId);

        if (!availabilityData) {
          setAvailabilityData({});
        } else {
          const complexAvailability = availabilityData[0]?.advancedroundrobin__Complex_Availability;
          const processedAvailabilityData = {
            ...availabilityData[0]
          }

          try {
            const parsedLeaveDates = JSON.parse(availabilityData[0]?.advancedroundrobin__Leave_Dates);
            processedAvailabilityData.advancedroundrobin__Leave_Dates = parsedLeaveDates.map((leaveDate) => {
              return {
                dates: [moment(leaveDate.dates[0]), moment(leaveDate.dates[1])],
              }
            });
          } catch (e) {
          }

          try {
            const parsedAvailability = JSON.parse(complexAvailability);
            processedAvailabilityData.advancedroundrobin__Complex_Availability = parsedAvailability;
          } catch (e) {
          }

          setAvailabilityData(processedAvailabilityData);
        }

        setIsLoading(false);
      } catch (e) {
        setError(e);
      }
    };

    fetchAvailability();
  }, [teamMemberId, teamMemberRecord.Owner]);

  const handleSave = async (data) => {
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

    try {
      setIsLoading(true);
      const result = await updateRoundRobinAvailability({
        ...availabilityData,
        Name: `Availability for team member ${teamMemberRecord.Owner.name}`,
        Owner: teamMemberRecord.Owner,
        round_robin_availability_id: availabilityData.id,
        teamMemberId,
        advancedroundrobin__Complex_Availability:
          data.advancedroundrobin__Complex_Availability,
        advancedroundrobin__Timezone: data.advancedroundrobin__Timezone,
        advancedroundrobin__Leave_Dates: data.advancedroundrobin__Leave_Dates,
      });

      setIsLoading(false);

      window.location.reload();
    } catch (e) {
      throwError(e);
    }
  };

  return (
    <div>
      <Layout>
        <Layout.Header>
          <Header />
        </Layout.Header>
        <Layout.Content style={{ padding: '40px'}}>
          {error && (
            <div className="alert alert-danger">
              <strong>Error:</strong> {error.message}
            </div>
          )}
          {isLoading && <Spin tip="Loading..." />}
          {!isLoading && (
            <EditAvailabilityForm handleSave={handleSave} availabilityData={availabilityData} />
          )}
        </Layout.Content>
      </Layout>
    </div>
  );
}

export default EditAvailabilityPage;
