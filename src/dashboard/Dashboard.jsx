import React from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Progress,
  Avatar,
  Table,
} from "antd";

import {
  ManOutlined,
  WomanOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const Dashboard = () => {
  // Table Data
  const dataSource = [
    {
      key: "1",
      name: "John Doe",
      gender: "Male",
      design: "Street Wear",
    },
    {
      key: "2",
      name: "Sophia James",
      gender: "Female",
      design: "Evening Gown",
    },
    {
      key: "3",
      name: "Michael Lee",
      gender: "Male",
      design: "Corporate Suit",
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Design",
      dataIndex: "design",
      key: "design",
    },
  ];

  return (
    <div>
      {/* PAGE HEADER */}
      <div style={{ marginBottom: 30 }}>
        <Title level={2} style={{ marginBottom: 0 }}>
          AuraDrape Dashboard
        </Title>

        <Text type="secondary">
          Monitor avatars, users, and virtual fashion designs.
        </Text>
      </div>

      {/* STAT CARDS */}
      <Row gutter={[20, 20]}>
        {/* MALE */}
        <Col xs={24} sm={12} lg={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 20,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Text type="secondary">Male Avatars</Text>

                <Title level={2} style={{ margin: "10px 0" }}>
                  120
                </Title>

                <Progress percent={75} showInfo={false} />
              </div>

              <Avatar
                size={70}
                style={{
                  backgroundColor: "#1677ff",
                }}
                icon={<ManOutlined />}
              />
            </div>
          </Card>
        </Col>

        {/* FEMALE */}
        <Col xs={24} sm={12} lg={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 20,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Text type="secondary">Female Avatars</Text>

                <Title level={2} style={{ margin: "10px 0" }}>
                  95
                </Title>

                <Progress percent={60} showInfo={false} />
              </div>

              <Avatar
                size={70}
                style={{
                  backgroundColor: "#eb2f96",
                }}
                icon={<WomanOutlined />}
              />
            </div>
          </Card>
        </Col>

        {/* TOTAL */}
        <Col xs={24} sm={24} lg={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 20,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Text type="secondary">Total Users</Text>

                <Title level={2} style={{ margin: "10px 0" }}>
                  215
                </Title>

                <Progress percent={90} showInfo={false} />
              </div>

              <Avatar
                size={70}
                style={{
                  backgroundColor: "#52c41a",
                }}
                icon={<TeamOutlined />}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* SECOND SECTION */}
      <Row gutter={[20, 20]} style={{ marginTop: 30 }}>
        {/* RECENT USERS */}
        <Col xs={24} lg={16}>
          <Card
            title="Recent Avatar Designs"
            bordered={false}
            style={{
              borderRadius: 20,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={false}
            />
          </Card>
        </Col>

        {/* QUICK STATS */}
        <Col xs={24} lg={8}>
          <Card
            title="System Overview"
            bordered={false}
            style={{
              borderRadius: 20,
              height: "100%",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ marginBottom: 20 }}>
              <Text>3D Avatars Generated</Text>
              <Progress percent={85} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <Text>Clothing Simulations</Text>
              <Progress percent={70} status="active" />
            </div>

            <div>
              <Text>Fabric Rendering</Text>
              <Progress percent={92} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;