import React, { useState } from "react";
import {
  Layout,
  Menu,
  theme,
  Typography,
  Avatar,
  Button,
  Space,
} from "antd";

import {
  DashboardOutlined,
  SketchOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import { Outlet, useNavigate, useLocation } from "react-router-dom";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const DashLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  /* ===============================
     ROUTE LABEL MAPPING
  =============================== */
  const routeNames = {
    "/dashboard": "Dashboard",
    "/dashboard/design-studio": "Design Studio",
    "/dashboard/settings": "Settings",
  };

  const currentPage =
    routeNames[location.pathname] || "Dashboard";

  /* ===============================
     SIDEBAR ITEMS
  =============================== */
  const items = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/dashboard/design-studio",
      icon: <SketchOutlined />,
      label: "Design Studio",
    },
    {
      key: "/dashboard/settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        {/* LOGO */}
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {collapsed ? "AD" : "AuraDrape"}
        </div>

        {/* MENU */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={items}
        />
      </Sider>

      {/* MAIN LAYOUT */}
      <Layout>
        {/* HEADER */}
        <Header
          style={{
            padding: "0 20px",
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
               {/* RIGHT SIDE - PAGE TITLE */}
          <Title level={4} style={{ margin: 0 }}>
            {currentPage}
          </Title>
          
          {/* LEFT SIDE - USER + LOGOUT */}
          <Space>
            <Avatar icon={<UserOutlined />} />
            <Button
              danger
              type="text"
              icon={<LogoutOutlined />}
            >
              Logout
            </Button>
          </Space>

       
        </Header>

        {/* CONTENT */}
        <Content style={{ margin: "16px" }}>
          <div
            style={{
              padding: 24,
              minHeight: "calc(100vh - 120px)",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashLayout;