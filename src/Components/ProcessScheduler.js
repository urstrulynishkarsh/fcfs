import React, { Component } from 'react';

class ProcessScheduler extends Component {
  constructor() {
    super();
    this.state = {
      processes: [],
      avgTurnaroundTime: 0,
      avgWaitingTime: 0,
      avgResponseTime: 0,
      cpuUtilization: 0,
      totalTurnaroundTime: 0,
      totalWaitingTime: 0,
      totalResponseTime: 0,
      totalIdleTime: 0,
      throughput: 0,
    };
  }

  handleProcessInput = (event) => {
    event.preventDefault();
    const { processes } = this.state;
    const processId = processes.length + 1;
    const arrivalTime = parseInt(event.target.arrivalTime.value);
    const burstTime = parseInt(event.target.burstTime.value);

    const newProcess = {
      processId,
      arrivalTime,
      burstTime,
      startTime: 0,
      completionTime: 0,
      turnaroundTime: 0,
      waitingTime: 0,
      responseTime: 0,
    };

    processes.push(newProcess);

    this.setState({ processes });
  };

  runFCFS = () => {
    const { processes } = this.state;
    const n = processes.length;

    for (let i = 0; i < n; i++) {
      processes[i].startTime = i === 0 ? processes[i].arrivalTime : Math.max(processes[i - 1].completionTime, processes[i].arrivalTime);
      processes[i].completionTime = processes[i].startTime + processes[i].burstTime;
      processes[i].turnaroundTime = processes[i].completionTime - processes[i].arrivalTime;
      processes[i].waitingTime = processes[i].turnaroundTime - processes[i].burstTime;
      processes[i].responseTime = processes[i].startTime - processes[i].arrivalTime;
    }

    const totalTurnaroundTime = processes.reduce((total, process) => total + process.turnaroundTime, 0);
    const totalWaitingTime = processes.reduce((total, process) => total + process.waitingTime, 0);
    const totalResponseTime = processes.reduce((total, process) => total + process.responseTime, 0);

    const avgTurnaroundTime = totalTurnaroundTime / n;
    const avgWaitingTime = totalWaitingTime / n;
    const avgResponseTime = totalResponseTime / n;
    const cpuUtilization = ((processes[n - 1].completionTime - this.state.totalIdleTime) / processes[n - 1].completionTime) * 100;
    const throughput = n / (processes[n - 1].completionTime - processes[0].arrivalTime);

    this.setState({ processes, avgTurnaroundTime, avgWaitingTime, avgResponseTime, cpuUtilization, throughput });
  };

  render() {
    const {
      processes,
      avgTurnaroundTime,
      avgWaitingTime,
      avgResponseTime,
      cpuUtilization,
      throughput,
    } = this.state;

    return (
        <div className="process-scheduler">
        <form onSubmit={this.handleProcessInput}>
          <input type="number" name="arrivalTime" placeholder="Arrival Time" />
          <input type="number" name="burstTime" placeholder="Burst Time" />
          <button type="submit">Add Process</button>
        </form>

        <button onClick={this.runFCFS}>Run FCFS</button>

        <div className="scheduling-results">
          <h2>Scheduling Results</h2>
          <table>
            <thead>
              <tr>
                <th>Process ID</th>
                <th>Arrival Time</th>
                <th>Burst Time</th>
                <th>Start Time</th>
                <th>Completion Time</th>
                <th>Turnaround Time</th>
                <th>Waiting Time</th>
                <th>Response Time</th>

              </tr>
            </thead>
            <tbody>
              {processes.map((process) => (
                <tr key={process.processId}>
                  <td>{process.processId}</td>
                  <td>{process.arrivalTime}</td>
                  <td>{process.burstTime}</td>
                  <td>{process.startTime}</td>
                  <td>{process.completionTime}</td>
                  <td>{process.turnaroundTime}</td>
                  <td>{process.waitingTime}</td>
                  <td>{process.responseTime}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="results">
          <p>Average Turnaround Time: {avgTurnaroundTime}</p>
          <p>Average Waiting Time: {avgWaitingTime}</p>
          <p>Average Response Time: {avgResponseTime}</p>
          <p>CPU Utilization: {cpuUtilization}%</p>
          <p>Throughput: {throughput} processes per unit time</p>
        </div>
        </div>
      </div>
    );
  }
}

export default ProcessScheduler;
