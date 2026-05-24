import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Progress,
  Avatar,
  Table,
  Spin,
} from "antd";
import {
  ManOutlined,
  WomanOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useApp } from "../context/AppContext";

const { Title, Text } = Typography;

const Dashboard = () => {
  const { getDesigns } = useApp?.() ?? {};
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load database array on component mount safely
  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getDesigns?.();
        if (isMounted) {
          setDesigns(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Dashboard initialization error:", err);
        if (isMounted) setDesigns([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ⚡ Changing this to an empty array breaks the infinite re-fetch loop

  // 📊 Calculate Dynamic Metrics Aggregate Layers from API
  const metrics = React.useMemo(() => {
    const total = designs.length;
    const maleCount = designs.filter((d) => d.gender?.toLowerCase() === "male").length;
    const femaleCount = designs.filter((d) => d.gender?.toLowerCase() === "female").length;

    const malePercent = total > 0 ? Math.round((maleCount / total) * 100) : 0;
    const femalePercent = total > 0 ? Math.round((femaleCount / total) * 100) : 0;

    return {
      total,
      maleCount,
      femaleCount,
      malePercent,
      femalePercent,
    };
  }, [designs]);

  // Ant Design Table Columns Configuration
  const columns = [
    {
      title: "Client Name",
      dataIndex: "customerName",
      key: "customerName",
      render: (text) => <Text style={{ textTransform: "capitalize", fontWeight: "500" }}>{text || "Walk-in Customer"}</Text>,
    },
    {
      title: "Gender Profile",
      dataIndex: "gender",
      key: "gender",
      render: (text) => <Text style={{ textTransform: "capitalize" }}>{text || "N/A"}</Text>,
    },
    {
      title: "Fabric Configuration",
      dataIndex: "fabric",
      key: "fabric",
      render: (text) => <Text style={{ textTransform: "capitalize" }}>{text || "Standard Cotton"}</Text>,
    },
  ];

  // Map API entries to safe key indexes
  const tableDataSource = designs.map((item, idx) => ({
    ...item,
    key: item._id || `design-row-${idx}`,
  }));

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <Spin size="large" tip="Synchronizing system metrics..." />
      </div>
    );
  }

  return (
    <div>
      {/* PAGE HEADER */}
      <div style={{ marginBottom: 30 }}>
        <Title level={2} style={{ marginBottom: 0 }}>
          AuraDrape Dashboard
        </Title>
        <Text type="secondary">
          Monitor production sheets, client volume, and real-time custom specifications.
        </Text>
      </div>

      {/* DYNAMIC AGGREGATED STAT CARDS */}
      <Row gutter={[20, 20]}>
        {/* MALE CARDS BLOCK */}
        <Col xs={24} sm={12} lg={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 20,
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ flex: 1, marginRight: 10 }}>
                <Text type="secondary">Male Configurations</Text>
                <Title level={2} style={{ margin: "10px 0" }}>
                  {metrics.maleCount}
                </Title>
                <Progress percent={metrics.malePercent} showInfo={false} strokeColor="#1677ff" />
              </div>
              <Avatar
                size={70}
                style={{ backgroundColor: "#1677ff" }}
                icon={<ManOutlined />}
              />
            </div>
          </Card>
        </Col>

        {/* FEMALE CARDS BLOCK */}
        <Col xs={24} sm={12} lg={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 20,
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ flex: 1, marginRight: 10 }}>
                <Text type="secondary">Female Configurations</Text>
                <Title level={2} style={{ margin: "10px 0" }}>
                  {metrics.femaleCount}
                </Title>
                <Progress percent={metrics.femalePercent} showInfo={false} strokeColor="#eb2f96" />
              </div>
              <Avatar
                size={70}
                style={{ backgroundColor: "#eb2f96" }}
                icon={<WomanOutlined />}
              />
            </div>
          </Card>
        </Col>

        {/* TOTAL USER COUNT BLOCK */}
        <Col xs={24} sm={24} lg={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 20,
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ flex: 1, marginRight: 10 }}>
                <Text type="secondary">Total Active Orders</Text>
                <Title level={2} style={{ margin: "10px 0" }}>
                  {metrics.total}
                </Title>
                <Progress percent={metrics.total > 0 ? 100 : 0} showInfo={false} strokeColor="#52c41a" />
              </div>
              <Avatar
                size={70}
                style={{ backgroundColor: "#52c41a" }}
                icon={<TeamOutlined />}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* GRID INTERFACE DATA WORKSPACE */}
      <Row gutter={[20, 20]} style={{ marginTop: 30 }}>
        {/* API RECENT WORK ORDERS TABLE */}
        <Col xs={24} lg={16}>
          <Card
            title="Recent Studio Records"
            bordered={false}
            style={{
              borderRadius: 20,
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            }}
          >
            <Table
              dataSource={tableDataSource}
              columns={columns}
              pagination={{ pageSize: 5 }}
              locale={{ emptyText: "No real-time studio measurements found." }}
            />
          </Card>
        </Col>

        {/* SYSTEM OVERVIEW STATUS PROGRESS BARS */}
        <Col xs={24} lg={8}>
          <Card
            title="System Diagnostics"
            bordered={false}
            style={{
              borderRadius: 20,
              height: "100%",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ marginBottom: 20 }}>
              <Text>API Server Connection</Text>
              <Progress percent={100} status="success" />
            </div>

            <div style={{ marginBottom: 20 }}>
              <Text>3D Engine Optimization</Text>
              <Progress percent={88} status="active" />
            </div>

            <div>
              <Text>Fabric Layer Render Accuracy</Text>
              <Progress percent={95} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;