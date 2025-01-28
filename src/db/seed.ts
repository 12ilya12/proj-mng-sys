import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { userTable, categoryTable, statusTable } from "./schema";
import * as dotenv from "dotenv";
import { genSalt, hash } from "bcrypt";
dotenv.config({ path: "./.env"});//"./.env.development" });
 
if (!("DATABASE_URL" in process.env))
	throw new Error("DATABASE_URL not found on .env.development");
 
const main = async () => {
	const client = new Pool({
		connectionString: process.env.DATABASE_URL,
	});
	const db = drizzle(client);

	const userData: (typeof userTable.$inferInsert)[] = [];
    const salt = await genSalt(12);
    const adminHashPassword = await hash('11111111', salt);
	userData.push({
		login: "admin",
        password: adminHashPassword,
        fullName: 'Админов Админ Админович',
        email: 'admin@maksoft.ru',
        role: 'ADMIN'
	});

    const categoryData: (typeof categoryTable.$inferInsert)[] = [];
    const categoryNames : string[] = ["Bug", "Epic", "Feature", "Issue", "Task", "Test Case", "User Story"];
    for (let i = 0; i < categoryNames.length; i++) {
	    categoryData.push({
		    name: categoryNames[i]
	    });
    }

    const statusData: (typeof statusTable.$inferInsert)[] = [];
    const statusNames : string[] = ["New", "Active", "Resolved", "Closed"];
    for (let i = 0; i < statusNames.length; i++) {
	    statusData.push({
		    name: statusNames[i]
	    });
    }
	
 
	console.log("Seed start");
	await db.insert(userTable).values(userData);
    await db.insert(categoryTable).values(categoryData);
    await db.insert(statusTable).values(statusData);
	console.log("Seed done");
};
 
main();