# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

### General assumptions
- The Facilities send the information to us using some endpoints we provide to them. We currently have `PUT /agents` and `POST agents/` endpoints that allows the Facility to send Agent's information
- We use story points to estimate the effort of the tickets: 1 (2-4 hr), 2 (4-8 hr/1 day), 5 (2 days), 8 (5 days), 15 (2 weeks/1 sprint)
- We use Atlassian Confluence page for documentation 
- We use PostgreSQL
- We already have data in the DB tables

### TKT-1: Research spike - Facilities own custom Agent ID

###### Description
Since we are adding external information provided by different Facilities to our DB (they can use their own data types and format), we want to have a better understanding of what information each Facility will provide. 
We also need to communicate all Facilities that we are making this change to our platform and that they have a deadline (TBD) to adjust their systems to start sending us the new information.

NOTE: This ticket is important, should block the subsequents tickets, but in order to move forward with the implementation we can assume that we'll receive a string value with a maximum of 150 characters.
Once this ticket is done, if we detect that there is something we must change, we can do it later.

###### Acceptance criteria
For each Facility we want to know:

- What is the data type/format they use for their own custom Agent ID? E.g: string, number, uuid
- What is the data format they use for their own custom Agent ID? E.g: max length in case of string
- When do they think could have their systems ready to send us the new field? 
- Ask for a list of all the agents and their corresponding custom ID (to perform a backfill)
- Create a Confluence page with the obtained information from each Facility and attach it to this ticket.

###### Effort
- Story points: `5`

###### Implementation details
- None

###### Execution plan
- Blocks: TKT-6
- Blocked by: None

### TKT-2: Create the new custom_agent_id column in Facilities table

###### Description
We need a new column in the `Agents` table to store the agent ID provided by the Facilities

###### Acceptance criteria
Create a new `custom_agent_id`column in the `Agents` table.

###### Effort
- Story points: `1`

###### Implementation details
Create a new `custom_agent_id`column in the `Agents` table.
- name: `custom_agent_id`
- type: `VARCHAR`
- nullable: `NOT NULL` (we currently have data in the table, it cannot be `NULL`)

`ALTER TABLE Agents
ADD COLUMN custom_agent_id VARCHAR NOT NULL;`

###### Execution plan
- Blocks: TKT-3, TKT-4
- Blocked by: None

### TKT-3: Update the existing endpoints to store the custom Agent ID

###### Description
We want the Facilities to be able to send us their custom Agent IDs when they create or update their agents in our platform. We also need this new values in our DB

###### Acceptance criteria
- Update the endpoints to create and update agents to include a new `custom_agent_id` field in the payloads.
- Store the received value into the `custom_agent_id` column in the `Agents` table 
- Update existing unit test cases

###### Effort
- Story points: `2`. This ticket could be split into two separate tickets (insert and update operations), but it looks easy to implement, we can do it together.

#### Implementation details
- Update `PUT /agents` and `POST agents/` endpoints to include a new field ine payload:
    - name: `custom_agent_id`
    - type: `String`
    - required: `false`

###### Execution plan
- Blocks: None
- Blocked by: TKT-2

### TKT-4: Update `getShiftsByFacility` function to return the custom agent ID values

###### Description
We want to include the custom agent ID provided by the facilities in the reports. So we need this information to be available during report generation.

###### Acceptance criteria
- Update the `getShiftsByFacility` function logic to return the custom agent ID as part of the agent metadata. 
- Update existing unit test cases

###### Effort
- Story points: `2`.

###### Implementation details
- Update the `AgentMetadata` interface to add a new property:
  - name: `custom_agent_id`
  - type: `String`
  - required: `false`
- Update the `getShiftsByFacility` function logic to populate `custom_agent_id` field in the `AgentMetadata` with the information received from `custom_agent_id` column in `Agents` table

###### Execution plan
- Blocks: None
- Blocked by: TKT-2

### TKT-5: Update `generateReport` function to use the custom agent ID in the reports

###### Description
We want to use the custom agent ID value instead of the current agent ID in the reports.

###### Acceptance criteria
- Update the `generateReport` function logic to return the custom agent ID instead of the current agent ID (if present).
- Update existing unit test cases

###### Effort
- Story points: `2`.

###### Implementation details
- Update the `generateReport` function logic to populate the existing `agent_id` field with the value in the `custom_agent_id` property of the `AgentMetadata` provided by the `getShiftsByFacility` function

###### Execution plan
- Blocks: None
- Blocked by: TKT-4


### TKT-6: Backfill the new `custom_agent_id` column

###### Description
There may be data in the `Agents` table with a `null` value in the `custom_agent_id` column (because they already existed before we created the new column).
So we want to store these missing values.

###### Acceptance criteria
- Backfill the new `custom_agent_id` column with the custom agent IDs provided by the Facilities
- Set the missing `custom_agent_id` values with the information included in the list of agents provided by each Facility

###### Effort
- Story points: `8`. It can be a large ticket in terms of time because we'll be able to fackfill data once all Facilities have sent their list of agents.

###### Implementation details
- Create a bash script (it will run only once) to backfill missing data.
- For each record in `Agents` table with `null` value in the `custom_agent_id` column, find the corresponding agent in the list of agents provided by the Facilities and set `custom_agent_id` with the custom agent ID.
- We should use Agent's `name` (lower/upper case) to match the agents.

###### Execution plan
- Blocks: None
- Blocked by: TKT-1
