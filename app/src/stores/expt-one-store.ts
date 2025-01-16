import { defineStore } from 'pinia';
import { ref } from 'vue';

import { createDb, DbType  } from 'src/core/db';

const fields = ['id', 'value'];

function getIsTarget(data: any) {
  return data.id === 2;
}

const SQL_COMMANDS = [
`CREATE TABLE names (
    id int primary key generated always as identity,
    value text
);
`,

`INSERT INTO names (value) VALUES
    ('alice'),
    ('bob'),
    ('ciara'),
    ('diana'),
    ('emma');
`,

`SELECT * FROM names;`,

`UPDATE names SET value = 'barbara' WHERE id = 2;`,

`/* Optional: */
VACUUM names;`,

`SELECT * FROM names;`,
];

export const useExptOneStore = defineStore('expt-one', () => {

  const db = ref<DbType | null>(null);

  async function initDb() {
    db.value = await createDb();
  }

  async function runCommand(command: string): Promise<any> {
    console.log('runCommand', command);
    const result = await db.value?.query(command);
    console.log('runCommand', result);
    return result;
  }

  function canExplainCommand(command: string): boolean {
    return command.trim().startsWith('SELECT ');
  }

  function doesFetchRows(command: string): boolean {
    return command.trim().startsWith('SELECT *');
  }

  async function explainCommand(command: string): Promise<string> {
    const result = await runCommand(`EXPLAIN ${command}`);
    const text = result.rows.map((row: any) => row['QUERY PLAN']).join('\n');
    return text;
  }

  async function explain(step: any) {
    step.explainLoading = true;
    step.explainOutput = null;
    step.explainOutput = await explainCommand(step.command);
    step.explainLoading = false;
  }

  async function execute(step: any) {
    step.commandLoading = true;
    if (step.fetchesRows) {
      step.dataRows = [];
    }

    const result = await runCommand(step.command);
    if (step.fetchesRows) {
      step.dataRows = result.rows;
    }

    step.commandLoading = false;
    step.commandExecuted = true;
  }

  // Progress

  const steps = ref(SQL_COMMANDS.map((command, index) => {
    const stepNumber = index + 1;
    return {
      name: stepNumber,
      done: false,

      command,
      commandLoading: false,
      commandExecuted: false,

      fetchesRows: doesFetchRows(command),
      dataRows: [],

      explainable: canExplainCommand(command),
      explainLoading: false,
      explainOutput: null,
    };
  }));

  return { steps, fields, getIsTarget, initDb, explain, execute, runCommand };
});
