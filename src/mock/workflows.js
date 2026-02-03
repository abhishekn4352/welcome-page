export const workflows = [
  {
    workflow_id: "wf-1",
    workflow_name: "My First Workflow",
    user_id: "user-1",
    company_id: "company-1",
    nodes: [
      {
        node_id: "n1",
        node_name: "Start Trigger",
        node_type: "trigger",
        input_json: { interval: "5m" },
        connections: ["n2"]
      },
      {
        node_id: "n2",
        node_name: "Process Data",
        node_type: "action",
        input_json: { threshold: 50 },
        connections: ["n3"]
      },
      {
        node_id: "n3",
        node_name: "End",
        node_type: "end",
        input_json: {},
        connections: []
      }
    ]
  }
]; 