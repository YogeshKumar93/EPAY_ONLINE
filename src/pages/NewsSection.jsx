import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";

const NewsSection = () => {
  const [data, setData] = useState([]);
  const [isProgress, setIsProgress] = useState(false);

  console.log("the news data is", data);
  const colors = ["#000000"];

  return (
    <Grid
      item
      xs={12}
      sm={12}
      md={12}
      lg={12}
      sx={{
        textAlign: "center",
        display: "flex",
        borderRadius: "8px",
        // backgroundImage: gradientColor,
        color: "#004080",
        fontSize: "18px",
        alignItems: "center",
        justifyContent: "right",
        marginBottom: "0.6rem",
        padding: "8px 6px",
      }}
    >
      <marquee direction="left" style={{ width: "100%" }}>
        <span
          // key={index}
          style={{
            // color: colors[index % colors.length],
            color: "#060a5cff",
            margin: "0 8px",
            backgroundColor:"#e3f2f2ff"
          }}
        >
          🚀 We have new Plans for You! | UPI Service is working Fine | New updates available | Keep
          track of your transactions here..
          {/* {item.news} */}
          {/* {index < data.length - 1 && " | "} */}
        </span>
      </marquee>
    </Grid>
  );
};

export default NewsSection;
