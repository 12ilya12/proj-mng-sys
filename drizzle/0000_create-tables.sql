CREATE TABLE "category" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "category_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	CONSTRAINT "category_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "dependency" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "dependency_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"parentTaskId" integer,
	"childTaskId" integer
);
--> statement-breakpoint
CREATE TABLE "status" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "status_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	CONSTRAINT "status_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "task" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "task_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"categoryId" integer NOT NULL,
	"statusId" integer NOT NULL,
	"userId" integer,
	"deadline" date,
	"priority" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"login" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"fullName" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" varchar(255) NOT NULL,
	CONSTRAINT "user_login_unique" UNIQUE("login")
);
--> statement-breakpoint
ALTER TABLE "dependency" ADD CONSTRAINT "dependency_parentTaskId_task_id_fk" FOREIGN KEY ("parentTaskId") REFERENCES "public"."task"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dependency" ADD CONSTRAINT "dependency_childTaskId_task_id_fk" FOREIGN KEY ("childTaskId") REFERENCES "public"."task"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_categoryId_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_statusId_status_id_fk" FOREIGN KEY ("statusId") REFERENCES "public"."status"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;