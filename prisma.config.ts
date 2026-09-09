/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import { definePrismaConfig } from "prisma/config";

export default definePrismaConfig({
  skills: {
    agents: ["claude", "cursor", "agents", "devin"],
  },
});
