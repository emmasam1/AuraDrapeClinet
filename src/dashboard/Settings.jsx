import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Avatar,
  Button,
  Input,
  message,
  Modal,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const Settings = () => {
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const [profile, setProfile] = useState(() => {
    const savedUser = JSON.parse(sessionStorage.getItem("user"));
    return {
      name: savedUser?.name || "Aura User",
      email: savedUser?.email || "fashion.designer@auradrape.com",
    };
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordUpdate = () => {
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      message.error("Please fill all password fields");
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      message.error("New passwords do not match");
      return;
    }
    message.success("Password updated successfully");
    setPasswords({ current: "", newPass: "", confirm: "" });
    console.log("Password update:", passwords);
    // connect backend later
  };

  const handleDeleteAccount = () => {
    Modal.confirm({
      title: "Delete Account",
      content: "Are you sure you want to permanently delete your account?",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        sessionStorage.clear();
        message.success("Account deleted successfully");
        window.location.href = "/";
      },
    });
  };

  const handleLogout = () => {
    sessionStorage.clear();
    message.success("Logged out successfully");
    window.location.href = "/";
  };

  const openEditModal = () => {
    setTempProfile(profile);
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = () => {
    if (!tempProfile.name || !tempProfile.email) {
      message.error("All profile fields are required");
      return;
    }
    setProfile(tempProfile);
    const existingUser = JSON.parse(sessionStorage.getItem("user")) || {};
    sessionStorage.setItem(
      "user",
      JSON.stringify({
        ...existingUser,
        name: tempProfile.name,
        email: tempProfile.email,
      })
    );
    message.success("Profile updated successfully");
    setIsEditModalOpen(false);
  };

  return (
    <div>
      {/* HEADER */}
      <div style={{ marginBottom: 25 }}>
        <Title level={2} style={{ marginBottom: 0 }}>
          Settings
        </Title>
        <Text type="secondary">
          Manage your account and security settings.
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* PROFILE CARD */}
        <Col xs={24} lg={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 20,
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              background: "linear-gradient(135deg,#fff,#f7f9fc)",
            }}
          >
            <Avatar
              size={90}
              icon={<UserOutlined />}
              style={{ backgroundColor: "#1677ff", marginBottom: 15 }}
            />

            <Title level={4} style={{ margin: 0 }}>
              {profile.name}
            </Title>

            <Text type="secondary">{profile.email}</Text>

            <div style={{ marginTop: 20 }}>
              <Button type="primary" block onClick={openEditModal}>
                Edit Profile
              </Button>
            </div>
          </Card>
        </Col>

        {/* PASSWORD SECTION */}
        <Col xs={24} lg={16}>
          <Card
            bordered={false}
            style={{
              borderRadius: 20,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <Title level={4}>
              <LockOutlined /> Change Password
            </Title>

            <Text type="secondary">
              Update your password to keep your account secure.
            </Text>

            <div style={{ marginTop: 20 }}>
              <Input.Password
                name="current"
                placeholder="Current Password"
                value={passwords.current}
                onChange={handleChange}
                style={{ marginBottom: 15 }}
              />

              <Input.Password
                name="newPass"
                placeholder="New Password"
                value={passwords.newPass}
                onChange={handleChange}
                style={{ marginBottom: 15 }}
              />

              <Input.Password
                name="confirm"
                placeholder="Confirm New Password"
                value={passwords.confirm}
                onChange={handleChange}
                style={{ marginBottom: 20 }}
              />

              <Button type="primary" block onClick={handlePasswordUpdate}>
                Update Password
              </Button>
            </div>
          </Card>

          {/* DANGER ZONE */}
          <Card
            style={{
              marginTop: 20,
              borderRadius: 20,
              background: "#fff5f5",
              border: "1px solid #ffccc7",
            }}
          >
            <Title level={4} style={{ color: "#ff4d4f" }}>
              Danger Zone
            </Title>

            <Text type="secondary">These actions are irreversible.</Text>

            <div style={{ marginTop: 15 }}>
              <Button
                danger
                block
                style={{ marginBottom: 10 }}
                onClick={handleDeleteAccount}
              >
                Delete Account
              </Button>

              <Button block icon={<LogoutOutlined />} onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* EDIT PROFILE MODAL */}
      <Modal
        title="Edit Profile"
        open={isEditModalOpen}
        onOk={handleSaveProfile}
        onCancel={() => setIsEditModalOpen(false)}
        okText="Save Changes"
      >
        <Input
          placeholder="Full Name"
          value={tempProfile.name}
          onChange={(e) =>
            setTempProfile({ ...tempProfile, name: e.target.value })
          }
          style={{ marginBottom: 15 }}
        />

        <Input
          placeholder="Email Address"
          value={tempProfile.email}
          onChange={(e) =>
            setTempProfile({ ...tempProfile, email: e.target.value })
          }
        />
      </Modal>
    </div>
  );
};

export default Settings;