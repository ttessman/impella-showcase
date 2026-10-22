import { useTheme } from "../../../hooks/useTheme";
import { IconButton } from "../Button/variants/IconButton";
import { Icon } from "../Icon/Icon";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <IconButton
      size="small"
      variant="primary"
      label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      onClick={toggle}
    >
      <Icon type={theme === "dark" ? "light-mode" : "dark-mode"} />
    </IconButton>
  );
}
