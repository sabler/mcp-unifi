import { TextContent } from "@modelcontextprotocol/sdk/types";

export const getDateAndTimeSchema = {
  title: "Get current date and time",
  description: "Get the current data and time in RFC3339 format",
};

export const getDateAndTimeHandler = async (): Promise<{content: TextContent[]}> => {
  let currentDT = Date.now();
  let date = new Date(currentDT);
  let dateAsISO = date.toISOString();

  return {
    content: [
      {
        type: "text",
        text: date.toString(),
      },

      {
        type: "text",
        text: dateAsISO,
      },
    ],
  };
};
