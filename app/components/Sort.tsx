import React, { useState } from "react";
import { Select, Popover, Paper } from "@mantine/core";

export default function SortBy() {
  const [selectedValue, setSelectedValue] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return {
    // TO DO:
  };
}
