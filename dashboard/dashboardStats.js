const { connectToDatabase } = require("../db/dbConnector");
const middy = require("middy");
const { errorHandler } = require("../util/errorHandler");
const { closeDb } = require("../util/closeDb");

exports.handler = middy(async (event, context) => {
	const client = await connectToDatabase();
	const countQuery = `
        SELECT
            (
                SELECT COUNT(id) FROM employee WHERE id IS NOT NULL
            ) AS employee_count,
            (
                SELECT COUNT(id) FROM projects_table WHERE id IS NOT NULL
            ) AS project_count;
        `;
	const countResult = await client.query(countQuery);
	const employeeCount = countResult.rows[0].employee_count;
	const projectCount = countResult.rows[0].project_count;

	return {
		statusCode: 200,
		headers: {
			"Access-Control-Allow-Origin": "*",
		},
		body: JSON.stringify({
			Totalemployees: employeeCount,
			Totalprojects: projectCount,
		}),
	};
})
	.use(errorHandler())
	.use(closeDb());
