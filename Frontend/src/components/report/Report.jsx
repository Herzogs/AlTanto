import React from "react";
import { Card, CardContent, Typography, Box, IconButton, Button } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import "./styles.css";

function Report({ report, title, description, dtime='', icon='', icolor='', onViewDetails }) {
  const IconoProp = icon;

  return (
    <Card variant="outlined" className="at-report">
      <CardContent>
        <Box className="at-report-header">
          <Typography variant="h6" component="h4">
            {title}
          </Typography>
          <IconButton style={{ color: icolor }}>
            <IconoProp />
          </IconButton>
        </Box>
        <Typography variant="body1" color="textSecondary" component="p">
          {description}
        </Typography>
        <Box className="at-report-footer">
        <Button variant="contained" color="primary" size="small" onClick={onViewDetails}>
            Ver detalles
          </Button>
          <Typography variant="body1" color="textSecondary" component="small">
            {dtime}
          </Typography>
          <IconButton>
            <ThumbUpIcon style={{ color: "#537ac9" }} />
          </IconButton>
          <IconButton>
            <ThumbDownAltIcon style={{ color: "#cc545d" }} />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}

export default Report;
