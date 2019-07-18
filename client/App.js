import React from "react";
import {
  Button,
  InputGroup,
  Checkbox,
  FormGroup,
  Toaster,
  Position,
  Intent
} from "@blueprintjs/core";
import axios from "axios";
import { FilePond } from "react-filepond";
import Header from "./components/Header";
import Layout from "./components/Layout";

const emailRegExp = /\S+@kindle\.\S+/i;

class App extends React.Component {
  state = {
    files: [],
    email: "",
    convert: false,
    first: true,
    alert: false,
    message: ""
  };

  handleSubmit = async () => {
    const { email, files, convert } = this.state;
    if (!emailRegExp.test(email)) {
      this.toaster.show({
        intent: Intent.WARNING,
        icon: "issue",
        message: "请输入正确的邮箱"
      });
    } else if (!files.filter(file => file.serverId).length) {
      this.toaster.show({
        intent: Intent.WARNING,
        icon: "issue",
        message: "请上传需要推送的文件"
      });
    } else {
      localStorage.setItem("email", email);
      try {
        const res = await axios("/api/push", {
          method: "POST",
          data: {
            email,
            files: files.map(f => ({
              md5: f.serverId,
              filename: f.filename
            })),
            convert
          }
        });
        if (res.data.status === "ok") {
          this.toaster.show({
            intent: Intent.PRIMARY,
            icon: "cube",
            message: "成功加入推送队列"
          });
        }
      } catch (err) {
        this.toaster.show({
          intent: Intent.DANGER,
          icon: "error",
          message: err.message || "服务器错误"
        });
      }
    }
    this.setState({ first: false });
  };

  componentDidMount() {
    this.setState({ email: localStorage.getItem("email") || "" });
  }

  render() {
    const { files, email, convert, first } = this.state;

    return (
      <Layout>
        <Header />
        <main>
          <FormGroup
            helperText={
              !files.filter(file => !!file.serverId).length && !first
                ? "请上传需要推送的文件"
                : false
            }
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
                this.setState({
                  files: files
                });
              }}
            />
          </FormGroup>
          <FormGroup
            helperText={
              !emailRegExp.test(email) && !first ? "请输入正确的邮箱" : false
            }
            label="kindle 邮箱"
            labelFor="email-input"
            intent={Intent.DANGER}
          >
            <InputGroup
              value={email}
              onChange={e => {
                this.setState({ email: e.target.value });
              }}
              id="email-input"
              placeholder="输入你的 kindle 邮箱"
              leftIcon="envelope"
              large
            />
          </FormGroup>

          <Checkbox
            checked={convert}
            onChange={e => {
              this.setState({ convert: e.target.checked });
            }}
            label="格式转换"
            style={{
              marginBottom: "1em"
            }}
          />
          <Button
            fill
            large
            intent={Intent.PRIMARY}
            onClick={this.handleSubmit}
          >
            确认
          </Button>
        </main>
        <Toaster
          canEscapeKeyClear
          position={Position.TOP}
          ref={toaster => (this.toaster = toaster)}
        />
      </Layout>
    );
  }
}

export default App;
