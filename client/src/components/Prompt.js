import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function EntryPrompt(props) {
    const navigate = useNavigate();

    return (
        <div className="prompt" style={{ textAlign: "center" }}>
            <img
                alt=""
                src={props.img}
                style={{
                    objectFit: "scale-down",
                    width: "70%",
                    marginLeft: "auto",
                    marginRight: "auto",
                }}
            />
            <h2>{props.title}</h2>
            <p style={{ paddingLeft: "3%", paddingRight: "3%" }}>{props.desc}</p>
            <Button onClick={() => navigate(props.link)}>Get started</Button>
        </div>
    );
}
