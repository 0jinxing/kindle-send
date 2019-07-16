import React from "react";
import { Button, InputGroup, Checkbox, Intent } from "@blueprintjs/core";
import { FilePond } from "react-filepond";
import logoImg from "./assets/logo.png";

const App = () => {
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
        <FilePond
          server={{
            url: "/api/upload"
          }}
          allowMultiple
        />
        <InputGroup
          placeholder="输入你的 kindle 邮箱"
          leftIcon="envelope"
          style={{
            marginBottom: "1em"
          }}
          large
        />
        <Checkbox
          label="格式转换"
          style={{
            marginBottom: "1em"
          }}
        />

        <Button fill intent={Intent.PRIMARY}>
          确认
        </Button>
      </main>
    </div>
  );
};

export default App;
