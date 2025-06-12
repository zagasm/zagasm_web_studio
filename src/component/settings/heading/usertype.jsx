import React from "react";
import Tooltip from "@mui/material/Tooltip";

export const UserTypeIcon = ({ userType }) => {
  const userTypeIcons = [
    { id: "1", icon: "👑", name: "King" },
    { id: "2", icon: "🤝", name: "Stakeholder" },
    { id: "3", icon: "👤", name: "Villager" },
  ];

  const getUserData = () => {
    if (!userType) return { icon: "👤", name: "Unknown" };
    const user = userTypeIcons.find((u) => u.id === userType);
    return user ? user : { icon: "👤", name: "Unknown" };
  };

  const { icon, name } = getUserData();

  return (
    <Tooltip title={name} placement="bottom">
      <span style={{ fontSize: "20px", cursor: "pointer" }}>{icon}</span>
    </Tooltip>
  );
};