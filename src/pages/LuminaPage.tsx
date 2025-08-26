import React from "react";
import styled from "styled-components";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  InputBase,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  ChatBubbleOutline as ChatIcon,
  GraphicEq as VoiceIcon,
  InsertDriveFileOutlined as FilesIcon,
  CheckCircleOutline as TasksIcon,
  ViewModule as ProjectsIcon,
  History as HistoryIcon,
  AttachFile as AttachIcon,
  KeyboardVoice as MicIcon,
} from "@mui/icons-material";
import { brandColors } from "../theme";
import { PageAppBar } from "../components/Header";
import { useFaviconVariant } from "../hooks/useFaviconVariant";

const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: #0b0c0f;
  color: #ffffff;
  display: flex;
  padding-top: 64px; /* account for fixed PageAppBar */
`;

const Sidebar = styled.aside`
  width: 260px;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SidebarItem = styled(Button)`
  && {
    justify-content: flex-start;
    gap: 10px;
    color: rgba(255, 255, 255, 0.85);
    text-transform: none;
    font-weight: 600;
    padding: 10px 12px;
    border-radius: 8px;
  }
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Stars = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    radial-gradient(2px 2px at 20% 30%, rgba(255, 255, 255, 0.18) 50%, transparent 50%),
    radial-gradient(1.5px 1.5px at 70% 60%, rgba(255, 255, 255, 0.14) 50%, transparent 50%),
    radial-gradient(1px 1px at 40% 80%, rgba(255, 255, 255, 0.12) 50%, transparent 50%),
    radial-gradient(1.5px 1.5px at 85% 25%, rgba(255, 255, 255, 0.16) 50%, transparent 50%);
  background-repeat: no-repeat;
`;

const CenterStack = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: min(900px, 92%);
  margin: 0 auto;
` as typeof Box;

const ChatBar = styled(Paper)`
  && {
    width: 100%;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: none;
    border-radius: 16px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    backdrop-filter: blur(6px);
  }
`;

const PersonasWrapper = styled.div`
  position: absolute;
  bottom: -56px;
  right: 0;
`;

// Using provided PNG logo from public folder

const LuminaPage: React.FC = () => {
  // Dark background → use light favicon
  useFaviconVariant("light");
  return (
    <PageContainer>
      <PageAppBar title="Lumina" />

      <Sidebar>
        <SidebarItem startIcon={<SearchIcon />} color="inherit">Search ⌘K</SidebarItem>
        <SidebarItem startIcon={<ChatIcon />} color="inherit">Chat</SidebarItem>
        <SidebarItem startIcon={<VoiceIcon />} color="inherit">Voice</SidebarItem>
        <SidebarItem startIcon={<FilesIcon />} color="inherit">Files</SidebarItem>
        <SidebarItem startIcon={<TasksIcon />} color="inherit">Tasks</SidebarItem>
        <SidebarItem startIcon={<ProjectsIcon />} color="inherit">Projects</SidebarItem>
        <Divider sx={{ my: 1, borderColor: "rgba(255,255,255,0.1)" }} />
        <SidebarItem startIcon={<HistoryIcon />} color="inherit">History</SidebarItem>
      </Sidebar>

      <Main>
        <Stars />
        <CenterStack>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              component="img"
              src="/Lumina%20Logo.png"
              alt="Lumina logo"
              sx={{ height: 72, width: 'auto' }}
            />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                letterSpacing: "0.5px",
                color: "#fff",
                textShadow: "0 2px 10px rgba(0,0,0,0.35)",
              }}
            >
              Lumina
            </Typography>
          </Box>

          <Box sx={{ position: "relative", width: "100%" }}>
            <ChatBar>
              <Tooltip title="Attach files">
                <IconButton size="small" sx={{ color: "rgba(255,255,255,0.8)" }}>
                  <AttachIcon />
                </IconButton>
              </Tooltip>
              <InputBase
                placeholder="What do you want to know?"
                sx={{
                  ml: 1,
                  flex: 1,
                  color: "#fff",
                  "& input::placeholder": { color: "rgba(255,255,255,0.6)" },
                }}
                inputProps={{ "aria-label": "Lumina chat input" }}
              />
              <Tooltip title="Ask with voice">
                <IconButton
                  size="small"
                  sx={{
                    color: "#0b0c0f",
                    bgcolor: "#fff",
                    "&:hover": { bgcolor: "#f5f5f5" },
                  }}
                >
                  <MicIcon />
                </IconButton>
              </Tooltip>
            </ChatBar>

            <PersonasWrapper>
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                sx={{
                  borderColor: "rgba(255,255,255,0.3)",
                  color: "rgba(255,255,255,0.9)",
                  textTransform: "none",
                  backdropFilter: "blur(4px)",
                }}
              >
                Personas ▾
              </Button>
            </PersonasWrapper>
          </Box>
        </CenterStack>
      </Main>
    </PageContainer>
  );
};

export default LuminaPage;


