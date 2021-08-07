import React, { useEffect } from 'react';
import { Controller, useForm } from "react-hook-form";
import { Col, Form, Layout, Row, Select, Spin, Typography } from 'antd';
import 'antd/dist/antd.css';
import { tz } from "moment-timezone";

import useAsyncError from "./hooks/useAsyncError";
import { AvailabilityTable } from "./AvailabilityTable";
import { loadRoundRobinAvailabilityForTeamMember, updateRoundRobinAvailability } from './utils/callCRMAPI';

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
          setAvailabilityData({
            ...availabilityData[0]
          });
        }

        setIsLoading(false);
      } catch (e) {
        setError(e);
      }
    };

    fetchAvailability();
  }, [teamMemberId, teamMemberRecord.Owner]);

  const defaultValues = {
    advancedroundrobin__Complex_Availability:
      availabilityData["advancedroundrobin__Complex_Availability"],
    advancedroundrobin__Timezone:
      availabilityData["advancedroundrobin__Timezone"] ||
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    advancedroundrobin__Leave_Dates: availabilityData["advancedroundrobin__Leave_Dates"],
    advancedroundrobin__Max_Leads_For_This_Setting:
      availabilityData["advancedroundrobin__Max_Leads_For_This_Setting"],
  };

  const {
    control,
    handleSubmit,
    errors,
    watch,
    setValue,
    getValues,
    trigger,
  } = useForm({
    defaultValues,
  });

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
      await updateRoundRobinAvailability({
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
    } catch (e) {
      throwError(e);
    }
  };

  return (
    <Layout>
      <Layout.Header>
        <Header />
      </Layout.Header>
      <Layout.Content>
        {error && (
          <div className="alert alert-danger">
            <strong>Error:</strong> {error.message}
          </div>
        )}
        {isLoading && <Spin tip="Loading..." />}
        {!isLoading && (
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            onFinish={handleSubmit(handleSave)}
          >
            <Form.Item label="Time Zone" labelAlign="left">
              <Controller
                control={control}
                name="advancedroundrobin__Timezone"
                render={(props) => (
                  <Select
                    style={{ width: 200 }}
                    placeholder="Timezone"
                    showSearch
                    {...props}
                  >
                    {tz.names().map((field) => (
                      <Select.Option key={field} value={field}>
                        {field}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              ></Controller>
            </Form.Item>
            <Form.Item label="Availability" labelAlign="left">
              <AvailabilityTable
                control={control}
                setValue={setValue}
                getValues={getValues}
                errors={errors}
                trigger={trigger}
                watch={watch}
              />
            </Form.Item>
          </Form>
        )}
      </Layout.Content>
    </Layout>
  );
}

export default EditAvailabilityPage;
