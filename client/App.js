import React, { useState, useEffect } from "react";
import {
  Button,
  InputGroup,
  Checkbox,
  Intent,
  FormGroup
} from "@blueprintjs/core";
import { FilePond } from "react-filepond";
import logoImg from "./assets/logo.png";

// @TODO
const App1 = () => {
  const [files, setFiles] = useState([]);
  const [email, setEmail] = useState("");
  const [convert, setConvert] = useState(false);

  const [hasSubmit, setHasSubmit] = useState(false);

  const handleSubmit = () => {
    setHasSubmit(true);
    // @TODO
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "14vh auto",
        padding: "0 16px"
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "left",
          alignItems: "center",
          marginBottom: "16px"
        }}
      >
        <img
          src={logoImg}
          alt="logo"
          style={{
            width: "100px"
          }}
        />
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "normal",
            display: "flex",
            flexDirection: "column"
          }}
        >
          给 Kindle，发邮件
          <span
            style={{
              fontSize: "14px",
              color: "#666",
              marginTop: "4px"
            }}
          >
            快捷的 kindle 邮件推送工具
          </span>
        </h1>
      </header>
      <main>
        <FormGroup
          helperText={"请上传需要推送的文件"}
          label="推送的文件"
          labelFor="file-upload"
          intent={Intent.DANGER}
        >
          <FilePond
            id="file-upload"
            server={{
              process: "/api/upload",
              fetch: null,
              revert: null
            }}
            allowMultiple
            onupdatefiles={files => {
              console.log(files.map(file => file.serverId));
              console.log(files);
              // setFiles(files);
              // setFiles(files.map(file => file.serverId));
            }}
          />
        </FormGroup>
        <FormGroup
          helperText={"请输入正确的邮箱"}
          label="kindle 邮箱"
          labelFor="email-input"
          intent={Intent.DANGER}
        >
          <InputGroup
            value={email}
            onChange={setEmail}
            id="email-input"
            placeholder="输入你的 kindle 邮箱"
            leftIcon="envelope"
            large
          />
        </FormGroup>

        <Checkbox
          checked={convert}
          onChange={setConvert}
          label="格式转换"
          style={{
            marginBottom: "1em"
          }}
        />
        <Button fill large intent={Intent.PRIMARY} onClick={handleSubmit}>
          确认
        </Button>
      </main>
    </div>
  );
};

export default App1;
