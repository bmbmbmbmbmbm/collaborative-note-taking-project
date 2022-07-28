import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function EntryPrompt({title, desc, link, img}) {
    const navigate = useNavigate();

    return (
        <div className="prompt" style={{ textAlign: "center" }}>
            <img
                alt=""
                src={img}
                style={{
                    objectFit: "scale-down",
                    width: "70%",
                    marginLeft: "auto",
                    marginRight: "auto",
                }}
            />
            <h2>{title}</h2>
            <p style={{ paddingLeft: "3%", paddingRight: "3%" }}>{desc}</p>
            <Button onClick={() => navigate(link)}>Get started</Button>
        </div>
    );
}
