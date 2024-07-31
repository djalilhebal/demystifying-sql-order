import { defineStore } from 'pinia';
import { ref } from 'vue';
import { createDb, DbType  } from 'src/core/db';

const SQL_COMMANDS = [
`SELECT setseed(0.444);`,

`CREATE TABLE characters (
  id SERIAL PRIMARY KEY,
  name TEXT,
  age INTEGER,
  description TEXT DEFAULT repeat(md5(random()::text), 2)
);`,

`/* C > D > E > A > B */
INSERT INTO characters(name, age)
    VALUES
    ('Ciel', 13),
    ('Damian', 45),
    ('Edward', 18),
    ('Ash', 777),
    ('Baldroy', 37);
`,

`-- Insert 10,000 random entries
INSERT INTO characters (name, age)
SELECT
    -- a random name starting with A-Z
    chr(65 + floor(random() * 26)::integer) || substr(md5(random()::text), 1, 9) AS name,
    -- a random age between 1 and 80
    floor(random() * 80 + 1)::integer AS age
FROM
    generate_series(1, 10000);
`,

`CREATE INDEX idx_characters_age ON characters(age);`,

`CREATE INDEX idx_characters_age_and_name ON characters(age, name);
-- Or:
--CREATE INDEX idx_characters_age_include_name ON characters(age) INCLUDE (name);
`,

`/* To update stats */
VACUUM ANALYZE;
`,

`SELECT name, age
FROM characters
WHERE age >= 40
LIMIT 10;
`,

`SELECT name, age
FROM characters
WHERE age >= 40
LIMIT 700;
`,
];

export const useExptTwoStore = defineStore('expt-two', () => {

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
    return command.trim().startsWith('SELECT name');
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

  return { steps, initDb, explain, execute, runCommand };
});
