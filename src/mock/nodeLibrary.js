export const nodeLibrary = [
  {
    template_id: "start_trigger",
    node_name: "Start Trigger",
    node_type: "trigger",
    description: "Starts the workflow on a schedule or event",
    sample_input_json: {
      cron: "*/5 * * * *",
      interval: "5m"
    }
  },
  {
    template_id: "data_processor",
    node_name: "Data Processor",
    node_type: "action",
    description: "Processes incoming data",
    sample_input_json: {
      threshold: 50,
      mode: "clean"
    }
  },
  {
    template_id: "filter_node",
    node_name: "Filter Data",
    node_type: "conditional",
    description: "Filters data based on rules",
    sample_input_json: {
      condition: "value > 100"
    }
  },
  {
    template_id: "end_node",
    node_name: "End",
    node_type: "end",
    description: "Ends the workflow",
    sample_input_json: {}
  }
]; 