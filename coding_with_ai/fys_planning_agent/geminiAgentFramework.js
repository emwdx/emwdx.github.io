// geminiAgentFramework.js

class Message {
  constructor(from, to, content) {
    this.from = from;
    this.to = to;
    this.content = content;
    this.timestamp = new Date();
  }
}

class Agent {
  constructor(name, behaviorFn) {
    this.name = name;
    this.behavior = behaviorFn;
    this.memory = [];
  }

  async receive(message, sendMessage) {
    this.memory.push(message);
    const response = await this.behavior(message, this.memory);
    if (response && response.to) {
      await sendMessage(this.name, response.to, response.content);
    }
  }
}

class SimpleAgentManager {
  constructor() {
    this.agents = {};
  }

  register(agent) {
    this.agents[agent.name] = agent;
  }

  async sendMessage(from, to, content) {
    const message = new Message(from, to, content);
    console.log(`[${message.timestamp.toLocaleTimeString()}] ${from} -> ${to}: ${JSON.stringify(content)}`);
    if (this.agents[to]) {
      await this.agents[to].receive(message, this.sendMessage.bind(this));
    } else {
      console.warn(`Agent "${to}" not found.`);
    }
  }

  async startConversation(from, to, content) {
    await this.sendMessage(from, to, content);
  }
}
