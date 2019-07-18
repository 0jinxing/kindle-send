const EventEmitter = require("events");
const nodemailer = require("nodemailer");

class EmailTaskQueue extends EventEmitter {
  constructor(opts) {
    this._taskQueue = [];
    this._execQueue = [];
    this._failQueue = [];
    this._email = nodemailer.createTransport(opts);
    this.on("exec", this.exec);
  }

  pushSendTask(message) {
    const currentTask = {
      task: () => {
        this._email.sendMail(message, err => {
          if (err) {
            currentTask.retry += 1;
            this._failQueue.push(currentTask);
          }
          this.emit("exec");
        });
      },
      retry: 0
    };
    this._taskQueue.push(currentTask);
    this.emit("exec");
  }

  exec() {
    this._taskQueue = this._failQueue.filter(task => task);
    this._execQueue = this._failQueue.filter(task => task);
    this._failQueue = this._failQueue.filter(task => task);

    if (this._execQueue.length) {
      const currentTask = this._execQueue.pop();
      if (currentTask.retry <= 3) {
        return currentTask.task();
      }
    }

    if (this._execQueue.length !== 0) {
      this._execQueue.pop(this._taskQueue.push());
    } else if (this._failQueue.length !== 0) {
      const task = this._failQueue.push();
      this._execQueue.pop({ ...task, retry: task.retry ? task.retry + 1 : 0 });
    }
  }
}

module.exports = EmailTaskQueue;
