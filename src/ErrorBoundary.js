import React, { Component } from "react";
import { Col, Layout, Row, Typography } from "antd";

class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error: error.stack,
    };
  }

  render() {
    if (this.state.hasError) {
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
            <Row>
              <Col>
                <Typography style={{ padding: "5px", alignSelf: "center" }}>
                  <Typography.Title
                    level={4}
                    style={{
                      padding: "5px",
                      alignSelf: "center",
                      color: "white",
                    }}
                  >
                    Sorry something went wrong. Please take a screenshot of this
                    error and email team@ethicaltechnology.co
                  </Typography.Title>
                </Typography>
              </Col>
              <Col>{this.state.error}</Col>
            </Row>
          </Layout.Header>
        </Layout>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
