import { type GetUserSignupFieldsFn } from "wasp/auth/types";

export const getEmailUserFields: GetUserSignupFieldsFn = () => {
  return {
    fields: {
      email: {
        type: "text",
        label: "Username",
        placeholder: "Enter your username",
      },
    },
  };
};

export const getGoogleUserFields: GetUserSignupFieldsFn = () => {
  return {
    fields: {
      username: {
        type: "text",
        label: "Username",
        placeholder: "Enter your username",
      },
    },
  };
};

export const getGitHubUserFields: GetUserSignupFieldsFn = () => {
  return {
    fields: {
      username: {
        type: "text",
        label: "Username",
        placeholder: "Enter your username",
      },
    },
  };
};

export const getDiscordUserFields: GetUserSignupFieldsFn = () => {
  return {
    fields: {
      username: {
        type: "text",
        label: "Username",
        placeholder: "Enter your username",
      },
    },
  };
};
